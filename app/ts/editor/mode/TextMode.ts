import BlockComment from './BlockComment';
import Completion from "../Completion";
import Position from "../Position";
import Tokenizer from "../Tokenizer";
import TextHighlightRules from "./TextHighlightRules";
import Behaviour from "./Behaviour";
// import BehaviourCallback from "../BehaviourCallback";
import CstyleBehaviour from './behaviour/CstyleBehaviour';
import FoldMode from './folding/FoldMode';
import { packages } from "../unicode";
import { escapeRegExp } from "../lib/lang";
import Highlighter from './Highlighter';
import HighlighterFactory from './HighlighterFactory';
import LanguageModeFactory from "../LanguageModeFactory";
import Token from '../Token';
import TokenIterator from "../TokenIterator";
import Range from "../Range";
import TextAndSelection from "../TextAndSelection";
import EditSession from '../EditSession';
import Editor from '../Editor';
import WorkerClient from "../worker/WorkerClient";
import LanguageMode from '../LanguageMode';
import Rule from '../Rule';

/**
 *
 */
export default class TextMode implements LanguageMode {
    /**
     * Used when loading snippets for zero or more modes?
     */
    public modes: LanguageMode[];

    /**
     * 
     */
    public wrap: 'auto' | 'code' | 'text' = 'text';

    protected highlighter: HighlighterFactory = TextHighlightRules;

    protected $behaviour = new Behaviour();
    protected $defaultBehaviour = new CstyleBehaviour();

    /**
     *
     */
    public tokenRe = new RegExp("^["
        + packages.L
        + packages.Mn + packages.Mc
        + packages.Nd
        + packages.Pc + "\\$_]+", "g"
    );

    /**
     *
     */
    public nonTokenRe = new RegExp("^(?:[^"
        + packages.L
        + packages.Mn + packages.Mc
        + packages.Nd
        + packages.Pc + "\\$_]|\\s])+", "g"
    );

    protected lineCommentStart: string | string[] = "";
    protected blockComment: BlockComment;
    public $id = "ace/mode/text";
    private $tokenizer: Tokenizer;
    private $highlightRules: Highlighter;
    private $keywordList: string[];
    private $embeds: string[];
    private $modes: { [path: string]: LanguageMode };
    private completionKeywords: string[];
    public $indentWithTabs: boolean;
    public foldingRules: FoldMode;
    public getMatching: (session: EditSession) => Range;

    /**
     *
     */
    protected workerUrl: string;

    /**
     *
     */
    protected scriptImports: string[] = [];

    /**
     *
     */
    constructor(workerUrl: string, scriptImports: string[]) {
        if (typeof workerUrl === 'string') {
            this.workerUrl = workerUrl;
        }
        else {
            throw new TypeError("workerUrl must be a string.");
        }
        this.scriptImports = scriptImports;
    }

    /**
     *
     */
    getTokenizer(): Tokenizer {
        if (!this.$tokenizer) {
            this.$highlightRules = this.$highlightRules || new this.highlighter();
            this.$tokenizer = new Tokenizer(this.$highlightRules.getRules());
        }
        return this.$tokenizer;
    }

    /**
     *
     */
    public toggleCommentLines(state: string, session: EditSession, startRow: number, endRow: number): void {
        const doc = session.docOrThrow();

        let ignoreBlankLines = true;
        let shouldRemove = true;
        let minIndent = Infinity;
        const tabSize = session.getTabSize();
        let insertAtTabStop = false;
        let comment: (line: string, i: number) => void;
        let uncomment: (line: string, i: number) => void;
        let testRemove: (line: string, i: number) => boolean;
        let lineCommentStart: string;

        if (!this.lineCommentStart) {
            if (!this.blockComment) {
                return;
            }
            lineCommentStart = this.blockComment.start;
            const lineCommentEnd = this.blockComment.end;
            const regexpStart = new RegExp("^(\\s*)(?:" + escapeRegExp(lineCommentStart) + ")");
            const regexpEnd = new RegExp("(?:" + escapeRegExp(lineCommentEnd) + ")\\s*$");

            comment = function (line: string, i: number): void {
                if (testRemove(line, i))
                    return;
                if (!ignoreBlankLines || /\S/.test(line)) {
                    doc.insertInLine({ row: i, column: line.length }, lineCommentEnd);
                    doc.insertInLine({ row: i, column: minIndent }, lineCommentStart);
                }
            };

            uncomment = function (line: string, i: number): void {
                let m: RegExpMatchArray | null;
                if (m = line.match(regexpEnd)) {
                    doc.removeInLine(i, line.length - m[0].length, line.length);
                }
                if (m = line.match(regexpStart))
                    doc.removeInLine(i, m[1].length, m[0].length);
            };

            testRemove = function (line: string, row: number): boolean {
                if (regexpStart.test(line)) {
                    return true;
                }
                const tokens = session.getTokens(row);
                for (let i = 0; i < tokens.length; i++) {
                    if (tokens[i].type === 'comment')
                        return true;
                }
                return false;
            };
        }
        else {
            let regexpStartString: string;
            if (Array.isArray(this.lineCommentStart)) {
                regexpStartString = (<string[]>this.lineCommentStart).map(escapeRegExp).join("|");
                lineCommentStart = (<string[]>this.lineCommentStart)[0];
            }
            else {
                regexpStartString = escapeRegExp(<string>this.lineCommentStart);
                lineCommentStart = <string>this.lineCommentStart;
            }

            const regexpStart = new RegExp("^(\\s*)(?:" + regexpStartString + ") ?");

            insertAtTabStop = session.getUseSoftTabs();

            const shouldInsertSpace = function (line: string, before: number, after: number) {
                let spaces = 0;
                while (before-- && line.charAt(before) === " ") {
                    spaces++;
                }
                if (spaces % tabSize !== 0) {
                    return false;
                }
                spaces = 0;
                while (line.charAt(after++) === " ") {
                    spaces++;
                }
                if (tabSize > 2) {
                    return spaces % tabSize !== tabSize - 1;
                }
                else {
                    return spaces % tabSize === 0;
                }
            };

            uncomment = function (line: string, i: number) {
                const m = line.match(regexpStart);
                if (!m) return;
                const start = m[1].length;
                let end = m[0].length;
                if (!shouldInsertSpace(line, start, end) && m[0][end - 1] === " ")
                    end--;
                doc.removeInLine(i, start, end);
            };

            const commentWithSpace = lineCommentStart + " ";
            comment = function (line: string, i: number) {
                if (!ignoreBlankLines || /\S/.test(line)) {
                    if (shouldInsertSpace(line, minIndent, minIndent))
                        doc.insertInLine({ row: i, column: minIndent }, commentWithSpace);
                    else
                        doc.insertInLine({ row: i, column: minIndent }, lineCommentStart);
                }
            };
            testRemove = function (line: string, i: number) {
                return regexpStart.test(line);
            };
        }

        function iter(fun: (line: string, row: number) => any) {
            for (let i = startRow; i <= endRow; i++) {
                fun(doc.getLine(i), i);
            }
        }


        let minEmptyLength = Infinity;
        iter(function (line: string, row: number) {
            const indent = line.search(/\S/);
            if (indent !== -1) {
                if (indent < minIndent)
                    minIndent = indent;
                if (shouldRemove && !testRemove(line, row))
                    shouldRemove = false;
            } else if (minEmptyLength > line.length) {
                minEmptyLength = line.length;
            }
        });

        if (minIndent === Infinity) {
            minIndent = minEmptyLength;
            ignoreBlankLines = false;
            shouldRemove = false;
        }

        if (insertAtTabStop && minIndent % tabSize !== 0)
            minIndent = Math.floor(minIndent / tabSize) * tabSize;

        iter(shouldRemove ? uncomment : comment);
    }

    /**
     * @param state
     * @param session
     * @param range
     * @param cursor
     */
    toggleBlockComment(state: string, session: EditSession, range: Range, cursor: Position): void {
        let comment = this.blockComment;
        if (!comment)
            return;
        if (!comment.start && comment[0])
            comment = comment[0];

        const outerIterator = new TokenIterator(session, cursor.row, cursor.column);
        let outerToken: Token | undefined | null = outerIterator.getCurrentToken();

        const selection = session.selectionOrThrow();
        const initialRange = selection.toOrientedRange();
        let startRow: number | undefined;
        let colDiff: number | undefined;

        if (outerToken && /comment/.test(outerToken.type)) {
            let startRange: Range | undefined;
            let endRange: Range | undefined;
            while (outerToken && /comment/.test(outerToken.type)) {
                const i = outerToken.value.indexOf(comment.start);
                if (i !== -1) {
                    const row = outerIterator.getCurrentTokenRow();
                    const column = outerIterator.getCurrentTokenColumn() + i;
                    startRange = new Range(row, column, row, column + comment.start.length);
                    break;
                }
                outerToken = outerIterator.stepBackward();
            }

            const innerIterator = new TokenIterator(session, cursor.row, cursor.column);
            let innerToken: Token | null | undefined = innerIterator.getCurrentToken();
            while (innerToken && /comment/.test(innerToken.type)) {
                const i = innerToken.value.indexOf(comment.end);
                if (i !== -1) {
                    const row = innerIterator.getCurrentTokenRow();
                    const column = innerIterator.getCurrentTokenColumn() + i;
                    endRange = new Range(row, column, row, column + comment.end.length);
                    break;
                }
                innerToken = innerIterator.stepForward();
            }
            if (endRange) {
                session.remove(endRange);
            }
            if (startRange) {
                session.remove(startRange);
                startRow = startRange.start.row;
                colDiff = -comment.start.length;
            }
        }
        else {
            colDiff = comment.start.length;
            startRow = range.start.row;
            session.insert(range.end, comment.end);
            session.insert(range.start, comment.start);
        }

        // todo: selection should have ended up in the right place automatically!
        if (initialRange.start.row === startRow) {
            if (colDiff) {
                initialRange.start.column += colDiff;
            }
            else {
                console.warn(`colDiff is ${typeof colDiff}`);
            }
        }
        if (initialRange.end.row === startRow) {
            if (colDiff) {
                initialRange.end.column += colDiff;
            }
            else {
                console.warn(`colDiff is ${typeof colDiff}`);
            }
        }

        session.selectionOrThrow().fromOrientedRange(initialRange);
    }

    /**
     *
     */
    getNextLineIndent(state: string, line: string, tab: string): string {
        return this.$getIndent(line);
    }

    checkOutdent(state: string, line: string, text: string): boolean {
        return false;
    }

    autoOutdent(state: string, session: EditSession, row: number): void {
        // Do nothing.
    }

    $getIndent(line: string): string {
        const match = line.match(/^\s*/);
        if (match) {
            return match[0];
        }
        else {
            return "";
        }
    }

    /**
     *
     */
    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => any): void {
        callback(void 0, void 0);
    }

    createModeDelegates(mapping: { [prefix: string]: LanguageModeFactory }) {
        this.$embeds = [];
        this.$modes = {};
        for (let p in mapping) {
            if (mapping[p]) {
                this.$embeds.push(p);
                // May not be ideal that we have to assume the same construction
                // parameters for delegates but it should work most of the time.
                // Leave it this way for now.
                this.$modes[p] = new mapping[p](this.workerUrl, this.scriptImports);
            }
        }

        const delegations = ['toggleBlockComment', 'toggleCommentLines', 'getNextLineIndent',
            'checkOutdent', 'autoOutdent', 'transformAction', 'getCompletions'];

        for (let k = 0; k < delegations.length; k++) {
            // TODO: Scarey code. Would be nice to unravel. But who provides arguments? 
            (function (scope) {
                const functionName = delegations[k];
                const defaultHandler = scope[functionName];
                scope[delegations[k]] = function (this: any) {
                    return this.$delegator(functionName, arguments, defaultHandler);
                };
            }(this));
        }
    }

    // We can't make this private because tslint would think that it is not being used.
    $delegator(method: string, args: any[], defaultHandler: any): any {
        let state = args[0];
        if (typeof state !== "string")
            state = state[0];
        for (let i = 0; i < this.$embeds.length; i++) {
            if (!this.$modes[this.$embeds[i]]) continue;

            const split = state.split(this.$embeds[i]);
            if (!split[0] && split[1]) {
                args[0] = split[1];
                const mode = this.$modes[this.$embeds[i]];
                return mode[method].apply(mode, args);
            }
        }
        const ret = defaultHandler.apply(this, args);
        return defaultHandler ? ret : undefined;
    }

    /**
     * This method is called by the Editor.
     *
     * @method transformAction
     * @param state {string}
     * @param action {string}
     * @param editor {Editor}
     * @param session {EditSession}
     * @param param {any} This will usually be a Range or a text string.
     * @return {any} This will usually be a Range or an object: {text: string; selection: number[]}
     */
    // TODO: May be able to make this type-safe by separating cases where param is string from Range.
    // string => {text: string; selection: number[]} (This corresponds to the insert operation)
    // Range  => Range                               (This corresponds to the remove operation)
    transformAction(state: string, action: string, editor: Editor, session: EditSession, param: string | Range): TextAndSelection | Range | undefined {
        if (this.$behaviour) {
            const behaviours = this.$behaviour.getBehaviours();
            for (let key in behaviours) {
                if (behaviours[key][action]) {
                    // FIXME: Make this type-safe?
                    // callback: BehaviourCallback = behaviours[key][action];
                    // transformed = callback(state, action, editor, session, unused);
                    const ret = behaviours[key][action].apply(this, arguments);
                    if (ret) {
                        return ret;
                    }
                }
            }
        }
        return void 0;
    }

    getKeywords(append: boolean): string[] {
        // this is for autocompletion to pick up regexp'ed keywords
        const completionKeywords: string[] = [];
        if (!this.completionKeywords) {

            const rulesByState: { [stateName: string]: Rule[] } = this.$tokenizer.states;
            const stateNames = Object.keys(rulesByState);
            const sLen = stateNames.length;
            for (let s = 0; s < sLen; s++) {
                const stateName = stateNames[s];
                /**
                 * The rules for this particular state.
                 */
                const rules: Rule[] = rulesByState[stateName];
                for (let r = 0, l = rules.length; r < l; r++) {
                    const rule = rules[r];
                    if (typeof rule.token === "string") {
                        const token = <string>rule.token;
                        if (/keyword|support|storage/.test(token)) {
                            // FIXME: What if regex is not a string?
                            completionKeywords.push(<string>rule.regex);
                        }
                    }
                    else if (typeof rule.token === "object") {
                        const tokens = <string[]>rule.token;
                        for (let a = 0, aLength = tokens.length; a < aLength; a++) {
                            if (/keyword|support|storage/.test(tokens[a])) {
                                // drop surrounding parens
                                if (typeof rule.regex === 'string') {
                                    const matches = (rule.regex).match(/\(.+?\)/g);
                                    if (matches) {
                                        const matched = matches[a];
                                        completionKeywords.push(matched.substr(1, matched.length - 2));
                                    }
                                }
                            }
                        }
                    }
                    else {
                        // TODO: What if Rule.tokens is a function?
                    }
                }
            }
            this.completionKeywords = completionKeywords;
        }
        // this is for highlighting embed rules, like HAML/Ruby or Obj-C/C
        if (!append) {
            return this.$keywordList;
        }
        return completionKeywords.concat(this.$keywordList || []);
    }

    private $createKeywordList(): string[] {
        if (!this.$highlightRules) {
            this.getTokenizer();
        }
        return this.$keywordList = this.$highlightRules.getKeywords() || [];
    }

    getCompletions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {
        const keywords: string[] = this.$keywordList || this.$createKeywordList();
        return keywords.map(function (word: string) {
            return {
                name: word,
                value: word,
                score: 0,
                meta: "keyword"
            };
        });
    }
}

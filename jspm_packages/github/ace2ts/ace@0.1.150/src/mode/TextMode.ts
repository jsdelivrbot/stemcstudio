import BlockComment from './BlockComment';
import Completion from "../Completion";
import Position from "../Position";
import Tokenizer from "../Tokenizer";
import TextHighlightRules from "./TextHighlightRules";
import Behaviour from "./Behaviour";
// import BehaviourCallback from "../BehaviourCallback";
import FoldMode from './folding/FoldMode';
import {packages} from "../unicode";
import {escapeRegExp} from "../lib/lang";
import TokenIterator from "../TokenIterator";
import Range from "../Range";
import TextAndSelection from "../TextAndSelection";
import EditSession from '../EditSession';
import Editor from '../Editor';
import WorkerClient from "../worker/WorkerClient";
import LanguageMode from '../LanguageMode';
import Rule from '../Rule';

/**
 * @class TextMode
 */
export default class TextMode implements LanguageMode {
    /**
     * Used when loading snippets for zero or more modes?
     * @property modes
     * @type LanguageMode[]
     */
    public modes: LanguageMode[];

    protected HighlightRules: any = TextHighlightRules;

    protected $behaviour = new Behaviour();

    /**
     * @property tokenRe
     * @type RegExp
     */
    public tokenRe = new RegExp("^["
        + packages.L
        + packages.Mn + packages.Mc
        + packages.Nd
        + packages.Pc + "\\$_]+", "g"
    );

    /**
     * @property nonTokenRe
     * @type RegExp
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
    private $highlightRules: any;
    private $keywordList: string[];
    private $embeds: string[];
    private $modes: { [path: string]: LanguageMode };
    private completionKeywords: string[];
    public $indentWithTabs: boolean;
    public foldingRules: FoldMode;
    public getMatching: (session: EditSession) => Range;

    /**
     * @property workerUrl
     * @type string
     * @protected
     */
    protected workerUrl: string;

    /**
     * @property scriptImports
     * @type string[]
     * @protected
     */
    protected scriptImports: string[] = [];

    /**
     * @class TextMode
     * @constructor
     * @param workerUrl {string}
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
     * @method getTokenizer
     * @return {Tokenizer}
     */
    getTokenizer(): Tokenizer {
        if (!this.$tokenizer) {
            this.$highlightRules = this.$highlightRules || new this.HighlightRules();
            this.$tokenizer = new Tokenizer(this.$highlightRules.getRules());
        }
        return this.$tokenizer;
    }

    /**
     * @method toggleCommentLines
     * @param state {string}
     * @param session {EditSession}
     * @param startRow {number}
     * @param endRow {number}
     * @return {boolean}
     */
    public toggleCommentLines(state: string, session: EditSession, startRow: number, endRow: number): boolean {
        const doc = session.doc;

        var ignoreBlankLines = true;
        var shouldRemove = true;
        var minIndent = Infinity;
        var tabSize = session.getTabSize();
        var insertAtTabStop = false;
        let comment: (line: string, i: number) => any;
        let uncomment: (line: string, i: number) => any;
        let testRemove: (line: string, i: number) => any;

        if (!this.lineCommentStart) {
            if (!this.blockComment) {
                return false;
            }
            var lineCommentStart = this.blockComment.start;
            const lineCommentEnd = this.blockComment.end;
            const regexpStart = new RegExp("^(\\s*)(?:" + escapeRegExp(lineCommentStart) + ")");
            const regexpEnd = new RegExp("(?:" + escapeRegExp(lineCommentEnd) + ")\\s*$");

            comment = function(line: string, i: number) {
                if (testRemove(line, i))
                    return;
                if (!ignoreBlankLines || /\S/.test(line)) {
                    doc.insertInLine({ row: i, column: line.length }, lineCommentEnd);
                    doc.insertInLine({ row: i, column: minIndent }, lineCommentStart);
                }
            };

            uncomment = function(line: string, i: number) {
                var m;
                if (m = line.match(regexpEnd))
                    doc.removeInLine(i, line.length - m[0].length, line.length);
                if (m = line.match(regexpStart))
                    doc.removeInLine(i, m[1].length, m[0].length);
            };

            testRemove = function(line: string, row: number) {
                if (regexpStart.test(line))
                    return true;
                var tokens = session.getTokens(row);
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].type === 'comment')
                        return true;
                }
            };
        }
        else {
            if (Array.isArray(this.lineCommentStart)) {
                var regexpStartString: string = (<string[]>this.lineCommentStart).map(escapeRegExp).join("|");
                lineCommentStart = (<string[]>this.lineCommentStart)[0];
            }
            else {
                var regexpStartString: string = escapeRegExp(<string>this.lineCommentStart);
                lineCommentStart = <string>this.lineCommentStart;
            }

            const regexpStart = new RegExp("^(\\s*)(?:" + regexpStartString + ") ?");

            insertAtTabStop = session.getUseSoftTabs();

            const shouldInsertSpace = function(line: string, before: number, after: number) {
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

            uncomment = function(line: string, i: number) {
                const m = line.match(regexpStart);
                if (!m) return;
                const start = m[1].length;
                let end = m[0].length;
                if (!shouldInsertSpace(line, start, end) && m[0][end - 1] === " ")
                    end--;
                doc.removeInLine(i, start, end);
            };

            const commentWithSpace = lineCommentStart + " ";
            comment = function(line: string, i: number) {
                if (!ignoreBlankLines || /\S/.test(line)) {
                    if (shouldInsertSpace(line, minIndent, minIndent))
                        doc.insertInLine({ row: i, column: minIndent }, commentWithSpace);
                    else
                        doc.insertInLine({ row: i, column: minIndent }, lineCommentStart);
                }
            };
            testRemove = function(line: string, i: number) {
                return regexpStart.test(line);
            };
        }

        function iter(fun: (line: string, row: number) => any) {
            for (let i = startRow; i <= endRow; i++) {
                fun(doc.getLine(i), i);
            }
        }


        var minEmptyLength = Infinity;
        iter(function(line: string, row: number) {
            var indent = line.search(/\S/);
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
     * @method toggleBlockComment
     * @param state {string}
     * @param session {EditSession}
     * @param range {Range}
     * @param cirsor {Position}
     * @return {void}
     */
    toggleBlockComment(state: string, session: EditSession, range: Range, cursor: Position): void {
        var comment = this.blockComment;
        if (!comment)
            return;
        if (!comment.start && comment[0])
            comment = comment[0];

        var iterator = new TokenIterator(session, cursor.row, cursor.column);
        var token = iterator.getCurrentToken();

        var selection = session.getSelection();
        var initialRange = selection.toOrientedRange();
        var startRow: number;
        var colDiff: number;

        if (token && /comment/.test(token.type)) {
            var startRange, endRange;
            while (token && /comment/.test(token.type)) {
                const i = token.value.indexOf(comment.start);
                if (i !== -1) {
                    var row = iterator.getCurrentTokenRow();
                    var column = iterator.getCurrentTokenColumn() + i;
                    startRange = new Range(row, column, row, column + comment.start.length);
                    break;
                }
                token = iterator.stepBackward();
            }

            var iterator = new TokenIterator(session, cursor.row, cursor.column);
            var token = iterator.getCurrentToken();
            while (token && /comment/.test(token.type)) {
                const i = token.value.indexOf(comment.end);
                if (i !== -1) {
                    var row = iterator.getCurrentTokenRow();
                    var column = iterator.getCurrentTokenColumn() + i;
                    endRange = new Range(row, column, row, column + comment.end.length);
                    break;
                }
                token = iterator.stepForward();
            }
            if (endRange)
                session.remove(endRange);
            if (startRange) {
                session.remove(startRange);
                startRow = startRange.start.row;
                colDiff = -comment.start.length;
            }
        } else {
            colDiff = comment.start.length;
            startRow = range.start.row;
            session.insert(range.end, comment.end);
            session.insert(range.start, comment.start);
        }
        // todo: selection should have ended up in the right place automatically!
        if (initialRange.start.row === startRow)
            initialRange.start.column += colDiff;
        if (initialRange.end.row === startRow)
            initialRange.end.column += colDiff;
        session.getSelection().fromOrientedRange(initialRange);
    }

    /**
     * @method getNextLineIndent
     * @param state {string}
     * @param line {string}
     * @param tab {string}
     * @return {string}
     */
    getNextLineIndent(state: string, line: string, tab: string): string {
        return this.$getIndent(line);
    }

    checkOutdent(state: string, line: string, text: string): boolean {
        return false;
    }

    autoOutdent(state: string, session: EditSession, row: number): number {
        return 0;
    }

    // FIXME: This should be standalone method.
    $getIndent(line: string): string {
        return line.match(/^\s*/)[0];
    }

    /**
     * @method createWorker
     * @param session {EditSession}
     * @param callback {(err: any, worker: WorkerClient) => any}
     * @return {void}
     */
    createWorker(session: EditSession, callback: (err: any, worker: WorkerClient) => any): void {
        callback(void 0, void 0);
    }

    createModeDelegates(mapping: { [prefix: string]: any }) {
        this.$embeds = [];
        this.$modes = {};
        for (var p in mapping) {
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

        for (var k = 0; k < delegations.length; k++) {
            (function(scope) {
                var functionName = delegations[k];
                var defaultHandler = scope[functionName];
                scope[delegations[k]] = function() {
                    return this.$delegator(functionName, arguments, defaultHandler);
                };
            } (this));
        }
    }

    $delegator(method, args, defaultHandler) {
        var state = args[0];
        if (typeof state !== "string")
            state = state[0];
        for (var i = 0; i < this.$embeds.length; i++) {
            if (!this.$modes[this.$embeds[i]]) continue;

            var split = state.split(this.$embeds[i]);
            if (!split[0] && split[1]) {
                args[0] = split[1];
                var mode = this.$modes[this.$embeds[i]];
                return mode[method].apply(mode, args);
            }
        }
        var ret = defaultHandler.apply(this, args);
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
    transformAction(state: string, action: string, editor: Editor, session: EditSession, param: string | Range): TextAndSelection | Range {
        if (this.$behaviour) {
            var behaviours = this.$behaviour.getBehaviours();
            for (var key in behaviours) {
                if (behaviours[key][action]) {
                    // FIXME: Make this type-safe?
                    // var callback: BehaviourCallback = behaviours[key][action];
                    // var transformed = callback(state, action, editor, session, unused);
                    var ret = behaviours[key][action].apply(this, arguments);
                    if (ret) {
                        return ret;
                    }
                }
            }
        }
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
                                const matched: string = (<string>rule.regex).match(/\(.+?\)/g)[a];
                                completionKeywords.push(matched.substr(1, matched.length - 2));
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

    $createKeywordList(): string[] {
        if (!this.$highlightRules) {
            this.getTokenizer();
        }
        return this.$keywordList = this.$highlightRules.$keywordList || [];
    }

    getCompletions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {
        const keywords: string[] = this.$keywordList || this.$createKeywordList();
        return keywords.map(function(word: string) {
            return {
                name: word,
                value: word,
                score: 0,
                meta: "keyword"
            };
        });
    }
}

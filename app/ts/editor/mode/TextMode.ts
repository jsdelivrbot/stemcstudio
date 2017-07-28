import { Annotation } from "../Annotation";
import { BlockComment } from './BlockComment';
import { Completion } from "../Completion";
import { Position } from "editor-document";
import { Tokenizer } from "../Tokenizer";
import { TextHighlightRules } from "./TextHighlightRules";
import { Behaviour } from "./Behaviour";
import { CstyleBehaviour } from './behaviour/CstyleBehaviour';
import { packages } from "../unicode";
import { escapeRegExp } from "../lib/lang";
import { Highlighter, HighlighterToken, HighlighterStack, HighlighterStackElement } from './Highlighter';
import { HighlighterFactory } from './HighlighterFactory';
import { LanguageModeFactory } from "../LanguageModeFactory";
import { TokenIterator } from "../TokenIterator";
import { RangeBasic } from "../RangeBasic";
import { Range } from "../Range";
import { TextAndSelection } from "../TextAndSelection";
import { WorkerClient } from "../worker/WorkerClient";
import { LanguageModeId } from '../LanguageMode';
import { LanguageMode } from '../LanguageMode';
import { EditSession } from '../EditSession';
import { Editor } from '../Editor';
import { FoldMode } from '../mode/folding/FoldMode';

/**
 * Standard hook of 'annotations' event.
 * When the event fires...
 * 1. Relay annotations to the session, causing a 'changeAnnotation' event (when update is true).
 * 2. Tell the session to emit an 'workerCompleted' event.
 * The tear-down function is returned, usually consumed by the hookTerminate function.
 */
export function hookAnnotations(worker: WorkerClient, session: EditSession, updateSessionAnnotations: boolean): () => void {
    return worker.on('annotations', function (event: { data: Annotation[] }) {
        const annotations: Annotation[] = event.data;
        if (updateSessionAnnotations) {
            if (annotations.length > 0) {
                session.setAnnotations(annotations);
            }
            else {
                session.clearAnnotations();
            }
        }
        session.onWorkerCompleted(annotations);
    });
}

/**
 * Standard hook of 'terminate' event.
 * When the event fires...
 * 1. Removes its own 'terminate' handler, since we don't need it anymore.
 * 2. Runs the tearDown function (which should remove the 'annotations' handler.
 * 3. Detaches the worker from the document.
 * 4. Clears the annotations in the session.
 * No tear-down function is returned because we reflexively clean up.
 */
export function hookTerminate(worker: WorkerClient, session: EditSession, tearDown: () => void): void {
    const terminate = 'terminate';
    /**
     * This is the function that is run when the event is received.
     * We give it a name so that we can remove the event handler.
     */
    function termHandler() {
        worker.off(terminate, termHandler);
        tearDown();
        worker.detachFromSession();
        session.clearAnnotations();
    }
    // Wire up the event to the handler.
    worker.on(terminate, termHandler);
}

/**
 * Standard implementation for initializing an editor worker thread.
 * @param worker
 * @param moduleName The name of the module containing the className.
 * @param className The name of the constructor function.
 * @param scriptImports 
 * @param session 
 * @param callback 
 */
export function initWorker(worker: WorkerClient, moduleName: string, className: string, scriptImports: string[], session: EditSession, callback: (err: any, worker?: WorkerClient) => void): void {
    try {
        worker.init(scriptImports, moduleName, className, function (err: any) {
            if (!err) {
                if (session) {
                    worker.attachToSession(session);
                    callback(void 0, worker);
                }
                else {
                    const msg = `${className} init fail. Cause: session does not have an associated document.`;
                    console.warn(msg);
                    callback(new Error(msg));
                }
            }
            else {
                const msg = `${className} init fail. Cause: ${err}`;
                console.warn(msg);
                callback(new Error(msg));
            }
        });
    }
    catch (e) {
        callback(e);
    }
}

export type LineCommentStart = '' | ';' | '//' | '--' | '%' | '#';

/**
 *
 */
export class TextMode implements LanguageMode {
    /**
     *
     */
    public modes: LanguageMode[];

    /**
     * 
     */
    public wrap: 'auto' | 'code' | 'text' = 'text';

    /**
     * The factory for creating a Highlighter.
     * The naming convention is to indicate that the 'new' operator should be used.
     */
    protected HighlightRules: HighlighterFactory = TextHighlightRules;

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

    /**
     * TODO: Why do we allow an array of string?
     */
    protected lineCommentStart: LineCommentStart | string[] = "";
    protected blockComment: BlockComment;
    public $id: LanguageModeId = "Text";
    private $tokenizer: Tokenizer<HighlighterToken, HighlighterStackElement, HighlighterStack>;
    private $highlightRules: Highlighter;
    private $keywordList: string[];
    private $embeds: string[];
    private $modes: { [path: string]: LanguageMode };
    private completionKeywords: string[];
    public $highlightRuleConfig = {};
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
    constructor(workerUrl = '', scriptImports: string[] = []) {
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
    getTokenizer(): Tokenizer<HighlighterToken, HighlighterStackElement, HighlighterStack> {
        if (!this.$tokenizer) {
            this.$highlightRules = this.$highlightRules || new this.HighlightRules(this.$highlightRuleConfig);
            this.$tokenizer = new Tokenizer(this.$highlightRules.getRules());
        }
        return this.$tokenizer;
    }

    /**
     *
     */
    public toggleCommentLines(state: string, session: EditSession, startRow: number, endRow: number): void {
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
                    session.insertInLine({ row: i, column: line.length }, lineCommentEnd);
                    session.insertInLine({ row: i, column: minIndent }, lineCommentStart);
                }
            };

            uncomment = function (line: string, i: number): void {
                let m: RegExpMatchArray | null;
                if (m = line.match(regexpEnd)) {
                    session.removeInLine(i, line.length - m[0].length, line.length);
                }
                if (m = line.match(regexpStart))
                    session.removeInLine(i, m[1].length, m[0].length);
            };

            testRemove = function (line: string, row: number): boolean {
                if (regexpStart.test(line)) {
                    return true;
                }
                const tokens = session.getTokens(row);
                if (tokens) {
                    for (let i = 0; i < tokens.length; i++) {
                        if (tokens[i].type === 'comment')
                            return true;
                    }
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
                session.removeInLine(i, start, end);
            };

            const commentWithSpace = lineCommentStart + " ";
            comment = function (line: string, i: number) {
                if (!ignoreBlankLines || /\S/.test(line)) {
                    if (shouldInsertSpace(line, minIndent, minIndent))
                        session.insertInLine({ row: i, column: minIndent }, commentWithSpace);
                    else
                        session.insertInLine({ row: i, column: minIndent }, lineCommentStart);
                }
            };
            testRemove = function (line: string, i: number) {
                return regexpStart.test(line);
            };
        }

        function iter(fun: (line: string, row: number) => any) {
            for (let i = startRow; i <= endRow; i++) {
                fun(session.getLine(i), i);
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
     *
     */
    toggleBlockComment(state: string, session: EditSession, range: RangeBasic, cursor: Position): void {
        let comment = this.blockComment;
        if (!comment)
            return;
        if (!comment.start && comment[0])
            comment = comment[0];

        const outerIterator = new TokenIterator(session, cursor.row, cursor.column);
        let outerToken = outerIterator.getCurrentToken();

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
            let innerToken = innerIterator.getCurrentToken();
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
     * Derived classes will override this method.
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

    /**
     * Determines the indentation of the specified line.
     * FIXME: This function does not use this and so should be standalone.
     */
    protected $getIndent(line: string): string {
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
    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => void): void {
        // TextMode does not create a worker.
        callback(void 0);
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
     */
    // TODO: May be able to make this type-safe by separating cases where param is string from Range.
    // string => {text: string; selection: number[]} (This corresponds to the insert operation)
    // Range  => Range                               (This corresponds to the remove operation)
    transformAction(state: string, action: string, editor: Editor, session: EditSession, param: string | RangeBasic): TextAndSelection | Range | undefined {
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

            const rulesByState = this.$tokenizer.rulesByState;
            for (const stateName of Object.keys(rulesByState)) {
                for (const rule of rulesByState[stateName]) {
                    if (typeof rule.token === "string") {
                        const token = rule.token;
                        if (/keyword|support|storage/.test(token)) {
                            // Following Rule normalization by the Tokenizer constructor,
                            // the `regex` property should be a string.
                            if (typeof rule.regex === 'string') {
                                completionKeywords.push(rule.regex);
                            }
                            else {
                                console.warn(`rule.regex ${JSON.stringify(rule)} in state ${stateName} is not correctly normalized.}`);
                            }
                        }
                    }
                    else if (typeof rule.token === "object" && rule.token !== null && Array.isArray(rule.token)) {
                        const tokens = rule.token;
                        // TODO: This cannot be converted to a for-of because of a later use of an index.
                        // Does this suggest that we should be zipping the tokens and matches?
                        for (let i = 0, iLength = tokens.length; i < iLength; i++) {
                            const token = tokens[i];
                            if (typeof token === 'string') {
                                if (/keyword|support|storage/.test(token)) {
                                    // drop surrounding parens
                                    if (typeof rule.regex === 'string') {
                                        const matches = rule.regex.match(/\(.+?\)/g);
                                        if (matches) {
                                            const matched = matches[i];
                                            completionKeywords.push(matched.substr(1, matched.length - 2));
                                        }
                                    }
                                }
                            }
                            else {
                                // TODO: This looks like dead code. What does this imply for the typing?
                                console.warn(`(TextMode) token => ${JSON.stringify(token)}`);
                            }
                        }
                    }
                    else {
                        console.warn(`(TextMode) rule.token => ${JSON.stringify(rule.token)}`);
                        // TODO: What if Rule.tokens is a function?
                        // rule.token may also be null. What does that mean?
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
                caption: word,
                name: word,
                value: word,
                score: 0,
                meta: "keyword"
            };
        });
    }
}

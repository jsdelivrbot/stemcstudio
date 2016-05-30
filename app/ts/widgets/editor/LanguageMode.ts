import Completion from "./Completion";
import Editor from "./Editor";
import EditSession from "./EditSession";
import Position from "./Position";
import Range from "./Range";
import TextAndSelection from "./TextAndSelection";
import Tokenizer from "./Tokenizer";
import WorkerClient from "./worker/WorkerClient";
import FoldMode from "./mode/folding/FoldMode";

/**
 * @class LanguageMode
 */
interface LanguageMode {

    /**
     * @property $id
     * @type string
     */
    $id: string;

    /**
     * @property indentWithTabs
     * @type boolean
     */
    $indentWithTabs: boolean;

    /**
     * @property foldingRules
     * @type FoldMode
     */
    foldingRules: FoldMode;

    /**
     * @property modes
     * @type LanguageMode[]
     */
    modes: LanguageMode[];

    /**
     * @property nonTokenRe
     * @type RegExp;
     */
    nonTokenRe: RegExp;

    /**
     * @property tokenRe
     * @type RegExp;
     */
    tokenRe: RegExp;

    /**
     * @method autoOutdent
     * @param state {string}
     * @param session {EditSession}
     * @param row {number}
     * @return {number}
     */
    autoOutdent(state: string, session: EditSession, row: number): number;

    /**
     * @method checkOutdent
     * @param state {string}
     * @param line {string}
     * @param text {string}
     * @return {boolean}
     */
    checkOutdent(state: string, line: string, text: string): boolean;

    /**
     * @method createWorker
     * @param session {EditSession}
     * @param callback {(err: any, worker?: WorkerClient) => any}
     * @return {void}
     */
    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => any): void;

    /**
     * @method getCompletions
     * @param state {string}
     * @param session {EditSession}
     * @param position {Position}
     * @param prefix {string}
     * @return {Completion[]}
     */
    getCompletions(state: string, session: EditSession, position: Position, prefix: string): Completion[];

    /**
     * @method getMatching
     * @param session {EditSession}
     * @return {Range}
     */
    getMatching(session: EditSession): Range;

    /**
     * @method getNextLineIndent
     * @param state {string}
     * @param line {string}
     * @param tab {string}
     * @return {string}
     */
    getNextLineIndent(state: string, line: string, tab: string): string;

    /**
     * @method getTokenizer
     * @return {Tokenizer}
     */
    getTokenizer(): Tokenizer;

    /**
     * @method toggleCommentLines
     * @param state {string}
     * @param session {EditSession}
     * @param startRow {number}
     * @param endRow {number}
     * @return {boolean}
     */
    toggleCommentLines(state: string, session: EditSession, startRow: number, endRow: number): boolean;

    /**
     * @method toggleBlockComment
     * @param state {string}
     * @param session {EditSession}
     * @param range {Range}
     * @param cursor {Position}
     * @return {void}
     */
    toggleBlockComment(state: string, session: EditSession, range: Range, cursor: Position): void;

    /**
     * @method transformAction
     * @param state {string}
     * @param action {string}
     * @param editor {Editor}
     * @param session {EditSession}
     * @param data {string | Range}
     * @return {TextAndSelection | Range}
     */
    transformAction(state: string, action: string, editor: Editor, session: EditSession, data: string | Range): TextAndSelection | Range;
}

export default LanguageMode;

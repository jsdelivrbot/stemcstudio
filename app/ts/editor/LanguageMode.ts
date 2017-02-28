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
 *
 */
interface LanguageMode {

    /**
     *
     */
    $id: string;

    /**
     * 
     */
    wrap: 'code' | 'text' | 'auto';

    /**
     *
     */
    $indentWithTabs: boolean;

    /**
     *
     */
    foldingRules: FoldMode;

    /**
     *
     */
    modes: LanguageMode[];

    /**
     *
     */
    nonTokenRe: RegExp;

    /**
     *
     */
    tokenRe: RegExp;

    /**
     * @param state
     * @param session
     * @param row
     */
    autoOutdent(state: string, session: EditSession, row: number): void;

    /**
     * @param state
     * @param line
     * @param text
     */
    checkOutdent(state: string, line: string, text: string): boolean;

    /**
     * @param session
     * @param callback
     */
    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => any): void;

    /**
     * @param state
     * @param session
     * @param position
     * @param prefix
     */
    getCompletions(state: string, session: EditSession, position: Position, prefix: string): Completion[];

    /**
     * @param session
     */
    getMatching(session: EditSession): Range;

    /**
     * @param state
     * @param line
     * @param tab
     */
    getNextLineIndent(state: string, line: string, tab: string): string;

    /**
     *
     */
    getTokenizer(): Tokenizer;

    /**
     * @param state
     * @param session
     * @param startRow
     * @param endRow
     */
    toggleCommentLines(state: string, session: EditSession, startRow: number, endRow: number): void;

    /**
     * @param state
     * @param session
     * @param range
     * @param cursor
     */
    toggleBlockComment(state: string, session: EditSession, range: Range, cursor: Position): void;

    /**
     * @param state
     * @param action
     * @param editor
     * @param session
     * @param data
     */
    transformAction(state: string, action: string, editor: Editor, session: EditSession, data: string | Range): TextAndSelection | Range | undefined;
}

export default LanguageMode;

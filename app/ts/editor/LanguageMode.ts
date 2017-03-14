import Completion from "./Completion";
import Editor from "./Editor";
import EditSession from "./EditSession";
import Position from "./Position";
import Range from "./Range";
import TextAndSelection from "./TextAndSelection";
import Tokenizer from "./Tokenizer";
import WorkerClient from "./worker/WorkerClient";
import FoldMode from "./mode/folding/FoldMode";
import { HighlighterToken, HighlighterStack, HighlighterStackElement } from './mode/Highlighter';

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
     *
     */
    autoOutdent(state: string, session: EditSession, row: number): void;

    /**
     *
     */
    checkOutdent(state: string, line: string, text: string): boolean;

    /**
     *
     */
    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => any): void;

    /**
     *
     */
    getCompletions(state: string, session: EditSession, position: Position, prefix: string): Completion[];

    /**
     *
     */
    getMatching(session: EditSession): Range;

    /**
     *
     */
    getNextLineIndent(state: string, line: string, tab: string): string;

    /**
     *
     */
    getTokenizer(): Tokenizer<HighlighterToken, HighlighterStackElement, HighlighterStack>;

    /**
     *
     */
    toggleCommentLines(state: string, session: EditSession, startRow: number, endRow: number): void;

    /**
     *
     */
    toggleBlockComment(state: string, session: EditSession, range: Range, cursor: Position): void;

    /**
     *
     */
    transformAction(state: string, action: string, editor: Editor, session: EditSession, data: string | Range): TextAndSelection | Range | undefined;
}

export default LanguageMode;

import { Completion } from "./Completion";
import { Editor } from "./Editor";
import { EditSession } from "./EditSession";
import { Position } from "./Position";
import { Range } from "./Range";
import TextAndSelection from "./TextAndSelection";
import { Tokenizer } from "./Tokenizer";
// import { WorkerClient } from "./worker/WorkerClient";
import { FoldMode } from "./mode/folding/FoldMode";
import { HighlighterToken, HighlighterStack, HighlighterStackElement } from './mode/Highlighter';
//
// Editor Abstraction Layer
//
import { LanguageModeId } from '../virtual/editor';

export interface Disposable {
    dispose(): void;
}

/**
 *
 */
export interface LanguageMode {
    /**
     *
     */
    $id: LanguageModeId;

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
     * Performs any replacement needed to outdent the current line.
     */
    autoOutdent(state: string, session: EditSession, row: number): void;

    /**
     * text us the character sequence entered.
     * Should return true or false on whether to call autoOutdent.
     */
    checkOutdent(state: string, line: string, text: string): boolean;

    /**
     * Called to create a worker which can perform analysis in the background.
     * This analysis is usually for detecting syntax errors.
     */
    createWorker(session: EditSession, callback: (err: any, worker?: Disposable) => any): void;

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

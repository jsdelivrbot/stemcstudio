import { Position } from './editor';
import { Range } from './editor';
import { EditorMinimal } from './EditorMinimal';

export interface EditorChangeable extends EditorMinimal {
    /**
     * Indicates that the editor content cannot be changed.
     */
    readOnly: boolean;

    blockOutdent(): void;
    blockIndent(): void;

    copyLinesDown(): void;
    copyLinesUp(): void;

    cut(): void;
    copy(): void;
    paste(args: { text: string }): void;

    deleteLeft(): void;

    indent(): void;
    insert(text: string): void;

    modifyNumber(value: number): void;

    moveLinesDown(): void;
    moveLinesUp(): void;

    replace(value: string): void;
    replaceAll(value: string): void;
    replaceRange(range: Readonly<Range>, newText: string): Position;
    /**
     * Removes the `range` from the document.
     * Triggers a 'change' event in the document.
     */
    removeRange(range: Readonly<Range>): Position;
    /**
     * Removes the specified columns from the `row`.
     * This method also triggers the `'change'` event.
     *
     * @param row The row to remove from
     * @param startColumn The column to start removing at 
     * @param endColumn The column to stop removing at
     * @returns An object containing `startRow` and `startColumn`, indicating the new row and column values.<br/>If `startColumn` is equal to `endColumn`, this function returns nothing.
     *
     */
    removeInLine(row: number, startColumn: number, endColumn: number): Position;

    remove(direction: 'left' | 'right'): void;

    removeLines(): void;

    removeToLineStart(): void;
    removeToLineEnd(): void;

    removeWordLeft(): void;
    removeWordRight(): void;

    splitLine(): void;

    toggleBlockComment(): void;
    toggleCommentLines(): void;

    toLowerCase(): void;
    toUpperCase(): void;

    transposeLetters(): void;
}

export function isEditorChangeable(editor: EditorMinimal): editor is EditorChangeable {
    if (editor) {
        const candidate = editor as EditorChangeable;
        return typeof candidate.replace === 'function' && typeof candidate.replaceAll === 'function';
    }
    else {
        return false;
    }
}

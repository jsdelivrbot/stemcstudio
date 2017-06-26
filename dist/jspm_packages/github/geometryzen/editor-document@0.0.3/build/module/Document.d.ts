import { Delta } from './Delta';
import { Position } from './Position';
import { Range } from './Range';
import { Shareable } from './Shareable';
export declare type DocumentEventName = 'change' | 'changeNewLineMode';
export declare type NewLineMode = 'auto' | 'unix' | 'windows';
/**
 *
 */
export declare class Document implements Shareable {
    /**
     * The lines of text.
     * These lines do not include a line terminating character.
     */
    private readonly _lines;
    /**
     *
     */
    private _autoNewLine;
    /**
     *
     */
    private _newLineMode;
    /**
     * A source of 'change' events that is observable.
     */
    /**
     *
     */
    private _eventBus;
    /**
     * Maintains a count of the number of references to this instance of Document.
     */
    private refCount;
    /**
     * If text is included, the Document contains those strings; otherwise, it's empty.
     * A `change` event will be emitted. But does anyone see it?
     *
     * @param textOrLines
     */
    constructor(textOrLines: string | Array<string>);
    protected destructor(): void;
    addRef(): number;
    release(): number;
    /**
     * Replaces all the lines in the current `Document` with the value of `text`.
     * A `change` event will be emitted.
     */
    setValue(text: string): void;
    /**
     * Returns all the lines in the document as a single string, joined by the new line character.
     */
    getValue(): string;
    private eventBusOrThrow();
    /**
     * Determines the newline character that is present in the presented text
     * and caches the result in $autoNewLine.
     * Emits 'changeNewLineMode'.
     */
    private $detectNewLine(text);
    /**
     * Returns the newline character that's being used, depending on the value of `newLineMode`.
     *  If `newLineMode == windows`, `\r\n` is returned.
     *  If `newLineMode == unix`, `\n` is returned.
     *  If `newLineMode == auto`, the value of `autoNewLine` is returned.
     */
    getNewLineCharacter(): string;
    /**
     * Sets the new line mode.
     *
     * newLineMode is the newline mode to use; can be either `windows`, `unix`, or `auto`.
     * Emits 'changeNewLineMode'
     */
    setNewLineMode(newLineMode: NewLineMode): void;
    /**
     * Returns the type of newlines being used; either `windows`, `unix`, or `auto`.
     */
    getNewLineMode(): NewLineMode;
    /**
     * Returns `true` if `text` is a newline character (either `\r\n`, `\r`, or `\n`).
     *
     * @param text The text to check.
     */
    isNewLine(text: string): boolean;
    /**
     * Returns a verbatim copy of the given line as it is in the document.
     *
     * @param row The row index to retrieve.
     */
    getLine(row: number): string;
    /**
     * Returns a COPY of the lines between and including `firstRow` and `lastRow`.
     * These lines do not include the line terminator.
     *
     * @param firstRow The first row index to retrieve.
     * @param lastRow The final row index to retrieve.
     */
    getLines(firstRow: number, lastRow: number): string[];
    /**
     * Returns a COPY of the lines in the document.
     * These lines do not include the line terminator.
     */
    getAllLines(): string[];
    /**
     * Returns the number of rows in the document.
     */
    getLength(): number;
    /**
     * Returns all the text corresponding to the range with line terminators.
     */
    getTextRange(range: Readonly<Range>): string;
    /**
     * Returns all the text within `range` as an array of lines.
     */
    getLinesForRange(range: Readonly<Range>): string[];
    /**
     * Inserts a block of `text` at the indicated `position`.
     * Returns the end position of the inserted text, the character immediately after the last character inserted.
     * This method also triggers the 'change' event.
     */
    insert(position: Position, text: string): Position;
    /**
     * Inserts `text` into the `position` at the current row. This method also triggers the `"change"` event.
     *
     * This differs from the `insert` method in two ways:
     *   1. This does NOT handle newline characters (single-line text only).
     *   2. This is faster than the `insert` method for single-line text insertions.
     */
    insertInLine(position: Readonly<Position>, text: string): Position;
    /**
     * Clips the position so that it refers to the nearest valid position.
     */
    clippedPos(row: number, column: number): Position;
    on(eventName: DocumentEventName, callback: (event: any, source: Document) => any, capturing?: boolean): () => void;
    off(eventName: DocumentEventName, callback: (event: any, source: Document) => any, capturing?: boolean): void;
    /**
     *
     */
    addChangeListener(callback: (event: Delta, source: Document) => void): () => void;
    /**
     *
     */
    addChangeNewLineModeListener(callback: (event: any, source: Document) => any): void;
    /**
     *
     */
    removeChangeListener(callback: (event: Delta, source: Document) => any): void;
    /**
     *
     */
    removeChangeNewLineModeListener(callback: (event: any, source: Document) => any): void;
    /**
     * Inserts the elements in `lines` into the document as full lines (does not merge with existing line), starting at the row index given by `row`.
     * This method also triggers the `"change"` event.
     */
    insertFullLines(row: number, lines: string[]): Position;
    /**
     * Inserts the text in `lines` into the document, starting at the `position` given.
     * Returns the end position of the inserted text.
     * This method also triggers the 'change' event.
     */
    insertMergedLines(position: Readonly<Position>, lines: string[]): Position;
    /**
     * Removes the `range` from the document.
     * This method triggers a 'change' event.
     *
     * @param range A specified Range to remove
     * @return Returns the new `start` property of the range.
     * If `range` is empty, this function returns the unmodified value of `range.start`.
     */
    remove(range: Readonly<Range>): Position;
    /**
     * Removes the specified columns from the `row`.
     * This method also triggers the `'change'` event.
     *
     * @param row The row to remove from.
     * @param startColumn The column to start removing at.
     * @param endColumn The column to stop removing at.
     * @returns An object containing `startRow` and `startColumn`, indicating the new row and column values.<br/>If `startColumn` is equal to `endColumn`, this function returns nothing.
     */
    removeInLine(row: number, startColumn: number, endColumn: number): Position;
    /**
     * Removes a range of full lines and returns a COPY of the removed lines.
     * This method also triggers the `"change"` event.
     *
     * @param firstRow The first row to be removed
     * @param lastRow The last row to be removed
     */
    removeFullLines(firstRow: number, lastRow: number): string[];
    /**
     * Removes the new line between `row` and the row immediately following it.
     *
     * @param row The row to check.
     */
    removeNewLine(row: number): void;
    /**
     * Replaces a range in the document with the new `text`.
     * Returns the end position of the change.
     * This method triggers a 'change' event for the removal.
     * This method triggers a 'change' event for the insertion.
     */
    replace(range: Range, newText: string): Position;
    /**
     * Applies all the changes previously accumulated.
     */
    applyDeltas(deltas: Delta[]): void;
    /**
     * Reverts any changes previously applied.
     */
    revertDeltas(deltas: Delta[]): void;
    /**
     * Applies `delta` (insert and remove actions) to the document and triggers the 'change' event.
     */
    applyDelta(delta: Delta, doNotValidate?: boolean): void;
    private $splitAndapplyLargeDelta(delta, MAX);
    /**
     * Reverts `delta` from the document.
     * A delta object (can include "insert" and "remove" actions)
     */
    revertDelta(delta: Readonly<Delta>): void;
    /**
     * Converts an index position in a document to a `{row, column}` object.
     *
     * Index refers to the "absolute position" of a character in the document. For example:
     *
     * ```javascript
     * x = 0; // 10 characters, plus one for newline
     * y = -1;
     * ```
     *
     * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
     *
     * @param index An index to convert
     * @param startRow The row from which to start the conversion
     * @returns An object of the `index` position.
     */
    indexToPosition(index: number, startRow?: number): Position;
    /**
     * Converts the `position` in a document to the character's zero-based index.
     *
     * Index refers to the "absolute position" of a character in the document. For example:
     *
     * ```javascript
     * x = 0; // 10 characters, plus one for newline
     * y = -1;
     * ```
     *
     * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
     *
     * @param position The `{row, column}` to convert.
     * @param startRow The row from which to start the conversion. Defaults to zero.
     */
    positionToIndex(position: Readonly<Position>, startRow?: number): number;
}

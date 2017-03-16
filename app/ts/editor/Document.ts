import applyDelta from './applyDelta';
import { equalPositions } from './Position';
import Delta from './Delta';
import EventEmitterClass from './lib/EventEmitterClass';
import Position from './Position';
import Range from './Range';
import RangeBasic from './RangeBasic';
import { isEmptyRange } from './RangeBasic';
import Shareable from './base/Shareable';

/**
 * Copies a Position.
 */
function clonePos(pos: Position): Position {
    return { row: pos.row, column: pos.column };
}

/**
 * Constructs a Position from row and column.
 */
function pos(row: number, column: number): Position {
    return { row: row, column: column };
}

const $split: (text: string) => string[] = (function () {
    function foo(text: string): string[] {
        return text.replace(/\r\n|\r/g, "\n").split("\n");
    }
    function bar(text: string): string[] {
        return text.split(/\r\n|\r|\n/);
    }
    // Determine whether the split function performs as we expect.
    // Here we attempt to separate a string of three separators.
    // If all works out, we should get back an array of four (4) empty strings.
    if ("aaa".split(/a/).length === 0) {
        return foo;
    }
    else {
        // In Chrome, this is the mainline because the result
        // of the test condition length is 4.
        return bar;
    }
})();

/*
function clipPosition(doc: Document, position: Position): Position {
    const length = doc.getLength();
    if (position.row >= length) {
        position.row = Math.max(0, length - 1);
        position.column = doc.getLine(length - 1).length;
    }
    else {
        position.row = Math.max(0, position.row);
        position.column = Math.min(Math.max(position.column, 0), doc.getLine(position.row).length);
    }
    return position;
}
*/

const CHANGE = 'change';
const CHANGE_NEW_LINE_MODE = 'changeNewLineMode';
export type EVENT_NAME_TYPE = 'change' | 'changeNewLineMode';
export type NewLineMode = 'auto' | 'unix' | 'windows';

/**
 *
 */
export class Document implements Shareable {

    /**
     * The lines of text.
     * These lines do not include a line terminating character.
     */
    private readonly _lines: string[] = [];

    /**
     *
     */
    private _autoNewLine = "";

    /**
     *
     */
    private _newLineMode: NewLineMode = "auto";

    /**
     *
     */
    private _eventBus: EventEmitterClass<any, Document> | undefined;

    /**
     * Maintains a count of the number of references to this instance of Document.
     */
    private refCount = 1;

    /**
     * If text is included, the Document contains those strings; otherwise, it's empty.
     *
     * @param textOrLines
     */
    constructor(textOrLines: string | Array<string>) {
        this._lines = [""];

        this._eventBus = new EventEmitterClass<any, Document>(this);

        // There has to be one line at least in the document. If you pass an empty
        // string to the insert function, nothing will happen. Workaround.
        if (textOrLines.length === 0) {
            this._lines = [""];
        }
        else if (Array.isArray(textOrLines)) {
            this.insertMergedLines({ row: 0, column: 0 }, textOrLines);
        }
        else {
            this.insert({ row: 0, column: 0 }, textOrLines);
        }
    }

    protected destructor(): void {
        this._lines.length = 0;
        this._eventBus = void 0;
    }

    public addRef(): number {
        this.refCount++;
        return this.refCount;
    }

    public release(): number {
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        else if (this.refCount < 0) {
            throw new Error("Document refCount is negative.");
        }
        return this.refCount;
    }

    /**
     * Replaces all the lines in the current `Document` with the value of `text`.
     */
    setValue(text: string): void {
        const row = this.getLength() - 1;
        this.remove(new Range(0, 0, row, this.getLine(row).length));
        this.insert({ row: 0, column: 0 }, text);
    }

    /**
     * Returns all the lines in the document as a single string, joined by the new line character.
     */
    getValue(): string {
        return this._lines.join(this.getNewLineCharacter());
    }

    private eventBusOrThrow() {
        if (this._eventBus) {
            return this._eventBus;
        }
        else {
            throw new Error("Document is a zombie.");
        }
    }

    /** 
     * Determines the newline character that is present in the presented text
     * and caches the result in $autoNewLine.
     * Emits 'changeNewLineMode'.
     */
    private $detectNewLine(text: string): void {
        const match = text.match(/^.*?(\r\n|\r|\n)/m);
        this._autoNewLine = match ? match[1] : "\n";
        this.eventBusOrThrow()._signal(CHANGE_NEW_LINE_MODE);
    }

    /**
     * Returns the newline character that's being used, depending on the value of `newLineMode`.
     *  If `newLineMode == windows`, `\r\n` is returned.  
     *  If `newLineMode == unix`, `\n` is returned.  
     *  If `newLineMode == auto`, the value of `autoNewLine` is returned.
     */
    getNewLineCharacter(): string {
        switch (this._newLineMode) {
            case "windows":
                return "\r\n";
            case "unix":
                return "\n";
            default:
                return this._autoNewLine || "\n";
        }
    }

    /**
     * Sets the new line mode.
     *
     * newLineMode is the newline mode to use; can be either `windows`, `unix`, or `auto`.
     * Emits 'changeNewLineMode'
     */
    setNewLineMode(newLineMode: NewLineMode): void {
        if (this._newLineMode === newLineMode) {
            return;
        }
        this._newLineMode = newLineMode;
        this.eventBusOrThrow()._signal(CHANGE_NEW_LINE_MODE);
    }

    /**
     * Returns the type of newlines being used; either `windows`, `unix`, or `auto`.
     */
    getNewLineMode(): NewLineMode {
        return this._newLineMode;
    }

    /**
     * Returns `true` if `text` is a newline character (either `\r\n`, `\r`, or `\n`).
     *
     * @param text The text to check.
     */
    isNewLine(text: string): boolean {
        return (text === "\r\n" || text === "\r" || text === "\n");
    }

    /**
     * Returns a verbatim copy of the given line as it is in the document.
     *
     * @param row The row index to retrieve.
     */
    getLine(row: number): string {
        return this._lines[row] || "";
    }

    /**
     * Returns a COPY of the lines between and including `firstRow` and `lastRow`.
     * These lines do not include the line terminator.
     *
     * @param firstRow The first row index to retrieve.
     * @param lastRow The final row index to retrieve.
     */
    getLines(firstRow: number, lastRow: number): string[] {
        // The semantics of slice are that it does not include the end index.
        const end = lastRow + 1;
        return this._lines.slice(firstRow, end);
    }

    /**
     * Returns a COPY of the lines in the document.
     * These lines do not include the line terminator.
     */
    getAllLines(): string[] {
        return this._lines.slice(0, this._lines.length);
    }

    /**
     * Returns the number of rows in the document.
     */
    getLength(): number {
        return this._lines.length;
    }

    /**
     * Returns all the text corresponding to the range with line terminators.
     */
    getTextRange(range: RangeBasic): string {
        return this.getLinesForRange(range).join(this.getNewLineCharacter());
    }

    /**
     * Returns all the text within `range` as an array of lines.
     */
    getLinesForRange(range: RangeBasic): string[] {
        let lines: string[];
        if (range.start.row === range.end.row) {
            // Handle a single-line range.
            lines = [this.getLine(range.start.row).substring(range.start.column, range.end.column)];
        }
        else {
            // Handle a multi-line range.
            lines = this.getLines(range.start.row, range.end.row);
            lines[0] = (lines[0] || "").substring(range.start.column);
            const l = lines.length - 1;
            if (range.end.row - range.start.row === l) {
                lines[l] = lines[l].substring(0, range.end.column);
            }
        }
        return lines;
    }

    /**
     * Inserts a block of `text` at the indicated `position`.
     * Returns the end position of the inserted text, the character immediately after the last character inserted.
     * This method also triggers the 'change' event.
     */
    insert(position: Position, text: string): Position {
        // Only detect new lines if the document has no line break yet.
        if (this.getLength() <= 1) {
            this.$detectNewLine(text);
        }
        return this.insertMergedLines(position, $split(text));
    }

    /**
     * Inserts `text` into the `position` at the current row. This method also triggers the `"change"` event.
     * 
     * This differs from the `insert` method in two ways:
     *   1. This does NOT handle newline characters (single-line text only).
     *   2. This is faster than the `insert` method for single-line text insertions.
     */
    insertInLine(position: Readonly<Position>, text: string): Position {
        const start: Position = this.clippedPos(position.row, position.column);
        const end: Position = pos(position.row, position.column + text.length);

        this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: [text]
        }, true);

        return clonePos(end);
    }

    /**
     * Clips the position so that it refers to the nearest valid position.
     */
    clippedPos(row: number, column: number): Position {
        const length = this.getLength();
        let rowTooBig = false;
        if (row === void 0) {
            row = length;
        }
        else if (row < 0) {
            row = 0;
        }
        else if (row >= length) {
            row = length - 1;
            rowTooBig = true;
        }
        const line = this.getLine(row);
        if (rowTooBig) {
            column = line.length;
        }
        column = Math.min(Math.max(column, 0), line.length);
        return { row: row, column: column };
    }

    on(eventName: EVENT_NAME_TYPE, callback: (event: any, source: Document) => any, capturing?: boolean): () => void {
        return this.eventBusOrThrow().on(eventName, callback, capturing);
    }

    off(eventName: EVENT_NAME_TYPE, callback: (event: any, source: Document) => any, capturing?: boolean): void {
        return this.eventBusOrThrow().off(eventName, callback, capturing);
    }

    /**
     *
     */
    addChangeListener(callback: (event: Delta, source: Document) => any): () => void {
        return this.on(CHANGE, callback, false);
    }

    /**
     *
     */
    addChangeNewLineModeListener(callback: (event: any, source: Document) => any): void {
        this.on(CHANGE_NEW_LINE_MODE, callback, false);
    }

    /**
     *
     */
    removeChangeListener(callback: (event: Delta, source: Document) => any): void {
        this.off(CHANGE, callback);
    }

    /**
     *
     */
    removeChangeNewLineModeListener(callback: (event: any, source: Document) => any): void {
        this.off(CHANGE_NEW_LINE_MODE, callback);
    }

    /**
     * Inserts the elements in `lines` into the document as full lines (does not merge with existing line), starting at the row index given by `row`.
     * This method also triggers the `"change"` event.
     */
    insertFullLines(row: number, lines: string[]): Position {
        // Clip to document.
        // Allow one past the document end.
        row = Math.min(Math.max(row, 0), this.getLength());

        // Calculate insertion point.
        let column = 0;
        if (row < this.getLength()) {
            // Insert before the specified row.
            lines = lines.concat([""]);
            column = 0;
        }
        else {
            // Insert after the last row in the document.
            lines = [""].concat(lines);
            row--;
            column = this._lines[row].length;
        }

        // Insert.
        return this.insertMergedLines({ row: row, column: column }, lines);
    }

    /**
     * Inserts the text in `lines` into the document, starting at the `position` given.
     * Returns the end position of the inserted text.
     * This method also triggers the 'change' event.
     */
    insertMergedLines(position: Readonly<Position>, lines: string[]): Position {
        const start: Position = this.clippedPos(position.row, position.column);
        const end: Position = {
            row: start.row + lines.length - 1,
            column: (lines.length === 1 ? start.column : 0) + lines[lines.length - 1].length
        };

        this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: lines
        });

        return clonePos(end);
    }

    /**
     * Removes the `range` from the document.
     * This method triggers a 'change' event.
     *
     * @param range A specified Range to remove
     * @return Returns the new `start` property of the range.
     * If `range` is empty, this function returns the unmodified value of `range.start`.
     */
    remove(range: Readonly<RangeBasic>): Position {
        const start = this.clippedPos(range.start.row, range.start.column);
        const end = this.clippedPos(range.end.row, range.end.column);
        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({ start: start, end: end })
        });
        return clonePos(start);
    }

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
    removeInLine(row: number, startColumn: number, endColumn: number): Position {
        const start = this.clippedPos(row, startColumn);
        const end = this.clippedPos(row, endColumn);

        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({ start: start, end: end })
        }, true);

        return clonePos(start);
    }

    /**
     * Removes a range of full lines and returns a COPY of the removed lines.
     * This method also triggers the `"change"` event.
     *
     * @param firstRow The first row to be removed
     * @param lastRow The last row to be removed
     */
    removeFullLines(firstRow: number, lastRow: number): string[] {
        // Clip to document.
        firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
        lastRow = Math.min(Math.max(0, lastRow), this.getLength() - 1);

        // Calculate deletion range.
        // Delete the ending new line unless we're at the end of the document.
        // If we're at the end of the document, delete the starting new line.
        const deleteFirstNewLine = lastRow === this.getLength() - 1 && firstRow > 0;
        const deleteLastNewLine = lastRow < this.getLength() - 1;
        const startRow = (deleteFirstNewLine ? firstRow - 1 : firstRow);
        const startCol = (deleteFirstNewLine ? this.getLine(startRow).length : 0);
        const endRow = (deleteLastNewLine ? lastRow + 1 : lastRow);
        const endCol = (deleteLastNewLine ? 0 : this.getLine(endRow).length);
        const range = new Range(startRow, startCol, endRow, endCol);

        /**
         * A copy of delelted lines with line terminators omitted (maintains previous behavior).
         */
        const deletedLines = this.getLines(firstRow, lastRow);

        this.applyDelta({
            start: range.start,
            end: range.end,
            action: "remove",
            lines: this.getLinesForRange(range)
        });

        return deletedLines;
    }

    /**
     * Removes the new line between `row` and the row immediately following it.
     *
     * @param row The row to check.
     */
    removeNewLine(row: number): void {
        if (row < this.getLength() - 1 && row >= 0) {
            this.applyDelta({
                start: pos(row, this.getLine(row).length),
                end: pos(row + 1, 0),
                action: "remove",
                lines: ["", ""]
            });
        }
    }

    /**
     * Replaces a range in the document with the new `text`.
     * Returns the end position of the change.
     * This method triggers a 'change' event for the removal. 
     * This method triggers a 'change' event for the insertion.
     */
    replace(range: RangeBasic, newText: string): Position {

        if (newText.length === 0 && isEmptyRange(range)) {
            // If the range is empty then the range.start and range.end will be the same.
            return range.end;
        }

        const oldText = this.getTextRange(range);

        // Shortcut: If the text we want to insert is the same as it is already
        // in the document, we don't have to replace anything.
        if (newText === oldText) {
            return range.end;
        }

        this.remove(range);

        return this.insert(range.start, newText);
    }

    /**
     * Applies all the changes previously accumulated.
     */
    applyDeltas(deltas: Delta[]): void {
        for (let i = 0; i < deltas.length; i++) {
            this.applyDelta(deltas[i]);
        }
    }

    /**
     * Reverts any changes previously applied.
     */
    revertDeltas(deltas: Delta[]): void {
        for (let i = deltas.length - 1; i >= 0; i--) {
            this.revertDelta(deltas[i]);
        }
    }

    /**
     * Applies `delta` (insert and remove actions) to the document and triggers the 'change' event.
     */
    applyDelta(delta: Delta, doNotValidate?: boolean): void {

        const isInsert = delta.action === "insert";
        // An empty range is a NOOP.
        if (isInsert ? delta.lines.length <= 1 && !delta.lines[0] : equalPositions(delta.start, delta.end)) {
            return;
        }

        if (isInsert && delta.lines.length > 20000)
            this.$splitAndapplyLargeDelta(delta, 20000);

        applyDelta(this._lines, delta, doNotValidate);
        this.eventBusOrThrow()._signal(CHANGE, delta);
    }

    private $splitAndapplyLargeDelta(delta: Delta, MAX: number): void {
        // Split large insert deltas. This is necessary because:
        //    1. We need to support splicing delta lines into the document via $lines.splice.apply(...)
        //    2. fn.apply() doesn't work for a large number of params. The smallest threshold is on chrome 40 ~42000.
        // we use 20000 to leave some space for actual stack
        // 
        // To Do: Ideally we'd be consistent and also split 'delete' deltas. We don't do this now, because delete
        //        delta handling is too slow. If we make delete delta handling faster we can split all large deltas
        //        as shown in https://gist.github.com/aldendaniels/8367109#file-document-snippet-js
        //        If we do this, update validateDelta() to limit the number of lines in a delete delta.
        const lines = delta.lines;
        const l = lines.length;
        const row = delta.start.row;
        let column = delta.start.column;
        let from = 0;
        let to = 0;
        do {
            from = to;
            to += MAX - 1;
            const chunk = lines.slice(from, to);
            if (to > l) {
                // Update remaining delta.
                delta.lines = chunk;
                delta.start.row = row + from;
                delta.start.column = column;
                break;
            }
            chunk.push("");
            this.applyDelta({
                start: pos(row + from, column),
                end: pos(row + to, column = 0),
                action: delta.action,
                lines: chunk
            }, true);
        } while (true);
    }

    /**
     * Reverts `delta` from the document.
     * A delta object (can include "insert" and "remove" actions)
     */
    revertDelta(delta: Readonly<Delta>): void {
        this.applyDelta({
            start: clonePos(delta.start),
            end: clonePos(delta.end),
            action: (delta.action === "insert" ? "remove" : "insert"),
            lines: delta.lines.slice()
        });
    };

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
    indexToPosition(index: number, startRow = 0): Position {
        /**
         * A local reference to improve performance in the loop.
         */
        const lines = this._lines;
        const newlineLength = this.getNewLineCharacter().length;
        const l = lines.length;
        for (let i = startRow || 0; i < l; i++) {
            index -= lines[i].length + newlineLength;
            if (index < 0)
                return { row: i, column: index + lines[i].length + newlineLength };
        }
        return { row: l - 1, column: lines[l - 1].length };
    }

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
    positionToIndex(position: Readonly<Position>, startRow = 0): number {
        /**
         * A local reference to improve performance in the loop.
         */
        const lines = this._lines;
        const newlineLength = this.getNewLineCharacter().length;
        let index = 0;
        const row = Math.min(position.row, lines.length);
        for (let i = startRow || 0; i < row; ++i) {
            index += lines[i].length + newlineLength;
        }

        return index + position.column;
    }
}

export default Document;

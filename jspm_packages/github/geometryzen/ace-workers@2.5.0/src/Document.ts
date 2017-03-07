/* ***** BEGIN LICENSE BLOCK *****
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 David Geo Holmes <david.geo.holmes@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ***** END LICENSE BLOCK ***** */
/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */
"use strict";

import applyDelta from './applyDelta';
import Delta from './Delta';
import Position from './Position';
import Range from './Range';

var $split: (text: string) => string[] = (function () {
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
    var length = doc.getLength();
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

/**
 *
 */
export default class Document {

    /**
     *
     */
    private $lines: string[] = [];

    /**
     *
     */
    private $autoNewLine = "";

    /**
     *
     */
    private $newLineMode: 'auto' | 'unix' | 'windows' = "auto";

    /**
     * Creates a new Document.
     * If text is included, the Document contains those strings; otherwise, it's empty.
     *
     * @param textOrLines
     */
    constructor(textOrLines: string | Array<string>) {

        this.$lines = [""];

        // There has to be one line at least in the document. If you pass an empty
        // string to the insert function, nothing will happen. Workaround.
        if (textOrLines.length === 0) {
            this.$lines = [""];
        }
        else if (Array.isArray(textOrLines)) {
            this.insertMergedLines({ row: 0, column: 0 }, textOrLines);
        }
        else {
            this.insert({ row: 0, column: 0 }, textOrLines);
        }
    }

    /**
     * Replaces all the lines in the current `Document` with the value of `text`.
     *
     * @param text The text to use
     */
    setValue(text: string): void {
        var len = this.getLength() - 1;
        this.remove(new Range(0, 0, len, this.getLine(len).length));
        this.insert({ row: 0, column: 0 }, text);
    }

    /**
     * Returns all the lines in the document as a single string, joined by the new line character.
     */
    getValue(): string {
        return this.getAllLines().join(this.getNewLineCharacter());
    }

    /**
     * Determines the newline character that is present in the presented text
     * and caches the result in $autoNewLine.
     *
     * @param text The text to work with.
     */
    private $detectNewLine(text: string): void {
        const match = text.match(/^.*?(\r\n|\r|\n)/m);
        this.$autoNewLine = match ? match[1] : "\n";
    }

    /**
     * Returns the newline character that's being used, depending on the value of `newLineMode`.
     *  If `newLineMode == windows`, `\r\n` is returned.
     *  If `newLineMode == unix`, `\n` is returned.
     *  If `newLineMode == auto`, the value of `autoNewLine` is returned.
     */
    getNewLineCharacter(): '\r\n' | '\n' | string {
        switch (this.$newLineMode) {
            case "windows":
                return "\r\n";
            case "unix":
                return "\n";
            default:
                return this.$autoNewLine || "\n";
        }
    }

    /**
     * Sets the new line mode.
     *
     * @param newLineMode The newline mode to use; can be either `windows`, `unix`, or `auto`.
     */
    setNewLineMode(newLineMode: 'auto' | 'unix' | 'windows'): void {
        if (this.$newLineMode === newLineMode) {
            return;
        }
        this.$newLineMode = newLineMode;
    }

    /**
     * Returns the type of newlines being used; either `windows`, `unix`, or `auto`.
     */
    getNewLineMode(): 'auto' | 'unix' | 'windows' {
        return this.$newLineMode;
    }

    /**
     * Returns `true` if `text` is a newline character (either `\r\n`, `\r`, or `\n`).
     *
     * @param text The text to check
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
        return this.$lines[row] || "";
    }

    /**
     * Returns an array of strings of the rows between `firstRow` and `lastRow`.
     * This function is inclusive of `lastRow`.
     */
    getLines(firstRow: number, lastRow: number): string[] {
        return this.$lines.slice(firstRow, lastRow + 1);
    }

    /**
     * Returns all lines in the document as string array.
     */
    getAllLines(): string[] {
        return this.getLines(0, this.getLength());
    }

    /**
     * Returns the number of rows in the document.
     */
    getLength(): number {
        return this.$lines.length;
    }

    /**
     * Given a range within the document, returns all the text within that range as a single string.
     *
     * @param range The range to work with.
     */
    getTextRange(range: Range): string {
        return this.getLinesForRange(range).join(this.getNewLineCharacter());
    }

    /**
     * Returns all the text within `range` as an array of lines.
     *
     * @param range The range to work with.
     */
    getLinesForRange(range: { start: Position; end: Position }): string[] {
        var lines: string[];
        if (range.start.row === range.end.row) {
            // Handle a single-line range.
            lines = [this.getLine(range.start.row).substring(range.start.column, range.end.column)];
        }
        else {
            // Handle a multi-line range.
            lines = this.getLines(range.start.row, range.end.row);
            lines[0] = (lines[0] || "").substring(range.start.column);
            var l = lines.length - 1;
            if (range.end.row - range.start.row === l) {
                lines[l] = lines[l].substring(0, range.end.column);
            }
        }
        return lines;
    }

    /**
     * Inserts a block of `text` at the indicated `position`.
     *
     * @param position The position to start inserting at; it's an object that looks like `{ row: row, column: column}`
     * @param text A chunk of text to insert
     * @returns The position ({row, column}) of the last line of `text`.
     * If the length of `text` is 0, this function simply returns `position`.
     */
    insert(position: Position, text: string): Position {
        // Only detect new lines if the document has no line break yet.
        if (this.getLength() <= 1) {
            this.$detectNewLine(text);
        }

        return this.insertMergedLines(position, $split(text));
    };

    /**
     * Inserts `text` into the `position` at the current row. This method also triggers the `"change"` event.
     *
     * This differs from the `insert` method in two ways:
     *   1. This does NOT handle newline characters (single-line text only).
     *   2. This is faster than the `insert` method for single-line text insertions.
     *
     * @param position The position to insert at; it's an object that looks like `{ row: row, column: column}`
     * @param text A chunk of text
     * @returns Returns an object containing the final row and column.
     */
    insertInLine(position: Position, text: string): Position {
        var start: Position = this.clippedPos(position.row, position.column);
        var end: Position = this.pos(position.row, position.column + text.length);

        this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: [text]
        }, true);

        return this.clonePos(end);
    }

    clippedPos(row: number, column: number): Position {
        var length = this.getLength();
        if (row === undefined) {
            row = length;
        }
        else if (row < 0) {
            row = 0;
        }
        else if (row >= length) {
            row = length - 1;
            column = undefined;
        }
        var line = this.getLine(row);
        if (column === undefined)
            column = line.length;
        column = Math.min(Math.max(column, 0), line.length);
        return { row: row, column: column };
    }

    // FIXME: Why is this a method?
    private clonePos(pos: Position): Position {
        return { row: pos.row, column: pos.column };
    }

    private pos(row: number, column: number): Position {
        return { row: row, column: column };
    }

    /**
     * Fires whenever the document changes.
     *
     * Several methods trigger different `"change"` events. Below is a list of each action type, followed by each property that's also available:
     *
     *  * `"insert"`
     *    * `range`: the [[Range]] of the change within the document
     *    * `lines`: the lines being added
     *  * `"remove"`
     *    * `range`: the [[Range]] of the change within the document
     *    * `lines`: the lines being removed
     *
     * @event change
     * @param e Contains at least one property called `"action"`. `"action"` indicates the action that triggered the change. Each action also has a set of additional properties.
     *
     */

    /**
     * Inserts the elements in `lines` into the document as full lines (does not merge with existing line), starting at the row index given by `row`. This method also triggers the `"change"` event.
     * @param row The index of the row to insert at
     * @param lines An array of strings
     */
    insertFullLines(row: number, lines: string[]): Position {
        // Clip to document.
        // Allow one past the document end.
        row = Math.min(Math.max(row, 0), this.getLength());

        // Calculate insertion point.
        var column = 0;
        if (row < this.getLength()) {
            // Insert before the specified row.
            lines = lines.concat([""]);
            column = 0;
        } else {
            // Insert after the last row in the document.
            lines = [""].concat(lines);
            row--;
            column = this.$lines[row].length;
        }

        // Insert.
        return this.insertMergedLines({ row: row, column: column }, lines);
    }

    /**
     * Inserts the elements in `lines` into the document, starting at the position index given by `row`. This method also triggers the `"change"` event.
     * @param row The index of the row to insert at
     * @param lines An array of strings
     */
    insertMergedLines(position: Position, lines: string[]): Position {
        var start: Position = this.clippedPos(position.row, position.column);
        var end: Position = {
            row: start.row + lines.length - 1,
            column: (lines.length === 1 ? start.column : 0) + lines[lines.length - 1].length
        };

        this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: lines
        });

        return this.clonePos(end);
    }

    /**
     * Removes the `range` from the document.
     *
     * @param range A specified Range to remove
     * @returns Returns the new `start` property of the range.
     * If `range` is empty, this function returns the unmodified value of `range.start`.
     */
    remove(range: Range): Position {
        var start = this.clippedPos(range.start.row, range.start.column);
        var end = this.clippedPos(range.end.row, range.end.column);
        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({ start: start, end: end })
        });
        return this.clonePos(start);
    }

    /**
     * Removes the specified columns from the `row`.
     * This method also triggers the `'change'` event.
     *
     * @param row The row to remove from
     * @param startColumn The column to start removing at
     * @param endColumn The column to stop removing at
     * @returns Returns an object containing `startRow` and `startColumn`, indicating the new row and column values.<br/>If `startColumn` is equal to `endColumn`, this function returns nothing.
     */
    removeInLine(row: number, startColumn: number, endColumn: number): Position {
        var start = this.clippedPos(row, startColumn);
        var end = this.clippedPos(row, endColumn);

        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({ start: start, end: end })
        }, true);

        return this.clonePos(start);
    }

    /**
     * Removes a range of full lines. This method also triggers the `"change"` event.
     * @param firstRow The first row to be removed
     * @param lastRow The last row to be removed
     * @returns Returns all the removed lines.
     */
    removeFullLines(firstRow: number, lastRow: number): string[] {
        // Clip to document.
        firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
        lastRow = Math.min(Math.max(0, lastRow), this.getLength() - 1);

        // Calculate deletion range.
        // Delete the ending new line unless we're at the end of the document.
        // If we're at the end of the document, delete the starting new line.
        var deleteFirstNewLine = lastRow === this.getLength() - 1 && firstRow > 0;
        var deleteLastNewLine = lastRow < this.getLength() - 1;
        var startRow = (deleteFirstNewLine ? firstRow - 1 : firstRow);
        var startCol = (deleteFirstNewLine ? this.getLine(startRow).length : 0);
        var endRow = (deleteLastNewLine ? lastRow + 1 : lastRow);
        var endCol = (deleteLastNewLine ? 0 : this.getLine(endRow).length);
        var range = new Range(startRow, startCol, endRow, endCol);

        // Store delelted lines with bounding newlines ommitted (maintains previous behavior).
        var deletedLines = this.$lines.slice(firstRow, lastRow + 1);

        this.applyDelta({
            start: range.start,
            end: range.end,
            action: "remove",
            lines: this.getLinesForRange(range)
        });

        // Return the deleted lines.
        return deletedLines;
    };

    /**
     * Removes the new line between `row` and the row immediately following it.
     *
     * @method removeNewLine
     * @param row {number} The row to check.
     * @return {void}
     */
    removeNewLine(row: number): void {
        if (row < this.getLength() - 1 && row >= 0) {
            this.applyDelta({
                start: this.pos(row, this.getLine(row).length),
                end: this.pos(row + 1, 0),
                action: "remove",
                lines: ["", ""]
            });
        }
    }

    /**
     * Replaces a range in the document with the new `text`.
     *
     * @method replace
     * @param range {Range} A specified Range to replace.
     * @param text {string} The new text to use as a replacement.
     * @return {Postion} Returns an object containing the final row and column, like this:
     *     {row: endRow, column: 0}
     * If the text and range are empty, this function returns an object containing the current `range.start` value.
     * If the text is the exact same as what currently exists, this function returns an object containing the current `range.end` value.
     */
    replace(range: Range, text: string): Position {

        if (text.length === 0 && range.isEmpty()) {
            return range.start;
        }

        // Shortcut: If the text we want to insert is the same as it is already
        // in the document, we don't have to replace anything.
        if (text === this.getTextRange(range)) {
            return range.end;
        }

        this.remove(range);

        if (text) {
            var end = this.insert(range.start, text);
        }
        else {
            end = range.start;
        }

        return end;
    }

    /**
     * Applies all the changes previously accumulated.
     *
     * @param deltas
     */
    applyDeltas(deltas: Delta[]): void {
        for (var i = 0; i < deltas.length; i++) {
            this.applyDelta(deltas[i]);
        }
    }

    /**
     * Reverts any changes previously applied.
     *
     * @param deltas
     */
    revertDeltas(deltas: Delta[]): void {
        for (var i = deltas.length - 1; i >= 0; i--) {
            this.revertDelta(deltas[i]);
        }
    }

    /**
     * Applies `delta` to the document.
     *
     * @param delta A delta object (can include "insert" and "remove" actions).
     */
    applyDelta(delta: Delta, doNotValidate?: boolean): void {

        var isInsert = delta.action === "insert";
        // An empty range is a NOOP.
        if (isInsert ? delta.lines.length <= 1 && !delta.lines[0]
            : !Range.comparePoints(delta.start, delta.end)) {
            return;
        }

        if (isInsert && delta.lines.length > 20000)
            this.$splitAndapplyLargeDelta(delta, 20000);

        applyDelta(this.$lines, delta, doNotValidate);
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
        var lines = delta.lines;
        var l = lines.length;
        var row = delta.start.row;
        var column = delta.start.column;
        var from = 0, to = 0;
        do {
            from = to;
            to += MAX - 1;
            var chunk = lines.slice(from, to);
            if (to > l) {
                // Update remaining delta.
                delta.lines = chunk;
                delta.start.row = row + from;
                delta.start.column = column;
                break;
            }
            chunk.push("");
            this.applyDelta({
                start: this.pos(row + from, column),
                end: this.pos(row + to, column = 0),
                action: delta.action,
                lines: chunk
            }, true);
        } while (true);
    }

    /**
     * Reverts `delta` from the document.
     * @param delta A delta object (can include "insert" and "remove" actions)
     */
    revertDelta(delta: Delta) {
        this.applyDelta({
            start: this.clonePos(delta.start),
            end: this.clonePos(delta.end),
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
     * var x = 0; // 10 characters, plus one for newline
     * var y = -1;
     * ```
     *
     * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
     *
     * @method indexToPosition
     * @param index {number} An index to convert
     * @param [startRow = 0] {number} The row from which to start the conversion
     * @return {Position} A `{row, column}` object of the `index` position.
     */
    indexToPosition(index: number, startRow = 0): Position {
        const lines = this.$lines || this.getAllLines();
        const newlineLength = this.getNewLineCharacter().length;
        const l = lines.length;
        for (let i = startRow; i < l; i++) {
            index -= lines[i].length + newlineLength;
            if (index < 0)
                return { row: i, column: index + lines[i].length + newlineLength };
        }
        return { row: l - 1, column: lines[l - 1].length };
    }

    /**
     * Converts the `{row, column}` position in a document to the character's index.
     *
     * Index refers to the "absolute position" of a character in the document. For example:
     *
     * ```javascript
     * var x = 0; // 10 characters, plus one for newline
     * var y = -1;
     * ```
     *
     * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
     *
     * @param pos The `{row, column}` to convert.
     * @param startRow The row from which to start the conversion
     * @return The index position in the document.
     */
    positionToIndex(pos: Position, startRow: number): number {
        var lines = this.$lines || this.getAllLines();
        var newlineLength = this.getNewLineCharacter().length;
        var index = 0;
        var row = Math.min(pos.row, lines.length);
        for (var i = startRow || 0; i < row; ++i)
            index += lines[i].length + newlineLength;

        return index + pos.column;
    }
}

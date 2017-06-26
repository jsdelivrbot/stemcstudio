/* */ 
"format cjs";
import { applyDelta } from './applyDelta';
import { equalPositions } from './Position';
import { EventEmitterClass } from './EventEmitterClass';
import { position } from './Position';
import { isEmptyRange, range } from './Range';
/**
 * Copies a Position.
 */
function clonePos(pos) {
    return { row: pos.row, column: pos.column };
}
/**
 * Constructs a Position from row and column.
 */
function pos(row, column) {
    return { row: row, column: column };
}
var $split = (function () {
    function foo(text) {
        return text.replace(/\r\n|\r/g, "\n").split("\n");
    }
    function bar(text) {
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
var CHANGE = 'change';
var CHANGE_NEW_LINE_MODE = 'changeNewLineMode';
/**
 *
 */
var Document = (function () {
    /**
     * If text is included, the Document contains those strings; otherwise, it's empty.
     * A `change` event will be emitted. But does anyone see it?
     *
     * @param textOrLines
     */
    function Document(textOrLines) {
        /**
         * The lines of text.
         * These lines do not include a line terminating character.
         */
        this._lines = [];
        /**
         *
         */
        this._autoNewLine = "";
        /**
         *
         */
        this._newLineMode = "auto";
        /**
         * Maintains a count of the number of references to this instance of Document.
         */
        this.refCount = 1;
        this._lines = [""];
        this._eventBus = new EventEmitterClass(this);
        /*
        this.changeEvents = new Observable<Delta>((observer: Observer<Delta>) => {
            function changeListener(value: Delta, source: Document) {
                observer.next(value);
            }
            this.addChangeListener(changeListener);
            return () => {
                this.removeChangeListener(changeListener);
            };
        });
        */
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
    Document.prototype.destructor = function () {
        this._lines.length = 0;
        this._eventBus = void 0;
    };
    Document.prototype.addRef = function () {
        this.refCount++;
        return this.refCount;
    };
    Document.prototype.release = function () {
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        else if (this.refCount < 0) {
            throw new Error("Document refCount is negative.");
        }
        return this.refCount;
    };
    /**
     * Replaces all the lines in the current `Document` with the value of `text`.
     * A `change` event will be emitted.
     */
    Document.prototype.setValue = function (text) {
        var row = this.getLength() - 1;
        var start = position(0, 0);
        var end = position(row, this.getLine(row).length);
        // FIXME: Can we avoid the temporary objects?
        this.remove(range(start, end));
        this.insert({ row: 0, column: 0 }, text);
    };
    /**
     * Returns all the lines in the document as a single string, joined by the new line character.
     */
    Document.prototype.getValue = function () {
        return this._lines.join(this.getNewLineCharacter());
    };
    Document.prototype.eventBusOrThrow = function () {
        if (this._eventBus) {
            return this._eventBus;
        }
        else {
            throw new Error("Document is a zombie.");
        }
    };
    /**
     * Determines the newline character that is present in the presented text
     * and caches the result in $autoNewLine.
     * Emits 'changeNewLineMode'.
     */
    Document.prototype.$detectNewLine = function (text) {
        var match = text.match(/^.*?(\r\n|\r|\n)/m);
        this._autoNewLine = match ? match[1] : "\n";
        this.eventBusOrThrow()._signal(CHANGE_NEW_LINE_MODE);
    };
    /**
     * Returns the newline character that's being used, depending on the value of `newLineMode`.
     *  If `newLineMode == windows`, `\r\n` is returned.
     *  If `newLineMode == unix`, `\n` is returned.
     *  If `newLineMode == auto`, the value of `autoNewLine` is returned.
     */
    Document.prototype.getNewLineCharacter = function () {
        switch (this._newLineMode) {
            case "windows":
                return "\r\n";
            case "unix":
                return "\n";
            default:
                return this._autoNewLine || "\n";
        }
    };
    /**
     * Sets the new line mode.
     *
     * newLineMode is the newline mode to use; can be either `windows`, `unix`, or `auto`.
     * Emits 'changeNewLineMode'
     */
    Document.prototype.setNewLineMode = function (newLineMode) {
        if (this._newLineMode === newLineMode) {
            return;
        }
        this._newLineMode = newLineMode;
        this.eventBusOrThrow()._signal(CHANGE_NEW_LINE_MODE);
    };
    /**
     * Returns the type of newlines being used; either `windows`, `unix`, or `auto`.
     */
    Document.prototype.getNewLineMode = function () {
        return this._newLineMode;
    };
    /**
     * Returns `true` if `text` is a newline character (either `\r\n`, `\r`, or `\n`).
     *
     * @param text The text to check.
     */
    Document.prototype.isNewLine = function (text) {
        return (text === "\r\n" || text === "\r" || text === "\n");
    };
    /**
     * Returns a verbatim copy of the given line as it is in the document.
     *
     * @param row The row index to retrieve.
     */
    Document.prototype.getLine = function (row) {
        return this._lines[row] || "";
    };
    /**
     * Returns a COPY of the lines between and including `firstRow` and `lastRow`.
     * These lines do not include the line terminator.
     *
     * @param firstRow The first row index to retrieve.
     * @param lastRow The final row index to retrieve.
     */
    Document.prototype.getLines = function (firstRow, lastRow) {
        // The semantics of slice are that it does not include the end index.
        var end = lastRow + 1;
        return this._lines.slice(firstRow, end);
    };
    /**
     * Returns a COPY of the lines in the document.
     * These lines do not include the line terminator.
     */
    Document.prototype.getAllLines = function () {
        return this._lines.slice(0, this._lines.length);
    };
    /**
     * Returns the number of rows in the document.
     */
    Document.prototype.getLength = function () {
        return this._lines.length;
    };
    /**
     * Returns all the text corresponding to the range with line terminators.
     */
    Document.prototype.getTextRange = function (range) {
        return this.getLinesForRange(range).join(this.getNewLineCharacter());
    };
    /**
     * Returns all the text within `range` as an array of lines.
     */
    Document.prototype.getLinesForRange = function (range) {
        var lines;
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
    };
    /**
     * Inserts a block of `text` at the indicated `position`.
     * Returns the end position of the inserted text, the character immediately after the last character inserted.
     * This method also triggers the 'change' event.
     */
    Document.prototype.insert = function (position, text) {
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
     */
    Document.prototype.insertInLine = function (position, text) {
        var start = this.clippedPos(position.row, position.column);
        var end = pos(position.row, position.column + text.length);
        this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: [text]
        }, true);
        return clonePos(end);
    };
    /**
     * Clips the position so that it refers to the nearest valid position.
     */
    Document.prototype.clippedPos = function (row, column) {
        var length = this.getLength();
        var rowTooBig = false;
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
        var line = this.getLine(row);
        if (rowTooBig) {
            column = line.length;
        }
        column = Math.min(Math.max(column, 0), line.length);
        return { row: row, column: column };
    };
    Document.prototype.on = function (eventName, callback, capturing) {
        return this.eventBusOrThrow().on(eventName, callback, capturing);
    };
    Document.prototype.off = function (eventName, callback, capturing) {
        return this.eventBusOrThrow().off(eventName, callback, capturing);
    };
    /**
     *
     */
    Document.prototype.addChangeListener = function (callback) {
        return this.on(CHANGE, callback, false);
    };
    /**
     *
     */
    Document.prototype.addChangeNewLineModeListener = function (callback) {
        this.on(CHANGE_NEW_LINE_MODE, callback, false);
    };
    /**
     *
     */
    Document.prototype.removeChangeListener = function (callback) {
        this.off(CHANGE, callback);
    };
    /**
     *
     */
    Document.prototype.removeChangeNewLineModeListener = function (callback) {
        this.off(CHANGE_NEW_LINE_MODE, callback);
    };
    /**
     * Inserts the elements in `lines` into the document as full lines (does not merge with existing line), starting at the row index given by `row`.
     * This method also triggers the `"change"` event.
     */
    Document.prototype.insertFullLines = function (row, lines) {
        // Clip to document.
        // Allow one past the document end.
        row = Math.min(Math.max(row, 0), this.getLength());
        // Calculate insertion point.
        var column = 0;
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
    };
    /**
     * Inserts the text in `lines` into the document, starting at the `position` given.
     * Returns the end position of the inserted text.
     * This method also triggers the 'change' event.
     */
    Document.prototype.insertMergedLines = function (position, lines) {
        var start = this.clippedPos(position.row, position.column);
        var end = {
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
    };
    /**
     * Removes the `range` from the document.
     * This method triggers a 'change' event.
     *
     * @param range A specified Range to remove
     * @return Returns the new `start` property of the range.
     * If `range` is empty, this function returns the unmodified value of `range.start`.
     */
    Document.prototype.remove = function (range) {
        var start = this.clippedPos(range.start.row, range.start.column);
        var end = this.clippedPos(range.end.row, range.end.column);
        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({ start: start, end: end })
        });
        return clonePos(start);
    };
    /**
     * Removes the specified columns from the `row`.
     * This method also triggers the `'change'` event.
     *
     * @param row The row to remove from.
     * @param startColumn The column to start removing at.
     * @param endColumn The column to stop removing at.
     * @returns An object containing `startRow` and `startColumn`, indicating the new row and column values.<br/>If `startColumn` is equal to `endColumn`, this function returns nothing.
     */
    Document.prototype.removeInLine = function (row, startColumn, endColumn) {
        var start = this.clippedPos(row, startColumn);
        var end = this.clippedPos(row, endColumn);
        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({ start: start, end: end })
        }, true);
        return clonePos(start);
    };
    /**
     * Removes a range of full lines and returns a COPY of the removed lines.
     * This method also triggers the `"change"` event.
     *
     * @param firstRow The first row to be removed
     * @param lastRow The last row to be removed
     */
    Document.prototype.removeFullLines = function (firstRow, lastRow) {
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
        var start = position(startRow, startCol);
        var end = position(endRow, endCol);
        /**
         * A copy of delelted lines with line terminators omitted (maintains previous behavior).
         */
        var deletedLines = this.getLines(firstRow, lastRow);
        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange(range(start, end))
        });
        return deletedLines;
    };
    /**
     * Removes the new line between `row` and the row immediately following it.
     *
     * @param row The row to check.
     */
    Document.prototype.removeNewLine = function (row) {
        if (row < this.getLength() - 1 && row >= 0) {
            this.applyDelta({
                start: pos(row, this.getLine(row).length),
                end: pos(row + 1, 0),
                action: "remove",
                lines: ["", ""]
            });
        }
    };
    /**
     * Replaces a range in the document with the new `text`.
     * Returns the end position of the change.
     * This method triggers a 'change' event for the removal.
     * This method triggers a 'change' event for the insertion.
     */
    Document.prototype.replace = function (range, newText) {
        if (newText.length === 0 && isEmptyRange(range)) {
            // If the range is empty then the range.start and range.end will be the same.
            return range.end;
        }
        var oldText = this.getTextRange(range);
        // Shortcut: If the text we want to insert is the same as it is already
        // in the document, we don't have to replace anything.
        if (newText === oldText) {
            return range.end;
        }
        this.remove(range);
        return this.insert(range.start, newText);
    };
    /**
     * Applies all the changes previously accumulated.
     */
    Document.prototype.applyDeltas = function (deltas) {
        for (var i = 0; i < deltas.length; i++) {
            this.applyDelta(deltas[i]);
        }
    };
    /**
     * Reverts any changes previously applied.
     */
    Document.prototype.revertDeltas = function (deltas) {
        for (var i = deltas.length - 1; i >= 0; i--) {
            this.revertDelta(deltas[i]);
        }
    };
    /**
     * Applies `delta` (insert and remove actions) to the document and triggers the 'change' event.
     */
    Document.prototype.applyDelta = function (delta, doNotValidate) {
        var isInsert = delta.action === "insert";
        // An empty range is a NOOP.
        if (isInsert ? delta.lines.length <= 1 && !delta.lines[0] : equalPositions(delta.start, delta.end)) {
            return;
        }
        if (isInsert && delta.lines.length > 20000)
            this.$splitAndapplyLargeDelta(delta, 20000);
        applyDelta(this._lines, delta, doNotValidate);
        this.eventBusOrThrow()._signal(CHANGE, delta);
    };
    Document.prototype.$splitAndapplyLargeDelta = function (delta, MAX) {
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
        var from = 0;
        var to = 0;
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
                start: pos(row + from, column),
                end: pos(row + to, column = 0),
                action: delta.action,
                lines: chunk
            }, true);
        } while (true);
    };
    /**
     * Reverts `delta` from the document.
     * A delta object (can include "insert" and "remove" actions)
     */
    Document.prototype.revertDelta = function (delta) {
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
    Document.prototype.indexToPosition = function (index, startRow) {
        if (startRow === void 0) { startRow = 0; }
        /**
         * A local reference to improve performance in the loop.
         */
        var lines = this._lines;
        var newlineLength = this.getNewLineCharacter().length;
        var l = lines.length;
        for (var i = startRow || 0; i < l; i++) {
            index -= lines[i].length + newlineLength;
            if (index < 0)
                return { row: i, column: index + lines[i].length + newlineLength };
        }
        return { row: l - 1, column: lines[l - 1].length };
    };
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
    Document.prototype.positionToIndex = function (position, startRow) {
        if (startRow === void 0) { startRow = 0; }
        /**
         * A local reference to improve performance in the loop.
         */
        var lines = this._lines;
        var newlineLength = this.getNewLineCharacter().length;
        var index = 0;
        var row = Math.min(position.row, lines.length);
        for (var i = startRow || 0; i < row; ++i) {
            index += lines[i].length + newlineLength;
        }
        return index + position.column;
    };
    return Document;
}());
export { Document };
//# sourceMappingURL=Document.js.map
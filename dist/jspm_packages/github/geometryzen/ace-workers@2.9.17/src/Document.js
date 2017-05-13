System.register(["./applyDelta", "./Range"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var applyDelta_1, Range_1, $split, Document;
    return {
        setters: [
            function (applyDelta_1_1) {
                applyDelta_1 = applyDelta_1_1;
            },
            function (Range_1_1) {
                Range_1 = Range_1_1;
            }
        ],
        execute: function () {
            $split = (function () {
                function foo(text) {
                    return text.replace(/\r\n|\r/g, "\n").split("\n");
                }
                function bar(text) {
                    return text.split(/\r\n|\r|\n/);
                }
                if ("aaa".split(/a/).length === 0) {
                    return foo;
                }
                else {
                    return bar;
                }
            })();
            Document = (function () {
                function Document(textOrLines) {
                    this.$lines = [];
                    this.$autoNewLine = "";
                    this.$newLineMode = "auto";
                    this.$lines = [""];
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
                Document.prototype.setValue = function (text) {
                    var len = this.getLength() - 1;
                    this.remove(new Range_1.default(0, 0, len, this.getLine(len).length));
                    this.insert({ row: 0, column: 0 }, text);
                };
                Document.prototype.getValue = function () {
                    return this.getAllLines().join(this.getNewLineCharacter());
                };
                Document.prototype.$detectNewLine = function (text) {
                    var match = text.match(/^.*?(\r\n|\r|\n)/m);
                    this.$autoNewLine = match ? match[1] : "\n";
                };
                Document.prototype.getNewLineCharacter = function () {
                    switch (this.$newLineMode) {
                        case "windows":
                            return "\r\n";
                        case "unix":
                            return "\n";
                        default:
                            return this.$autoNewLine || "\n";
                    }
                };
                Document.prototype.setNewLineMode = function (newLineMode) {
                    if (this.$newLineMode === newLineMode) {
                        return;
                    }
                    this.$newLineMode = newLineMode;
                };
                Document.prototype.getNewLineMode = function () {
                    return this.$newLineMode;
                };
                Document.prototype.isNewLine = function (text) {
                    return (text === "\r\n" || text === "\r" || text === "\n");
                };
                Document.prototype.getLine = function (row) {
                    return this.$lines[row] || "";
                };
                Document.prototype.getLines = function (firstRow, lastRow) {
                    return this.$lines.slice(firstRow, lastRow + 1);
                };
                Document.prototype.getAllLines = function () {
                    return this.getLines(0, this.getLength());
                };
                Document.prototype.getLength = function () {
                    return this.$lines.length;
                };
                Document.prototype.getTextRange = function (range) {
                    return this.getLinesForRange(range).join(this.getNewLineCharacter());
                };
                Document.prototype.getLinesForRange = function (range) {
                    var lines;
                    if (range.start.row === range.end.row) {
                        lines = [this.getLine(range.start.row).substring(range.start.column, range.end.column)];
                    }
                    else {
                        lines = this.getLines(range.start.row, range.end.row);
                        lines[0] = (lines[0] || "").substring(range.start.column);
                        var l = lines.length - 1;
                        if (range.end.row - range.start.row === l) {
                            lines[l] = lines[l].substring(0, range.end.column);
                        }
                    }
                    return lines;
                };
                Document.prototype.insert = function (position, text) {
                    if (this.getLength() <= 1) {
                        this.$detectNewLine(text);
                    }
                    return this.insertMergedLines(position, $split(text));
                };
                Document.prototype.insertInLine = function (position, text) {
                    var start = this.clippedPos(position.row, position.column);
                    var end = this.pos(position.row, position.column + text.length);
                    this.applyDelta({
                        start: start,
                        end: end,
                        action: "insert",
                        lines: [text]
                    }, true);
                    return this.clonePos(end);
                };
                Document.prototype.clippedPos = function (row, column) {
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
                };
                Document.prototype.clonePos = function (pos) {
                    return { row: pos.row, column: pos.column };
                };
                Document.prototype.pos = function (row, column) {
                    return { row: row, column: column };
                };
                Document.prototype.insertFullLines = function (row, lines) {
                    row = Math.min(Math.max(row, 0), this.getLength());
                    var column = 0;
                    if (row < this.getLength()) {
                        lines = lines.concat([""]);
                        column = 0;
                    }
                    else {
                        lines = [""].concat(lines);
                        row--;
                        column = this.$lines[row].length;
                    }
                    return this.insertMergedLines({ row: row, column: column }, lines);
                };
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
                    return this.clonePos(end);
                };
                Document.prototype.remove = function (range) {
                    var start = this.clippedPos(range.start.row, range.start.column);
                    var end = this.clippedPos(range.end.row, range.end.column);
                    this.applyDelta({
                        start: start,
                        end: end,
                        action: "remove",
                        lines: this.getLinesForRange({ start: start, end: end })
                    });
                    return this.clonePos(start);
                };
                Document.prototype.removeInLine = function (row, startColumn, endColumn) {
                    var start = this.clippedPos(row, startColumn);
                    var end = this.clippedPos(row, endColumn);
                    this.applyDelta({
                        start: start,
                        end: end,
                        action: "remove",
                        lines: this.getLinesForRange({ start: start, end: end })
                    }, true);
                    return this.clonePos(start);
                };
                Document.prototype.removeFullLines = function (firstRow, lastRow) {
                    firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
                    lastRow = Math.min(Math.max(0, lastRow), this.getLength() - 1);
                    var deleteFirstNewLine = lastRow === this.getLength() - 1 && firstRow > 0;
                    var deleteLastNewLine = lastRow < this.getLength() - 1;
                    var startRow = (deleteFirstNewLine ? firstRow - 1 : firstRow);
                    var startCol = (deleteFirstNewLine ? this.getLine(startRow).length : 0);
                    var endRow = (deleteLastNewLine ? lastRow + 1 : lastRow);
                    var endCol = (deleteLastNewLine ? 0 : this.getLine(endRow).length);
                    var range = new Range_1.default(startRow, startCol, endRow, endCol);
                    var deletedLines = this.$lines.slice(firstRow, lastRow + 1);
                    this.applyDelta({
                        start: range.start,
                        end: range.end,
                        action: "remove",
                        lines: this.getLinesForRange(range)
                    });
                    return deletedLines;
                };
                Document.prototype.removeNewLine = function (row) {
                    if (row < this.getLength() - 1 && row >= 0) {
                        this.applyDelta({
                            start: this.pos(row, this.getLine(row).length),
                            end: this.pos(row + 1, 0),
                            action: "remove",
                            lines: ["", ""]
                        });
                    }
                };
                Document.prototype.replace = function (range, text) {
                    if (text.length === 0 && range.isEmpty()) {
                        return range.start;
                    }
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
                };
                Document.prototype.applyDeltas = function (deltas) {
                    for (var i = 0; i < deltas.length; i++) {
                        this.applyDelta(deltas[i]);
                    }
                };
                Document.prototype.revertDeltas = function (deltas) {
                    for (var i = deltas.length - 1; i >= 0; i--) {
                        this.revertDelta(deltas[i]);
                    }
                };
                Document.prototype.applyDelta = function (delta, doNotValidate) {
                    var isInsert = delta.action === "insert";
                    if (isInsert ? delta.lines.length <= 1 && !delta.lines[0]
                        : !Range_1.default.comparePoints(delta.start, delta.end)) {
                        return;
                    }
                    if (isInsert && delta.lines.length > 20000)
                        this.$splitAndapplyLargeDelta(delta, 20000);
                    applyDelta_1.applyDelta(this.$lines, delta, doNotValidate);
                };
                Document.prototype.$splitAndapplyLargeDelta = function (delta, MAX) {
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
                };
                Document.prototype.revertDelta = function (delta) {
                    this.applyDelta({
                        start: this.clonePos(delta.start),
                        end: this.clonePos(delta.end),
                        action: (delta.action === "insert" ? "remove" : "insert"),
                        lines: delta.lines.slice()
                    });
                };
                Document.prototype.indexToPosition = function (index, startRow) {
                    if (startRow === void 0) { startRow = 0; }
                    var lines = this.$lines || this.getAllLines();
                    var newlineLength = this.getNewLineCharacter().length;
                    var l = lines.length;
                    for (var i = startRow; i < l; i++) {
                        index -= lines[i].length + newlineLength;
                        if (index < 0)
                            return { row: i, column: index + lines[i].length + newlineLength };
                    }
                    return { row: l - 1, column: lines[l - 1].length };
                };
                Document.prototype.positionToIndex = function (pos, startRow) {
                    var lines = this.$lines || this.getAllLines();
                    var newlineLength = this.getNewLineCharacter().length;
                    var index = 0;
                    var row = Math.min(pos.row, lines.length);
                    for (var i = startRow || 0; i < row; ++i)
                        index += lines[i].length + newlineLength;
                    return index + pos.column;
                };
                return Document;
            }());
            exports_1("default", Document);
        }
    };
});

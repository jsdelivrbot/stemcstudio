/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var applyDelta_1 = require('./applyDelta');
var Position_1 = require('./Position');
var EventEmitterClass_1 = require('./EventEmitterClass');
var Position_2 = require('./Position');
var Range_1 = require('./Range');
function clonePos(pos) {
  return {
    row: pos.row,
    column: pos.column
  };
}
function pos(row, column) {
  return {
    row: row,
    column: column
  };
}
var $split = (function() {
  function foo(text) {
    return text.replace(/\r\n|\r/g, "\n").split("\n");
  }
  function bar(text) {
    return text.split(/\r\n|\r|\n/);
  }
  if ("aaa".split(/a/).length === 0) {
    return foo;
  } else {
    return bar;
  }
})();
var CHANGE = 'change';
var CHANGE_NEW_LINE_MODE = 'changeNewLineMode';
var Document = (function() {
  function Document(textOrLines) {
    this._lines = [];
    this._autoNewLine = "";
    this._newLineMode = "auto";
    this.refCount = 1;
    this._lines = [""];
    this._eventBus = new EventEmitterClass_1.EventEmitterClass(this);
    if (textOrLines.length === 0) {
      this._lines = [""];
    } else if (Array.isArray(textOrLines)) {
      this.insertMergedLines({
        row: 0,
        column: 0
      }, textOrLines);
    } else {
      this.insert({
        row: 0,
        column: 0
      }, textOrLines);
    }
  }
  Document.prototype.destructor = function() {
    this._lines.length = 0;
    this._eventBus = void 0;
  };
  Document.prototype.addRef = function() {
    this.refCount++;
    return this.refCount;
  };
  Document.prototype.release = function() {
    this.refCount--;
    if (this.refCount === 0) {
      this.destructor();
    } else if (this.refCount < 0) {
      throw new Error("Document refCount is negative.");
    }
    return this.refCount;
  };
  Document.prototype.setValue = function(text) {
    var row = this.getLength() - 1;
    var start = Position_2.position(0, 0);
    var end = Position_2.position(row, this.getLine(row).length);
    this.remove(Range_1.range(start, end));
    this.insert({
      row: 0,
      column: 0
    }, text);
  };
  Document.prototype.getValue = function() {
    return this._lines.join(this.getNewLineCharacter());
  };
  Document.prototype.eventBusOrThrow = function() {
    if (this._eventBus) {
      return this._eventBus;
    } else {
      throw new Error("Document is a zombie.");
    }
  };
  Document.prototype.$detectNewLine = function(text) {
    var match = text.match(/^.*?(\r\n|\r|\n)/m);
    this._autoNewLine = match ? match[1] : "\n";
    this.eventBusOrThrow()._signal(CHANGE_NEW_LINE_MODE);
  };
  Document.prototype.getNewLineCharacter = function() {
    switch (this._newLineMode) {
      case "windows":
        return "\r\n";
      case "unix":
        return "\n";
      default:
        return this._autoNewLine || "\n";
    }
  };
  Document.prototype.setNewLineMode = function(newLineMode) {
    if (this._newLineMode === newLineMode) {
      return;
    }
    this._newLineMode = newLineMode;
    this.eventBusOrThrow()._signal(CHANGE_NEW_LINE_MODE);
  };
  Document.prototype.getNewLineMode = function() {
    return this._newLineMode;
  };
  Document.prototype.isNewLine = function(text) {
    return (text === "\r\n" || text === "\r" || text === "\n");
  };
  Document.prototype.getLine = function(row) {
    return this._lines[row] || "";
  };
  Document.prototype.getLines = function(firstRow, lastRow) {
    var end = lastRow + 1;
    return this._lines.slice(firstRow, end);
  };
  Document.prototype.getAllLines = function() {
    return this._lines.slice(0, this._lines.length);
  };
  Document.prototype.getLength = function() {
    return this._lines.length;
  };
  Document.prototype.getTextRange = function(range) {
    return this.getLinesForRange(range).join(this.getNewLineCharacter());
  };
  Document.prototype.getLinesForRange = function(range) {
    var lines;
    if (range.start.row === range.end.row) {
      lines = [this.getLine(range.start.row).substring(range.start.column, range.end.column)];
    } else {
      lines = this.getLines(range.start.row, range.end.row);
      lines[0] = (lines[0] || "").substring(range.start.column);
      var l = lines.length - 1;
      if (range.end.row - range.start.row === l) {
        lines[l] = lines[l].substring(0, range.end.column);
      }
    }
    return lines;
  };
  Document.prototype.insert = function(position, text) {
    if (this.getLength() <= 1) {
      this.$detectNewLine(text);
    }
    return this.insertMergedLines(position, $split(text));
  };
  Document.prototype.insertInLine = function(position, text) {
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
  Document.prototype.clippedPos = function(row, column) {
    var length = this.getLength();
    var rowTooBig = false;
    if (row === void 0) {
      row = length;
    } else if (row < 0) {
      row = 0;
    } else if (row >= length) {
      row = length - 1;
      rowTooBig = true;
    }
    var line = this.getLine(row);
    if (rowTooBig) {
      column = line.length;
    }
    column = Math.min(Math.max(column, 0), line.length);
    return {
      row: row,
      column: column
    };
  };
  Document.prototype.on = function(eventName, callback, capturing) {
    return this.eventBusOrThrow().on(eventName, callback, capturing);
  };
  Document.prototype.off = function(eventName, callback, capturing) {
    return this.eventBusOrThrow().off(eventName, callback, capturing);
  };
  Document.prototype.addChangeListener = function(callback) {
    return this.on(CHANGE, callback, false);
  };
  Document.prototype.addChangeNewLineModeListener = function(callback) {
    this.on(CHANGE_NEW_LINE_MODE, callback, false);
  };
  Document.prototype.removeChangeListener = function(callback) {
    this.off(CHANGE, callback);
  };
  Document.prototype.removeChangeNewLineModeListener = function(callback) {
    this.off(CHANGE_NEW_LINE_MODE, callback);
  };
  Document.prototype.insertFullLines = function(row, lines) {
    row = Math.min(Math.max(row, 0), this.getLength());
    var column = 0;
    if (row < this.getLength()) {
      lines = lines.concat([""]);
      column = 0;
    } else {
      lines = [""].concat(lines);
      row--;
      column = this._lines[row].length;
    }
    return this.insertMergedLines({
      row: row,
      column: column
    }, lines);
  };
  Document.prototype.insertMergedLines = function(position, lines) {
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
  Document.prototype.remove = function(range) {
    var start = this.clippedPos(range.start.row, range.start.column);
    var end = this.clippedPos(range.end.row, range.end.column);
    this.applyDelta({
      start: start,
      end: end,
      action: "remove",
      lines: this.getLinesForRange({
        start: start,
        end: end
      })
    });
    return clonePos(start);
  };
  Document.prototype.removeInLine = function(row, startColumn, endColumn) {
    var start = this.clippedPos(row, startColumn);
    var end = this.clippedPos(row, endColumn);
    this.applyDelta({
      start: start,
      end: end,
      action: "remove",
      lines: this.getLinesForRange({
        start: start,
        end: end
      })
    }, true);
    return clonePos(start);
  };
  Document.prototype.removeFullLines = function(firstRow, lastRow) {
    firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
    lastRow = Math.min(Math.max(0, lastRow), this.getLength() - 1);
    var deleteFirstNewLine = lastRow === this.getLength() - 1 && firstRow > 0;
    var deleteLastNewLine = lastRow < this.getLength() - 1;
    var startRow = (deleteFirstNewLine ? firstRow - 1 : firstRow);
    var startCol = (deleteFirstNewLine ? this.getLine(startRow).length : 0);
    var endRow = (deleteLastNewLine ? lastRow + 1 : lastRow);
    var endCol = (deleteLastNewLine ? 0 : this.getLine(endRow).length);
    var start = Position_2.position(startRow, startCol);
    var end = Position_2.position(endRow, endCol);
    var deletedLines = this.getLines(firstRow, lastRow);
    this.applyDelta({
      start: start,
      end: end,
      action: "remove",
      lines: this.getLinesForRange(Range_1.range(start, end))
    });
    return deletedLines;
  };
  Document.prototype.removeNewLine = function(row) {
    if (row < this.getLength() - 1 && row >= 0) {
      this.applyDelta({
        start: pos(row, this.getLine(row).length),
        end: pos(row + 1, 0),
        action: "remove",
        lines: ["", ""]
      });
    }
  };
  Document.prototype.replace = function(range, newText) {
    if (newText.length === 0 && Range_1.isEmptyRange(range)) {
      return range.end;
    }
    var oldText = this.getTextRange(range);
    if (newText === oldText) {
      return range.end;
    }
    this.remove(range);
    return this.insert(range.start, newText);
  };
  Document.prototype.applyDeltas = function(deltas) {
    for (var i = 0; i < deltas.length; i++) {
      this.applyDelta(deltas[i]);
    }
  };
  Document.prototype.revertDeltas = function(deltas) {
    for (var i = deltas.length - 1; i >= 0; i--) {
      this.revertDelta(deltas[i]);
    }
  };
  Document.prototype.applyDelta = function(delta, doNotValidate) {
    var isInsert = delta.action === "insert";
    if (isInsert ? delta.lines.length <= 1 && !delta.lines[0] : Position_1.equalPositions(delta.start, delta.end)) {
      return;
    }
    if (isInsert && delta.lines.length > 20000)
      this.$splitAndapplyLargeDelta(delta, 20000);
    applyDelta_1.applyDelta(this._lines, delta, doNotValidate);
    this.eventBusOrThrow()._signal(CHANGE, delta);
  };
  Document.prototype.$splitAndapplyLargeDelta = function(delta, MAX) {
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
  Document.prototype.revertDelta = function(delta) {
    this.applyDelta({
      start: clonePos(delta.start),
      end: clonePos(delta.end),
      action: (delta.action === "insert" ? "remove" : "insert"),
      lines: delta.lines.slice()
    });
  };
  Document.prototype.indexToPosition = function(index, startRow) {
    if (startRow === void 0) {
      startRow = 0;
    }
    var lines = this._lines;
    var newlineLength = this.getNewLineCharacter().length;
    var l = lines.length;
    for (var i = startRow || 0; i < l; i++) {
      index -= lines[i].length + newlineLength;
      if (index < 0)
        return {
          row: i,
          column: index + lines[i].length + newlineLength
        };
    }
    return {
      row: l - 1,
      column: lines[l - 1].length
    };
  };
  Document.prototype.positionToIndex = function(position, startRow) {
    if (startRow === void 0) {
      startRow = 0;
    }
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
exports.Document = Document;

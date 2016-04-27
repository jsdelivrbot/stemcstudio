"use strict";
System.register([], function(exports_1) {
    var Range;
    return {
        setters:[],
        execute: function() {
            Range = (function () {
                function Range(startRow, startColumn, endRow, endColumn) {
                    this.start = {
                        row: startRow,
                        column: startColumn
                    };
                    this.end = {
                        row: endRow,
                        column: endColumn
                    };
                }
                Range.prototype.isEqual = function (range) {
                    return this.start.row === range.start.row &&
                        this.end.row === range.end.row &&
                        this.start.column === range.start.column &&
                        this.end.column === range.end.column;
                };
                Range.prototype.toString = function () {
                    return ("Range: [" + this.start.row + "/" + this.start.column +
                        "] -> [" + this.end.row + "/" + this.end.column + "]");
                };
                Range.prototype.contains = function (row, column) {
                    return this.compare(row, column) === 0;
                };
                Range.prototype.compareRange = function (range) {
                    var cmp;
                    var end = range.end;
                    var start = range.start;
                    cmp = this.compare(end.row, end.column);
                    if (cmp === 1) {
                        cmp = this.compare(start.row, start.column);
                        if (cmp === 1) {
                            return 2;
                        }
                        else if (cmp === 0) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    }
                    else if (cmp === -1) {
                        return -2;
                    }
                    else {
                        cmp = this.compare(start.row, start.column);
                        if (cmp === -1) {
                            return -1;
                        }
                        else if (cmp === 1) {
                            return 42;
                        }
                        else {
                            return 0;
                        }
                    }
                };
                Range.prototype.comparePoint = function (point) {
                    return this.compare(point.row, point.column);
                };
                Range.prototype.containsRange = function (range) {
                    return this.comparePoint(range.start) === 0 && this.comparePoint(range.end) === 0;
                };
                Range.prototype.intersects = function (range) {
                    var cmp = this.compareRange(range);
                    return (cmp === -1 || cmp === 0 || cmp === 1);
                };
                Range.prototype.isEnd = function (row, column) {
                    return this.end.row === row && this.end.column === column;
                };
                Range.prototype.isStart = function (row, column) {
                    return this.start.row === row && this.start.column === column;
                };
                Range.prototype.setStart = function (row, column) {
                    this.start.row = row;
                    this.start.column = column;
                };
                Range.prototype.setEnd = function (row, column) {
                    this.end.row = row;
                    this.end.column = column;
                };
                Range.prototype.inside = function (row, column) {
                    if (this.compare(row, column) === 0) {
                        if (this.isEnd(row, column) || this.isStart(row, column)) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    return false;
                };
                Range.prototype.insideStart = function (row, column) {
                    if (this.compare(row, column) === 0) {
                        if (this.isEnd(row, column)) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    return false;
                };
                Range.prototype.insideEnd = function (row, column) {
                    if (this.compare(row, column) === 0) {
                        if (this.isStart(row, column)) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    return false;
                };
                Range.prototype.compare = function (row, column) {
                    if (!this.isMultiLine()) {
                        if (row === this.start.row) {
                            return column < this.start.column ? -1 : (column > this.end.column ? 1 : 0);
                        }
                    }
                    if (row < this.start.row)
                        return -1;
                    if (row > this.end.row)
                        return 1;
                    if (this.start.row === row)
                        return column >= this.start.column ? 0 : -1;
                    if (this.end.row === row)
                        return column <= this.end.column ? 0 : 1;
                    return 0;
                };
                Range.prototype.compareStart = function (row, column) {
                    if (this.start.row === row && this.start.column === column) {
                        return -1;
                    }
                    else {
                        return this.compare(row, column);
                    }
                };
                Range.prototype.compareEnd = function (row, column) {
                    if (this.end.row === row && this.end.column === column) {
                        return 1;
                    }
                    else {
                        return this.compare(row, column);
                    }
                };
                Range.prototype.compareInside = function (row, column) {
                    if (this.end.row === row && this.end.column === column) {
                        return 1;
                    }
                    else if (this.start.row === row && this.start.column === column) {
                        return -1;
                    }
                    else {
                        return this.compare(row, column);
                    }
                };
                Range.prototype.clipRows = function (firstRow, lastRow) {
                    var start;
                    var end;
                    if (this.end.row > lastRow)
                        end = { row: lastRow + 1, column: 0 };
                    else if (this.end.row < firstRow)
                        end = { row: firstRow, column: 0 };
                    if (this.start.row > lastRow)
                        start = { row: lastRow + 1, column: 0 };
                    else if (this.start.row < firstRow)
                        start = { row: firstRow, column: 0 };
                    return Range.fromPoints(start || this.start, end || this.end);
                };
                Range.prototype.extend = function (row, column) {
                    var cmp = this.compare(row, column);
                    if (cmp === 0) {
                        return this;
                    }
                    else if (cmp === -1) {
                        var start = { row: row, column: column };
                    }
                    else {
                        var end = { row: row, column: column };
                    }
                    return Range.fromPoints(start || this.start, end || this.end);
                };
                Range.prototype.isEmpty = function () {
                    return (this.start.row === this.end.row && this.start.column === this.end.column);
                };
                Range.prototype.isMultiLine = function () {
                    return (this.start.row !== this.end.row);
                };
                Range.prototype.clone = function () {
                    return Range.fromPoints(this.start, this.end);
                };
                Range.prototype.collapseRows = function () {
                    if (this.end.column === 0)
                        return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0);
                    else
                        return new Range(this.start.row, 0, this.end.row, 0);
                };
                Range.prototype.moveBy = function (row, column) {
                    this.start.row += row;
                    this.start.column += column;
                    this.end.row += row;
                    this.end.column += column;
                };
                Range.fromPoints = function (start, end) {
                    return new Range(start.row, start.column, end.row, end.column);
                };
                Range.comparePoints = function (p1, p2) {
                    return p1.row - p2.row || p1.column - p2.column;
                };
                return Range;
            })();
            exports_1("default", Range);
        }
    }
});

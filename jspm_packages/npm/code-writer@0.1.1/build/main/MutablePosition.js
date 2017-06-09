/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MutablePosition = (function () {
    function MutablePosition(line, column) {
        this.line = line;
        this.column = column;
        // TODO
    }
    MutablePosition.prototype.offset = function (rows, cols) {
        this.line += rows;
        this.column += cols;
    };
    MutablePosition.prototype.toString = function () {
        return "[" + this.line + ", " + this.column + "]";
    };
    return MutablePosition;
}());
exports.MutablePosition = MutablePosition;

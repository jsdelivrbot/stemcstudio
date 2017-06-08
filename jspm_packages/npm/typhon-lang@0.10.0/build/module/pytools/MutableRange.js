/* */ 
"format cjs";
import { assert } from '../pytools/asserts';
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
export { MutablePosition };
var MutableRange = (function () {
    /**
     *
     */
    function MutableRange(begin, end) {
        this.begin = begin;
        this.end = end;
        assert(begin, "begin must be defined");
        assert(end, "end must be defined");
        this.begin = begin;
        this.end = end;
    }
    MutableRange.prototype.offset = function (rows, cols) {
        this.begin.offset(rows, cols);
        this.end.offset(rows, cols);
    };
    MutableRange.prototype.toString = function () {
        return this.begin + " to " + this.end;
    };
    return MutableRange;
}());
export { MutableRange };

/* */ 
"format cjs";
import { assert } from './asserts';
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

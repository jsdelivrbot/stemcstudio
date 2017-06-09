import { assert } from './asserts';
import { MutablePosition } from './MutablePosition';

export class MutableRange {
    /**
     *
     */
    constructor(public readonly begin: MutablePosition, public readonly end: MutablePosition) {
        assert(begin, "begin must be defined");
        assert(end, "end must be defined");
        this.begin = begin;
        this.end = end;
    }
    offset(rows: number, cols: number): void {
        this.begin.offset(rows, cols);
        this.end.offset(rows, cols);
    }
    toString(): string {
        return `${this.begin} to ${this.end}`;
    }
}

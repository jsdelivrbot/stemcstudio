import { RangeBasic } from "./RangeBasic";
import { isEmpty } from "./RangeHelpers";
import { EditSession } from "./EditSession";
import { comparePositions } from "./Position";
import { Position } from "./Position";

/**
 *
 */
export class RangeList<R extends RangeBasic> {

    /**
     *
     */
    public ranges: R[] = [];

    /**
     *
     */
    private session: EditSession | null;

    /**
     * 
     */
    private onChange: (e: { data: { action: string; range: R } }, unused: EditSession) => void;

    /**
     *
     */
    constructor() {
        // Do nothing.
    }

    /**
     * @param pos
     * @param excludeEdges
     * @param startIndex
     */
    pointIndex(pos: Position, excludeEdges?: boolean, startIndex?: number): number {
        const list = this.ranges;
        let i: number;
        for (i = startIndex || 0; i < list.length; i++) {
            const range = list[i];
            const cmpEnd = comparePositions(pos, range.end);
            if (cmpEnd > 0) {
                continue;
            }
            const cmpStart = comparePositions(pos, range.start);
            if (cmpEnd === 0) {
                return excludeEdges && cmpStart !== 0 ? -i - 2 : i;
            }
            if (cmpStart > 0 || (cmpStart === 0 && !excludeEdges)) {
                return i;
            }
            return -i - 1;
        }
        return -i - 1;
    }

    add(range: R): R[] {
        const excludeEdges = !isEmpty(range);
        let startIndex = this.pointIndex(range.start, excludeEdges);
        if (startIndex < 0)
            startIndex = -startIndex - 1;

        let endIndex = this.pointIndex(range.end, excludeEdges, startIndex);

        if (endIndex < 0) {
            endIndex = -endIndex - 1;
        }
        else {
            endIndex++;
        }
        return this.ranges.splice(startIndex, endIndex - startIndex, range);
    }

    addList(list: R[]): R[] {
        const removed: R[] = [];
        for (let i = list.length; i--;) {
            removed.push.call(removed, this.add(list[i]));
        }
        return removed;
    }

    substractPoint(pos: Position): R[] | undefined {
        const i = this.pointIndex(pos);
        if (i >= 0) {
            return this.ranges.splice(i, 1);
        }
        return void 0;
    }

    /**
     * merge overlapping ranges
     */
    merge(): R[] {
        const removed: R[] = [];

        const list = this.ranges.sort(function (a, b) {
            return comparePositions(a.start, b.start);
        });

        let next = list[0];
        for (let i = 1; i < list.length; i++) {
            const range = next;
            next = list[i];
            const cmp = comparePositions(range.end, next.start);
            if (cmp < 0)
                continue;

            if (cmp === 0 && !isEmpty(range) && !isEmpty(next))
                continue;

            if (comparePositions(range.end, next.end) < 0) {
                range.end.row = next.end.row;
                range.end.column = next.end.column;
            }

            list.splice(i, 1);
            removed.push(next);
            next = range;
            i--;
        }

        this.ranges = list;

        return removed;
    }

    contains(row: number, column: number): boolean {
        return this.pointIndex({ row: row, column: column }) >= 0;
    }

    containsPoint(pos: Position): boolean {
        return this.pointIndex(pos) >= 0;
    }

    rangeAtPoint(pos: Position): R | undefined {
        const i = this.pointIndex(pos);
        if (i >= 0) {
            return this.ranges[i];
        }
        return void 0;
    }

    clipRows(startRow: number, endRow: number): R[] {
        const list = this.ranges;
        if (list[0].start.row > endRow || list[list.length - 1].start.row < startRow) {
            return [];
        }

        let startIndex = this.pointIndex({ row: startRow, column: 0 });
        if (startIndex < 0) {
            startIndex = -startIndex - 1;
        }
        // TODO: Had to make a guess here, excludeEdges was not provided.
        const excludeEdges = true;
        let endIndex = this.pointIndex({ row: endRow, column: 0 }, excludeEdges, startIndex);
        if (endIndex < 0) {
            endIndex = -endIndex - 1;
        }

        const clipped: R[] = [];
        for (let i = startIndex; i < endIndex; i++) {
            clipped.push(list[i]);
        }
        return clipped;
    }

    removeAll(): R[] {
        return this.ranges.splice(0, this.ranges.length);
    }

    /**
     * FIXME: Remove this coupling?
     */
    attach(session: EditSession) {
        if (this.session) {
            this.detach();
        }

        this.session = session;
        this.onChange = this.$onChange.bind(this);

        this.session.on('change', this.onChange);
    }

    /**
     * FIXME: Remove this coupling?
     */
    detach() {
        if (!this.session) {
            return;
        }
        this.session.off('change', this.onChange);
        this.session = null;
    }

    /**
     * FIXME: The session appears to be unused. This is a strange coupling.
     * @param e
     * @param session
     */
    private $onChange(e: { data: { action: string; range: R } }, unused: EditSession): void {
        const changeRange: R = e.data.range;
        let start: Position;
        let end: Position;
        if (e.data.action[0] === "i") {
            start = changeRange.start;
            end = changeRange.end;
        }
        else {
            end = changeRange.start;
            start = changeRange.end;
        }
        const startRow = start.row;
        const endRow = end.row;
        const lineDif = endRow - startRow;

        const colDiff = -start.column + end.column;
        const ranges = this.ranges;

        let i: number;
        const n = ranges.length;
        for (i = 0; i < n; i++) {
            const r = ranges[i];
            if (r.end.row < startRow) {
                continue;
            }
            if (r.start.row > startRow) {
                break;
            }

            if (r.start.row === startRow && r.start.column >= start.column) {
                if (r.start.column === start.column && this['$insertRight']) {
                    // do nothing
                }
                else {
                    r.start.column += colDiff;
                    r.start.row += lineDif;
                }
            }
            if (r.end.row === startRow && r.end.column >= start.column) {
                if (r.end.column === start.column && this['$insertRight']) {
                    continue;
                }
                // special handling for the case when two ranges share an edge
                if (r.end.column === start.column && colDiff > 0 && i < n - 1) {
                    if (r.end.column > r.start.column && r.end.column === ranges[i + 1].start.column) {
                        r.end.column -= colDiff;
                    }
                }
                r.end.column += colDiff;
                r.end.row += lineDif;
            }
        }

        if (lineDif !== 0 && i < n) {
            for (; i < n; i++) {
                const r = ranges[i];
                r.start.row += lineDif;
                r.end.row += lineDif;
            }
        }
    }
}

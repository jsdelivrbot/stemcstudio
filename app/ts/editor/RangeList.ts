import Range from "./Range";
import EditSession from "./EditSession";
import comparePoints from "./comparePoints";
import Position from "./Position";

/**
 * @class RangeList
 */
export default class RangeList {

    /**
     * @property ranges
     * @type Range[]
     */
    public ranges: Range[] = [];

    /**
     * @property session
     * @type {EditSession}
     * @private
     */
    private session: EditSession;
    private onChange;

    /**
     * @class RangeList
     * @constructor
     */
    constructor() {
        // Do nothing.
    }

    /**
     * @method pointIndex
     * @param pos {Position}
     * @param [excludeEdges] {boolean}
     * @param [startIndex] {number}
     * @return {number}
     */
    pointIndex(pos: Position, excludeEdges?: boolean, startIndex?: number): number {
        var list = this.ranges;

        for (var i = startIndex || 0; i < list.length; i++) {
            var range = list[i];
            var cmpEnd = comparePoints(pos, range.end);
            if (cmpEnd > 0) {
                continue;
            }
            var cmpStart = comparePoints(pos, range.start);
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

    add(range: Range): Range[] {
        var excludeEdges = !range.isEmpty();
        var startIndex = this.pointIndex(range.start, excludeEdges);
        if (startIndex < 0)
            startIndex = -startIndex - 1;

        var endIndex = this.pointIndex(range.end, excludeEdges, startIndex);

        if (endIndex < 0) {
            endIndex = -endIndex - 1;
        }
        else {
            endIndex++;
        }
        return this.ranges.splice(startIndex, endIndex - startIndex, range);
    }

    addList(list: Range[]): Range[] {
        var removed: Range[] = [];
        for (var i = list.length; i--;) {
            removed.push.call(removed, this.add(list[i]));
        }
        return removed;
    }

    substractPoint(pos: Position): Range[] {
        var i = this.pointIndex(pos);
        if (i >= 0) {
            return this.ranges.splice(i, 1);
        }
    }

    /**
     * merge overlapping ranges
     */
    merge(): Range[] {
        var removed: Range[] = [];
        var list = this.ranges;

        list = list.sort(function(a, b) {
            return comparePoints(a.start, b.start);
        });

        var next = list[0], range;
        for (var i = 1; i < list.length; i++) {
            range = next;
            next = list[i];
            var cmp = comparePoints(range.end, next.start);
            if (cmp < 0)
                continue;

            if (cmp === 0 && !range.isEmpty() && !next.isEmpty())
                continue;

            if (comparePoints(range.end, next.end) < 0) {
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

    rangeAtPoint(pos: Position): Range {
        var i = this.pointIndex(pos);
        if (i >= 0) {
            return this.ranges[i];
        }
    }

    clipRows(startRow: number, endRow: number): Range[] {
        var list = this.ranges;
        if (list[0].start.row > endRow || list[list.length - 1].start.row < startRow) {
            return [];
        }

        var startIndex = this.pointIndex({ row: startRow, column: 0 });
        if (startIndex < 0) {
            startIndex = -startIndex - 1;
        }
        // TODO: Had to make a guess here, excludeEdges was not provided.
        var excludeEdges = true;
        var endIndex = this.pointIndex({ row: endRow, column: 0 }, excludeEdges, startIndex);
        if (endIndex < 0) {
            endIndex = -endIndex - 1;
        }

        var clipped: Range[] = [];
        for (var i = startIndex; i < endIndex; i++) {
            clipped.push(list[i]);
        }
        return clipped;
    }

    removeAll(): Range[] {
        return this.ranges.splice(0, this.ranges.length);
    }

    /**
     * FIXME: Remove this coupling?
     */
    attachXYZ(session: EditSession) {
        if (this.session) {
            this.detachXYZ();
        }

        this.session = session;
        this.onChange = this.$onChange.bind(this);

        this.session.on('change', this.onChange);
    }

    /**
     * FIXME: Remove this coupling?
     */
    detachXYZ() {
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
    private $onChange(e, session: EditSession) {
        var changeRange: Range = e.data.range;
        if (e.data.action[0] === "i") {
            var start = changeRange.start;
            var end = changeRange.end;
        }
        else {
            var end = changeRange.start;
            var start = changeRange.end;
        }
        var startRow = start.row;
        var endRow = end.row;
        var lineDif = endRow - startRow;

        var colDiff = -start.column + end.column;
        var ranges = this.ranges;

        for (var i = 0, n = ranges.length; i < n; i++) {
            var r = ranges[i];
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

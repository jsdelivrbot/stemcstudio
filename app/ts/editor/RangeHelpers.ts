import { Position } from 'editor-document';
import { RangeBasic as Range } from '../editor/RangeBasic';

/**
 * Returns a duplicate of the calling range.
 */
export function clone(range: Readonly<Range>): Range {
    return fromPoints(range.start, range.end);
}

/**
 * Returns a range containing the starting and ending rows of the original range, but with a column value of `0`.
 */
export function collapseRows(range: Readonly<Range>): Range {
    if (range.end.column === 0) {
        return makeRange(makePosition(range.start.row, 0), makePosition(Math.max(range.start.row, range.end.row - 1), 0));
    }
    else {
        return makeRange(makePosition(range.start.row, 0), makePosition(range.end.row, 0));
    }
}

/**
 * Checks the row and column points with the row and column points of the calling range.
 *
 * @param row A row point to compare with
 * @param column A column point to compare with
 * @returns This method returns one of the following numbers:<br/>
 * `0` if the two points are exactly equal <br/>
 * `-1` if `p.row` is less then the calling range <br/>
 * `1` if `p.row` is greater than the calling range <br/>
 *  <br/>
 * If the starting row of the calling range is equal to `p.row`, and: <br/>
 * `p.column` is greater than or equal to the calling range's starting column, returns `0`<br/>
 * Otherwise, it returns -1<br/>
 * <br/>
 * If the ending row of the calling range is equal to `p.row`, and: <br/>
 * `p.column` is less than or equal to the calling range's ending column, returns `0` <br/>
 * Otherwise, it returns 1
 */
export function compare(range: Readonly<Range>, row: number, column: number): -1 | 1 | 0 {
    if (!isMultiLine(range)) {
        if (row === range.start.row) {
            return column < range.start.column ? -1 : (column > range.end.column ? 1 : 0);
        }
    }

    if (row < range.start.row)
        return -1;

    if (row > range.end.row)
        return 1;

    if (range.start.row === row)
        return column >= range.start.column ? 0 : -1;

    if (range.end.row === row) {
        return column <= range.end.column ? 0 : 1;
    }

    return 0;
}

/**
 * Checks the row and column points with the row and column points of the calling range.
 *
 * @param row A row point to compare with
 * @param column A column point to compare with
 *
 * @returns This method returns one of the following numbers:<br/>
 * <br/>
 * `0` if the two points are exactly equal<br/>
 * `-1` if `p.row` is less then the calling range<br/>
 * `1` if `p.row` is greater than the calling range, or if `isStart` is `true`.<br/>
 * <br/>
 * If the starting row of the calling range is equal to `p.row`, and:<br/>
 * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
 * Otherwise, it returns -1<br/>
 * <br/>
 * If the ending row of the calling range is equal to `p.row`, and:<br/>
 * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
 * Otherwise, it returns 1.
 */
export function compareStart(range: Range, row: number, column: number): 0 | 1 | -1 {
    if (range.start.row === row && range.start.column === column) {
        return -1;
    }
    else {
        return compare(range, row, column);
    }
}

/**
 * Checks the row and column points with the row and column points of the calling range.
 *
 * @param row A row point to compare with
 * @param column A column point to compare with
 *
 *
 * @returns This method returns one of the following numbers:<br/>
 * `0` if the two points are exactly equal<br/>
 * `-1` if `p.row` is less then the calling range<br/>
 * `1` if `p.row` is greater than the calling range, or if `isEnd` is `true.<br/>
 * <br/>
 * If the starting row of the calling range is equal to `p.row`, and:<br/>
 * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
 * Otherwise, it returns -1<br/>
 * <br/>
 * If the ending row of the calling range is equal to `p.row`, and:<br/>
 * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
 * Otherwise, it returns 1
 */
export function compareEnd(range: Readonly<Range>, row: number, column: number): 0 | 1 | -1 {
    if (range.end.row === row && range.end.column === column) {
        return 1;
    }
    else {
        return compare(range, row, column);
    }
}

/**
 * Compares `this` range (A) with another range (B).
 *
 * @param range A range to compare with
 * @returns This method returns one of the following numbers:<br/>
 * <br/>
 * `-2`: (B) is in front of (A), and doesn't intersect with (A)<br/>
 * `-1`: (B) begins before (A) but ends inside of (A)<br/>
 * `0`: (B) is completely inside of (A) OR (A) is completely inside of (B)<br/>
 * `+1`: (B) begins inside of (A) but ends outside of (A)<br/>
 * `+2`: (B) is after (A) and doesn't intersect with (A)<br/>
 * `42`: FTW state: (B) ends in (A) but starts outside of (A)
 */
export function compareRange(lhs: Readonly<Range>, rhs: Readonly<Range>): -2 | -1 | 0 | 1 | 2 | 42 {
    const end = rhs.end;
    const start = rhs.start;

    let cmp = compare(lhs, end.row, end.column);
    if (cmp === 1) {
        cmp = compare(lhs, start.row, start.column);
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
        cmp = compare(lhs, start.row, start.column);
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
}

/**
 * Checks the row and column points of `p` with the row and column points of the calling range.
 *
 * @param p A point to compare with
 * @returns This method returns one of the following numbers:<br/>
 * `0` if the two points are exactly equal<br/>
 * `-1` if `p.row` is less then the calling range<br/>
 * `1` if `p.row` is greater than the calling range<br/>
 * <br/>
 * If the starting row of the calling range is equal to `p.row`, and:<br/>
 * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
 * Otherwise, it returns -1<br/>
 * <br/>
 * If the ending row of the calling range is equal to `p.row`, and:<br/>
 * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
 * Otherwise, it returns 1<br/>
 */
export function comparePoint(range: Readonly<Range>, point: Readonly<Position>): 0 | 1 | -1 {
    return compare(range, point.row, point.column);
}

/**
 * Returns `true` if the `row` and `column` provided are within the given range.
 *
 * @param row A row to check for.
 * @param column A column to check for.
 */
export function contains(range: Readonly<Range>, row: number, column: number): boolean {
    return compare(range, row, column) === 0;
}

/**
 * Checks the start and end points of `range` and compares them to the calling range.
 *
 * @param range A range to compare with
 * @returns `true` if the `range` is contained within the caller's range.
 */
export function containsRange(lhs: Readonly<Range>, rhs: Readonly<Range>): boolean {
    return comparePoint(lhs, rhs.start) === 0 && comparePoint(lhs, rhs.end) === 0;
}

export function insideStart(range: Range, row: number, column: number): boolean {
    if (compare(range, row, column) === 0) {
        if (isEnd(range, row, column)) {
            return false;
        }
        else {
            return true;
        }
    }
    return false;
}

/**
 * The range is empty if the start and end position coincide.
 */
export function isEmpty(range: Readonly<Range>): boolean {
    return (range.start.row === range.end.row && range.start.column === range.end.column);
}

/**
 * @returns `true` if the caller's ending row point is the same as `row`, and if the caller's ending column is the same as `column`.
 *
 * @param row A row point to compare with.
 * @param column A column point to compare with.
 */
export function isEnd(range: Range, row: number, column: number): boolean {
    return range.end.row === row && range.end.column === column;
}

/**
 * Returns `true` if and only if the starting row and column, and ending row and column, are equivalent to those given by `range`.
 */
export function isEqual(lhs: Readonly<Range>, rhs: Readonly<Range>): boolean {
    return lhs.start.row === rhs.start.row &&
        lhs.end.row === rhs.end.row &&
        lhs.start.column === rhs.start.column &&
        lhs.end.column === rhs.end.column;
}

/**
 * Returns `true` if the range spans across multiple lines.
 */
export function isMultiLine(range: Readonly<Range>): boolean {
    return (range.start.row !== range.end.row);
}

export function isPosition(arg: any): arg is Position {
    if (arg) {
        if ('row' in arg && 'column' in arg) {
            // Cast so that we can do a typesafe check.
            const candidate = arg as Position;
            return typeof candidate.row === 'number' && typeof candidate.column === 'number';
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

export function isRange(arg: any): arg is Range {
    if (arg) {
        if ('start' in arg && 'end' in arg) {
            // Cast so that we can do a typesafe check.
            const candidate = arg as Range;
            return isPosition(candidate.start) && isPosition(candidate.end);
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

/**
 * @returns `true` if the caller's starting row point is the same as `row`, and if the caller's starting column is the same as `column`.
 *
 * @param row A row point to compare with.
 * @param column A column point to compare with.
 */
export function isStart(range: Range, row: number, column: number): boolean {
    return range.start.row === row && range.start.column === column;
}

export function clipRows(range: Readonly<Range>, firstRow: number, lastRow: number): Range {
    if (typeof firstRow !== 'number') {
        throw new TypeError(`clipRows() firstRow must be a number.`);
    }
    if (typeof lastRow !== 'number') {
        throw new TypeError(`clipRows() lastRow must be a number.`);
    }
    let start: Position | undefined;
    let end: Position | undefined;
    if (range.end.row > lastRow) {
        end = { row: lastRow + 1, column: 0 };
    }
    else if (range.end.row < firstRow) {
        end = { row: firstRow, column: 0 };
    }

    if (range.start.row > lastRow) {
        start = { row: lastRow + 1, column: 0 };
    }
    else if (range.start.row < firstRow) {
        start = { row: firstRow, column: 0 };
    }

    return fromPoints(start || range.start, end || range.end);
}

export function fromPoints(start: Readonly<Position>, end: Readonly<Position>): Range {
    return { start: { row: start.row, column: start.column }, end: { row: end.row, column: end.column } };
}

export function makePosition(row: number, column: number): Position {
    return { row, column };
}

export function makeRange(start: Position, end: Position): Range {
    return { start, end };
}

/**
 * WARNING: Mutates the argument.
 */
export function moveBy(range: Range, row: number, column: number): void {
    range.start.row += row;
    range.start.column += column;
    range.end.row += row;
    range.end.column += column;
}


/**
 * Sets the starting row and column for the range.
 *
 * @param row A row point to set.
 * @param column A column point to set.
 */
export function setEnd(range: Range, row: number, column: number): void {
    range.end.row = row;
    range.end.column = column;
}


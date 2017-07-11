import { Position } from "editor-document";
import { RangeBasic } from './RangeBasic';
import { compareRange, isStart, isEnd, isMultiLine } from './RangeHelpers';

export class Range implements RangeBasic {

    /**
     * The starting position of the range.
     */
    public start: Position;

    /**
     * The ending position of the range.
     */
    public end: Position;

    /**
     * A marker id that is being sneaked onto the Range.
     *
     * @deprecated
     */
    public markerId: number | null;

    /**
     *
     */
    public collapseChildren: number;

    /**
     *
     */
    public isBackwards: boolean;

    /**
     * The cursor position is an optional property making an oriented range.
     */
    public cursor: Position;

    /**
     * The desired column is an optional property making an oriented range.
     */
    public desiredColumn: number | null;

    /**
     * Creates a new `EditorRange` object with the given starting and ending row and column points.
     */
    constructor(startRow = 0, startColumn = 0, endRow = 0, endColumn = 0) {
        this.start = { row: startRow, column: startColumn };
        this.end = { row: endRow, column: endColumn };
    }

    /**
     * Returns a string containing the range's row and column information.
     */
    toString(): string {
        return ("Range: [" + this.start.row + "/" + this.start.column +
            "] -> [" + this.end.row + "/" + this.end.column + "]");
    }

    /**
     * @returns `true` if passed in `range` intersects with the one calling this method.
     *
     * @param range A range to compare with.
     */
    intersects(range: Readonly<RangeBasic>): boolean {
        const cmp = compareRange(this, range);
        return (cmp === -1 || cmp === 0 || cmp === 1);
    }

    /**
     * Sets the starting row and column for the range.
     *
     * @param row A row point to set.
     * @param column A column point to set.
     */
    setStart(row: number, column: number): void {
        this.start.row = row;
        this.start.column = column;
    }

    /**
     * @returns `true` if the `row` and `column` are within the given range.
     *
     * @param row A row point to compare with.
     * @param column A column point to compare with.
     */
    inside(row: number, column: number): boolean {
        if (this.compare(row, column) === 0) {
            if (isEnd(this, row, column) || isStart(this, row, column)) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    }

    /**
     * @returns `true` if the `row` and `column` are within the given range's starting points.
     *
     * @param row A row point to compare with.
     * @param column A column point to compare with.
     */
    insideStart(row: number, column: number): boolean {
        if (this.compare(row, column) === 0) {
            if (isEnd(this, row, column)) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    }

    /**
     * @returns `true` if the `row` and `column` are within the given range's ending points.
     *
     * @param row A row point to compare with.
     * @param column A column point to compare with.
     */
    insideEnd(row: number, column: number): boolean {
        if (this.compare(row, column) === 0) {
            if (isStart(this, row, column)) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
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
     * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
     * Otherwise, it returns -1<br/>
     * <br/>
     * If the ending row of the calling range is equal to `p.row`, and: <br/>
     * `p.column` is less than or equal to the calling range's ending column, this returns `0` <br/>
     * Otherwise, it returns 1
     */
    compare(row: number, column: number): -1 | 1 | 0 {
        if (!isMultiLine(this)) {
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
    }

    /**
     * Checks the row and column points with the row and column points of the calling range.
     *
     * @param row A row point to compare with
     * @param column A column point to compare with
     *
     *
     * @returns This method returns one of the following numbers:<br/>
     * * `1` if the ending row of the calling range is equal to `row`, and the ending column of the calling range is equal to `column`<br/>
     * * `-1` if the starting row of the calling range is equal to `row`, and the starting column of the calling range is equal to `column`<br/>
     * <br/>
     * Otherwise, it returns the value after calling compare.
     */
    compareInside(row: number, column: number): 0 | 1 | -1 {
        if (this.end.row === row && this.end.column === column) {
            return 1;
        }
        else if (this.start.row === row && this.start.column === column) {
            return -1;
        }
        else {
            return this.compare(row, column);
        }
    }

    /**
     * Returns the part of the current `EditorRange` that occurs within the boundaries of `firstRow` and `lastRow` as a new `EditorRange` object.
     *
     * @param firstRow The starting row
     * @param lastRow The ending row
     */
    clipRows(firstRow: number, lastRow: number): Range {
        if (typeof firstRow !== 'number') {
            throw new TypeError(`clipRows() firstRow must be a number.`);
        }
        if (typeof lastRow !== 'number') {
            throw new TypeError(`clipRows() lastRow must be a number.`);
        }
        let start: Position | undefined;
        let end: Position | undefined;
        if (this.end.row > lastRow) {
            end = { row: lastRow + 1, column: 0 };
        }
        else if (this.end.row < firstRow) {
            end = { row: firstRow, column: 0 };
        }

        if (this.start.row > lastRow) {
            start = { row: lastRow + 1, column: 0 };
        }
        else if (this.start.row < firstRow) {
            start = { row: firstRow, column: 0 };
        }

        return Range.fromPoints(start || this.start, end || this.end);
    }

    /**
     * Changes the row and column points for the calling range for both the starting and ending points.
     *
     * @param row A new row to extend to
     * @param column A new column to extend to
     * @returns The original range with the new row
     */
    extend(row: number, column: number): Range {
        const cmp = this.compare(row, column);

        if (cmp === 0) {
            return this;
        }
        else if (cmp === -1) {
            return Range.fromPoints({ row, column }, this.end);
        }
        else if (cmp === 1) {
            return Range.fromPoints(this.start, { row, column });
        }
        else {
            throw new Error("");
        }
    }

    /**
     * The range is empty if the start and end position coincide.
     */
    isEmpty(): boolean {
        return (this.start.row === this.end.row && this.start.column === this.end.column);
    }

    /**
     * Returns a duplicate of the calling range.
     */
    clone(): Range {
        return Range.fromPoints(this.start, this.end);
    }

    /**
     * Returns a range containing the starting and ending rows of the original range, but with a column value of `0`.
     */
    collapseRows(): Range {
        if (this.end.column === 0) {
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0);
        }
        else {
            return new Range(this.start.row, 0, this.end.row, 0);
        }
    }

    /**
     * experimental
     */
    public moveBy(row: number, column: number): void {
        // This is dangerous because it breaks the assumed immutability semantics.
        this.start.row += row;
        this.start.column += column;
        this.end.row += row;
        this.end.column += column;
    }

    /**
     * Creates and returns a new `EditorRange` based on the row and column of the given parameters.
     * @param start A starting point to use
     * @param end An ending point to use
     */
    public static fromPoints(start: Position, end: Position): Range {
        return new Range(start.row, start.column, end.row, end.column);
    }
}

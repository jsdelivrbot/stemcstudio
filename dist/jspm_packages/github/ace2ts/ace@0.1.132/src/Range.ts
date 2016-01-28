/* ***** BEGIN LICENSE BLOCK *****
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 David Geo Holmes <david.geo.holmes@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ***** END LICENSE BLOCK ***** */
/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */
"use strict";

import Position from "./Position";
import RangeBasic from './RangeBasic';
import Tabstop from './Tabstop';

/**
 * This object is used in various places to indicate a region within the editor.
 * To better visualize how this works, imagine a rectangle.
 * Each quadrant of the rectangle is analogus to a range, as ranges contain a starting row and starting column, and an ending row, and ending column.
 *
 * @class Range
 */
export default class Range {

    /**
     * @property start
     * @type Position
     */
    public start: Position;

    /**
     * @property end
     * @type Position
     */
    public end: Position;

    /**
     * A marker id that is being sneaked onto the Range.
     *
     * @property markerId
     * @type number
     * @deprecated
     */
    public markerId: number;

    /**
     * @property collapseChildren
     * @type number
     * @deprecated
     */
    public collapseChildren: number;

    /**
     * @property isBackwards
     * @type boolean
     */
    public isBackwards: boolean;

    /**
     * The cursor position is an optional property making an oriented range.
     *
     * @property cursor
     * @type Position
     */
    public cursor: Position;

    /**
     * The desired column is an optional property making an oriented range.
     *
     * @property desirecColumn
     * @type number
     */
    public desiredColumn: number;

    /**
     * Used by the TabstopManager.
     *
     * @property tabstop
     * @type Tabstop
     * @optional
     */
    public tabstop: Tabstop;

    /**
     * Used by the TabstopManager.
     *
     * @property original
     * @type Range
     * @optional
     */
    public original: Range;

    /**
     * Used by the TabstopManager.
     *
     * @property linked
     * @type boolean
     */
    public linked: boolean;

    /**
     * Used by the TabstopManager.
     *
     * @propery fmtString
     * @type string
     */
    public fmtString: string;

    /**
     * Used by the TabstopManager.
     *
     * @propery guard
     * @type string
     */
    public guard: string;

    /**
     * Used by the TabstopManager.
     *
     * @propery fmt
     * @type string
     */
    public fmt: string;

    /**
     * Used by the TabstopManager.
     *
     * @propery flag
     * @type string
     */
    public flag: string;

    /**
     * Creates a new `EditorRange` object with the given starting and ending row and column points.
     *
     * @class Range
     * @constructor
     * @param {Number} startRow The starting row
     * @param {Number} startColumn The starting column
     * @param {Number} endRow The ending row
     * @param {Number} endColumn The ending column
     */
    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number) {
        this.start = {
            row: startRow,
            column: startColumn
        };

        this.end = {
            row: endRow,
            column: endColumn
        };
    }

    /**
     * Returns `true` if and only if the starting row and column, and ending row and column, are equivalent to those given by `range`.
     *
     * @method isEqual
     * @param range {Range} A range to check against.
     * @return {boolean}
     */
    isEqual(range: { start: Position; end: Position }): boolean {
        return this.start.row === range.start.row &&
            this.end.row === range.end.row &&
            this.start.column === range.start.column &&
            this.end.column === range.end.column;
    }

    /**
     * Returns a string containing the range's row and column information.
     *
     * @method toString
     * @return {string}
     */
    toString(): string {
        return ("Range: [" + this.start.row + "/" + this.start.column +
            "] -> [" + this.end.row + "/" + this.end.column + "]");
    }

    /**
     * Returns `true` if the `row` and `column` provided are within the given range.
     *
     * @method contains
     * @param row {number} A row to check for
     * @param column {number} A column to check for
     * @return {boolean}
     */
    contains(row: number, column: number): boolean {
        return this.compare(row, column) === 0;
    }

    /**
     * Compares `this` range (A) with another range (B).
     *
     * @method compareRange
     * @param {Range} range A range to compare with
     * @return {number} This method returns one of the following numbers:<br/>
     * <br/>
     * `-2`: (B) is in front of (A), and doesn't intersect with (A)<br/>
     * `-1`: (B) begins before (A) but ends inside of (A)<br/>
     * `0`: (B) is completely inside of (A) OR (A) is completely inside of (B)<br/>
     * `+1`: (B) begins inside of (A) but ends outside of (A)<br/>
     * `+2`: (B) is after (A) and doesn't intersect with (A)<br/>
     * `42`: FTW state: (B) ends in (A) but starts outside of (A)
     */
    compareRange(range: RangeBasic): number {
        let cmp: number;
        const end = range.end;
        const start = range.start;

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
    }

    /**
     * Checks the row and column points of `p` with the row and column points of the calling range.
     *
     * @method comparePoint
     * @param p {Position} A point to compare with
     * @return {number} This method returns one of the following numbers:<br/>
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
    comparePoint(point: Position): number {
        return this.compare(point.row, point.column);
    }

    /**
     * Checks the start and end points of `range` and compares them to the calling range.
     *
     * @method containsRange
     * @param range {Range} A range to compare with
     * @return {boolean} Returns `true` if the `range` is contained within the caller's range.
     */
    containsRange(range: { start: Position; end: Position }) {
        return this.comparePoint(range.start) === 0 && this.comparePoint(range.end) === 0;
    }

    /**
     * Returns `true` if passed in `range` intersects with the one calling this method.
     *
     * @method intersects
     * @param range {Range} A range to compare with.
     * @return {boolean}
     */
    intersects(range: Range): boolean {
        var cmp = this.compareRange(range);
        return (cmp === -1 || cmp === 0 || cmp === 1);
    }

    /**
     * Returns `true` if the caller's ending row point is the same as `row`, and if the caller's ending column is the same as `column`.
     *
     * @method isEnd
     * @param row {number} A row point to compare with.
     * @param column {number} A column point to compare with.
     * @return {boolean}
     */
    isEnd(row: number, column: number): boolean {
        return this.end.row === row && this.end.column === column;
    }

    /**
     * Returns `true` if the caller's starting row point is the same as `row`, and if the caller's starting column is the same as `column`.
     *
     * @method isStart
     * @param row {number} A row point to compare with.
     * @param column {number} A column point to compare with.
     * @return {boolean}
     */
    isStart(row: number, column: number): boolean {
        return this.start.row === row && this.start.column === column;
    }

    /**
     * Sets the starting row and column for the range.
     *
     * @method setStart
     * @param row {number} A row point to set.
     * @param column {number} A column point to set.
     * @return {void}
     */
    setStart(row: number, column: number): void {
        this.start.row = row;
        this.start.column = column;
    }

    /**
     * Sets the starting row and column for the range.
     *
     * @method setEnd
     * @param row {number} A row point to set.
     * @param column {number} A column point to set.
     * @return {void}
     */
    setEnd(row: number, column: number): void {
        this.end.row = row;
        this.end.column = column;
    }

    /**
     * Returns `true` if the `row` and `column` are within the given range.
     *
     * @method inside
     * @param row {number} A row point to compare with.
     * @param column {number} A column point to compare with.
     * @return {boolean}
     */
    inside(row: number, column: number): boolean {
        if (this.compare(row, column) === 0) {
            if (this.isEnd(row, column) || this.isStart(row, column)) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns `true` if the `row` and `column` are within the given range's starting points.
     *
     * @method insideStart
     * @param row {number} A row point to compare with.
     * @param column {number} A column point to compare with.
     * @return {boolean}
     */
    insideStart(row: number, column: number): boolean {
        if (this.compare(row, column) === 0) {
            if (this.isEnd(row, column)) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns `true` if the `row` and `column` are within the given range's ending points.
     *
     * @method insideEnd
     * @param row {number} A row point to compare with.
     * @param column {number} A column point to compare with.
     * @return {boolean}
     */
    insideEnd(row: number, column: number): boolean {
        if (this.compare(row, column) === 0) {
            if (this.isStart(row, column)) {
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
     * @method compare
     * @param row {number} A row point to compare with
     * @param column {number} A column point to compare with
     * @return {number} This method returns one of the following numbers:<br/>
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
    compare(row: number, column: number): number {
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
    }

    /**
     * Checks the row and column points with the row and column points of the calling range.
     *
     * @method compareStart
     * @param {Number} row A row point to compare with
     * @param {Number} column A column point to compare with
     *
     * @return {Number} This method returns one of the following numbers:<br/>
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
    compareStart(row: number, column: number): number {
        if (this.start.row === row && this.start.column === column) {
            return -1;
        }
        else {
            return this.compare(row, column);
        }
    }

    /**
     * Checks the row and column points with the row and column points of the calling range.
     *
     * @method compareEnd
     * @param {Number} row A row point to compare with
     * @param {Number} column A column point to compare with
     *
     *
     * @return {Number} This method returns one of the following numbers:<br/>
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
    compareEnd(row: number, column: number): number {
        if (this.end.row === row && this.end.column === column) {
            return 1;
        }
        else {
            return this.compare(row, column);
        }
    }

    /**
     * Checks the row and column points with the row and column points of the calling range.
     *
     * @method compareInside
     * @param {Number} row A row point to compare with
     * @param {Number} column A column point to compare with
     *
     *
     * @return {Number} This method returns one of the following numbers:<br/>
     * * `1` if the ending row of the calling range is equal to `row`, and the ending column of the calling range is equal to `column`<br/>
     * * `-1` if the starting row of the calling range is equal to `row`, and the starting column of the calling range is equal to `column`<br/>
     * <br/>
     * Otherwise, it returns the value after calling [[EditorRange.compare `compare()`]].
     */
    compareInside(row: number, column: number): number {
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
     * @method clipRows
     * @param firstRow {number} The starting row
     * @param lastRow {number} The ending row
     * @return {Range}
     */
    clipRows(firstRow: number, lastRow: number): Range {
        if (typeof firstRow !== 'number') {
            throw new TypeError(`clipRows() firstRow must be a number.`);
        }
        if (typeof lastRow !== 'number') {
            throw new TypeError(`clipRows() lastRow must be a number.`);
        }
        let start: Position;
        let end: Position;
        if (this.end.row > lastRow)
            end = { row: lastRow + 1, column: 0 };
        else if (this.end.row < firstRow)
            end = { row: firstRow, column: 0 };

        if (this.start.row > lastRow)
            start = { row: lastRow + 1, column: 0 };
        else if (this.start.row < firstRow)
            start = { row: firstRow, column: 0 };

        return Range.fromPoints(start || this.start, end || this.end);
    }

    /**
     * Changes the row and column points for the calling range for both the starting and ending points.
     *
     * @method extend
     * @param {Number} row A new row to extend to
     * @param {Number} column A new column to extend to
     * @return {Range} The original range with the new row
     */
    extend(row: number, column: number): Range {
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
    }

    /**
     * @method isEmpty
     * @return {boolean}
     */
    isEmpty(): boolean {
        return (this.start.row === this.end.row && this.start.column === this.end.column);
    }

    /**
     * Returns `true` if the range spans across multiple lines.
     *
     * @method isMultiLine
     * @return {Boolean}
     */
    isMultiLine(): boolean {
        return (this.start.row !== this.end.row);
    }

    /**
     * Returns a duplicate of the calling range.
     *
     * @method clone
     * @return {Range}
     */
    clone() {
        return Range.fromPoints(this.start, this.end);
    }

    /**
     * Returns a range containing the starting and ending rows of the original range, but with a column value of `0`.
     *
     * @method collapseRows
     * @return {Range}
     */
    collapseRows(): Range {
        if (this.end.column === 0) {
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0);
        }
        else {
            return new Range(this.start.row, 0, this.end.row, 0);
        }
    }

    /* experimental */
    moveBy(row: number, column: number): void {
        this.start.row += row;
        this.start.column += column;
        this.end.row += row;
        this.end.column += column;
    }

    /**
     * Creates and returns a new `EditorRange` based on the row and column of the given parameters.
     * @param start {Position} A starting point to use
     * @param end {Position} An ending point to use
     * @return {Range}
     * @static
     */
    public static fromPoints(start: Position, end: Position): Range {
        return new Range(start.row, start.column, end.row, end.column);
    }

    /**
     * @method comparePoints
     * @param p1 {Position}
     * @param p2 {Position}
     * @return {number}
     * @static
     */
    public static comparePoints(p1: Position, p2: Position): number {
        return p1.row - p2.row || p1.column - p2.column;
    }
}

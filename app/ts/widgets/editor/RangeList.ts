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

            if (cmp == 0 && !range.isEmpty() && !next.isEmpty())
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

    attach(session: EditSession) {
        if (this.session) {
            this.detach();
        }

        this.session = session;
        this.onChange = this.$onChange.bind(this);

        this.session.on('change', this.onChange);
    }

    detach() {
        if (!this.session) {
            return;
        }
        this.session.off('change', this.onChange);
        this.session = null;
    }

    private $onChange(e, session: EditSession) {
        var changeRange: Range = e.data.range;
        if (e.data.action[0] == "i") {
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

            if (r.start.row == startRow && r.start.column >= start.column) {
                if (r.start.column == start.column && this['$insertRight']) {
                    // do nothing
                }
                else {
                    r.start.column += colDiff;
                    r.start.row += lineDif;
                }
            }
            if (r.end.row == startRow && r.end.column >= start.column) {
                if (r.end.column == start.column && this['$insertRight']) {
                    continue;
                }
                // special handling for the case when two ranges share an edge
                if (r.end.column == start.column && colDiff > 0 && i < n - 1) {
                    if (r.end.column > r.start.column && r.end.column == ranges[i + 1].start.column) {
                        r.end.column -= colDiff;
                    }
                }
                r.end.column += colDiff;
                r.end.row += lineDif;
            }
        }

        if (lineDif != 0 && i < n) {
            for (; i < n; i++) {
                var r = ranges[i];
                r.start.row += lineDif;
                r.end.row += lineDif;
            }
        }
    }
}

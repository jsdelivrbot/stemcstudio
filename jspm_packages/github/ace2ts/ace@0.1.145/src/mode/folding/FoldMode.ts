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
 
* * ***** END LICENSE BLOCK ***** */
"use strict";

import Range from "../../Range";
import EditSession from "../../EditSession";

/**
 * @class FoldMode
 */
export default class FoldMode {

    /**
     * @property foldingStartMarker
     * @type RegExp
     */
    foldingStartMarker: RegExp = null;

    /**
     * @property foldingStartMarker
     * @type RegExp
     */
    foldingStopMarker: RegExp = null;

    /**
     * @class FoldMode
     * @constructor
     */
    constructor() {
    }

    /**
     * must return "" if there's no fold, to enable caching
     *
     * @method getFoldWidget
     * @param session {EditSession}
     * @param foldStyle {string} "markbeginend"
     * @param row {number}
     * @return {string}
     */
    getFoldWidget(session: EditSession, foldStyle: string, row: number): string {
        var line = session.getLine(row);
        if (this.foldingStartMarker.test(line)) {
            return "start";
        }
        if (foldStyle === "markbeginend" && this.foldingStopMarker && this.foldingStopMarker.test(line)) {
            return "end";
        }
        return "";
    }

    /**
     * @method getFoldWidgetRange
     * @param session {EditSession}
     * @param foldStyle {string}
     * @param row {number}
     * @return {Range}
     */
    getFoldWidgetRange(session: EditSession, foldStyle: string, row: number): Range {
        return null;
    }

    /**
     * @method indentationBlock
     * @param session {EditSession}
     * @param row {number}
     * @param column {number}
     * @return {Range}
     */
    indentationBlock(session: EditSession, row: number, column: number): Range {
        var re = /\S/;
        var line = session.getLine(row);
        var startLevel = line.search(re);
        if (startLevel === -1) {
            return;
        }

        var startColumn = column || line.length;
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;

        while (++row < maxRow) {
            var level = session.getLine(row).search(re);

            if (level === -1) {
                continue;
            }

            if (level <= startLevel) {
                break;
            }

            endRow = row;
        }

        if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
    }

    /**
     * @method openingBracketBlock
     * @param session {EditSession}
     * @param bracket {string}
     * @param row {number}
     * @param column {number}
     * @param [typeRe] {RegExp}
     * @return {Range}
     */
    openingBracketBlock(session: EditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range {
        var start = { row: row, column: column + 1 };
        var end = session.findClosingBracket(bracket, start, typeRe);
        if (!end)
            return;

        var fw = session.foldWidgets[end.row];
        if (fw == null)
            fw = session.getFoldWidget(end.row);

        if (fw == "start" && end.row > start.row) {
            end.row--;
            end.column = session.getLine(end.row).length;
        }
        return Range.fromPoints(start, end);
    }

    /**
     * @method closingBracketBlock
     * @param session {EditSession}
     * @param bracket {string}
     * @param row {number}
     * @param column {number}
     * @param [typeRe] {RegExp}
     * @return {Range}
     */
    closingBracketBlock(session: EditSession, bracket: string, row: number, column: number, typeRe?: RegExp): Range {
        var end = { row: row, column: column };
        var start = session.findOpeningBracket(bracket, end);

        if (!start) {
            return;
        }

        start.column++;
        end.column--;

        return Range.fromPoints(start, end);
    }
}

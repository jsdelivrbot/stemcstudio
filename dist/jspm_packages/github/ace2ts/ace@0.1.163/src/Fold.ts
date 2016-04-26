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

import FoldLine from "./FoldLine";
import Range from "./Range";
import RangeList from "./RangeList";
import Position from "./Position";

/**
 * Simple fold-data struct.
 * @class Fold
 * @extends RangeList
 */
export default class Fold extends RangeList {
    foldLine: FoldLine;
    placeholder: string;
    range: Range;
    start: Position;
    end: Position;
    endRow: number;
    sameRow: boolean;
    subFolds: Fold[];
    collapseChildren: number;

    /**
     * @class Fold
     * @constructor
     * @param range {Range}
     * @param placeholder {string}
     */
    constructor(range: Range, placeholder: string) {
        super()
        this.foldLine = null;
        this.placeholder = placeholder;
        this.range = range;
        this.start = range.start;
        this.end = range.end;

        this.sameRow = range.start.row === range.end.row;
        this.subFolds = this.ranges = [];
    }

    /**
     * @method toString
     * @return {string}
     */
    toString(): string {
        return '"' + this.placeholder + '" ' + this.range.toString();
    }

    /**
     * @method setFoldLine
     * @param foldLine {FoldLine}
     * @return {void}
     */
    setFoldLine(foldLine: FoldLine): void {
        this.foldLine = foldLine;
        this.subFolds.forEach(function(fold: Fold) {
            fold.setFoldLine(foldLine);
        });
    }

    /**
     * @method clone
     * @return {Fold}
     */
    clone(): Fold {
        var range = this.range.clone();
        var fold = new Fold(range, this.placeholder);
        this.subFolds.forEach(function(subFold) {
            fold.subFolds.push(subFold.clone());
        });
        fold.collapseChildren = this.collapseChildren;
        return fold;
    }

    /**
     * @method addSubFold
     * @param fold {Fold}
     * @return {Fold}
     */
    addSubFold(fold: Fold): Fold {
        if (this.range.isEqual(fold))
            return;

        if (!this.range.containsRange(fold))
            throw new Error("A fold can't intersect already existing fold" + fold.range + this.range);

        // transform fold to local coordinates
        consumeRange(fold, this.start);

        var row = fold.start.row, column = fold.start.column;
        for (var i = 0, cmp = -1; i < this.subFolds.length; i++) {
            cmp = this.subFolds[i].range.compare(row, column);
            if (cmp != 1)
                break;
        }
        var afterStart = this.subFolds[i];

        if (cmp == 0)
            return afterStart.addSubFold(fold);

        // cmp == -1
        var row = fold.range.end.row, column = fold.range.end.column;
        for (var j = i, cmp = -1; j < this.subFolds.length; j++) {
            cmp = this.subFolds[j].range.compare(row, column);
            if (cmp != 1)
                break;
        }
        var afterEnd = this.subFolds[j];

        if (cmp == 0)
            throw new Error("A fold can't intersect already existing fold" + fold.range + this.range);

        var consumedFolds = this.subFolds.splice(i, j - i, fold);
        fold.setFoldLine(this.foldLine);

        return fold;
    }

    /**
     * @method restoreRange
     * @param range {Fold}
     * @return {void}
     */
    restoreRange(range: Fold): void {
        return restoreRange(range, this.start);
    }
}

function consumePoint(point: Position, anchor: Position) {
    point.row -= anchor.row;
    if (point.row == 0)
        point.column -= anchor.column;
}

function consumeRange(range: Fold, anchor: Position) {
    consumePoint(range.start, anchor);
    consumePoint(range.end, anchor);
}

function restorePoint(point: Position, anchor: Position) {
    if (point.row == 0)
        point.column += anchor.column;
    point.row += anchor.row;
}

function restoreRange(range: Fold, anchor: Position) {
    restorePoint(range.start, anchor);
    restorePoint(range.end, anchor);
}

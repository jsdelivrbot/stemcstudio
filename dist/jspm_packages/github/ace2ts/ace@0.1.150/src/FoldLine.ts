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

import Range from "./Range";
import Fold from "./Fold";

/**
 * If an array is passed in, the folds are expected to be sorted already.
 * @class FoldLine
 */
export default class FoldLine {
    foldData
    folds: Fold[];
    range: Range;
    start: { row: number; column: number };
    startRow: number;
    end: { row: number; column: number };
    endRow: number;

    /**
     * @class FoldLine
     * @constructor
     * @param foldData
     * @param folds {Fold[]}
     */
    constructor(foldData, folds: Fold[]) {
        this.foldData = foldData;
        if (Array.isArray(folds)) {
            this.folds = folds;
        }
        else {
            throw new Error("folds must have type Fold[]")
        }

        var last: Fold = folds[folds.length - 1];
        this.range = new Range(folds[0].start.row, folds[0].start.column, last.end.row, last.end.column);
        this.start = this.range.start;
        this.end = this.range.end;

        this.folds.forEach(function(fold) {
            fold.setFoldLine(this);
        }, this);
    }

    /**
     * Note: This doesn't update wrapData!
     * @method shiftRow
     * @param shift {number}
     * @return {void}
     */
    shiftRow(shift: number): void {
        this.start.row += shift;
        this.end.row += shift;
        this.folds.forEach(function(fold) {
            fold.start.row += shift;
            fold.end.row += shift;
        });
    }

    /**
     * @method addFold
     * @param fold {Fold}
     * @return {void}
     */
    addFold(fold: Fold): void {
        if (fold.sameRow) {
            if (fold.start.row < this.startRow || fold.endRow > this.endRow) {
                throw new Error("Can't add a fold to this FoldLine as it has no connection");
            }
            this.folds.push(fold);
            this.folds.sort(function(a, b) {
                return -a.range.compareEnd(b.start.row, b.start.column);
            });
            if (this.range.compareEnd(fold.start.row, fold.start.column) > 0) {
                this.end.row = fold.end.row;
                this.end.column = fold.end.column;
            } else if (this.range.compareStart(fold.end.row, fold.end.column) < 0) {
                this.start.row = fold.start.row;
                this.start.column = fold.start.column;
            }
        }
        else if (fold.start.row == this.end.row) {
            this.folds.push(fold);
            this.end.row = fold.end.row;
            this.end.column = fold.end.column;
        }
        else if (fold.end.row == this.start.row) {
            this.folds.unshift(fold);
            this.start.row = fold.start.row;
            this.start.column = fold.start.column;
        }
        else {
            throw new Error("Trying to add fold to FoldRow that doesn't have a matching row");
        }
        fold.foldLine = this;
    }

    /**
     * @method containsRow
     * @param row {number}
     * @return {boolean}
     */
    containsRow(row: number): boolean {
        return row >= this.start.row && row <= this.end.row;
    }

    /**
     * @method walk
     * @param callback
     * @param endRow {number}
     * @param endColumn {number}
     * @return {void}
     */
    walk(callback: (placeholder, row, column, end, isNewRow?) => any, endRow: number, endColumn: number): void {
        var lastEnd = 0,
            folds = this.folds,
            fold,
            cmp, stop, isNewRow = true;

        if (endRow == null) {
            endRow = this.end.row;
            endColumn = this.end.column;
        }

        for (var i = 0; i < folds.length; i++) {
            fold = folds[i];

            cmp = fold.range.compareStart(endRow, endColumn);
            // This fold is after the endRow/Column.
            if (cmp == -1) {
                callback(null, endRow, endColumn, lastEnd, isNewRow);
                return;
            }

            stop = callback(null, fold.start.row, fold.start.column, lastEnd, isNewRow);
            stop = !stop && callback(fold.placeholder, fold.start.row, fold.start.column, lastEnd);

            // If the user requested to stop the walk or endRow/endColumn is
            // inside of this fold (cmp == 0), then end here.
            if (stop || cmp === 0) {
                return;
            }

            // Note the new lastEnd might not be on the same line. However,
            // it's the callback's job to recognize this.
            isNewRow = !fold.sameRow;
            lastEnd = fold.end.column;
        }
        callback(null, endRow, endColumn, lastEnd, isNewRow);
    }

    getNextFoldTo(row: number, column: number): { fold: Fold; kind: string } {
        var fold: Fold;
        var cmp: number;
        for (var i = 0; i < this.folds.length; i++) {
            fold = this.folds[i];
            cmp = fold.range.compareEnd(row, column);
            if (cmp == -1) {
                return {
                    fold: fold,
                    kind: "after"
                };
            } else if (cmp === 0) {
                return {
                    fold: fold,
                    kind: "inside"
                };
            }
        }
        return null;
    }

    addRemoveChars(row: number, column: number, len: number) {
        var ret = this.getNextFoldTo(row, column);
        var fold: Fold;
        var folds;

        if (ret) {
            fold = ret.fold;
            if (ret.kind === "inside"
                && fold.start.column !== column
                && fold.start.row !== row) {
                //throwing here breaks whole editor
                //TODO: properly handle this
                window.console && window.console.warn(row, column, fold);
            }
            else if (fold.start.row == row) {
                folds = this.folds;
                var i = folds.indexOf(fold);
                if (i === 0) {
                    this.start.column += len;
                }
                for (i; i < folds.length; i++) {
                    fold = folds[i];
                    fold.start.column += len;
                    if (!fold.sameRow) {
                        return;
                    }
                    fold.end.column += len;
                }
                this.end.column += len;
            }
        }
    }

    split(row, column) {
        var pos = this.getNextFoldTo(row, column);

        if (!pos || pos.kind == "inside")
            return null;

        var fold = pos.fold;
        var folds = this.folds;
        var foldData = this.foldData;

        var i = folds.indexOf(fold);
        var foldBefore = folds[i - 1];
        this.end.row = foldBefore.end.row;
        this.end.column = foldBefore.end.column;

        // Remove the folds after row/column and create a new FoldLine
        // containing these removed folds.
        folds = folds.splice(i, folds.length - i);

        var newFoldLine = new FoldLine(foldData, folds);
        foldData.splice(foldData.indexOf(this) + 1, 0, newFoldLine);
        return newFoldLine;
    }

    merge(foldLineNext) {
        var folds = foldLineNext.folds;
        for (var i = 0; i < folds.length; i++) {
            this.addFold(folds[i]);
        }
        // Remove the foldLineNext - no longer needed, as
        // it's merged now with foldLineNext.
        var foldData = this.foldData;
        foldData.splice(foldData.indexOf(foldLineNext), 1);
    }

    toString() {
        var ret = [this.range.toString() + ": ["];

        this.folds.forEach(function(fold) {
            ret.push("  " + fold.toString());
        });
        ret.push("]");
        return ret.join("\n");
    }

    idxToPosition(idx) {
        var lastFoldEndColumn = 0;

        for (var i = 0; i < this.folds.length; i++) {
            var fold = this.folds[i];

            idx -= fold.start.column - lastFoldEndColumn;
            if (idx < 0) {
                return {
                    row: fold.start.row,
                    column: fold.start.column + idx
                };
            }

            idx -= fold.placeholder.length;
            if (idx < 0) {
                return fold.start;
            }

            lastFoldEndColumn = fold.end.column;
        }

        return {
            row: this.end.row,
            column: this.end.column + idx
        };
    }
}

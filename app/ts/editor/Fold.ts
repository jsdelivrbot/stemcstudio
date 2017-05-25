import { FoldLine } from "./FoldLine";
import { clone, compare, containsRange, isEqual } from "./RangeHelpers";
import { RangeBasic } from "./RangeBasic";
import { RangeList } from "./RangeList";
import { Position } from "./Position";

/**
 * Simple fold-data struct.
 */
export class Fold extends RangeList<RangeBasic> {
    foldLine: FoldLine | null;
    placeholder: string;
    range: Readonly<RangeBasic>;
    start: Position;
    end: Position;
    endRow: number;
    sameRow: boolean;
    subFolds: Fold[];
    collapseChildren: number;

    /**
     * @param range
     * @param placeholder
     */
    constructor(range: RangeBasic, placeholder: string) {
        super();
        this.foldLine = null;
        this.placeholder = placeholder;
        this.range = range;
        this.start = range.start;
        this.end = range.end;

        this.sameRow = range.start.row === range.end.row;
        this.subFolds = this.ranges = [];
    }

    /**
     *
     */
    toString(): string {
        return '"' + this.placeholder + '" ' + this.range.toString();
    }

    /**
     * @param foldLine
     */
    setFoldLine(foldLine: FoldLine | null): void {
        this.foldLine = foldLine;
        this.subFolds.forEach(function (fold: Fold) {
            fold.setFoldLine(foldLine);
        });
    }

    /**
     *
     */
    clone(): Fold {
        const range = clone(this.range);
        const fold = new Fold(range, this.placeholder);
        this.subFolds.forEach(function (subFold) {
            fold.subFolds.push(subFold.clone());
        });
        fold.collapseChildren = this.collapseChildren;
        return fold;
    }

    /**
     * @param fold
     */
    addSubFold(fold: Fold): Fold | undefined {
        if (isEqual(this.range, fold)) {
            return void 0;
        }

        if (!containsRange(this.range, fold))
            throw new Error("A fold can't intersect already existing fold" + fold.range + this.range);

        // transform fold to local coordinates
        consumeRange(fold, this.start);

        let row = fold.start.row;
        let column = fold.start.column;
        let i: number;
        let cmp: number;
        for (i = 0, cmp = -1; i < this.subFolds.length; i++) {
            cmp = compare(this.subFolds[i].range, row, column);
            if (cmp !== 1)
                break;
        }
        const afterStart = this.subFolds[i];

        if (cmp === 0) {
            return afterStart.addSubFold(fold);
        }

        // cmp == -1
        row = fold.range.end.row;
        column = fold.range.end.column;
        let j: number;
        for (j = i, cmp = -1; j < this.subFolds.length; j++) {
            cmp = compare(this.subFolds[j].range, row, column);
            if (cmp !== 1)
                break;
        }
        /* afterEnd = this.subFolds[j]; */

        if (cmp === 0) {
            throw new Error("A fold can't intersect already existing fold" + fold.range + this.range);
        }

        /* consumedFolds = */ this.subFolds.splice(i, j - i, fold);
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
    if (point.row === 0) {
        point.column -= anchor.column;
    }
}

function consumeRange(range: Fold, anchor: Position) {
    consumePoint(range.start, anchor);
    consumePoint(range.end, anchor);
}

function restorePoint(point: Position, anchor: Position) {
    if (point.row === 0) {
        point.column += anchor.column;
    }
    point.row += anchor.row;
}

function restoreRange(range: Fold, anchor: Position) {
    restorePoint(range.start, anchor);
    restorePoint(range.end, anchor);
}

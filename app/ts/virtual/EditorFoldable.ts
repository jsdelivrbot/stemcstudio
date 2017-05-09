import { Position } from './editor';
import { Range } from './editor';
import { RangeWithCollapseChildren } from './editor';

export interface Fold {

}

export interface EditorFoldable {
    addPlaceholderFold(placeholder: string, range: RangeWithCollapseChildren): Fold | undefined;
    expandFold(fold: any): void;
    foldAll(): void;
    /**
     * Looks up a fold at a given row/column. Possible values for side:
     *   -1: ignore a fold if fold.start = row/column
     *   +1: ignore a fold if fold.end = row/column
     */
    getFoldAt(row: number, column: number, side?: number): Fold | undefined | null;
    removeFold(fold: any): void;
    toggleFold(tryToUnfold: boolean): void;
    toggleFoldWidget(toggleParent?: boolean): void;
    unfold(location?: number | Position | Range, expandInner?: boolean): Fold[] | undefined;
}

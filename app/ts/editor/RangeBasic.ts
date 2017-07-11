import { Position, equalPositions } from 'editor-document';

/**
 * 
 */
export interface RangeBasic {
    /**
     * The starting position of the range.
     */
    start: Position;
    /**
     * The ending position of the range.
     */
    end: Position;
}

export interface RangeWithCollapseChildren extends RangeBasic {
    collapseChildren: number;
}

export interface RangeWithMarkerId extends RangeBasic {
    markerId: number;
}

export interface OrientedRange extends RangeWithCollapseChildren {
    cursor: Position;
    desiredColumn: number | null;
    isBackwards: boolean;
}

export interface RangeSelectionMarker extends OrientedRange, RangeWithMarkerId {
}

/**
 * The range is empty if the start and end position coincide.
 */
export function isEmptyRange(range: RangeBasic): boolean {
    return equalPositions(range.start, range.end);
}

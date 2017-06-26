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

/**
 * The range is empty if the start and end position coincide.
 */
export function isEmptyRange(range: RangeBasic): boolean {
    return equalPositions(range.start, range.end);
}

import { Position } from './Position';
import { equalPositions } from './Position';

/**
 *
 */
export interface Range {
    /**
     * The starting position of the range.
     */
    start: Position;
    /**
     * The ending position of the range.
     */
    end: Position;
}


export function range(start: Position, end: Position): Range {
    return { start, end };
}


/**
 * The range is empty if the start and end position coincide.
 */
export function isEmptyRange(range: Range): boolean {
    return equalPositions(range.start, range.end);
}

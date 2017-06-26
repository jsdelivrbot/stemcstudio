import { Position } from './Position';
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
export declare function range(start: Position, end: Position): Range;
/**
 * The range is empty if the start and end position coincide.
 */
export declare function isEmptyRange(range: Range): boolean;

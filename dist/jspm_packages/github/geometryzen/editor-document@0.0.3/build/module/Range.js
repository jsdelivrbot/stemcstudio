import { equalPositions } from './Position';
export function range(start, end) {
    return { start: start, end: end };
}
/**
 * The range is empty if the start and end position coincide.
 */
export function isEmptyRange(range) {
    return equalPositions(range.start, range.end);
}
//# sourceMappingURL=Range.js.map
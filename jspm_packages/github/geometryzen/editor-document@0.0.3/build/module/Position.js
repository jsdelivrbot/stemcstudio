export function position(row, column) {
    return { row: row, column: column };
}
/**
 * Returns 0 if positions are equal, positive if p1 comes after p2, negative if p1 comes before p2.
 */
export function comparePositions(p1, p2) {
    return p1.row - p2.row || p1.column - p2.column;
}
export function equalPositions(p1, p2) {
    return comparePositions(p1, p2) === 0;
}
//# sourceMappingURL=Position.js.map
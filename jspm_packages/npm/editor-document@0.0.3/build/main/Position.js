/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function position(row, column) {
    return { row: row, column: column };
}
exports.position = position;
/**
 * Returns 0 if positions are equal, positive if p1 comes after p2, negative if p1 comes before p2.
 */
function comparePositions(p1, p2) {
    return p1.row - p2.row || p1.column - p2.column;
}
exports.comparePositions = comparePositions;
function equalPositions(p1, p2) {
    return comparePositions(p1, p2) === 0;
}
exports.equalPositions = equalPositions;
//# sourceMappingURL=Position.js.map
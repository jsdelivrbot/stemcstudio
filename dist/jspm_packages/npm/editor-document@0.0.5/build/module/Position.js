/* */ 
"format cjs";
export function position(row, column) {
    return { row: row, column: column };
}
/**
 * Returns 0 if positions are equal, +1 if p1 comes after p2, -1 if p1 comes before p2.
 */
export function comparePositions(p1, p2) {
    if (p1.row > p2.row) {
        return 1;
    }
    else if (p1.row < p2.row) {
        return -1;
    }
    else {
        if (p1.column > p2.column) {
            return 1;
        }
        else if (p1.column < p2.column) {
            return -1;
        }
        else {
            return 0;
        }
    }
}
export function equalPositions(p1, p2) {
    return p1.row === p2.row && p1.column === p2.column;
}
//# sourceMappingURL=Position.js.map
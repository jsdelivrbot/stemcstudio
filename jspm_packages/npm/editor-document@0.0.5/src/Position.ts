/**
 * The zero-based coordinates of a character in the editor.
 * (row,column) => (0,0) is the topmost and leftmost character.
 */
export interface Position {
    /**
     * The zero-based row.
     */
    row: number;
    /**
     * The zero-based column.
     */
    column: number;
}

export function position(row: number, column: number): Position {
    return { row, column };
}

/**
 * Returns 0 if positions are equal, +1 if p1 comes after p2, -1 if p1 comes before p2.
 */
export function comparePositions(p1: Position, p2: Position): 1 | -1 | 0 {
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

export function equalPositions(p1: Position, p2: Position): boolean {
    return p1.row === p2.row && p1.column === p2.column;
}

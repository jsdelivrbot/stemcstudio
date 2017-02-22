/**
 * The zero-based coordinates of a character in the editor.
 * (row,column) => (0,0) is the topmost and leftmost character.
 */
interface Position {
    /**
     * The zero-based row.
     */
    row: number;
    /**
     * The zero-based column.
     */
    column: number;
}

/**
 * Returns 0 if positions are equal, positive if p1 comes after p2, negative if p1 comes before p2.
 */
export function comparePositions(p1: Position, p2: Position): number {
    return p1.row - p2.row || p1.column - p2.column;
}

export function equalPositions(p1: Position, p2: Position): boolean {
    return comparePositions(p1, p2) === 0;
}

export default Position;

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
export declare function position(row: number, column: number): Position;
/**
 * Returns 0 if positions are equal, +1 if p1 comes after p2, -1 if p1 comes before p2.
 */
export declare function comparePositions(p1: Position, p2: Position): 1 | -1 | 0;
export declare function equalPositions(p1: Position, p2: Position): boolean;

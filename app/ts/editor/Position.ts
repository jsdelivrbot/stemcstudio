/**
 * The 0-based coordinates of a character in the editor.
 * (row,column) => (0,0) is the topmost and leftmost character.
 */
interface Position {
    /**
     *
     */
    row: number;
    /**
     *
     */
    column: number;
}

export default Position;

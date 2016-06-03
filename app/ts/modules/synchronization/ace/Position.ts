/**
 * The 0-based coordinates of a character in the editor.
 * (row,column) => (0,0) is the topmost and leftmost character.
 *
 * @class Position
 */
interface Position {

    /**
     * @property row
     * @type number
     */
    row: number;

    /**
     * @property column
     * @type number
     */
    column: number;
}

export default Position;

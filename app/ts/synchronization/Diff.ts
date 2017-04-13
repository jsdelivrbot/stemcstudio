/**
 * Diff is a two-element array.
 * The first element is the operation DELETE, EQUAL, INSERT (number).
 * The second element is the text (string).
 * 
 * When a diff is computed, the Diff[] contains sufficient information to compute both the source and resulting document.
 */
type Diff = [number, string];

export default Diff;

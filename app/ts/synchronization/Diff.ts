/**
 * 
 */
// export type DiffOperation = 0 | 1 | -1;
export enum DiffOperation {
    DIFF_INSERT = +1,
    DIFF_EQUAL = 0,
    DIFF_DELETE = -1
}

/**
 * Diff is a two-element array.
 * The first element is the operation DELETE, EQUAL, INSERT (number).
 * The second element is the text (string).
 * 
 * When a diff is computed, the Diff[] contains sufficient information to compute both the source and resulting document.
 */

export type Diff = [DiffOperation, string];

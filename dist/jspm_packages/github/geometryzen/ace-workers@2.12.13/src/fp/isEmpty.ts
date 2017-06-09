/**
 * Determines whether the specified object has any keys.
 */
export function isEmpty(xs: any): boolean {
    return Object.keys(xs).length === 0;
}

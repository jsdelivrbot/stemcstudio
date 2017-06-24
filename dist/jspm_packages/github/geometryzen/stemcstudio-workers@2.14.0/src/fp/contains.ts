/**
 * Determines whether the array contains the specified element.
 */
export function contains<T>(xs: T[], element: T): boolean {
    for (const x of xs) {
        if (x === element) {
            return true;
        }
    }
    return false;
}

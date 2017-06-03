/**
 * Returns a subset of the elements of an array that DON'T satisfy a predicate.
 */
export function reject<T>(xs: T[], predicate: (x: T) => boolean): T[] {
    const result: T[] = [];
    for (const x of xs) {
        if (!predicate(x)) {
            result.push(x);
        }
    }
    return result;
}

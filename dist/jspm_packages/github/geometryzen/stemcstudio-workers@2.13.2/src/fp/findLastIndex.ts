/**
 *
 */
export function findLastIndex<T>(xs: T[], callback: (x: T) => boolean): number {
    for (let i = xs.length - 1; i >= 0; i--) {
        const x = xs[i];
        if (callback(x)) {
            return i;
        }
    }
    return -1;
}

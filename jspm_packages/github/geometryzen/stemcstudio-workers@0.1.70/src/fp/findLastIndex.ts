export default function findLastIndex<T>(xs: T[], callback: (x: T) => boolean): number {
    for (var i = xs.length - 1; i >= 0; i--) {
        var x = xs[i];
        if (callback(x)) {
            return i;
        }
    }
    return -1;
}
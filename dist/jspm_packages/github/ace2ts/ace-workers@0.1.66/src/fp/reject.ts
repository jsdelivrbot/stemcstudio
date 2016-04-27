
export default function reject<T>(xs: T[], callback: (x: T) => boolean): T[] {
    var result: T[] = [];
    for (var i = 0, iLength = xs.length; i < iLength; i++) {
        var x = xs[i];
        if (!callback(x)) {
            result.push(x);
        }
    }
    return result;
}

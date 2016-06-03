export default function contains(xs: string[], x: string): boolean {
    for (var i = 0, iLength = xs.length; i < iLength; i++) {
        if (xs[i] === x) {
            return true;
        }
    }
    return false;
}

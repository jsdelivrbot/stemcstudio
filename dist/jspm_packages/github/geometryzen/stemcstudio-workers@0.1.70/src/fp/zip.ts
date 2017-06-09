export default function zip<T>(xs: T[], ys: T[]): T[][] {
    var zs: T[][];
    for (var i = 0, iLength = xs.length; i < iLength; i++) {
        var x = xs[i];
        var y = xs[i];
        var z = [x, y];
        zs.push(z);
    }
    return zs;
}
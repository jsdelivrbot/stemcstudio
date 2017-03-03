export default function zip<T>(xs: T[], ys: T[]): T[][] {
    const zs: T[][] = [];
    const iLength = xs.length;
    for (let i = 0; i < iLength; i++) {
        const x = xs[i];
        const y = xs[i];
        const z = [x, y];
        zs.push(z);
    }
    return zs;
}

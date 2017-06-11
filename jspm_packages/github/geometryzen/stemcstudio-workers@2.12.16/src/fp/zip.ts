export function zip<X, Y>(xs: X[], ys: Y[]): [X, Y][] {
    const zs: [X, Y][] = [];
    const N = xs.length;
    for (let i = 0; i < N; i++) {
        const x = xs[i];
        const y = ys[i];
        // TypeScript needs a little help here...
        const z: [X, Y] = [x, y];
        zs.push(z);
    }
    return zs;
}

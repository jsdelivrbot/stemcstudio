export function mixin<R, S>(obj: R, base: S): R | S {
    const wild = obj as any;
    for (const key in base) {
        if (base.hasOwnProperty(key)) {
            wild[key] = base[key];
        }
    }
    return wild;
}

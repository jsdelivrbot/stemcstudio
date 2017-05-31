/**
 * Extends the first object using properties from the second.
 */
export function extend<R, S>(obj: R, x: S): R | S {
    const keys: string[] = Object.keys(x);
    for (const key of keys) {
        const prop = x[key];
        obj[key] = prop;
    }
    return obj;
}


export default function extend<T>(obj: T, x): T {
    const keys: string[] = Object.keys(x);
    for (const key of keys) {
        const prop = x[key];
        obj[key] = prop;
    }
    return obj;
}

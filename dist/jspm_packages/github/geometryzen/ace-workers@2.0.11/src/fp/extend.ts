
export default function extend<T>(obj: T, x): T {
    const keys: string[] = Object.keys(x);
    for (let i = 0, iLength = keys.length; i < iLength; i++) {
        const key = keys[i];
        const prop = x[key];
        obj[key] = prop;
    }
    return obj;
}

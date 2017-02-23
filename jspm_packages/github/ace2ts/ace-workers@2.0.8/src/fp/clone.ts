
export default function clone<T>(x: T): T {
    const keys: string[] = Object.keys(x);
    const result: any = {};
    for (let i = 0, iLength = keys.length; i < iLength; i++) {
        const key = keys[i];
        const prop = x[key];
        result[key] = prop;
    }
    return result;
}

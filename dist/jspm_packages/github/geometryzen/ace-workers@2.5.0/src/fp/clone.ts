
export default function clone<T>(x: T): T {
    const keys: string[] = Object.keys(x);
    const result: any = {};
    for (const key of keys) {
        const prop = x[key];
        result[key] = prop;
    }
    return result;
}

/**
 * Executes a callback function for each key-value pair in a map.
 */
export function each<T>(obj: { [key: string]: T } | null, callback: (value: T, key: string) => any): void {
    if (!obj) {
        return;
    }
    const keys = Object.keys(obj);
    for (const key of keys) {
        const value = obj[key];
        callback(value, key);
    }

}

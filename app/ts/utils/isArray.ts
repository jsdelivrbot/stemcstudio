export function isArray<T>(arg: T[]): arg is T[] {
    return Array.isArray(arg);
}

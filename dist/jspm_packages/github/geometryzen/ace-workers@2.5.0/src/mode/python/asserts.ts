export function assert(condition, message?) {
    if (!condition) {
        throw new Error(message);
    }
}

export function fail(message, unknown?: any, whatever?: any) {
    assert(false, message);
}

export function mustBeTruthy(condition: any, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}

export function mustBeFalsey(condition: any, message: string): void {
    if (condition) {
        throw new Error(message);
    }
}

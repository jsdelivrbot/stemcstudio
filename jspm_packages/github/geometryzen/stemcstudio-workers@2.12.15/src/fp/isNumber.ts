/**
 * Determines whether the argument is a number.
 */
export function isNumber(arg: any): arg is number {
    return typeof arg === 'number';
}

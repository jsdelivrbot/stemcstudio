/**
 * @param {string} s
 */
export function floatAST(s: string) {
    var thing: {
        text: string;
        value: number;
        isFloat: () => boolean;
        isInt: () => boolean;
        isLong: () => boolean;
        toString: () => string;
    } = {
            text: s,
            value: parseFloat(s),
            isFloat: function() { return true; },
            isInt: function() { return false; },
            isLong: function() { return false; },
            toString: function() {return s }
        };
    return thing;
}

/**
 * @param {number} n
 */
export function intAST(n: number) {
    var thing: {
        value: number;
        isFloat: () => boolean;
        isInt: () => boolean;
        isLong: () => boolean;
        toString: () => string;
    } = {
            value: n,
            isFloat: function() { return false; },
            isInt: function() { return true; },
            isLong: function() { return false; },
            toString: function() {return '' + n }
        };
    return thing;
}

/**
 * @param {string} s
 */
export function longAST(s: string, radix: number) {
    var thing: {
        text: string;
        radix: number;
        isFloat: () => boolean;
        isInt: () => boolean;
        isLong: () => boolean;
        toString: () => string;
    } = {
            text: s,
            radix: radix,
            isFloat: function() { return false; },
            isInt: function() { return false; },
            isLong: function() { return true; },
            toString: function() {return s }
        };
    return thing;
}

"use strict";

export var ENABLE_ASSERTS = true;

export class AssertionError implements Error {
    public name = 'AssertionError';
    public message;
    constructor(message, args) {
        this.message = message;
    }
}

function doAssertFailure(defaultMessage: string, defaultArgs, givenMessage: string, givenArgs) {
    var message = 'Assertion failed';
    if (givenMessage) {
        message += ': ' + givenMessage;
        var args = givenArgs;
    }
    else if (defaultMessage) {
        message += ': ' + defaultMessage;
        args = defaultArgs;
    }
    // The '' + works around an Opera 10 bug in the unit tests. Without it,
    // a stack trace is added to var message above. With this, a stack trace is
    // not added until this line (it causes the extra garbage to be added after
    // the assertion message instead of in the middle of it).
    throw new AssertionError('' + message, args || []);
}

export function assert(condition, message?, args?) {
    if (ENABLE_ASSERTS && !condition) {
        doAssertFailure('', null, message, Array.prototype.slice.call(arguments, 2));
    }
    return condition;
};

import asserts = require('./asserts');
import base = require('./base');

class TokenError
{
    public name: string = 'TokenError';
    public message: string;
    public fileName: string;
    public lineNumber: number;
    public columnNumber: number;

    constructor(message: string, fileName: string, lineNumber: number, columnNumber: number)
    {
        asserts.assert(base.isString(message), "message must be a string");
        asserts.assert(base.isString(fileName), "fileName must be a string");
        asserts.assert(base.isNumber(lineNumber), "lineNumber must be a number");
        asserts.assert(base.isNumber(columnNumber), "columnNumber must be a number");

        this.message = message;
        this.fileName = fileName;
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber;
    }
}

export = TokenError;
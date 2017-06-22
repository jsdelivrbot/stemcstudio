/* */ 
"format cjs";
import { CSVError } from './CSVError';
import { messages, ErrorCode } from './messages';
var COMMA = ',';
var SEMICOLON = ';';
var CR = '\r';
var LF = '\n';
var CRLF = CR + LF;
var APOS = "'";
var QUOTE = '"';
var SPACE = ' ';
var MINUS = '-';
var PLUS = '+';
var CsvState;
(function (CsvState) {
    CsvState[CsvState["START"] = 0] = "START";
    CsvState[CsvState["INTEGER"] = 1] = "INTEGER";
    CsvState[CsvState["DECIMAL"] = 2] = "DECIMAL";
    CsvState[CsvState["SCIENTIFIC"] = 3] = "SCIENTIFIC";
    CsvState[CsvState["APOS_STRING"] = 4] = "APOS_STRING";
    CsvState[CsvState["APOS_ESCAPE"] = 5] = "APOS_ESCAPE";
    CsvState[CsvState["QUOTE_STRING"] = 6] = "QUOTE_STRING";
    CsvState[CsvState["QUOTE_ESCAPE"] = 7] = "QUOTE_ESCAPE";
    /**
     * We've just seen the delimiter, usually a comma or a semicolon.
     */
    CsvState[CsvState["DELIM"] = 8] = "DELIM";
    CsvState[CsvState["ISO8601_HHMM"] = 9] = "ISO8601_HHMM";
    CsvState[CsvState["UNQUOTED_STRING"] = 10] = "UNQUOTED_STRING";
    CsvState[CsvState["EXPONENT"] = 11] = "EXPONENT";
    CsvState[CsvState["SIGNED_EXPONENT"] = 12] = "SIGNED_EXPONENT";
    CsvState[CsvState["NEGATIVE_INTEGER"] = 13] = "NEGATIVE_INTEGER";
    CsvState[CsvState["TRAILING_WHITESPACE"] = 14] = "TRAILING_WHITESPACE";
})(CsvState || (CsvState = {}));
function decodeState(state) {
    switch (state) {
        case CsvState.START: return "START";
        case CsvState.INTEGER: return "INTEGER";
        case CsvState.DECIMAL: return "DECIMAL";
        case CsvState.SCIENTIFIC: return "SCIENTIFIC";
        case CsvState.APOS_STRING: return "APOS_STRING";
        case CsvState.APOS_ESCAPE: return "APOS_ESCAPE";
        case CsvState.QUOTE_STRING: return "QUOTE_STRING";
        case CsvState.QUOTE_ESCAPE: return "QUOTE_ESCAPE";
        case CsvState.DELIM: return "DELIM";
        case CsvState.ISO8601_HHMM: return "ISO8601_HHMM";
        case CsvState.UNQUOTED_STRING: return "UNQUOTED_STRING";
        case CsvState.EXPONENT: return "EXPONENT";
        case CsvState.SIGNED_EXPONENT: return "SIGNED_EXPONENT";
        case CsvState.NEGATIVE_INTEGER: return "NEGATIVE_INTEGER";
        case CsvState.TRAILING_WHITESPACE: return "TRAILING_WHITESPACE";
    }
    throw new Error("decodeState(" + state + ")");
}
/**
 * Regular expression for detecting integers.
 */
var rxIsInt = /^\d+$/;
/**
 * Regular expression for detecting floating point numbers (with optional exponents).
 */
var rxIsFloat = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
// If a string has leading or trailing space,
// contains a comma double quote or a newline
// it needs to be quoted in CSV output
var rxNeedsQuoting = /^\s|\s$|,|"|\n/;
/**
 * A polyfill in case String.trim does not exist.
 */
var trim = (function () {
    // Fx 3.1 has a native trim function, it's about 10x faster, use it if it exists
    if (String.prototype.trim) {
        return function (s) {
            return s.trim();
        };
    }
    else {
        return function (s) {
            return s.replace(/^\s*/, '').replace(/\s*$/, '');
        };
    }
}());
/**
 *
 */
function chomp(s, lineterminator) {
    if (s.charAt(s.length - lineterminator.length) !== lineterminator) {
        // Does not end with \n, just return string.
        return s;
    }
    else {
        // Remove the newline.
        return s.substring(0, s.length - lineterminator.length);
    }
}
/**
 * Replaces all the funky line terminators with a single newline character.
 */
function normalizeLineTerminator(csvString, dialect) {
    if (dialect === void 0) { dialect = {}; }
    // Try to guess line terminator if it's not provided.
    if (!dialect.lineTerminator) {
        return csvString.replace(/(\r\n|\n|\r)/gm, '\n');
    }
    // if not return the string untouched.
    return csvString;
}
/**
 * Converts from the fields and records structure to an array of arrays.
 * The first row in the output contains the field names in the same order as the input.
 */
export function dataToArrays(data) {
    var arrays = [];
    var fieldIds = data.fields.map(function (field) { return field.id; });
    arrays.push(fieldIds);
    var _loop_1 = function (record) {
        var tmp = fieldIds.map(function (fieldId) { return record[fieldId]; });
        arrays.push(tmp);
    };
    for (var _i = 0, _a = data.records; _i < _a.length; _i++) {
        var record = _a[_i];
        _loop_1(record);
    }
    return arrays;
}
/**
 */
function normalizeDialectOptions(dialect) {
    // note lower case compared to CSV DDF.
    var options = {
        delim: COMMA,
        escape: true,
        lineTerm: LF,
        quoteChar: QUOTE,
        skipRows: 0,
        trim: true
    };
    if (dialect) {
        if (typeof dialect.fieldDelimiter === 'string') {
            switch (dialect.fieldDelimiter) {
                case COMMA:
                case SEMICOLON: {
                    options.delim = dialect.fieldDelimiter;
                    break;
                }
                default: {
                    throw new Error("Unexpected dialect field delimiter " + dialect.fieldDelimiter + ".");
                }
            }
        }
        if (typeof dialect.escapeEmbeddedQuotes === 'boolean') {
            options.escape = dialect.escapeEmbeddedQuotes;
        }
        if (typeof dialect.lineTerminator === 'string') {
            switch (dialect.lineTerminator) {
                case LF:
                case CR:
                case CRLF: {
                    options.lineTerm = LF;
                    break;
                }
                default: {
                    throw new Error("Unexpected dialect lineTerminator " + dialect.lineTerminator + ".");
                }
            }
        }
        if (typeof dialect.quoteChar === 'string') {
            switch (dialect.quoteChar) {
                case APOS:
                case QUOTE: {
                    options.quoteChar = dialect.quoteChar;
                    break;
                }
                default: {
                    throw new Error("Unexpected dialect quoteChar " + dialect.quoteChar + ".");
                }
            }
        }
        if (typeof dialect.skipInitialRows === 'number') {
            options.skipRows = dialect.skipInitialRows;
        }
        if (typeof dialect.trimFields === 'boolean') {
            options.trim = dialect.trimFields;
        }
    }
    return options;
}
// ## serialize
//
// See README for docs
//
// Heavily based on uselesscode's JS CSV serializer (MIT Licensed):
// http://www.uselesscode.org/javascript/csv/
/**
 * Converts from structured data to a string in CSV format of the specified dialect.
 */
export function serialize(data, dialect) {
    var a = (data instanceof Array) ? data : dataToArrays(data);
    var options = normalizeDialectOptions(dialect);
    var fieldToString = function fieldToString(field) {
        if (field === null) {
            // If field is null set to empty string
            field = '';
        }
        else if (typeof field === "string" && rxNeedsQuoting.test(field)) {
            if (options.escape) {
                // FIXME: May need to be the quote character?
                field = field.replace(/"/g, '""');
            }
            // Convert string to delimited string
            field = options.quoteChar + field + options.quoteChar;
        }
        else if (typeof field === "number") {
            // Convert number to string
            field = field.toString(10);
        }
        return field;
    };
    /**
     * Buffer for building up the output.
     */
    var outBuffer = '';
    for (var i = 0; i < a.length; i += 1) {
        /**
         * The fields we are currently processing.
         */
        var fields = a[i];
        /**
         * Buffer for building up the current row.
         */
        var rowBuffer = '';
        for (var j = 0; j < fields.length; j += 1) {
            /**
             * Buffer for building up the current field.
             */
            var fieldBuffer = fieldToString(fields[j]);
            // If this is EOR append row to output and flush row
            if (j === (fields.length - 1)) {
                rowBuffer += fieldBuffer;
                outBuffer += rowBuffer + options.lineTerm;
                rowBuffer = '';
            }
            else {
                // Add the current field to the current row
                rowBuffer += fieldBuffer + options.delim;
            }
        }
    }
    return outBuffer;
}
/**
 * Normalizes the line terminator across the file.
 */
function normalizeInputString(csvText, dialect) {
    // When line terminator is not provided then we try to guess it
    // and normalize it across the file.
    if (!dialect || (dialect && !dialect.lineTerminator)) {
        csvText = normalizeLineTerminator(csvText, dialect);
    }
    var options = normalizeDialectOptions(dialect);
    // Get rid of any trailing \n
    return { s: chomp(csvText, options.lineTerm), options: options };
}
/**
 * Parses a string representation of CSV data into an array of arrays of fields.
 * The dialect may be specified to improve the parsing.
 */
export function parse(csvText, dialect, errors) {
    var _a = normalizeInputString(csvText, dialect), s = _a.s, options = _a.options;
    var state = CsvState.START;
    /**
     * The length of the input string following normalization.
     * Using cached length of s will improve performance and is safe because s is constant.
     */
    var sLength = s.length;
    /**
     * The character we are currently processing.
     */
    var ch = '';
    var fieldQuoted = false;
    /**
     * Keep track of where a quotation mark begins for reporting unterminated string literals.
     */
    var quoteBegin = Number.MAX_SAFE_INTEGER;
    /**
     * The parsed current field
     */
    var field = '';
    /**
     * The parsed row.
     */
    var row = [];
    /**
     * The parsed output.
     */
    var out = [];
    /**
     * The 1-based line number.
     */
    var line = 1;
    /**
     * The zero-based column number.
     */
    var column = 0;
    /**
     * Helper function to parse a single field.
     */
    var parseField = function parseField(fieldAsString) {
        if (fieldQuoted) {
            return fieldAsString;
        }
        else {
            // If field is empty set to null
            if (fieldAsString === '') {
                return null;
                // If the field was not quoted and we are trimming fields, trim it
            }
            else if (options.trim) {
                fieldAsString = trim(fieldAsString);
            }
            // Convert unquoted numbers to their appropriate types
            if (rxIsInt.test(fieldAsString)) {
                return parseInt(fieldAsString, 10);
            }
            else if (rxIsFloat.test(fieldAsString)) {
                return parseFloat(fieldAsString);
            }
            else {
                // An example here is a heading which is not quoted.
                return fieldAsString;
            }
        }
    };
    var error = function (e) {
        if (errors) {
            errors.push(e);
        }
        else {
            throw e;
        }
    };
    for (var i = 0; i < sLength; i += 1) {
        ch = s.charAt(i);
        switch (state) {
            case CsvState.START: {
                switch (ch) {
                    case ' ': {
                        // Ignore whitespace.
                        break;
                    }
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9': {
                        field += ch;
                        state = CsvState.INTEGER;
                        break;
                    }
                    case QUOTE: {
                        quoteBegin = i;
                        state = CsvState.QUOTE_STRING;
                        break;
                    }
                    case APOS: {
                        state = CsvState.APOS_STRING;
                        break;
                    }
                    case PLUS: {
                        state = CsvState.INTEGER;
                        break;
                    }
                    case MINUS: {
                        field += ch;
                        state = CsvState.NEGATIVE_INTEGER;
                        break;
                    }
                    default: {
                        field += ch;
                        state = CsvState.UNQUOTED_STRING;
                    }
                }
                break;
            }
            case CsvState.INTEGER: {
                switch (ch) {
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9': {
                        field += ch;
                        break;
                    }
                    case '.': {
                        field += ch;
                        state = CsvState.DECIMAL;
                        break;
                    }
                    case ':': {
                        field += ch;
                        state = CsvState.ISO8601_HHMM;
                        break;
                    }
                    case 'e': {
                        field += ch;
                        state = CsvState.EXPONENT;
                        break;
                    }
                    case COMMA: {
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        state = CsvState.DELIM;
                        break;
                    }
                    case APOS: {
                        var msg = messages[ErrorCode.E001];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                        break;
                    }
                    case QUOTE: {
                        var msg = messages[ErrorCode.E002];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                        break;
                    }
                    case SPACE: {
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        state = CsvState.TRAILING_WHITESPACE;
                        break;
                    }
                    case LF: {
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        out.push(row);
                        row = [];
                        state = CsvState.START;
                        break;
                    }
                    case CR: {
                        // Do we want to support CRLF?
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        out.push(row);
                        row = [];
                        state = CsvState.START;
                        break;
                    }
                    default: {
                        var msg = messages[ErrorCode.E003];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                    }
                }
                break;
            }
            case CsvState.NEGATIVE_INTEGER: {
                switch (ch) {
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9': {
                        field += ch;
                        break;
                    }
                    case '.': {
                        field += ch;
                        state = CsvState.DECIMAL;
                        break;
                    }
                    default: {
                        var msg = messages[ErrorCode.E003];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                    }
                }
                break;
            }
            case CsvState.DECIMAL: {
                switch (ch) {
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9': {
                        field += ch;
                        break;
                    }
                    case 'e': {
                        field += ch;
                        state = CsvState.EXPONENT;
                        break;
                    }
                    case options.delim: {
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        state = CsvState.DELIM;
                        break;
                    }
                    case APOS: {
                        var msg = messages[ErrorCode.E001];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                        break;
                    }
                    case QUOTE: {
                        var msg = messages[ErrorCode.E002];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                        break;
                    }
                    case SPACE: {
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        state = CsvState.TRAILING_WHITESPACE;
                        break;
                    }
                    default: {
                        var msg = messages[ErrorCode.E003];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                    }
                }
                break;
            }
            case CsvState.APOS_STRING: {
                switch (ch) {
                    case APOS: {
                        state = CsvState.APOS_ESCAPE;
                        break;
                    }
                    default: {
                        field += ch;
                        break;
                    }
                }
                break;
            }
            case CsvState.QUOTE_STRING: {
                switch (ch) {
                    case QUOTE: {
                        state = CsvState.QUOTE_ESCAPE;
                        break;
                    }
                    default: {
                        field += ch;
                        break;
                    }
                }
                break;
            }
            case CsvState.QUOTE_ESCAPE: {
                switch (ch) {
                    case QUOTE: {
                        field += ch;
                        state = CsvState.QUOTE_STRING;
                        break;
                    }
                    case options.delim: {
                        row.push(field);
                        field = '';
                        state = CsvState.DELIM;
                        break;
                    }
                    case LF: {
                        row.push(field);
                        field = '';
                        out.push(row);
                        row = [];
                        state = CsvState.START;
                        break;
                    }
                    default: {
                        var msg = messages[ErrorCode.E003];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                    }
                }
                break;
            }
            case CsvState.APOS_ESCAPE: {
                switch (ch) {
                    case APOS: {
                        field += ch;
                        state = CsvState.APOS_STRING;
                        break;
                    }
                    case options.delim: {
                        row.push(field);
                        field = '';
                        state = CsvState.DELIM;
                        break;
                    }
                    case LF: {
                        row.push(field);
                        field = '';
                        out.push(row);
                        row = [];
                        state = CsvState.START;
                        break;
                    }
                    default: {
                        var msg = messages[ErrorCode.E003];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                    }
                }
                break;
            }
            case CsvState.DELIM: {
                switch (ch) {
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9': {
                        field += ch;
                        state = CsvState.INTEGER;
                        break;
                    }
                    case SPACE: {
                        break;
                    }
                    case PLUS: {
                        state = CsvState.INTEGER;
                        break;
                    }
                    case MINUS: {
                        field += ch;
                        state = CsvState.NEGATIVE_INTEGER;
                        break;
                    }
                    case QUOTE: {
                        quoteBegin = i;
                        state = CsvState.QUOTE_STRING;
                        break;
                    }
                    case APOS: {
                        quoteBegin = i;
                        state = CsvState.APOS_STRING;
                        break;
                    }
                    default: {
                        field += ch;
                        state = CsvState.UNQUOTED_STRING;
                    }
                }
                break;
            }
            case CsvState.ISO8601_HHMM: {
                switch (ch) {
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9': {
                        field += ch;
                        break;
                    }
                    case LF: {
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        out.push(row);
                        row = [];
                        state = CsvState.START;
                        break;
                    }
                    case CR: {
                        // Do we want to support CRLF?
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        out.push(row);
                        row = [];
                        state = CsvState.START;
                        break;
                    }
                    default: {
                        var msg = messages[ErrorCode.E003];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                    }
                }
                break;
            }
            case CsvState.UNQUOTED_STRING: {
                switch (ch) {
                    case options.delim: {
                        row.push(field);
                        field = '';
                        state = CsvState.DELIM;
                        break;
                    }
                    case LF: {
                        row.push(field);
                        field = '';
                        out.push(row);
                        row = [];
                        state = CsvState.START;
                        break;
                    }
                    case CR: {
                        row.push(field);
                        field = '';
                        out.push(row);
                        row = [];
                        state = CsvState.START;
                        break;
                    }
                    default: {
                        field += ch;
                    }
                }
                break;
            }
            case CsvState.EXPONENT: {
                switch (ch) {
                    case PLUS:
                    case MINUS: {
                        field += ch;
                        state = CsvState.SIGNED_EXPONENT;
                        break;
                    }
                    case SPACE: {
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        state = CsvState.TRAILING_WHITESPACE;
                        break;
                    }
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9': {
                        field += ch;
                        break;
                    }
                    default: {
                        var msg = messages[ErrorCode.E003];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                    }
                }
                break;
            }
            case CsvState.SIGNED_EXPONENT: {
                switch (ch) {
                    case SPACE: {
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        state = CsvState.TRAILING_WHITESPACE;
                        break;
                    }
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9': {
                        field += ch;
                        break;
                    }
                    case LF: {
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        out.push(row);
                        row = [];
                        state = CsvState.START;
                        break;
                    }
                    case CR: {
                        field = parseField(field);
                        row.push(field);
                        field = '';
                        out.push(row);
                        row = [];
                        state = CsvState.START;
                        break;
                    }
                    default: {
                        var msg = messages[ErrorCode.E003];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                    }
                }
                break;
            }
            case CsvState.TRAILING_WHITESPACE: {
                switch (ch) {
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9': {
                        var msg = messages[ErrorCode.E004];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                        break;
                    }
                    default: {
                        var msg = messages[ErrorCode.E003];
                        error(new CSVError(msg.code, msg.desc, i, line, column));
                    }
                }
                break;
            }
            default: {
                throw new Error("Unexpected state " + decodeState(state) + " at " + i + " for " + s);
            }
        }
    }
    // We've reached the end of the string.
    switch (state) {
        case CsvState.INTEGER: {
            // Add the last field
            field = parseField(field);
            row.push(field);
            field = '';
            out.push(row);
            row = [];
            break;
        }
        case CsvState.DECIMAL: {
            // Add the last field
            field = parseField(field);
            row.push(field);
            field = '';
            out.push(row);
            row = [];
            break;
        }
        case CsvState.EXPONENT:
        case CsvState.SIGNED_EXPONENT: {
            // Add the last field
            field = parseField(field);
            row.push(field);
            field = '';
            out.push(row);
            row = [];
            break;
        }
        case CsvState.APOS_ESCAPE: {
            // It's not actually an escape that we saw, but the end of the apostrophe delimited string.
            // Add the last field
            field = parseField(field);
            row.push(field);
            field = '';
            out.push(row);
            row = [];
            break;
        }
        case CsvState.QUOTE_ESCAPE: {
            // It's not actually an escape that we saw, but the end of the quote delimited string.
            // Add the last field
            field = parseField(field);
            row.push(field);
            field = '';
            out.push(row);
            row = [];
            break;
        }
        case CsvState.ISO8601_HHMM: {
            // Add the last field
            field = parseField(field);
            row.push(field);
            field = '';
            out.push(row);
            row = [];
            break;
        }
        case CsvState.DELIM: {
            row.push(null);
            field = '';
            out.push(row);
            row = [];
            break;
        }
        case CsvState.APOS_STRING: {
            var msg = messages[ErrorCode.E005];
            error(new CSVError(msg.code, msg.desc, quoteBegin, line, column));
            break;
        }
        case CsvState.QUOTE_STRING: {
            var msg = messages[ErrorCode.E006];
            error(new CSVError(msg.code, msg.desc, quoteBegin, line, column));
            break;
        }
        case CsvState.START: {
            // Do nothing?
            break;
        }
        case CsvState.TRAILING_WHITESPACE: {
            // Do nothing?
            break;
        }
        default: {
            throw new Error("Unexpected end state " + decodeState(state) + " " + s);
        }
    }
    // Expose the ability to discard initial rows
    if (options.skipRows)
        out = out.slice(options.skipRows);
    return out;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ1NWLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9DU1YudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLFlBQVksQ0FBQztBQTBEakQsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLElBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUV0QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDaEIsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLElBQU0sSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDckIsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNsQixJQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDbEIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUVqQixJQUFLLFFBbUJKO0FBbkJELFdBQUssUUFBUTtJQUNULHlDQUFTLENBQUE7SUFDVCw2Q0FBVyxDQUFBO0lBQ1gsNkNBQVcsQ0FBQTtJQUNYLG1EQUFjLENBQUE7SUFDZCxxREFBZSxDQUFBO0lBQ2YscURBQWUsQ0FBQTtJQUNmLHVEQUFnQixDQUFBO0lBQ2hCLHVEQUFnQixDQUFBO0lBQ2hCOztPQUVHO0lBQ0gseUNBQVMsQ0FBQTtJQUNULHVEQUFnQixDQUFBO0lBQ2hCLDhEQUFvQixDQUFBO0lBQ3BCLGdEQUFhLENBQUE7SUFDYiw4REFBb0IsQ0FBQTtJQUNwQixnRUFBcUIsQ0FBQTtJQUNyQixzRUFBd0IsQ0FBQTtBQUM1QixDQUFDLEVBbkJJLFFBQVEsS0FBUixRQUFRLFFBbUJaO0FBRUQscUJBQXFCLEtBQWU7SUFDaEMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFD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
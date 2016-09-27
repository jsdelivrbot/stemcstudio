import { copyObject, escapeRegExp, getMatchOffsets } from "./lib/lang";
import { mixin } from "./lib/oop";
import LineFilter from './LineFilter';
import MatchHandler from './MatchHandler';
import MatchOffset from './lib/MatchOffset';
import Position from './Position';
import Range from "./Range";
import SearchOptions from "./SearchOptions";
import EditSession from "./EditSession";

/**
 * A class designed to handle all sorts of text searches within a [[Document `Document`]].
 */
export default class Search {

    /**
     *
     */
    $options: SearchOptions;
    /**
     * Creates a new `Search` object. The following search options are avaliable:
     *
     * - `needle`: The string or regular expression you're looking for
     * - `backwards`: Whether to search backwards from where cursor currently is. Defaults to `false`.
     * - `wrap`: Whether to wrap the search back to the beginning when it hits the end. Defaults to `false`.
     * - `caseSensitive`: Whether the search ought to be case-sensitive. Defaults to `false`.
     * - `wholeWord`: Whether the search matches only on whole words. Defaults to `false`.
     * - `range`: The [[Range]] to search within. Set this to `null` for the whole document
     * - `regExp`: Whether the search is a regular expression or not. Defaults to `false`.
     * - `start`: The starting [[Range]] or cursor position to begin the search
     * - `skipCurrent`: Whether or not to include the current line in the search. Default to `false`.
     */
    constructor() {
        this.$options = {};
    }

    /**
     * Sets the search options via the `options` parameter.
     *
     * @param options An object containing all the new search properties.
     */
    set(options: SearchOptions): Search {
        mixin(this.$options, options);
        return this;
    }

    /**
     * Returns an object containing all the search options.
     */
    getOptions(): SearchOptions {
        return copyObject(this.$options);
    }

    /**
     * Sets the search options via the `options` parameter.
     *
     * @param options An object containing all the search properties.
     */
    setOptions(options: SearchOptions): void {
        this.$options = options;
    }

    /**
     * Searches for `options.needle`.
     * If found, this method returns the Range where the text first occurs.
     * If `options.backwards` is `true`, the search goes backwards in the session.
     *
     * @param session The session to search with.
     */
    find(session: EditSession): Range {
        const options = this.$options;
        const matches = $matchIterator(session, options);

        if (typeof matches === 'boolean') {
            // Presumably eliminates the boolean case?
            return void 0;
        }
        else {
            let firstRange: Range = null;
            // Note: row and startIndex in the callback go with the first callback argument being a MatchOffset.
            matches.forEach(function (range: MatchOffset | Range, row: number, startIndex: number): boolean {
                if (range instanceof Range) {
                    firstRange = range;
                }
                else {
                    const column = range.offset + (startIndex || 0);
                    firstRange = new Range(row, column, row, column + range.length);
                    if (!range.length && options.start && options.start.start && options.skipCurrent !== false && firstRange.isEqual(options.start)) {
                        firstRange = null;
                        return false;
                    }
                }
                return true;
            });
            return firstRange;
        }
    }

    /**
     * Searches for all occurances `options.needle`.
     * If found, this method returns an array of [[Range `Range`s]] where the text first occurs.
     * If `options.backwards` is `true`, the search goes backwards in the session.
     *
     * @param session The session to search with.
     */
    findAll(session: EditSession): Range[] {

        const options: SearchOptions = this.$options;

        if (!options.needle) {
            // If we are not looking for anything, return an empty array of Range(s).
            return [];
        }

        // The side-effect of this call is mutation of the options.
        assembleRegExp(options);

        const range: Range = options.range;
        const lines: string[] = range ? session.getLines(range.start.row, range.end.row) : session.doc.getAllLines();

        let ranges: Range[] = [];
        if (options.$isMultiLine) {
            // When multiLine, re is an array of RegExp.
            const re = <RegExp[]>options.re;
            var len = re.length;
            var maxRow = lines.length - len;
            var prevRange: Range;
            // TODO: What is this offset property?
            outer: for (var row = re['offset'] || 0; row <= maxRow; row++) {
                for (var j = 0; j < len; j++)
                    if (lines[row + j].search(re[j]) === -1)
                        continue outer;

                var startLine = lines[row];
                var line = lines[row + len - 1];
                var startIndex = startLine.length - startLine.match(re[0])[0].length;
                var endIndex = line.match(re[len - 1])[0].length;

                if (prevRange && prevRange.end.row === row && prevRange.end.column > startIndex) {
                    continue;
                }
                ranges.push(prevRange = new Range(
                    row, startIndex, row + len - 1, endIndex
                ));
                if (len > 2)
                    row = row + len - 2;
            }
        }
        else {
            // TODO: How did we eliminate the case when options.re is false (boolean)?
            const re = <RegExp>options.re;
            for (let i = 0; i < lines.length; i++) {
                var matches = getMatchOffsets(lines[i], re);
                for (var j = 0; j < matches.length; j++) {
                    var match = matches[j];
                    ranges.push(new Range(i, match.offset, i, match.offset + match.length));
                }
            }
        }

        if (range) {
            var startColumn = range.start.column;
            var endColumn = range.start.column;
            var i = 0, j = ranges.length - 1;
            while (i < j && ranges[i].start.column < startColumn && ranges[i].start.row === range.start.row)
                i++;

            while (i < j && ranges[j].end.column > endColumn && ranges[j].end.row === range.end.row)
                j--;

            ranges = ranges.slice(i, j + 1);
            for (i = 0, j = ranges.length; i < j; i++) {
                ranges[i].start.row += range.start.row;
                ranges[i].end.row += range.start.row;
            }
        }

        return ranges;
    }

    /**
     * Searches for `options.needle` in `input`, and, if found, replaces it with `replacement`.
     *
     * @method replace
     * @param {String} input The text to search in
     * @param {String} replacement The replacing text
     * + (String): If `options.regExp` is `true`, this function returns `input` with the replacement already made. Otherwise, this function just returns `replacement`.<br/>
     * If `options.needle` was not found, this function returns `null`.
     * @return {String}
     */
    replace(input: string, replacement: string): string {
        const options = this.$options;

        const re: boolean | RegExp | RegExp[] = assembleRegExp(options);
        if (options.$isMultiLine) {
            // This eliminates the RegExp[]
            return replacement;
        }

        if (!re) {
            // Presumably, the boolean is always false?
            return;
        }

        const match: RegExpExecArray = (<RegExp>re).exec(input);
        if (!match || match[0].length !== input.length) {
            return null;
        }

        replacement = input.replace(<RegExp>re, replacement);
        if (options.preserveCase) {
            var parts: string[] = replacement.split("");
            for (var i = Math.min(input.length, input.length); i--;) {
                var ch = input[i];
                if (ch && ch.toLowerCase() !== ch)
                    parts[i] = parts[i].toUpperCase();
                else
                    parts[i] = parts[i].toLowerCase();
            }
            replacement = parts.join("");
        }

        return replacement;
    }
}

function $matchIterator(session: EditSession, options: SearchOptions): boolean | { forEach: (callback: MatchHandler) => void } {
    var re: boolean | RegExp | RegExp[] = assembleRegExp(options);

    if (!re) {
        // This eliminates the case where re is a boolean.
        return false;
    }

    let callback: MatchHandler;
    const backwards = options.backwards;
    let lineFilter: LineFilter;
    if (options.$isMultiLine) {
        const len = (<RegExp[]>re).length;
        lineFilter = function (line: string, row: number, offset: number) {
            const startIndex = line.search(re[0]);
            if (startIndex === -1)
                return;
            for (let i = 1; i < len; i++) {
                line = session.getLine(row + i);
                if (line.search(re[i]) === -1)
                    return;
            }

            const endIndex = line.match(re[len - 1])[0].length;

            const range = new Range(row, startIndex, row + len - 1, endIndex);
            // FIXME: What's going on here?
            if ((<RegExp[]>re)['offset'] === 1) {
                range.start.row--;
                range.start.column = Number.MAX_VALUE;
            }
            else if (offset)
                range.start.column += offset;

            if (callback(range))
                return true;
        };
    }
    else if (backwards) {
        lineFilter = function (line: string, row: number, startIndex: number): boolean {
            const matches = getMatchOffsets(line, <RegExp>re);
            for (let i = matches.length - 1; i >= 0; i--)
                if (callback(matches[i], row, startIndex))
                    return true;
        };
    }
    else {
        lineFilter = function (line: string, row: number, startIndex: number): boolean {
            const matches = getMatchOffsets(line, <RegExp>re);
            for (let i = 0; i < matches.length; i++)
                if (callback(matches[i], row, startIndex)) {
                    return true;
                }
        };
    }

    return {
        forEach: (_callback) => {
            callback = _callback;
            $lineIterator(session, options).forEach(lineFilter);
        }
    };
}

/**
 * 
 */
export function assembleRegExp(options: SearchOptions, $disableFakeMultiline?: boolean): boolean | RegExp | RegExp[] {

    if (!options.needle) {
        options.re = false;
    }
    else if (options.needle instanceof RegExp) {
        options.re = <RegExp>options.needle;
    }
    else if (typeof options.needle === 'string') {

        let needleString = <string>options.needle;

        // TODO: Is this a BUG?
        if (!options.regExp) {
            needleString = escapeRegExp(needleString);
        }

        if (options.wholeWord) {
            needleString = "\\b" + needleString + "\\b";
        }

        const modifier: string = options.caseSensitive ? "g" : "gi";

        options.$isMultiLine = !$disableFakeMultiline && /[\n\r]/.test(needleString);
        if (options.$isMultiLine) {
            return options.re = $assembleMultilineRegExp(needleString, modifier);
        }

        try {
            options.re = new RegExp(needleString, modifier);
        }
        catch (e) {
            options.re = false;
        }
    }
    else {
        throw new Error(`typeof options.needle => ${typeof options.needle}`);
    }
    return options.re;
}

function $assembleMultilineRegExp(needle: string, modifier: string): RegExp[] {
    const parts: string[] = needle.replace(/\r\n|\r|\n/g, "$\n^").split("\n");
    const re: RegExp[] = [];
    for (let i = 0; i < parts.length; i++) {
        try {
            re.push(new RegExp(parts[i], modifier));
        }
        catch (e) {
            return void 0;
        }
    }
    // FIXME: We're sneaking a property onto the array of RegExp.
    // Better to return a class with {offset: number; regExps: RegExp[]}
    if (parts[0] === "") {
        re.shift();
        re['offset'] = 1;
    }
    else {
        re['offset'] = 0;
    }
    return re;
}

function $lineIterator(session: EditSession, options: SearchOptions): { forEach: (lineFilter: LineFilter) => void } {
    const backwards = options.backwards === true;

    const startPos = getStartPosition(session, options);

    const range = options.range;
    let firstRow = range ? range.start.row : 0;
    let lastRow = range ? range.end.row : session.getLength() - 1;

    const forEach = backwards ? function (lineFilter: LineFilter) {
        let row = startPos.row;

        const line = session.getLine(row).substring(0, startPos.column);
        if (lineFilter(line, row)) {
            return;
        }

        for (row--; row >= firstRow; row--)
            if (lineFilter(session.getLine(row), row)) {
                return;
            }

        if (options.wrap === false)
            return;

        for (row = lastRow, firstRow = startPos.row; row >= firstRow; row--)
            if (lineFilter(session.getLine(row), row)) {
                return;
            }
    } : function (callback: LineFilter) {
        let row = startPos.row;

        const line = session.getLine(row).substr(startPos.column);
        if (callback(line, row, startPos.column))
            return;

        for (row = row + 1; row <= lastRow; row++)
            if (callback(session.getLine(row), row))
                return;

        if (options.wrap === false)
            return;

        for (row = firstRow, lastRow = startPos.row; row <= lastRow; row++)
            if (callback(session.getLine(row), row))
                return;
    };

    return { forEach: forEach };
}

/**
 * Returns the appropriate property of the range (start or end) according to the
 * direction of the search and whether the currently selected range should be skipped.
 */
function getRangePosition(range: Range, options: SearchOptions): Position {
    const backwards = options.backwards === true;
    const skipCurrent = options.skipCurrent !== false;
    return skipCurrent !== backwards ? range.end : range.start;
}

function getStartPosition(session: EditSession, options: SearchOptions): Position {
    const backwards = options.backwards === true;
    if (!options.start) {
        if (options.range) {
            // TODO: Why doesn't options.range follow the same rules using skipCurrent?
            return backwards ? options.range.end : options.range.start;
        }
        else {
            return getRangePosition(session.selection.getRange(), options);
        }
    }
    else {
        return getRangePosition(options.start, options);
    }
}

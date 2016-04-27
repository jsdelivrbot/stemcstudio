import Range from './Range';
import Position from './Position';

/**
 * @class SearchOptions
 */
interface SearchOptions {

    /**
     * @property needle
     * @type string | RegExp
     * @optional
     */
    needle?: string | RegExp;

    /**
     * @property range
     * @type range
     * @optional
     */
    range?: Range;

    /**
     * @property backwards
     * @type boolean
     * @optional
     */
    backwards?: boolean;

    /**
     * @property $isMultiLine
     * @type boolean
     * @optional
     */
    $isMultiLine?: boolean;

    /**
     * A multi-line search will have an array of regular expressions.
     * TODO: Better to separate these out for type-safety purposes.
     */
    re?: /*boolean | RegExp | RegExp[]*/any;
    regExp?: RegExp;

    /**
     * TODO: Possible BUG duplicating caseSensitive property?
     *
     * @property preserveCase
     * @type boolean
     * @optional
     */
    preserveCase?: boolean;

    /**
     * @property caseSensitive
     * @type boolean
     * @optional
     */
    caseSensitive?: boolean;

    /**
     * @property wholeWord
     * @type boolean
     * @optional
     */
    wholeWord?: boolean;

    /**
     * @property skipCurrent
     * @type boolean
     * @optional
     */
    skipCurrent?: boolean;


    /**
     * @property wrap
     * @type boolean
     * @optional
     */
    wrap?: boolean;

    /**
     * @property start
     * @type Position
     * @optional
     */
    start?: Position;

    /**
     * @property preventScroll
     * @type boolean
     * @optional
     */
    preventScroll?: boolean;
}

export default SearchOptions;
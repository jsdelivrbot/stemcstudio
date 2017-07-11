import { RangeBasic as Range } from '../editor/RangeBasic';

/**
 *
 */
export interface SearchOptions {

    /**
     * The string or regular expression you're looking for.
     */
    needle?: string | RegExp;

    /**
     *  The Range to search within. Set this to null for the whole document.
     */
    range?: Range;

    /**
     * The starting Range or cursor position to begin the search.
     * The existing selection range.
     */
    start?: Range;

    /**
     * Whether to search backwards from where cursor currently is. Defaults to false.
     */
    backwards?: boolean;

    /**
     *
     */
    $isMultiLine?: boolean;

    /**
     * A multi-line search will have an array of regular expressions.
     */
    re?: boolean | RegExp | RegExp[] | undefined;

    /**
     * Whether the search is a regular expression or not. Defaults to false.
     * SearchBox sets this to a boolean to indicate the state of the Regular Expression toggle.
     */
    regExp?: boolean;

    /**
     * TODO: Possible BUG duplicating caseSensitive property?
     */
    preserveCase?: boolean;

    /**
     * Whether the search ought to be case-sensitive. Defaults to false.
     */
    caseSensitive?: boolean;

    /**
     * Whether the search matches only on whole words. Defaults to false.
     */
    wholeWord?: boolean;

    /**
     * Whether or not to include the current line in the search. Default to false.
     */
    skipCurrent?: boolean;


    /**
     * Whether to wrap the search back to the beginning when it hits the end. Defaults to false.
     */
    wrap?: boolean;

    /**
     *
     */
    preventScroll?: boolean;
}

//
// Rules are defined by various language modes.
// The Tokenizer seems to be the main consumer of the Rule.
// Therefore, the Tokenizer would appear to be the authority on the type definition for Rule.
//

/**
 * A rule token is the token as it is defined in the highlighter rules.
 * 
 * From the Wiki (https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode)...
 * 
 * For flat regex matches, token should be a String,
 * or a Function that takes a single argument (the match) and returns a string token.
 * 
 * For grouped regex, token can be a String, in which case all matched groups are given that same token.
 * It can be an Array (of the same length as the number of groups), whereby matches are given the token
 * of the same alignment as in the match.
 * For a function, the Function should take the same number of arguments as there are groups, and return an array of tokens as per before.
 * 
 * TODO: It would appear that the return type should be string or string[], or perhaps the generic counterparts.
 * FIXME: It appears that RuleToken can also be a T[]
 * TODO: Do we need to split this into a design-time and run-time version?
 */
export type RuleToken<T, E, S extends Array<string | E>> = string | string[] | T | T[] | ((value: string, state: string, stack: S) => any) | null | undefined;

/**
 * The type patameter T is for the token.
 * The type parameter E is the type for the stack entry.
 * The type parameter S is the type for the stack, which may be more than just an array
 * In normal tokenizing the stack entry is a string.
 */
export interface Rule<T, E, S extends Array<string | E>> {

    /**
     * Legacy?
     */
    stateName?: string;

    /**
     * Allows the tokenizer to ignore case when matching the rule.
     */
    caseInsensitive?: boolean;

    /**
     * The token returned if nothing matches in the tokenizer.
     * FIXME: Is this too general?
     */
    // defaultToken?: string | string[] | ((value: any, state: string, stack: string[]) => any);
    defaultToken?: string | RuleToken<T, E, S>;

    /**
     *
     */
    include?: string;

    /**
     * 
     */
    keywordMap?: { [key: string]: string };

    /**
     * FIXME: It could be that next and nextState are the same thing?
     * FIXME: Should this be an E? The type error in (TextHighlightRules) pushState suggests E | undefined
     */
    nextState?: E;/* | Rule[] | ((currentState: string, stack: string[]) => string);*/

    /**
     *
     */
    noEscape?: boolean;

    /**
     *
     */
    onMatch?: ((value: string, state: string, stack: S, line?: string) => any) | null;

    /**
     *
     */
    processed?: boolean;

    /**
     * TODO: Should next and push look similar?
     */
    next?: E | Rule<T, E, S>[] | ((currentState: string, stack: S) => number | string);

    /**
     *
     */
    push?: string | Rule<T, E, S>[];

    /**
     * Regular expressions can either be a RegExp or String definition.
     * According to the Wiki, string is the standard representation of a RegExp here.
     * If using a stringed regular expression, every '\' (backslash) character must be escaped.
     */
    regex?: string | RegExp;

    /**
     * 
     */
    rules?: { [stateName: string]: Rule<T, E, S>[] };

    /**
     *
     */
    splitRegex?: RegExp;

    /**
     * The token may be a string, or a string[], or a function (like an onMatch).
     * The token is used to markup the text by wrapping in a <span class="ace_{token}"> tag.
     * Note that all tokens are prefixed by the "ace_" prefix.
     */
    token?: RuleToken<T, E, S>;

    /**
     *
     */
    tokenArray?: string[] | T[];

    /**
     *
     */
    merge?: boolean;
}

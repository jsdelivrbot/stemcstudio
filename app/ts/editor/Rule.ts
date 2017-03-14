//
// Rules are defined by various language modes.
// The Tokenizer seems to be the main consumer of the Rule.
// Therefore, the Tokenizer would appear to be the authority on the type definition for Rule.
//

export type RuleToken<T, E, S extends Array<string | E>> = string | string[] | ((value: string, state: string, stack: S) => any) | null | undefined;

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
     *
     */
    caseInsensitive?: boolean;

    /**
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
     */
    nextState?: string;/* | Rule[] | ((currentState: string, stack: string[]) => string);*/

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
     *
     */
    push?: string | Rule<T, E, S>[];

    /**
     *
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
     */
    token?: RuleToken<T, E, S>;

    /**
     *
     */
    tokenArray?: string[];

    /**
     *
     */
    next?: E | Rule<T, E, S>[] | ((currentState: string, stack: S) => number | string);

    /**
     *
     */
    merge?: boolean;
}

export default Rule;

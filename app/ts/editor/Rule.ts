//
// Rules are defined by various language modes.
// The Tokenizer seems to be the main consumer of the Rule.
// Therefore, the Tokenizer would appear to be the authority on the type definition for Rule.
//

/**
 *
 */
interface Rule {

    /**
     *
     */
    caseInsensitive?: boolean;

    /**
     * FIXME: Is this too general?
     */
    defaultToken?: string | string[] | ((value: any, state: string, stack: string[]) => any);

    /**
     *
     */
    include?: string;

    /**
     * FIXME: It could be that next and nextState are the same thing?
     */
    nextState?: string;/* | Rule[] | ((currentState: string, stack: string[]) => string);*/

    /**
     *
     */
    noEscape?: boolean;

    /**
     * FIXME: Something strange going on with SnippetManager and the stack?
     *        TypeScript 2.0 really starts to complain!
     */
    onMatch?: (value, state: string, stack: string[]) => any;

    /**
     *
     */
    processed?: boolean;

    /**
     *
     */
    push?: string | Rule[];

    /**
     *
     */
    regex?: string | RegExp;

    /**
     *
     */
    splitRegex?: RegExp;

    /**
     * The token may be a string, or a string[], or a function (like an onMatch).
     */
    token?: string | string[] | ((value: any, state: string, stack: string[]) => any);

    /**
     *
     */
    tokenArray?: any;

    /**
     * The Tokenizer believes that this is either a string or a function.
     * I think the stack should be a string[]
     */
    next?: string | ((currentState: string, stack: string[]) => string);

    /**
     *
     */
    merge?: boolean;
}

export default Rule;

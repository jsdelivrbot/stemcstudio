//
// Rules are defined by various language modes.
// The Tokenizer seems to be the main consumer of the Rule.
// Therefore, the Tokenizer would appear to be the authority on the type definition for Rule.
//

export type RuleToken = string | string[] | ((value: any, state: string, stack: string[]) => any) | null | undefined;

/**
 *
 */
export interface Rule {

    /**
     *
     */
    caseInsensitive?: boolean;

    /**
     * FIXME: Is this too general?
     */
    // defaultToken?: string | string[] | ((value: any, state: string, stack: string[]) => any);
    defaultToken?: string;

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
     * FIXME: Something strange going on with SnippetManager and the stack?
     *        TypeScript 2.0 really starts to complain!
     */
    onMatch?: ((value: string, state: string, stack: string[]) => any) | null;

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
    rules?: { [stateName: string]: Rule[] };

    /**
     *
     */
    splitRegex?: RegExp;

    /**
     * The token may be a string, or a string[], or a function (like an onMatch).
     */
    token?: RuleToken;

    /**
     *
     */
    tokenArray?: string[];

    /**
     * The Tokenizer believes that this is either a string or a function.
     * I think the stack should be a string[]
     */
    next?: string | Rule[] | ((currentState: string, stack: string[]) => string);

    /**
     *
     */
    merge?: boolean;
}

export default Rule;

//
// Rules are defined by various language modes.
// The Tokenizer seems to be the main consumer of the Rule.
// Therefore, the Tokenizer would appear to be the authority on the type definition for Rule.
//
/**
 * @class Rule
 */
interface Rule {

    /**
     * @property caseInsensitive
     * @type boolean
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
     */
    onMatch?: (value, state: string, stack: string[]) => any;

    /**
     * @property processed
     * @type boolean
     */
    processed?: boolean;

    /**
     *
     */
    push?: string | Rule[];

    /**
     * @property regex
     * @type string | RegExp
     */
    regex?: string | RegExp;

    /**
     * @property splitRegEx
     * @type RegExp
     */
    splitRegex?: RegExp;

    /**
     * The token may be a string, or a string[], or a function (like an onMatch).
     *
     * @property token
     * @type string | string[] | function(value: any, state: string, stack: any[]): any
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
     * @property merge
     * @type boolean
     */
    merge?: boolean;
}

export default Rule;

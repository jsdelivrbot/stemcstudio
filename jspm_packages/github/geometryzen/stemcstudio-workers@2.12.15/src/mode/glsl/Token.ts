import LeftDenotation from './LeftDenotation';
import NullDenotation from './NullDenotation';

/**
 * Every token inherits from a symbol (Pratt).
 *
 * Tokens are objects that bear methods that allow them to make precedence decisions,
 * match other tokens, and build trees (and in a more ambitious project also check types,
 * optimize and generate code).
 */
interface Token {
    type?: string;  // "name", "string", "number" or "operator" etc.
    data?: string;  // the value member, might be a string or number?
    lbp?: number;
    led?: LeftDenotation;
    nud?: NullDenotation;
    position?: number;
    line?: number;
    column?: number;
    /**
     * Used for storing whitespace.
     */
    preceding?: Token[];
    /**
     * Used for storing whitespace.
     */
    succeeding?: Token[];
}

export default Token;

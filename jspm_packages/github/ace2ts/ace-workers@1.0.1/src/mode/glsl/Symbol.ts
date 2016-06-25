import LeftDenotation from './LeftDenotation'
import NullDenotation from './NullDenotation'
import Token from './Token'

interface Symbol {
    id: string;
    /**
     * Left Binding Power
     */
    lbp: number;
    led: LeftDenotation;
    nud: NullDenotation;
    token: Token;
    /**
     * Crockford uses first, and second, and third (for the ternary operator).
     */
    children: Symbol[];
    /**
     * Crockford calls this the arity.
     */
    type: string;
    data: string;
    assignment: boolean;
}

export default Symbol

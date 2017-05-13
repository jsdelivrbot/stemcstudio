import LeftDenotation from './LeftDenotation';
import NullDenotation from './NullDenotation';

interface Symbol {
    /**
     * The id may be
     * (ident), (keyword), (builtin), (literal), (end), ...
     * closing braces or punctuation, ...
     * operators.
     */
    id: string;
    /**
     * Left Binding Power
     */
    lbp: number;
    /**
     * Handle infix operators, and suffix.
     */
    led: LeftDenotation;
    /**
     * Handle prefix operators, variables and literals.
     */
    nud: NullDenotation;
}

export default Symbol;

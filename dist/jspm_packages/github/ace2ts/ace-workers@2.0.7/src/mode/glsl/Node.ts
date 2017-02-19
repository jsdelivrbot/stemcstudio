import Token from './Token'
import LeftDenotation from './LeftDenotation'
import NullDenotation from './NullDenotation'

interface Node {
    mode: number;
    data?: string;
    lbp?: number;
    led?: LeftDenotation;
    nud?: NullDenotation;
    token: Token;
    children: Node[];
    type: string;
    // type: 'binary' | 'unary' | 'ternary' | 'suffix' | 'assign' | 'builtin' | 'call' | 'decl' | 'decllist' | 'expr' | 'forloop' | 'function' | 'functionargs' | 'ident' | 'keyword' | 'literal' | 'placeholder' | 'precision' | 'stmt' | 'stmtlist';
    id: string;
    expecting?: string;
    flags?: number;
    parent?: Node;
    allow_assign?: boolean;
    allow_comma?: boolean;
    assignment?: boolean;
}

export default Node

import Node from './Node';
import Scope from './Scope';
import Token from './Token';

interface Hybrid {
    id: string;
    mode: number;
    type: string;
    // type: 'binary' | 'unary' | 'ternary' | 'suffix' | 'assign' | 'builtin' | 'call' | 'decl' | 'decllist' | 'expr' | 'forloop' | 'function' | 'functionargs' | 'ident' | 'keyword' | 'literal' | 'placeholder' | 'precision' | 'stmt' | 'stmtlist';
    scope: Scope;
    brace?: boolean;
    bracelevel?: number;
    parenlevel?: number;
    data?: string;
    expecting?: string;
    tokens?: Token[];
    flags?: number;
    collected_name?: Token;
    stage?: number;
    children: Node[];
    token: Token;
    length: number;
    [x: number]: Hybrid;
    assignment?: boolean;
}

export default Hybrid;

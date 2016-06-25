import Node from './Node';
import Scope from './Scope';
import Token from './Token';

interface Hybrid {
    id: string;
    mode: number;
    type: string;
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
}

export default Hybrid;

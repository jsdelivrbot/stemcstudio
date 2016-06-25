import Token from './Token'

interface Node {
    mode: number;
    token: Token;
    children: Node[];
    type: string;
    id: string;
    expecting?: string;
    flags?: number;
    parent?: Node;
    allow_assign?: boolean;
    allow_comma?: boolean;
}

export default Node

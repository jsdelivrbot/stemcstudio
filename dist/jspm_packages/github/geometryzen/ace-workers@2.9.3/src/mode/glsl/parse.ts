import Node from './Node';
import Token from './Token';
import tokenizeString from './tokenizeString';
import parser from './parser';

export default function (code: string): Node | Node[] {
    const tokens: Token[] = tokenizeString(code);
    const reader = parser();
    for (let i = 0; i < tokens.length; i++) {
        reader(tokens[i]);
    }
    const ast = reader(null);
    return ast;
}

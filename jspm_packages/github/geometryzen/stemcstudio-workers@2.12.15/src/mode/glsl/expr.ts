//
// WARNING: The original author of this code had a fondness for the comma operator.
//
// My opinion is that it obscures the meaning of the code. Here is the MDN description as a reminder.
//
// The comma operator evaluates each of its operands (from left to right) and returns the value of the last operand.
//
import LeftDenotation from './LeftDenotation';
import Node from './Node';
import NullDenotation from './NullDenotation';
import State from './State';
import Symbol from './Symbol';
import Token from './Token';
//
// See javascript.crockford.com/tdop/tdop.html
//
// We assume that the source text has been transformed into an array of tokens.
//

var state: State;
/**
 * The current token.
 */
let currentNode: Node;
var tokens: Token[];
/**
 * The token index.
 */
let idx: number;

function fail(message: string) {
    return function () { return state.unexpected(message); };
}

/**
 * The prototype for all other symbols. Its method will usually be overridden.
 */
const original_symbol: { nud: NullDenotation; led: LeftDenotation } = {
    nud: function () {
        return this.children && this.children.length ? this : fail('unexpected')();
    },
    led: fail('missing operator')
};

/**
 * The symbol table drives the parser.
 */
const symbol_table: { [id: string]: Symbol } = {};

const itself: NullDenotation = function () {
    return this;
};

/**
 * A function that makes symbols and looks them up in a cache.
 * @param id Identifier
 * @param bp Binding Power. Optional. Defaults to zero.
 */
function symbol(id: string, bp = 0) {
    let s: Symbol = symbol_table[id];
    if (s) {
        if (bp > s.lbp) {
            s.lbp = bp;
        }
    }
    else {
        s = Object.create(original_symbol);
        s.id = id;
        s.lbp = bp;
        symbol_table[id] = s;
    }
    return s;
}

function infix(id: string, bp: number, led?: LeftDenotation) {
    const sym: Symbol = symbol(id, bp);
    sym.led = led || function (left: Node): Node {
        (<Node>this).children = [left, expression(bp)];
        (<Node>this).type = 'binary';
        return this;
    };
}

function infixr(id: string, bp: number, led?: LeftDenotation): Symbol {
    const sym = symbol(id, bp);
    sym.led = led || function (left: Node): Node {
        (<Node>this).children = [left, expression(bp - 1)];
        (<Node>this).type = 'binary';
        return this;
    };
    return sym;
}

function prefix(id: string, nud?: NullDenotation): Symbol {
    const sym = symbol(id);
    sym.nud = nud || function (): Node {
        (<Node>this).children = [expression(70)];
        (<Node>this).type = 'unary';
        return this;
    };
    return sym;
}

function suffix(id: string): void {
    const sym = symbol(id, 150);
    sym.led = function (left: Node): Node {
        (<Node>this).children = [left];
        (<Node>this).type = 'suffix';
        return this;
    };
}

function assignment(id: string): Symbol {
    return infixr(id, 10, function (left: Node): Node {
        (<Node>this).children = [left, expression(9)];
        (<Node>this).assignment = true;
        (<Node>this).type = 'assign';
        return this;
    });
}

// parentheses included to avoid collisions with user-defined tokens.
symbol('(ident)').nud = itself;
symbol('(keyword)').nud = itself;
symbol('(builtin)').nud = itself;
// The (literal) symbol is the prototype for all (NOT string in GLSL) and number literals.
symbol('(literal)').nud = itself;
symbol('(end)');  // Indicates the end of the token stream.

// The following symbols are separators and closers.
symbol(':');
symbol(';');
symbol(',');
symbol(')');
symbol(']');
symbol('}');

infixr('&&', 30);
infixr('||', 30);
infix('|', 43);
infix('^', 44);
infix('&', 45);
infix('==', 46);
infix('!=', 46);
infix('<', 47);
infix('<=', 47);
infix('>', 47);
infix('>=', 47);
infix('>>', 48);
infix('<<', 48);
infix('+', 50);
infix('-', 50);
infix('*', 60);
infix('/', 60);
infix('%', 60);
infix('?', 20, function (left: Node): Node {
    // The comma operator evaluates each of its operands (from left to right) and returns the value of the last operand.
    (<Node>this).children = [left, expression(0), (advance(':'), expression(0))]; // original.
    // this.children = [];
    // this.children.push(left);
    // this.children.push(expression(0));
    // advance(':');
    // this.children.push(expression(0));
    (<Node>this).type = 'ternary';
    return this;
});

//
// The . operator is used to select a member of an object.
//
infix('.', 80, function (left: Node): Node {
    currentNode.type = 'literal';
    // FIXME: Something wrong here?
    // It seems that we want to be able to use a Token as a Node.
    // console.log(JSON.stringify(token, null, 2));
    state.fake(currentNode);
    (<Node>this).children = [left, currentNode];
    advance();
    return this;
});

//
// The operator [ is used to dynamically select a member from an object or array.
// The expression on the right must be followed by a closing ]
//
infix('[', 80, function (left: Node): Node {
    (<Node>this).children = [left, expression(0)];
    (<Node>this).type = 'binary';
    advance(']');
    return this;
});

infix('(', 80, function (left) {
    this.children = [left];
    this.type = 'call';

    if (currentNode.data !== ')') {
        while (1) {
            (<Node>this).children.push(expression(0));
            if (currentNode.data !== ',') {
                break;
            }
            advance(',');
        }
    }
    advance(')');
    return this;
});

prefix('-');
prefix('+');
prefix('!');
prefix('~');
prefix('defined');
prefix('(', function () {
    this.type = 'group';
    this.children = [expression(0)];
    advance(')');
    return this;
});
prefix('++');
prefix('--');
suffix('++');
suffix('--');

assignment('=');
assignment('+=');
assignment('-=');
assignment('*=');
assignment('/=');
assignment('%=');
assignment('&=');
assignment('|=');
assignment('^=');
assignment('>>=');
assignment('<<=');

export default function expr(incoming_state: any, incoming_tokens?: Token[]): void {

    function emit(node: Node) {
        state.unshift(node, false);
        for (var i = 0, len = node.children.length; i < len; ++i) {
            emit(node.children[i]);
        }
        state.shift();
    }

    state = incoming_state;
    tokens = incoming_tokens;
    idx = 0;
    var result: any;

    if (!tokens.length) {
        return;
    }

    advance();
    result = expression(0);
    result.parent = state[0];
    emit(result);

    if (idx < tokens.length) {
        throw new Error('did not use all tokens');
    }

    result.parent.children = [result];
}

/**
 * The heart of top-down precedence parsing (Pratt).
 * @param rbp Right Binding Power.
 */
function expression(rbp: number): Node {
    let node: Node = currentNode;

    advance();

    let left = node.nud();
    while (rbp < currentNode.lbp) {
        node = currentNode;
        advance();
        left = node.led(left);
    }
    return left;
}

/**
 * Make a new token from the next simple object in the array and assign to the (current) token variable.
 * @param expecting A symbol identifier such as a closing brace or punctuation symbol.
 */
function advance(expecting?: string): Node {

    // TODO: Why does this not check against token.id?
    // It seems to pass the tests either way!
    if (expecting && currentNode.data !== expecting) {
        return state.unexpected('expected `' + expecting + '`, got `' + currentNode.data + '`');
    }

    if (idx >= tokens.length) {
        currentNode = nodeFromSymbol(symbol_table['(end)'], void 0, void 0, void 0);
        return;
    }

    const next = tokens[idx++];
    const value = next.data;
    const type = next.type;

    if (type === 'ident') {
        if (state.scope.find(value)) {
            const output: State = state.scope.find(value);
            currentNode = nodeFromState(output, next, type, value);
        }
        else {
            const output: Node = state.create_node();
            currentNode = nodeFromNode(output, next, output.type, value);
        }
    }
    else if (type === 'builtin') {
        currentNode = nodeFromSymbol(symbol_table['(builtin)'], next, next.type, value);
    }
    else if (type === 'keyword') {
        currentNode = nodeFromSymbol(symbol_table['(keyword)'], next, next.type, value);
    }
    else if (type === 'operator') {
        if (!symbol_table[value]) {
            return state.unexpected('unknown operator `' + value + '`');
        }
        else {
            currentNode = nodeFromSymbol(symbol_table[value], next, next.type, value);
        }
    }
    else if (type === 'float' || type === 'integer') {
        currentNode = nodeFromSymbol(symbol_table['(literal)'], next, 'literal', value);
    }
    else {
        return state.unexpected('unexpected token.');
    }
    return currentNode;
}

function nodeFromSymbol(thing: Symbol, token: Token, type: string, value: string): Node {
    const node: Node = Object.create(thing);

    if (!node.nud) { node.nud = itself; }
    if (!node.children) { node.children = []; }

    node.token = token;
    node.type = type;
    if (!node.data) {
        node.data = value;
    }
    return node;
}

/**
 * Not sure what is going on here.
 */
function nodeFromNode(thing: Node, token: Token, type: string, value: string): Node {
    // It seems to be important to use the incoming node (created by the scope).
    const node: Node = Object.create(thing);

    if (!node.nud) { node.nud = itself; }
    if (!node.children) { node.children = []; }

    node.token = token;
    node.type = type;
    if (!node.data) {
        node.data = value;
    }
    return node;
}

/**
 * Not sure what is going on here.
 */
function nodeFromState(thing: State, token: Token, type: string, value: string): Node {
    // It seems to be important to use the incoming state (resulting from find).
    const node: Node = Object.create(thing);

    if (!node.nud) { node.nud = itself; }
    if (!node.children) { node.children = []; }

    node.token = token;
    node.type = type;
    if (!node.data) {
        node.data = value;
    }
    return node;
}

//
// WARNING: The original author of this code had a fondness for the comma operator.
//
// My opinion is that it obscures the meaning of the code. Here is the MDN description as a reminder.
//
// The comma operator evaluates each of its operands (from left to right) and returns the value of the last operand.
//
import Hybrid from './Hybrid';
import LeftDenotation from './LeftDenotation';
import Node from './Node';
import NullDenotation from './NullDenotation'
import State from './State';
import Symbol from './Symbol'
import Token from './Token'
//
// See javascript.crockford.com/tdop/tdop.html
//
// We assume that the source text has been transformed into an array of tokens.
//

var state: State;
/**
 * The current token.
 */
let token: Token;
var tokens: Token[];
/**
 * The token index.
 */
let idx: number;

function fail(message: string) {
    return function() { return state.unexpected(message) }
}

/**
 * The prototype for all other symbols. Its method will usually be overridden.
 */
const original_symbol = {
    nud: function() {
        return this.children && this.children.length ? this : fail('unexpected')()
    },
    led: fail('missing operator')
}

/**
 * The symbol table drives the parser.
 */
const symbol_table: { [id: string]: Symbol } = {};

const itself: NullDenotation = function() {
    return this
}

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
    sym.led = led || function(left: Symbol): Symbol {
        (<Symbol>this).children = [left, expression(bp)];
        (<Symbol>this).type = 'binary';
        return this;
    };
}

function infixr(id: string, bp: number, led?: LeftDenotation): Symbol {
    const sym = symbol(id, bp);
    sym.led = led || function(left: Symbol): Symbol {
        (<Symbol>this).children = [left, expression(bp - 1)];
        (<Symbol>this).type = 'binary';
        return this;
    }
    return sym;
}

function prefix(id: string, nud?: NullDenotation): Symbol {
    const sym = symbol(id)
    sym.nud = nud || function(): Symbol {
        (<Symbol>this).children = [expression(70)];
        (<Symbol>this).type = 'unary';
        return this;
    }
    return sym;
}

function suffix(id: string): void {
    const sym = symbol(id, 150);
    sym.led = function(left: Symbol): Symbol {
        (<Symbol>this).children = [left];
        (<Symbol>this).type = 'suffix';
        return this;
    }
}

function assignment(id: string): Symbol {
    return infixr(id, 10, function(left: Symbol): Symbol {
        (<Symbol>this).children = [left, expression(9)];
        (<Symbol>this).assignment = true;
        (<Symbol>this).type = 'assign';
        return this;
    });
}

// parentheses included to avoid collisions with user-defined tokens.
symbol('(ident)').nud = itself
symbol('(keyword)').nud = itself
symbol('(builtin)').nud = itself
// The (literal) symbol is the prototype for all (NOT string in GLSL) and number literals.
symbol('(literal)').nud = itself
symbol('(end)');  // Indicates the end of the token stream.

// The following symbols are separators and closers.
symbol(':')
symbol(';')
symbol(',')
symbol(')')
symbol(']')
symbol('}')

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
infix('?', 20, function(left: Symbol): Symbol {
    // The comma operator evaluates each of its operands (from left to right) and returns the value of the last operand.
    (<Symbol>this).children = [left, expression(0), (advance(':'), expression(0))]; // original.
    //this.children = [];
    //this.children.push(left);
    //this.children.push(expression(0));
    //advance(':');
    //this.children.push(expression(0));
    (<Symbol>this).type = 'ternary';
    return this;
});

//
// The . operator is used to select a member of an object.
//
infix('.', 80, function(left: Symbol): Symbol {
    token.type = 'literal'
    // FIXME: Something wrong here?
    // console.log(JSON.stringify(token, null, 2));
    state.fake(<any>token);
    (<Symbol>this).children = [left, <Symbol>token];
    advance();
    return this;
});

//
// The operator [ is used to dynamically select a member from an object or array.
// The expression on the right must be followed by a closing ]
//
infix('[', 80, function(left: Symbol): Symbol {
    (<Symbol>this).children = [left, expression(0)];
    (<Symbol>this).type = 'binary';
    advance(']');
    return this;
});

infix('(', 80, function(left) {
    this.children = [left]
    this.type = 'call'

    if (token.data !== ')') {
        while (1) {
            (<Symbol>this).children.push(expression(0));
            if (token.data !== ',') {
                break;
            }
            advance(',');
        }
    }
    advance(')');
    return this;
});

prefix('-')
prefix('+')
prefix('!')
prefix('~')
prefix('defined')
prefix('(', function() {
    this.type = 'group'
    this.children = [expression(0)]
    advance(')')
    return this
})
prefix('++')
prefix('--')
suffix('++')
suffix('--')

assignment('=')
assignment('+=')
assignment('-=')
assignment('*=')
assignment('/=')
assignment('%=')
assignment('&=')
assignment('|=')
assignment('^=')
assignment('>>=')
assignment('<<=')

export default function expr(incoming_state: any, incoming_tokens?: Token[]): void {

    function emit(node: Node) {
        state.unshift(node, false)
        for (var i = 0, len = node.children.length; i < len; ++i) {
            emit(node.children[i])
        }
        state.shift()
    }

    state = incoming_state
    tokens = incoming_tokens
    idx = 0
    var result: any

    if (!tokens.length) {
        return
    }

    advance()
    result = expression(0)
    result.parent = state[0]
    emit(result)

    if (idx < tokens.length) {
        throw new Error('did not use all tokens')
    }

    result.parent.children = [result]
}

/**
 * The heart of top-down precedence parsing (Pratt).
 * @param rbp Right Binding Power.
 */
function expression(rbp: number): Symbol {
    let left: Symbol;
    let t: Token = token;

    advance();

    left = t.nud();
    while (rbp < token.lbp) {
        t = token;
        advance();
        left = t.led(left);
    }
    return left;
}

/**
 * Make a new token from the next simple object in the array and assign to the (current) token variable.
 */
function advance(id?: string): Token {
    var next: Token;
    var value: string;
    var type: string;
    /**
     * Symbol obtained from the symbol lookup table.
     */
    var output: any;

    // TODO: Why does this not check against token.id?
    if (id && token.data !== id) {
        return state.unexpected('expected `' + id + '`, got `' + token.data + '`')
    }

    if (idx >= tokens.length) {
        token = symbol_table['(end)']
        return
    }

    next = tokens[idx++]
    value = next.data
    type = next.type

    if (type === 'ident') {
        output = state.scope.find(value) || state.create_node()
        type = output.type
    }
    else if (type === 'builtin') {
        output = symbol_table['(builtin)']
    }
    else if (type === 'keyword') {
        output = symbol_table['(keyword)']
    }
    else if (type === 'operator') {
        output = symbol_table[value]
        if (!output) {
            return state.unexpected('unknown operator `' + value + '`')
        }
    }
    else if (type === 'float' || type === 'integer') {
        type = 'literal'
        output = symbol_table['(literal)']
    }
    else {
        return state.unexpected('unexpected token.')
    }

    if (output) {
        if (!output.nud) { output.nud = itself }
        if (!output.children) { output.children = [] }
    }

    // FIXME: This should be assigning to token?
    output = Object.create(output)
    output.token = next
    output.type = type
    if (!output.data) {
        output.data = value
    }

    // I don't think the assignment is required.
    // It also may be effing up the type safety.
    return token = output
}

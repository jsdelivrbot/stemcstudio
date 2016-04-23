import asserts = require('./asserts');
import base = require('./base');
import tables = require('./tables');
import Tokenizer = require('./Tokenizer');

var OpMap = tables.OpMap;
var ParseTables = tables.ParseTables;

/**
 * @param {string} message
 * @param {string} fileName
 * @param {Array.<number>=} begin
 * @param {Array.<number>=} end
 */
function parseError(message: string, fileName: string, begin?, end?) {
    var e = new SyntaxError(message);
    e.name = "ParseError";
    e['fileName'] = fileName;
    if (base.isDef(begin)) {
        e['lineNumber'] = begin[0];
        e['columnNumber'] = begin[1];
    }
    return e;
}

/**
 * Finds the specified
 * @param a An array of arrays where each element is an array of two integers.
 * @param obj An array containing two integers.
 */
function findInDfa(a: number[][], obj: number[]) {
    var i = a.length;
    while (i--) {
        if (a[i][0] === obj[0] && a[i][1] === obj[1]) {
            return true;
        }
    }
    return false;
}

export class Node {
    public type: number;
    public value: string;
    public lineno: number;
    public col_offset: number;
    public children: Node[];
    public used_names = {};
    constructor(type: number, value: string, lineno: number, col_offset: number, children: Node[]) {
        this.type = type;
        this.value = value;
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.children = children;
    }
}

class StackEntry {
    public dfa;
    public state: number;
    public node: Node;
    constructor(dfa, state: number, node: Node) {
        this.dfa = dfa;
        this.state = state;
        this.node = node;
    }
}

class Parser {
    private fileName: string;
    private grammar;
    private stack: StackEntry[];
    public rootnode: Node;
    private used_names;

    constructor(fileName: string, grammar) {
        this.fileName = fileName;
        this.grammar = grammar;
    }

    setup(start: number): void {
        start = start || this.grammar.start;
        var newnode = new Node(start, null, null, null, []);
        this.stack = [new StackEntry(this.grammar.dfas[start], 0, newnode)];
        this.used_names = {};
    }

    /**
     * Add a token; return true if we're done
     */
    addtoken(type: number, value: string, context: {}[]): boolean {
        var iLabel = this.classify(type, value, context);

        OUTERWHILE:
        while (true) {
            var tp = this.stack[this.stack.length - 1];
            var states = tp.dfa[0];
            var first = tp.dfa[1];
            var arcs = states[tp.state];

            // look for a state with this label
            for (var a = 0; a < arcs.length; ++a) {
                var i = arcs[a][0];
                var newstate = arcs[a][1];
                var t = this.grammar.labels[i][0];
                var v = this.grammar.labels[i][1];
                if (iLabel === i) {
                    // look it up in the list of labels
                    asserts.assert(t < 256);
                    // shift a token; we're done with it
                    this.shift(type, value, newstate, context);
                    // pop while we are in an accept-only state
                    var state = newstate;
                    while (states[state].length === 1
                        && states[state][0][0] === 0
                        && states[state][0][1] === state) {
                        this.pop();
                        if (this.stack.length === 0) {
                            // done!
                            return true;
                        }
                        tp = this.stack[this.stack.length - 1];
                        state = tp.state;
                        states = tp.dfa[0];
                        first = tp.dfa[1];
                    }
                    // done with this token
                    return false;
                }
                else if (t >= 256) {
                    var itsdfa = this.grammar.dfas[t];
                    var itsfirst = itsdfa[1];
                    if (itsfirst.hasOwnProperty(iLabel)) {
                        // push a symbol
                        this.push(t, this.grammar.dfas[t], newstate, context);
                        continue OUTERWHILE;
                    }
                }
            }

            if (findInDfa(arcs, [0, tp.state])) {
                // an accepting state, pop it and try something else
                this.pop();
                if (this.stack.length === 0) {
                    throw parseError("too much input", this.fileName);
                }
            }
            else {
                // no transition
                throw parseError("bad input", this.fileName, context[0], context[1]);
            }
        }
    }

    /**
     * turn a token into a label
     */
    private classify(type: number, value: string, context: {}[]): number {
        var iLabel: number;
        if (type === Tokenizer.Tokens.T_NAME) {
            this.used_names[value] = true;
            iLabel = this.grammar.keywords.hasOwnProperty(value) && this.grammar.keywords[value];
            if (iLabel) {
                return iLabel;
            }
        }
        iLabel = this.grammar.tokens.hasOwnProperty(type) && this.grammar.tokens[type];
        if (!iLabel) {
            throw parseError("bad token", this.fileName, context[0], context[1]);
        }
        return iLabel;
    }

    /**
     * shift a token
     */
    private shift(type: number, value: string, newstate, context: {}[]) {
        var dfa = this.stack[this.stack.length - 1].dfa;
        var state = this.stack[this.stack.length - 1].state;
        var node = this.stack[this.stack.length - 1].node;
        var newnode = new Node(type, value, context[0][0], context[0][1], []);
        if (newnode) {
            node.children.push(newnode);
        }
        this.stack[this.stack.length - 1] = { dfa: dfa, state: newstate, node: node };
    }

    /**
     * push a nonterminal
     */
    private push(type: number, newdfa, newstate, context: {}[]) {
        var dfa = this.stack[this.stack.length - 1].dfa;
        var node = this.stack[this.stack.length - 1].node;

        this.stack[this.stack.length - 1] = { dfa: dfa, state: newstate, node: node };

        var newnode = new Node(type, null, context[0][0], context[0][1], []);

        this.stack.push({ dfa: newdfa, state: 0, node: newnode });
    }

    /**
     * pop a nonterminal
     */
    private pop() {
        var pop = this.stack.pop();
        var newnode = pop.node;
        if (newnode) {
            if (this.stack.length !== 0) {
                var node = this.stack[this.stack.length - 1].node;
                node.children.push(newnode);
            }
            else {
                this.rootnode = newnode;
                this.rootnode.used_names = this.used_names;
            }
        }
    }
}

/**
 * parser for interactive input. returns a function that should be called with
 * lines of input as they are entered. the function will return false
 * until the input is complete, when it will return the rootnode of the parse.
 *
 * @param {string} fileName
 * @param {string=} style root of parse tree (optional)
 */
function makeParser(fileName: string, style?) {
    if (style === undefined) style = "file_input";

    var p = new Parser(fileName, ParseTables);
    // for closure's benefit
    if (style === "file_input") {
        p.setup(ParseTables.sym.file_input);
    }
    else {
        asserts.fail("todo;");
    }
    var curIndex = 0;
    var lineno = 1;
    var column = 0;
    var prefix = "";
    var T_COMMENT = Tokenizer.Tokens.T_COMMENT;
    var T_NL = Tokenizer.Tokens.T_NL;
    var T_OP = Tokenizer.Tokens.T_OP;
    var tokenizer = new Tokenizer(fileName, style === "single_input", function(type, value, start, end, line) {
        var s_lineno = start[0];
        var s_column = start[1];
        /*
        if (s_lineno !== lineno && s_column !== column)
        {
            // todo; update prefix and line/col
        }
        */
        if (type === T_COMMENT || type === T_NL) {
            prefix += value;
            lineno = end[0];
            column = end[1];
            if (value[value.length - 1] === "\n") {
                lineno += 1;
                column = 0;
            }
            return undefined;
        }
        if (type === T_OP) {
            type = OpMap[value];
        }
        if (p.addtoken(type, value, [start, end, line])) {
            return true;
        }
    });
    return function(line): Node {
        var ret = tokenizer.generateTokens(line);
        if (ret) {
            if (ret !== "done") {
                throw parseError("incomplete input", this.fileName);
            }
            return p.rootnode;
        }
        return null;
    };
}

/**
 * 
 */
export function parse(fileName: string, source: string): Node {
    var parseFunc = makeParser(fileName);
    if (source.substr(source.length - 1, 1) !== "\n") source += "\n";
    var lines = source.split("\n");
    var ret: Node;
    for (var i = 0; i < lines.length; ++i) {
        ret = parseFunc(lines[i] + ((i === lines.length - 1) ? "" : "\n"));
    }
    return ret;
}

/**
 * 
 */
export function parseTreeDump(node: Node): string {
    var ret = "";
    if (node.type >= 256) // non-term
    {
        ret += ParseTables.number2symbol[node.type] + "\n";
        for (var i = 0; i < node.children.length; ++i) {
            ret += parseTreeDump(node.children[i]);
        }
    }
    else {
        ret += Tokenizer.tokenNames[node.type] + ": " + node.value + "\n";
    }
    return ret;
}

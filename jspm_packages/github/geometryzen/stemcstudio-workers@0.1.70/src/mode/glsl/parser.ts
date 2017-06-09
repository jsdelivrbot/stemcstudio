import Node from './Node'
import full_parse_expr from './expr'
import Scope from './Scope'
import Token from './Token'

// singleton!
var Advance = {};

var DEBUG = false

let IDENT = 0;
let STMT = 1;
let STMTLIST = 2;
let STRUCT = 3;
let FUNCTION = 4;
let FUNCTIONARGS = 5;
let DECL = 6;
let DECLLIST = 7;
let FORLOOP = 8;
let WHILELOOP = 9;
let IF = 10;
let EXPR = 11;
let PRECISION = 12;
let COMMENT = 13;
let PREPROCESSOR = 14;
let KEYWORD = 15;
let KEYWORD_OR_IDENT = 16;
let RETURN = 17;
let BREAK = 18;
let CONTINUE = 19;
let DISCARD = 20;
let DOWHILELOOP = 21;
let PLACEHOLDER = 22;
let QUANTIFIER = 23;

let DECL_ALLOW_ASSIGN = 0x1;
let DECL_ALLOW_COMMA = 0x2;
let DECL_REQUIRE_NAME = 0x4;
let DECL_ALLOW_INVARIANT = 0x8;
let DECL_ALLOW_STORAGE = 0x10;
let DECL_NO_INOUT = 0x20;
let DECL_ALLOW_STRUCT = 0x40;
let DECL_STATEMENT = 0xFF;
let DECL_FUNCTION = DECL_STATEMENT & ~(DECL_ALLOW_ASSIGN | DECL_ALLOW_COMMA | DECL_NO_INOUT | DECL_ALLOW_INVARIANT | DECL_REQUIRE_NAME);
let DECL_STRUCT = DECL_STATEMENT & ~(DECL_ALLOW_ASSIGN | DECL_ALLOW_INVARIANT | DECL_ALLOW_STORAGE | DECL_ALLOW_STRUCT);

let QUALIFIERS = ['const', 'attribute', 'uniform', 'varying']

let NO_ASSIGN_ALLOWED = false;
let NO_COMMA_ALLOWED = false;

// map of tokens to stmt types
let token_map = {
    'block-comment': COMMENT
    , 'line-comment': COMMENT
    , 'preprocessor': PREPROCESSOR
}

// map of stmt types to human
let stmt_type = [
    'ident'
    , 'stmt'
    , 'stmtlist'
    , 'struct'
    , 'function'
    , 'functionargs'
    , 'decl'
    , 'decllist'
    , 'forloop'
    , 'whileloop'
    , 'if'
    , 'expr'
    , 'precision'
    , 'comment'
    , 'preprocessor'
    , 'keyword'
    , 'keyword_or_ident'
    , 'return'
    , 'break'
    , 'continue'
    , 'discard'
    , 'do-while'
    , 'placeholder'
    , 'quantifier'
]

export default function parser(): (data: Token) => Node {

    function reader(data: Token) {
        if (data === null) {
            return end(), program
        }

        nodes = []
        write(data)
        return nodes
    }

    function write(input: Token) {
        if (input.type === 'whitespace' || input.type === 'line-comment' || input.type === 'block-comment') {

            whitespace.push(input)
            return
        }
        tokens.push(input)
        token = token || tokens[0]

        if (token && whitespace.length) {
            token.preceding = token.preceding || []
            token.preceding = token.preceding.concat(whitespace)
            whitespace = []
        }

        while (take()) {
            switch (state[0].mode) {
                case STMT: parse_stmt(); break
                case STMTLIST: parse_stmtlist(); break
                case DECL: parse_decl(); break
                case DECLLIST: parse_decllist(); break
                case EXPR: parse_expr(); break
                case STRUCT: parse_struct(true, true); break
                case PRECISION: parse_precision(); break
                case IDENT: parse_ident(); break
                case KEYWORD: parse_keyword(); break
                case KEYWORD_OR_IDENT: parse_keyword_or_ident(); break
                case FUNCTION: parse_function(); break
                case FUNCTIONARGS: parse_function_args(); break
                case FORLOOP: parse_forloop(); break
                case WHILELOOP: parse_whileloop(); break
                case DOWHILELOOP: parse_dowhileloop(); break
                case RETURN: parse_return(); break
                case IF: parse_if(); break
                case QUANTIFIER: parse_quantifier(); break
            }
        }
    }

    // stream functions ---------------------------------------------

    function end(token?: Token) {
        if (arguments.length) {
            write(token)
        }

        if (state.length > 1) {
            unexpected('unexpected EOF')
            return
        }

        complete = true
    }

    function take() {
        if (errored || !state.length) {
            return false
        }
        return (token = tokens[0])
    }

    // ----- state manipulation --------

    function special_fake(x: any) {
        state.unshift(x)
        state.shift()
    }

    function special_unshift(_node: any, add_child?: boolean) {
        _node.parent = state[0]

        var ret = [].unshift.call(this, _node)

        add_child = add_child === undefined ? true : add_child

        if (DEBUG) {
            var pad = ''
            for (var i = 0, len = this.length - 1; i < len; ++i) {
                pad += ' |'
            }
        }

        if (add_child && node !== _node) {
            node.children.push(_node)
        }
        node = _node

        return ret
    }

    function special_shift() {
        var _node = [].shift.call(this)
            , okay = check[this.length]
            , emit = false

        if (DEBUG) {
            var pad = ''
            for (var i = 0, len = this.length; i < len; ++i) {
                pad += ' |'
            }
        }

        if (check.length) {
            if (typeof check[0] === 'function') {
                emit = check[0](_node)
            } else if (okay !== undefined) {
                emit = okay.test ? okay.test(_node.type) : okay === _node.type
            }
        } else {
            emit = true
        }

        if (emit && !errored) {
            nodes.push(_node)
        }

        node = _node.parent
        return _node
    }

    // parse states ---------------

    function parse_stmtlist() {

        function normal_mode() {
            if (token.data === state[0].expecting) {
                return state.scope.exit(), state.shift()
            }
            switch (token.type) {
                case 'preprocessor':
                    state.fake(adhoc())
                    tokens.shift()
                    return
                default:
                    state.unshift(stmt())
                    return
            }
        }

        // determine the type of the statement
        // and then start parsing
        return stative(
            function() { state.scope.enter(); return Advance }
            , normal_mode
        )()
    }

    function parse_stmt() {
        if (state[0].brace) {
            if (token.data !== '}') {
                return unexpected('expected `}`, got ' + token.data)
            }
            state[0].brace = false
            return tokens.shift(), state.shift()
        }
        switch (token.type) {
            case 'eof': return got_eof()
            case 'keyword':
                switch (token.data) {
                    case 'for': return state.unshift(forstmt());
                    case 'if': return state.unshift(ifstmt());
                    case 'while': return state.unshift(whilestmt());
                    case 'do': return state.unshift(dowhilestmt());
                    case 'break': return state.fake(mknode(BREAK, token)), tokens.shift()
                    case 'continue': return state.fake(mknode(CONTINUE, token)), tokens.shift()
                    case 'discard': return state.fake(mknode(DISCARD, token)), tokens.shift()
                    case 'return': return state.unshift(returnstmt());
                    case 'precision': return state.unshift(precision());
                }
                return state.unshift(decl(DECL_STATEMENT))
            case 'ident':
                var lookup: any
                if (lookup = state.scope.find(token.data)) {
                    if (lookup.parent.type === 'struct') {
                        // this is strictly untrue, you could have an
                        // expr that starts with a struct constructor.
                        //      ... sigh
                        return state.unshift(decl(DECL_STATEMENT))
                    }
                    return state.unshift(expr(';'))
                }
            case 'operator':
                if (token.data === '{') {
                    state[0].brace = true
                    var n: any = stmtlist()  // FIXME
                    n.expecting = '}'
                    return tokens.shift(), state.unshift(n)
                }
                if (token.data === ';') {
                    return tokens.shift(), state.shift()
                }
            default: return state.unshift(expr(';'))
        }
    }

    function got_eof() {
        if (ended) {
            errored = true
        }
        ended = true
        return state.shift()
    }

    function parse_decl() {
        function invariant_or_not(): any {  // FIXME
            if (token.data === 'invariant') {
                if (stmt.flags & DECL_ALLOW_INVARIANT) {
                    state.unshift(keyword())
                    return Advance
                } else {
                    return unexpected('`invariant` is not allowed here')
                }
            } else {
                state.fake(mknode(PLACEHOLDER, { data: '', position: token.position }))
                return Advance
            }
        }

        function storage_or_not(): any {  // FIXME
            if (is_storage(token)) {
                if (stmt.flags & DECL_ALLOW_STORAGE) {
                    state.unshift(keyword())
                    return Advance
                } else {
                    return unexpected('storage is not allowed here')
                }
            } else {
                state.fake(mknode(PLACEHOLDER, { data: '', position: token.position }))
                return Advance
            }
        }

        function parameter_or_not(): any {  // FIXME
            if (is_parameter(token)) {
                if (!(stmt.flags & DECL_NO_INOUT)) {
                    state.unshift(keyword())
                    return Advance
                } else {
                    return unexpected('parameter is not allowed here')
                }
            } else {
                state.fake(mknode(PLACEHOLDER, { data: '', position: token.position }))
                return Advance
            }
        }

        function precision_or_not() {
            if (is_precision(token)) {
                state.unshift(keyword())
                return Advance
            } else {
                state.fake(mknode(PLACEHOLDER, { data: '', position: token.position }))
                return Advance
            }
        }

        function struct_or_type(): any {  // FIXME
            if (token.data === 'struct') {
                if (!(stmt.flags & DECL_ALLOW_STRUCT)) {
                    return unexpected('cannot nest structs')
                }
                state.unshift(struct())
                return Advance
            }

            if (token.type === 'keyword') {
                state.unshift(keyword())
                return Advance
            }

            var lookup = state.scope.find(token.data)

            if (lookup) {
                state.fake(Object.create(lookup))
                tokens.shift()
                return Advance
            }
            return unexpected('expected user defined type, struct or keyword, got ' + token.data)
        }

        function maybe_name() {
            if (token.data === ',' && !(stmt.flags & DECL_ALLOW_COMMA)) {
                return state.shift()
            }

            if (token.data === '[') {
                // oh lord.
                state.unshift(quantifier())
                return
            }

            if (token.data === ')') {
                return state.shift()
            }

            if (token.data === ';') {
                return stmt.stage + 3
            }

            if (token.type !== 'ident' && token.type !== 'builtin') {
                return unexpected('expected identifier, got ' + token.data)
            }

            stmt.collected_name = tokens.shift()
            return Advance
        }

        function maybe_lparen() {
            if (token.data === '(') {
                tokens.unshift(stmt.collected_name)
                delete stmt.collected_name
                state.unshift(fn())
                return stmt.stage + 2
            }
            return Advance
        }

        function is_decllist() {
            tokens.unshift(stmt.collected_name)
            delete stmt.collected_name
            state.unshift(decllist())
            return Advance
        }

        function done() {
            return state.shift()
        }
        var stmt = state[0]

        return stative(
            invariant_or_not,
            storage_or_not,
            parameter_or_not,
            precision_or_not,
            struct_or_type,
            maybe_name,
            maybe_lparen,     // lparen means we're a function
            is_decllist,
            done
        )()
    }

    function parse_decllist() {
        // grab ident

        if (token.type === 'ident') {
            var name = token.data
            state.unshift(ident())
            state.scope.define(name)
            return
        }

        if (token.type === 'operator') {

            if (token.data === ',') {
                // multi-decl!
                if (!(state[1].flags & DECL_ALLOW_COMMA)) {
                    return state.shift()
                }

                return tokens.shift()
            }
            else if (token.data === '=') {
                if (!(state[1].flags & DECL_ALLOW_ASSIGN)) {
                    return unexpected('`=` is not allowed here.')
                }

                tokens.shift()

                state.unshift(expr(',', ';'))
                return
            }
            else if (token.data === '[') {
                state.unshift(quantifier())
                return
            }
        }
        return state.shift()
    }

    function parse_keyword_or_ident() {
        if (token.type === 'keyword') {
            state[0].type = 'keyword'
            state[0].mode = KEYWORD
            return
        }

        if (token.type === 'ident') {
            state[0].type = 'ident'
            state[0].mode = IDENT
            return
        }

        return unexpected('expected keyword or user-defined name, got ' + token.data)
    }

    function parse_keyword() {
        if (token.type !== 'keyword') {
            return unexpected('expected keyword, got ' + token.data)
        }

        return state.shift(), tokens.shift()
    }

    function parse_ident() {
        if (token.type !== 'ident') {
            return unexpected('expected user-defined name, got ' + token.data)
        }

        state[0].data = token.data
        return state.shift(), tokens.shift()
    }


    function parse_expr() {

        function parseexpr(tokens: Token[]) {
            try {
                full_parse_expr(state, tokens)
            } catch (err) {
                errored = true
                throw err
            }

            return state.shift()
        }

        var expecting = state[0].expecting

        state[0].tokens = state[0].tokens || []

        if (state[0].parenlevel === undefined) {
            state[0].parenlevel = 0
            state[0].bracelevel = 0
        }
        if (state[0].parenlevel < 1 && expecting.indexOf(token.data) > -1) {
            return parseexpr(state[0].tokens)
        }
        if (token.data === '(') {
            ++state[0].parenlevel
        }
        else if (token.data === ')') {
            --state[0].parenlevel
        }

        switch (token.data) {
            case '{': ++state[0].bracelevel; break
            case '}': --state[0].bracelevel; break
            case '(': ++state[0].parenlevel; break
            case ')': --state[0].parenlevel; break
        }

        if (state[0].parenlevel < 0) {
            return unexpected('unexpected `)`')
        }
        if (state[0].bracelevel < 0) {
            return unexpected('unexpected `}`')
        }

        state[0].tokens.push(tokens.shift())
        return
    }

    // node types ---------------

    function n(type: number) {
        // this is a function factory that suffices for most kinds of expressions and statements
        return function() {
            return mknode(type, token)
        }
    }

    function adhoc() {
        return mknode(token_map[token.type], token, node)
    }

    function decl(flags: number) {
        var _: any = mknode(DECL, token, node)  // FIXME
        _.flags = flags

        return _
    }

    function struct(allow_assign?: boolean, allow_comma?: boolean) {
        var _: any = mknode(STRUCT, token, node)  // FIXME
        _.allow_assign = allow_assign === undefined ? true : allow_assign
        _.allow_comma = allow_comma === undefined ? true : allow_comma
        return _
    }

    function expr(arg0?: any, arg1?: any) {
        var n: any = mknode(EXPR, token, node)  // FIXME

        n.expecting = [].slice.call(arguments)
        return n
    }

    function keyword(default_value?: any) {
        var t = token
        if (default_value) {
            t = { 'type': '(implied)', data: '(default)', position: t.position }
        }
        return mknode(KEYWORD, t, node)
    }

    // utils ----------------------------

    // FIXME: This should return the Error and let the site throw it.
    function unexpected(str: string) {
        errored = true
        throw new Error(
            (str || 'unexpected ' + state) +
            ' at line ' + state[0].token.line
        )
    }

    function assert(type: string, data?: any) {
        return 1,
            assert_null_string_or_array(type, token.type) &&
            assert_null_string_or_array(data, token.data)
    }

    function assert_null_string_or_array(x: any, y: any) {
        switch (typeof x) {
            case 'string': if (y !== x) {
                unexpected('expected `' + x + '`, got ' + y + '\n' + token.data);
            } return !errored

            case 'object': if (x && x.indexOf(y) === -1) {
                unexpected('expected one of `' + x.join('`, `') + '`, got ' + y);
            } return !errored
        }
        return true
    }

    // stative ----------------------------

    function stative(arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any, arg9?: any, argA?: any, argB?: any) {
        var steps = [].slice.call(arguments)
        var step: any
        var result: any

        return function(): any {
            var current = state[0]

            // FIXME
            //current.stage || (current.stage = 0)
            if (!current.stage) {
                current.stage = 0;
            }

            step = steps[current.stage]
            if (!step) {
                return unexpected('parser in undefined state!')
            }

            result = step()

            if (result === Advance) {
                return ++current.stage
            }
            if (result === undefined) {
                return
            }
            current.stage = result
        }
    }

    function advance(op: string, t?: string) {
        t = t || 'operator'
        return function() {
            if (!assert(t, op)) {
                return
            }

            var last = tokens.shift()
                , children = state[0].children
                , last_node = children[children.length - 1]

            if (last_node && last_node.token && last.preceding) {
                last_node.token.succeeding = last_node.token.succeeding || []
                last_node.token.succeeding = last_node.token.succeeding.concat(last.preceding)
            }
            return Advance
        }
    }

    function advance_expr(until: any) {
        return function() {
            state.unshift(expr(until))
            return Advance
        }
    }

    function advance_ident(declare: any) {
        return declare ? function() {
            var name = token.data
            return assert('ident') && (state.unshift(ident()), state.scope.define(name), Advance)
        } : function() {
            if (!assert('ident')) {
                return
            }

            var s = Object.create(state.scope.find(token.data))
            s.token = token

            return (tokens.shift(), Advance)
        }
    }

    function advance_stmtlist() {
        return function() {
            var n: any = stmtlist()  // FIXME
            n.expecting = '}'
            return state.unshift(n), Advance
        }
    }

    function maybe_stmtlist(skip: any) {
        return function() {
            var current = state[0].stage
            if (token.data !== '{') { return state.unshift(stmt()), current + skip }
            return tokens.shift(), Advance
        }
    }

    function popstmt() {
        return function() { return state.shift(), state.shift() }
    }


    function setup_stative_parsers() {

        // could also be
        // struct { } decllist
        parse_struct =
            stative(
                advance('struct', 'keyword')
                , function() {
                    if (token.data === '{') {
                        state.fake(mknode(IDENT, { data: '', position: token.position, type: 'ident' }))
                        return Advance
                    }

                    return advance_ident(true)()
                }
                , function() { state.scope.enter(); return Advance }
                , advance('{')
                , function() {
                    if (token.type === 'preprocessor') {
                        state.fake(adhoc())
                        tokens.shift()
                        return
                    }
                    if (token.data === '}') {
                        state.scope.exit()
                        tokens.shift()
                        return state.shift()
                    }
                    if (token.data === ';') {
                        tokens.shift();
                        return
                    }
                    state.unshift(decl(DECL_STRUCT))
                }
            )

        parse_precision =
            stative(
                function() { return tokens.shift(), Advance }
                , function() {
                    return assert(
                        'keyword', ['lowp', 'mediump', 'highp']
                    ) && (state.unshift(keyword()), Advance)
                }
                , function() { return (state.unshift(keyword()), Advance) }
                , function() { return state.shift() }
            )

        parse_quantifier =
            stative(
                advance('[')
                , advance_expr(']')
                , advance(']')
                , function() { return state.shift() }
            )

        parse_forloop =
            stative(
                advance('for', 'keyword')
                , advance('(')
                , function() {
                    var lookup: any
                    if (token.type === 'ident') {
                        if (!(lookup = state.scope.find(token.data))) {
                            lookup = state.create_node()
                        }

                        if (lookup.parent.type === 'struct') {
                            return state.unshift(decl(DECL_STATEMENT)), Advance
                        }
                    } else if (token.type === 'builtin' || token.type === 'keyword') {
                        return state.unshift(decl(DECL_STATEMENT)), Advance
                    }
                    return advance_expr(';')()
                }
                , advance(';')
                , advance_expr(';')
                , advance(';')
                , advance_expr(')')
                , advance(')')
                , maybe_stmtlist(3)
                , advance_stmtlist()
                , advance('}')
                , popstmt()
            )

        parse_if =
            stative(
                advance('if', 'keyword')
                , advance('(')
                , advance_expr(')')
                , advance(')')
                , maybe_stmtlist(3)
                , advance_stmtlist()
                , advance('}')
                , function() {
                    if (token.data === 'else') {
                        return tokens.shift(), state.unshift(stmt()), Advance
                    }
                    return popstmt()()
                }
                , popstmt()
            )

        parse_return =
            stative(
                advance('return', 'keyword')
                , function() {
                    if (token.data === ';') {
                        return Advance
                    }
                    return state.unshift(expr(';')), Advance
                }
                , function() { tokens.shift(), popstmt()() }
            )

        parse_whileloop =
            stative(
                advance('while', 'keyword')
                , advance('(')
                , advance_expr(')')
                , advance(')')
                , maybe_stmtlist(3)
                , advance_stmtlist()
                , advance('}')
                , popstmt()
            )

        parse_dowhileloop =
            stative(
                advance('do', 'keyword')
                , maybe_stmtlist(3)
                , advance_stmtlist()
                , advance('}')
                , advance('while', 'keyword')
                , advance('(')
                , advance_expr(')')
                , advance(')')
                , popstmt()
            )

        parse_function =
            stative(
                function(): any {
                    for (var i = 1, len = state.length; i < len; ++i) {
                        if (state[i].mode === FUNCTION) {
                            return unexpected('function definition is not allowed within another function')
                        }
                    }

                    return Advance
                }
                , function() {
                    if (!assert('ident')) {
                        return
                    }

                    let name = token.data;
                    let lookup = state.scope.find(name);

                    state.unshift(ident());
                    state.scope.define(name);

                    state.scope.enter(lookup ? lookup.scope : null);
                    return Advance;
                }
                , advance('(')
                , function() { return state.unshift(fnargs()), Advance }
                , advance(')')
                , function() {
                    // forward decl
                    if (token.data === ';') {
                        return state.scope.exit(), state.shift(), state.shift()
                    }
                    return Advance
                }
                , advance('{')
                , advance_stmtlist()
                , advance('}')
                , function() { state.scope.exit(); return Advance }
                , function() { return state.shift(), state.shift(), state.shift() }
            )

        parse_function_args =
            stative(
                function() {
                    if (token.data === 'void') { state.fake(keyword()); tokens.shift(); return Advance }
                    if (token.data === ')') { state.shift(); return }
                    if (token.data === 'struct') {
                        state.unshift(struct(NO_ASSIGN_ALLOWED, NO_COMMA_ALLOWED))
                        return Advance
                    }
                    state.unshift(decl(DECL_FUNCTION))
                    return Advance
                }
                , function() {
                    if (token.data === ',') { tokens.shift(); return 0 }
                    if (token.data === ')') { state.shift(); return }
                    unexpected('expected one of `,` or `)`, got ' + token.data)
                }
            )
    }

    /// END OF INNER FUNCTIONS

    var stmtlist = n(STMTLIST)
        , stmt = n(STMT)
        , decllist = n(DECLLIST)
        , precision = n(PRECISION)
        , ident = n(IDENT)
        , keyword_or_ident = n(KEYWORD_OR_IDENT)
        , fn = n(FUNCTION)
        , fnargs = n(FUNCTIONARGS)
        , forstmt = n(FORLOOP)
        , ifstmt = n(IF)
        , whilestmt = n(WHILELOOP)
        , returnstmt = n(RETURN)
        , dowhilestmt = n(DOWHILELOOP)
        , quantifier = n(QUANTIFIER)

    var parse_struct: any
    var parse_precision: any
    var parse_quantifier: any
    var parse_forloop: any
    var parse_if: any
    var parse_return: any
    var parse_whileloop: any
    var parse_dowhileloop: any
    var parse_function: any
    var parse_function_args: any

    var check = arguments.length ? [].slice.call(arguments) : [];
    var complete = false;
    var ended = false;
    var depth = 0;
    var state: any = [];  // FIXME
    var nodes: Node[] = [];
    var tokens: any[] = [];
    var whitespace: Token[] = [];
    var errored = false;
    var program: any;
    var token: Token;
    var node: Node;

    // setup state
    state.shift = special_shift
    state.unshift = special_unshift
    state.fake = special_fake
    state.unexpected = unexpected
    state.scope = new Scope(state)  // FIXME The only place where we create a Scope?
    state.create_node = function() {
        var n: any = mknode(IDENT, token)  // FIXME
        n.parent = reader['program']  // FIXME
        return n
    }

    setup_stative_parsers()

    // setup root node
    node = stmtlist()
    node.expecting = '(eof)'
    node.mode = STMTLIST
    node.token = { type: '(program)', data: '(program)' }
    program = node

    reader['program'] = program;  // FIXME
    reader['scope'] = function(scope: any) {  // FIXME
        if (arguments.length === 1) {
            state.scope = scope
        }
        return state.scope
    }

    state.unshift(node)
    return reader
}

function mknode(mode: any, sourcetoken: any, unused?: any) {  // FIXME: What is the third argument?
    const children: any[] = []
    return {
        mode: mode
        , token: sourcetoken
        , children: children
        , type: stmt_type[mode]
        , id: (Math.random() * 0xFFFFFFFF).toString(16)
    }
}

function is_storage(token: { data: string }): boolean {
    return token.data === 'const' ||
        token.data === 'attribute' ||
        token.data === 'uniform' ||
        token.data === 'varying'
}

function is_parameter(token: { data: string }): boolean {
    return token.data === 'in' ||
        token.data === 'inout' ||
        token.data === 'out'
}

function is_precision(token: { data: string }): boolean {
    return token.data === 'highp' ||
        token.data === 'mediump' ||
        token.data === 'lowp'
}

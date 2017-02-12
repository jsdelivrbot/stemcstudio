System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function fail(message) {
        return function () { return state.unexpected(message); };
    }
    function symbol(id, bp) {
        if (bp === void 0) { bp = 0; }
        var s = symbol_table[id];
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
    function infix(id, bp, led) {
        var sym = symbol(id, bp);
        sym.led = led || function (left) {
            this.children = [left, expression(bp)];
            this.type = 'binary';
            return this;
        };
    }
    function infixr(id, bp, led) {
        var sym = symbol(id, bp);
        sym.led = led || function (left) {
            this.children = [left, expression(bp - 1)];
            this.type = 'binary';
            return this;
        };
        return sym;
    }
    function prefix(id, nud) {
        var sym = symbol(id);
        sym.nud = nud || function () {
            this.children = [expression(70)];
            this.type = 'unary';
            return this;
        };
        return sym;
    }
    function suffix(id) {
        var sym = symbol(id, 150);
        sym.led = function (left) {
            this.children = [left];
            this.type = 'suffix';
            return this;
        };
    }
    function assignment(id) {
        return infixr(id, 10, function (left) {
            this.children = [left, expression(9)];
            this.assignment = true;
            this.type = 'assign';
            return this;
        });
    }
    function expr(incoming_state, incoming_tokens) {
        function emit(node) {
            state.unshift(node, false);
            for (var i = 0, len = node.children.length; i < len; ++i) {
                emit(node.children[i]);
            }
            state.shift();
        }
        state = incoming_state;
        tokens = incoming_tokens;
        idx = 0;
        var result;
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
    exports_1("default", expr);
    function expression(rbp) {
        var node = currentNode;
        advance();
        var left = node.nud();
        while (rbp < currentNode.lbp) {
            node = currentNode;
            advance();
            left = node.led(left);
        }
        return left;
    }
    function advance(expecting) {
        if (expecting && currentNode.data !== expecting) {
            return state.unexpected('expected `' + expecting + '`, got `' + currentNode.data + '`');
        }
        if (idx >= tokens.length) {
            currentNode = nodeFromSymbol(symbol_table['(end)'], void 0, void 0, void 0);
            return;
        }
        var next = tokens[idx++];
        var value = next.data;
        var type = next.type;
        if (type === 'ident') {
            if (state.scope.find(value)) {
                var output = state.scope.find(value);
                currentNode = nodeFromState(output, next, type, value);
            }
            else {
                var output = state.create_node();
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
    function nodeFromSymbol(thing, token, type, value) {
        var node = Object.create(thing);
        if (!node.nud) {
            node.nud = itself;
        }
        if (!node.children) {
            node.children = [];
        }
        node.token = token;
        node.type = type;
        if (!node.data) {
            node.data = value;
        }
        return node;
    }
    function nodeFromNode(thing, token, type, value) {
        var node = Object.create(thing);
        if (!node.nud) {
            node.nud = itself;
        }
        if (!node.children) {
            node.children = [];
        }
        node.token = token;
        node.type = type;
        if (!node.data) {
            node.data = value;
        }
        return node;
    }
    function nodeFromState(thing, token, type, value) {
        var node = Object.create(thing);
        if (!node.nud) {
            node.nud = itself;
        }
        if (!node.children) {
            node.children = [];
        }
        node.token = token;
        node.type = type;
        if (!node.data) {
            node.data = value;
        }
        return node;
    }
    var state, currentNode, tokens, idx, original_symbol, symbol_table, itself;
    return {
        setters: [],
        execute: function () {
            original_symbol = {
                nud: function () {
                    return this.children && this.children.length ? this : fail('unexpected')();
                },
                led: fail('missing operator')
            };
            symbol_table = {};
            itself = function () {
                return this;
            };
            symbol('(ident)').nud = itself;
            symbol('(keyword)').nud = itself;
            symbol('(builtin)').nud = itself;
            symbol('(literal)').nud = itself;
            symbol('(end)');
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
            infix('?', 20, function (left) {
                this.children = [left, expression(0), (advance(':'), expression(0))];
                this.type = 'ternary';
                return this;
            });
            infix('.', 80, function (left) {
                currentNode.type = 'literal';
                state.fake(currentNode);
                this.children = [left, currentNode];
                advance();
                return this;
            });
            infix('[', 80, function (left) {
                this.children = [left, expression(0)];
                this.type = 'binary';
                advance(']');
                return this;
            });
            infix('(', 80, function (left) {
                this.children = [left];
                this.type = 'call';
                if (currentNode.data !== ')') {
                    while (1) {
                        this.children.push(expression(0));
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
        }
    };
});

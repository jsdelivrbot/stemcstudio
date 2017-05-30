/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var tables_1 = require('./tables');
var tree_1 = require('./tree');
var asserts_1 = require('./asserts');
var Tokenizer_1 = require('./Tokenizer');
var Tokens_1 = require('./Tokens');
var tokenNames_1 = require('./tokenNames');
var grammarName_1 = require('./grammarName');
var syntaxError_1 = require('./syntaxError');
var ARC_SYMBOL_LABEL = 0;
var ARC_TO_STATE = 1;
var DFA_STATES = 0;
var Parser = (function() {
  function Parser(grammar) {
    this.grammar = grammar;
    return this;
  }
  Parser.prototype.setup = function(start) {
    start = start || this.grammar.start;
    var newnode = {
      type: start,
      value: null,
      context: null,
      children: []
    };
    var stackentry = {
      dfa: this.grammar.dfas[start],
      state: 0,
      node: newnode
    };
    this.stack = [stackentry];
    this.used_names = {};
  };
  Parser.prototype.addtoken = function(type, value, context) {
    var tokenSymbol = this.classify(type, value, context);
    OUTERWHILE: while (true) {
      var tp = this.stack[this.stack.length - 1];
      asserts_1.assert(typeof tp === 'object', "stack element must be a StackElement. stack = " + JSON.stringify(this.stack));
      var states = tp.dfa[DFA_STATES];
      var arcs = states[tp.state];
      for (var _i = 0,
          arcs_1 = arcs; _i < arcs_1.length; _i++) {
        var arc = arcs_1[_i];
        var arcSymbol = arc[ARC_SYMBOL_LABEL];
        var newstate = arc[ARC_TO_STATE];
        var t = this.grammar.labels[arcSymbol][0];
        if (tokenSymbol === arcSymbol) {
          asserts_1.assert(t < 256);
          this.shift(type, value, newstate, context);
          var state = newstate;
          while (states[state].length === 1 && states[state][0][ARC_SYMBOL_LABEL] === 0 && states[state][0][ARC_TO_STATE] === state) {
            this.pop();
            if (this.stack.length === 0) {
              return true;
            }
            tp = this.stack[this.stack.length - 1];
            state = tp.state;
            states = tp.dfa[DFA_STATES];
          }
          return false;
        } else if (t >= 256) {
          var itsdfa = this.grammar.dfas[t];
          var itsfirst = itsdfa[1];
          if (itsfirst.hasOwnProperty(tokenSymbol)) {
            this.push(t, this.grammar.dfas[t], newstate, context);
            continue OUTERWHILE;
          }
        }
      }
      if (existsTransition(arcs, [Tokens_1.Tokens.T_ENDMARKER, tp.state])) {
        this.pop();
        if (this.stack.length === 0) {
          throw syntaxError_1.parseError("too much input");
        }
      } else {
        var found = grammarName_1.grammarName(tp.state);
        var begin = context[0];
        var end = context[1];
        throw syntaxError_1.parseError("Unexpected " + found + " at " + JSON.stringify(begin), begin, end);
      }
    }
  };
  Parser.prototype.classify = function(type, value, context) {
    var ilabel;
    if (type === Tokens_1.Tokens.T_NAME) {
      this.used_names[value] = true;
      if (this.grammar.keywords.hasOwnProperty(value)) {
        ilabel = this.grammar.keywords[value];
      }
      if (ilabel) {
        return ilabel;
      }
    }
    if (this.grammar.tokens.hasOwnProperty(type)) {
      ilabel = this.grammar.tokens[type];
    }
    if (!ilabel) {
      throw syntaxError_1.parseError("bad token", context[0], context[1]);
    }
    return ilabel;
  };
  Parser.prototype.shift = function(type, value, newstate, context) {
    var dfa = this.stack[this.stack.length - 1].dfa;
    var node = this.stack[this.stack.length - 1].node;
    var newnode = {
      type: type,
      value: value,
      lineno: context[0][0],
      col_offset: context[0][1],
      children: null
    };
    if (newnode && node.children) {
      node.children.push(newnode);
    }
    this.stack[this.stack.length - 1] = {
      dfa: dfa,
      state: newstate,
      node: node
    };
  };
  Parser.prototype.push = function(type, newdfa, newstate, context) {
    var dfa = this.stack[this.stack.length - 1].dfa;
    var node = this.stack[this.stack.length - 1].node;
    this.stack[this.stack.length - 1] = {
      dfa: dfa,
      state: newstate,
      node: node
    };
    var newnode = {
      type: type,
      value: null,
      lineno: context[0][0],
      col_offset: context[0][1],
      children: []
    };
    this.stack.push({
      dfa: newdfa,
      state: 0,
      node: newnode
    });
  };
  Parser.prototype.pop = function() {
    var pop = this.stack.pop();
    if (pop) {
      var newnode = pop.node;
      if (newnode) {
        if (this.stack.length !== 0) {
          var node = this.stack[this.stack.length - 1].node;
          if (node.children) {
            node.children.push(newnode);
          }
        } else {
          this.rootnode = newnode;
          this.rootnode.used_names = this.used_names;
        }
      }
    }
  };
  return Parser;
}());
function existsTransition(a, obj) {
  var i = a.length;
  while (i--) {
    if (a[i][0] === obj[0] && a[i][1] === obj[1]) {
      return true;
    }
  }
  return false;
}
function makeParser(sourceKind) {
  if (sourceKind === undefined)
    sourceKind = SourceKind.File;
  var p = new Parser(tables_1.ParseTables);
  switch (sourceKind) {
    case SourceKind.File:
      {
        p.setup(tables_1.ParseTables.sym.file_input);
        break;
      }
    case SourceKind.Eval:
      {
        p.setup(tables_1.ParseTables.sym.eval_input);
        break;
      }
    case SourceKind.Single:
      {
        p.setup(tables_1.ParseTables.sym.single_input);
        break;
      }
    default:
      {
        throw new Error("SourceKind must be one of File, Eval, or Single.");
      }
  }
  var lineno = 1;
  var column = 0;
  var prefix = "";
  var T_COMMENT = Tokens_1.Tokens.T_COMMENT;
  var T_NL = Tokens_1.Tokens.T_NL;
  var T_OP = Tokens_1.Tokens.T_OP;
  var tokenizer = new Tokenizer_1.Tokenizer(sourceKind === SourceKind.Single, function tokenizerCallback(type, value, start, end, line) {
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
      type = tables_1.OpMap[value];
    }
    if (p.addtoken(type, value, [start, end, line])) {
      return true;
    }
    return undefined;
  });
  return function parseFunc(line) {
    var ret = tokenizer.generateTokens(line);
    if (ret) {
      if (ret !== "done") {
        throw syntaxError_1.parseError("incomplete input");
      }
      return p.rootnode;
    }
    return false;
  };
}
var SourceKind;
(function(SourceKind) {
  SourceKind[SourceKind["File"] = 0] = "File";
  SourceKind[SourceKind["Eval"] = 1] = "Eval";
  SourceKind[SourceKind["Single"] = 2] = "Single";
})(SourceKind = exports.SourceKind || (exports.SourceKind = {}));
function parse(sourceText, sourceKind) {
  if (sourceKind === void 0) {
    sourceKind = SourceKind.File;
  }
  var parseFunc = makeParser(sourceKind);
  if (sourceText.substr(tree_1.IDXLAST(sourceText), 1) !== "\n") {
    sourceText += "\n";
  }
  var lines = sourceText.split("\n");
  var ret = false;
  for (var i = 0; i < lines.length; ++i) {
    ret = parseFunc(lines[i] + ((i === tree_1.IDXLAST(lines)) ? "" : "\n"));
  }
  return ret;
}
exports.parse = parse;
function parseTreeDump(parseTree) {
  function parseTreeDumpInternal(n, indent) {
    var ret = "";
    if (n.type >= 256) {
      ret += indent + tables_1.ParseTables.number2symbol[n.type] + "\n";
      if (n.children) {
        for (var i = 0; i < n.children.length; ++i) {
          ret += parseTreeDumpInternal(n.children[i], "  " + indent);
        }
      }
    } else {
      ret += indent + tokenNames_1.tokenNames[n.type] + ": " + n.value + "\n";
    }
    return ret;
  }
  return parseTreeDumpInternal(parseTree, "");
}
exports.parseTreeDump = parseTreeDump;

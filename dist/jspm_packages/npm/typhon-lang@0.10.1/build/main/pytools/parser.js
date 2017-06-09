/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var tables_1 = require('./tables');
var tree_1 = require('./tree');
var Tokenizer_1 = require('./Tokenizer');
var Tokens_1 = require('./Tokens');
var tokenNames_1 = require('./tokenNames');
var grammarName_1 = require('./grammarName');
var syntaxError_1 = require('./syntaxError');
var Position_1 = require('./Position');
var Range_1 = require('./Range');
var T_COMMENT = Tokens_1.Tokens.T_COMMENT;
var T_ENDMARKER = Tokens_1.Tokens.T_ENDMARKER;
var T_NAME = Tokens_1.Tokens.T_NAME;
var T_NL = Tokens_1.Tokens.T_NL;
var T_NT_OFFSET = Tokens_1.Tokens.T_NT_OFFSET;
var T_OP = Tokens_1.Tokens.T_OP;
var ARC_SYMBOL_LABEL = 0;
var ARC_TO_STATE = 1;
var DFA_STATES = 0;
var Parser = (function() {
  function Parser(grammar) {
    this.stack = [];
    this.used_names = {};
    this.grammar = grammar;
  }
  Parser.prototype.setup = function(start) {
    start = start || this.grammar.start;
    var newnode = {
      type: start,
      range: null,
      value: null,
      children: []
    };
    var stackentry = {
      dfa: this.grammar.dfas[start],
      state: 0,
      node: newnode
    };
    this.stack.push(stackentry);
  };
  Parser.prototype.addtoken = function(type, value, begin, end, line) {
    var tokenSymbol = this.classify(type, value, begin, end, line);
    var stack = this.stack;
    var g = this.grammar;
    var dfas = g.dfas;
    var labels = g.labels;
    OUTERWHILE: while (true) {
      var top_1 = stack[stack.length - 1];
      var states = top_1.dfa[DFA_STATES];
      var arcs = states[top_1.state];
      for (var _i = 0,
          arcs_1 = arcs; _i < arcs_1.length; _i++) {
        var arc = arcs_1[_i];
        var arcSymbol = arc[ARC_SYMBOL_LABEL];
        var newState = arc[ARC_TO_STATE];
        var t = labels[arcSymbol][0];
        if (tokenSymbol === arcSymbol) {
          this.shiftToken(type, value, newState, begin, end, line);
          var state = newState;
          var statesOfState = states[state];
          while (statesOfState.length === 1 && statesOfState[0][ARC_SYMBOL_LABEL] === 0 && statesOfState[0][ARC_TO_STATE] === state) {
            this.popNonTerminal();
            var stackLength = stack.length;
            if (stackLength === 0) {
              return true;
            } else {
              top_1 = stack[stackLength - 1];
              state = top_1.state;
              states = top_1.dfa[DFA_STATES];
              statesOfState = states[state];
            }
          }
          return false;
        } else if (isNonTerminal(t)) {
          var dfa = dfas[t];
          var itsfirst = dfa[1];
          if (itsfirst.hasOwnProperty(tokenSymbol)) {
            this.pushNonTerminal(t, dfa, newState, begin, end, line);
            continue OUTERWHILE;
          }
        }
      }
      if (existsTransition(arcs, [T_ENDMARKER, top_1.state])) {
        this.popNonTerminal();
        if (stack.length === 0) {
          throw syntaxError_1.parseError("too much input");
        }
      } else {
        var found = grammarName_1.grammarName(top_1.state);
        throw syntaxError_1.parseError("Unexpected " + found + " at " + JSON.stringify([begin[0], begin[1] + 1]), begin, end);
      }
    }
  };
  Parser.prototype.classify = function(type, value, begin, end, line) {
    var g = this.grammar;
    if (type === T_NAME) {
      this.used_names[value] = true;
      var keywordToSymbol = g.keywords;
      if (keywordToSymbol.hasOwnProperty(value)) {
        var ilabel_1 = keywordToSymbol[value];
        return ilabel_1;
      }
    }
    var tokenToSymbol = g.tokens;
    var ilabel;
    if (tokenToSymbol.hasOwnProperty(type)) {
      ilabel = tokenToSymbol[type];
    }
    if (!ilabel) {
      throw syntaxError_1.parseError("bad token", begin, end);
    }
    return ilabel;
  };
  Parser.prototype.shiftToken = function(type, value, newState, begin, end, line) {
    var stack = this.stack;
    var stackTop = stack[stack.length - 1];
    var node = stackTop.node;
    var newnode = {
      type: type,
      value: value,
      range: new Range_1.Range(new Position_1.Position(begin[0], begin[1]), new Position_1.Position(end[0], end[1])),
      children: null
    };
    if (newnode && node.children) {
      node.children.push(newnode);
    }
    stackTop.state = newState;
  };
  Parser.prototype.pushNonTerminal = function(type, newDfa, newState, begin, end, line) {
    var stack = this.stack;
    var stackTop = stack[stack.length - 1];
    stackTop.state = newState;
    var beginPos = begin ? new Position_1.Position(begin[0], begin[1]) : null;
    var endPos = end ? new Position_1.Position(end[0], end[1]) : null;
    var newnode = {
      type: type,
      value: null,
      range: new Range_1.Range(beginPos, endPos),
      children: []
    };
    stack.push({
      dfa: newDfa,
      state: 0,
      node: newnode
    });
  };
  Parser.prototype.popNonTerminal = function() {
    var stack = this.stack;
    var poppedElement = stack.pop();
    if (poppedElement) {
      var poppedNode = poppedElement.node;
      if (poppedNode) {
        var N = stack.length;
        if (N !== 0) {
          var node = stack[N - 1].node;
          var children = node.children;
          if (children) {
            children.push(poppedNode);
          }
        } else {
          this.rootNode = poppedNode;
          poppedNode.used_names = this.used_names;
        }
      }
    }
  };
  return Parser;
}());
function existsTransition(arcs, obj) {
  var i = arcs.length;
  while (i--) {
    var arc = arcs[i];
    if (arc[ARC_SYMBOL_LABEL] === obj[ARC_SYMBOL_LABEL] && arc[ARC_TO_STATE] === obj[ARC_TO_STATE]) {
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
    if (p.addtoken(type, value, start, end, line)) {
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
      return p.rootNode;
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
  var N = lines.length;
  for (var i = 0; i < N; ++i) {
    ret = parseFunc(lines[i] + ((i === tree_1.IDXLAST(lines)) ? "" : "\n"));
  }
  return ret;
}
exports.parse = parse;
function cstDump(parseTree) {
  function parseTreeDump(n, indent) {
    var ret = "";
    if (isNonTerminal(n.type)) {
      ret += indent + tables_1.ParseTables.number2symbol[n.type] + "\n";
      if (n.children) {
        for (var i = 0; i < n.children.length; ++i) {
          ret += parseTreeDump(n.children[i], "  " + indent);
        }
      }
    } else {
      ret += indent + tokenNames_1.tokenNames[n.type] + ": " + n.value + "\n";
    }
    return ret;
  }
  return parseTreeDump(parseTree, "");
}
exports.cstDump = cstDump;
function isNonTerminal(type) {
  return type >= T_NT_OFFSET;
}

/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var asserts_1 = require('../pytools/asserts');
var types_1 = require('../pytools/types');
var types_2 = require('../pytools/types');
var types_3 = require('../pytools/types');
var types_4 = require('../pytools/types');
var types_5 = require('../pytools/types');
var parser_1 = require('../pytools/parser');
var builder_1 = require('../pytools/builder');
var symtable_1 = require('../pytools/symtable');
var toStringLiteralJS_1 = require('../pytools/toStringLiteralJS');
var SymbolConstants_1 = require('../pytools/SymbolConstants');
var utils_1 = require('./utils');
var TypeWriter_1 = require('./TypeWriter');
var PrinterUnit = (function() {
  function PrinterUnit(name, ste) {
    this.declared = {};
    asserts_1.assert(typeof name === 'string');
    asserts_1.assert(typeof ste === 'object');
    this.name = name;
    this.ste = ste;
    this.private_ = null;
    this.firstlineno = 0;
    this.lineno = 0;
    this.linenoSet = false;
    this.localnames = [];
    this.blocknum = 0;
    this.blocks = [];
    this.curblock = 0;
    this.scopename = null;
    this.prefixCode = '';
    this.varDeclsCode = '';
    this.switchCode = '';
    this.suffixCode = '';
    this.breakBlocks = [];
    this.continueBlocks = [];
    this.exceptBlocks = [];
    this.finallyBlocks = [];
  }
  PrinterUnit.prototype.activateScope = function() {};
  PrinterUnit.prototype.deactivateScope = function() {};
  return PrinterUnit;
}());
var Printer = (function() {
  function Printer(st, flags, sourceText) {
    this.gensymCount = 0;
    this.st = st;
    this.flags = flags;
    this.interactive = false;
    this.nestlevel = 0;
    this.u = null;
    this.stack = [];
    this.result = [];
    this.allUnits = [];
    this.source = sourceText ? sourceText.split("\n") : false;
    this.writer = new TypeWriter_1.TypeWriter();
  }
  Printer.prototype.transpileModule = function(module) {
    this.enterScope("<module>", module, 0);
    this.module(module);
    this.exitScope();
    return this.writer.snapshot();
  };
  Printer.prototype.enterScope = function(name, key, lineno) {
    var u = new PrinterUnit(name, this.st.getStsForAst(key));
    u.firstlineno = lineno;
    if (this.u && this.u.private_) {
      u.private_ = this.u.private_;
    }
    this.stack.push(this.u);
    this.allUnits.push(u);
    var scopeName = this.gensym('scope');
    u.scopename = scopeName;
    this.u = u;
    this.u.activateScope();
    this.nestlevel++;
    return scopeName;
  };
  Printer.prototype.exitScope = function() {
    if (this.u) {
      this.u.deactivateScope();
    }
    this.nestlevel--;
    if (this.stack.length - 1 >= 0) {
      this.u = this.stack.pop();
    } else {
      this.u = null;
    }
    if (this.u) {
      this.u.activateScope();
    }
  };
  Printer.prototype.gensym = function(namespace) {
    var symbolName = namespace || '';
    symbolName = '$' + symbolName;
    symbolName += this.gensymCount++;
    return symbolName;
  };
  Printer.prototype.assign = function(assign) {
    this.writer.beginStatement();
    for (var _i = 0,
        _a = assign.targets; _i < _a.length; _i++) {
      var target = _a[_i];
      if (target instanceof types_5.Name) {
        var flags = this.u.ste.symFlags[target.id];
        if (flags && SymbolConstants_1.DEF_LOCAL) {
          if (this.u.declared[target.id]) {} else {
            this.writer.write("let ");
            this.u.declared[target.id] = true;
          }
        }
      }
      target.accept(this);
    }
    this.writer.write("=");
    assign.value.accept(this);
    this.writer.endStatement();
  };
  Printer.prototype.attribute = function(attribute) {
    attribute.value.accept(this);
    this.writer.write(".");
    this.writer.write(attribute.attr);
  };
  Printer.prototype.binOp = function(be) {
    be.left.accept(this);
    switch (be.op) {
      case types_2.Add:
        {
          this.writer.binOp("+");
          break;
        }
      case types_2.Sub:
        {
          this.writer.binOp("-");
          break;
        }
      case types_2.Mult:
        {
          this.writer.binOp("*");
          break;
        }
      case types_2.Div:
        {
          this.writer.binOp("/");
          break;
        }
      case types_2.BitOr:
        {
          this.writer.binOp("|");
          break;
        }
      case types_2.BitXor:
        {
          this.writer.binOp("^");
          break;
        }
      case types_2.BitAnd:
        {
          this.writer.binOp("&");
          break;
        }
      case types_2.LShift:
        {
          this.writer.binOp("<<");
          break;
        }
      case types_2.RShift:
        {
          this.writer.binOp(">>");
          break;
        }
      case types_2.Mod:
        {
          this.writer.binOp("%");
          break;
        }
      case types_2.FloorDiv:
        {
          this.writer.binOp("//");
          break;
        }
      default:
        {
          throw new Error("Unexpected binary operator " + be.op + ": " + typeof be.op);
        }
    }
    be.right.accept(this);
  };
  Printer.prototype.callExpression = function(ce) {
    if (ce.func instanceof types_5.Name) {
      if (utils_1.isClassNameByConvention(ce.func)) {
        this.writer.write("new ");
      }
    } else if (ce.func instanceof types_1.Attribute) {
      if (utils_1.isClassNameByConvention(ce.func)) {
        this.writer.write("new ");
      }
    } else {
      throw new Error("Call.func must be a Name " + ce.func);
    }
    ce.func.accept(this);
    this.writer.openParen();
    for (var i = 0; i < ce.args.length; i++) {
      if (i > 0) {
        this.writer.comma();
      }
      var arg = ce.args[i];
      arg.accept(this);
    }
    for (var i = 0; i < ce.keywords.length; ++i) {
      ce.keywords[i].value.accept(this);
    }
    if (ce.starargs) {
      ce.starargs.accept(this);
    }
    if (ce.kwargs) {
      ce.kwargs.accept(this);
    }
    this.writer.closeParen();
  };
  Printer.prototype.classDef = function(cd) {
    this.writer.write("class ");
    this.writer.write(cd.name);
    this.writer.beginBlock();
    for (var _i = 0,
        _a = cd.body; _i < _a.length; _i++) {
      var stmt = _a[_i];
      stmt.accept(this);
    }
    this.writer.endBlock();
  };
  Printer.prototype.compareExpression = function(ce) {
    ce.left.accept(this);
    for (var _i = 0,
        _a = ce.ops; _i < _a.length; _i++) {
      var op = _a[_i];
      switch (op) {
        case types_3.Eq:
          {
            this.writer.write("===");
            break;
          }
        case types_3.NotEq:
          {
            this.writer.write("!==");
            break;
          }
        case types_3.Lt:
          {
            this.writer.write("<");
            break;
          }
        case types_3.LtE:
          {
            this.writer.write("<=");
            break;
          }
        case types_3.Gt:
          {
            this.writer.write(">");
            break;
          }
        case types_3.GtE:
          {
            this.writer.write(">=");
            break;
          }
        case types_3.Is:
          {
            this.writer.write("===");
            break;
          }
        case types_3.IsNot:
          {
            this.writer.write("!==");
            break;
          }
        case types_3.In:
          {
            this.writer.write(" in ");
            break;
          }
        case types_3.NotIn:
          {
            this.writer.write(" not in ");
            break;
          }
        default:
          {
            throw new Error("Unexpected comparison expression operator: " + op);
          }
      }
    }
    for (var _b = 0,
        _c = ce.comparators; _b < _c.length; _b++) {
      var comparator = _c[_b];
      comparator.accept(this);
    }
  };
  Printer.prototype.dict = function(dict) {
    var keys = dict.keys;
    var values = dict.values;
    var N = keys.length;
    this.writer.beginObject();
    for (var i = 0; i < N; i++) {
      if (i > 0) {
        this.writer.comma();
      }
      keys[i].accept(this);
      this.writer.write(":");
      values[i].accept(this);
    }
    this.writer.endObject();
  };
  Printer.prototype.expressionStatement = function(s) {
    this.writer.beginStatement();
    s.value.accept(this);
    this.writer.endStatement();
  };
  Printer.prototype.functionDef = function(functionDef) {
    var isClassMethod = utils_1.isMethod(functionDef);
    if (!isClassMethod) {
      this.writer.write("function ");
    }
    this.writer.write(functionDef.name);
    this.writer.openParen();
    for (var i = 0; i < functionDef.args.args.length; i++) {
      var arg = functionDef.args.args[i];
      if (i === 0) {
        if (arg.id === 'self') {} else {
          arg.accept(this);
        }
      } else {
        arg.accept(this);
      }
    }
    this.writer.closeParen();
    this.writer.beginBlock();
    for (var _i = 0,
        _a = functionDef.body; _i < _a.length; _i++) {
      var stmt = _a[_i];
      stmt.accept(this);
    }
    this.writer.endBlock();
  };
  Printer.prototype.ifStatement = function(i) {
    this.writer.write("if");
    this.writer.openParen();
    i.test.accept(this);
    this.writer.closeParen();
    this.writer.beginBlock();
    for (var _i = 0,
        _a = i.consequent; _i < _a.length; _i++) {
      var con = _a[_i];
      con.accept(this);
    }
    this.writer.endBlock();
  };
  Printer.prototype.importFrom = function(importFrom) {
    this.writer.beginStatement();
    this.writer.write("import ");
    this.writer.beginBlock();
    for (var i = 0; i < importFrom.names.length; i++) {
      if (i > 0) {
        this.writer.comma();
      }
      var alias = importFrom.names[i];
      this.writer.write(alias.name);
      if (alias.asname) {
        this.writer.write(" as ");
        this.writer.write(alias.asname);
      }
    }
    this.writer.endBlock();
    this.writer.write(" from ");
    this.writer.beginQuote();
    this.writer.write(importFrom.module);
    this.writer.endQuote();
    this.writer.endStatement();
  };
  Printer.prototype.list = function(list) {
    var elements = list.elts;
    var N = elements.length;
    this.writer.write('[');
    for (var i = 0; i < N; i++) {
      if (i > 0) {
        this.writer.comma();
      }
      elements[i].accept(this);
    }
    this.writer.write(']');
  };
  Printer.prototype.module = function(m) {
    for (var _i = 0,
        _a = m.body; _i < _a.length; _i++) {
      var stmt = _a[_i];
      stmt.accept(this);
    }
  };
  Printer.prototype.name = function(name) {
    switch (name.id) {
      case 'True':
        {
          this.writer.write('true');
          break;
        }
      case 'False':
        {
          this.writer.write('false');
          break;
        }
      default:
        {
          this.writer.write(name.id);
        }
    }
  };
  Printer.prototype.num = function(num) {
    var n = num.n;
    this.writer.write(n.toString());
  };
  Printer.prototype.print = function(print) {
    this.writer.write("console.log");
    this.writer.openParen();
    for (var _i = 0,
        _a = print.values; _i < _a.length; _i++) {
      var value = _a[_i];
      value.accept(this);
    }
    this.writer.closeParen();
  };
  Printer.prototype.returnStatement = function(rs) {
    this.writer.beginStatement();
    this.writer.write("return ");
    rs.value.accept(this);
    this.writer.endStatement();
  };
  Printer.prototype.str = function(str) {
    var s = str.s;
    this.writer.write(toStringLiteralJS_1.toStringLiteralJS(s));
  };
  return Printer;
}());
function transpileModule(sourceText) {
  var cst = parser_1.parse(sourceText, parser_1.SourceKind.File);
  if (typeof cst === 'object') {
    var stmts = builder_1.astFromParse(cst);
    var mod = new types_4.Module(stmts);
    var symbolTable = symtable_1.semanticsOfModule(mod);
    var printer = new Printer(symbolTable, 0, sourceText);
    return {
      code: printer.transpileModule(mod),
      cst: cst,
      mod: mod,
      symbolTable: symbolTable
    };
  } else {
    throw new Error("Error parsing source for file.");
  }
}
exports.transpileModule = transpileModule;

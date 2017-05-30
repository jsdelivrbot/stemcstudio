/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var asserts_1 = require('./asserts');
var tree_1 = require('./tree');
var types_1 = require('./types');
var types_2 = require('./types');
var types_3 = require('./types');
var types_4 = require('./types');
var types_5 = require('./types');
var types_6 = require('./types');
var types_7 = require('./types');
var types_8 = require('./types');
var types_9 = require('./types');
var types_10 = require('./types');
var types_11 = require('./types');
var types_12 = require('./types');
var types_13 = require('./types');
var types_14 = require('./types');
var types_15 = require('./types');
var types_16 = require('./types');
var types_17 = require('./types');
var types_18 = require('./types');
var types_19 = require('./types');
var types_20 = require('./types');
var types_21 = require('./types');
var types_22 = require('./types');
var types_23 = require('./types');
var types_24 = require('./types');
var types_25 = require('./types');
var types_26 = require('./types');
var types_27 = require('./types');
var types_28 = require('./types');
var types_29 = require('./types');
var types_30 = require('./types');
var types_31 = require('./types');
var types_32 = require('./types');
var types_33 = require('./types');
var types_34 = require('./types');
var types_35 = require('./types');
var types_36 = require('./types');
var types_37 = require('./types');
var types_38 = require('./types');
var types_39 = require('./types');
var types_40 = require('./types');
var types_41 = require('./types');
var types_42 = require('./types');
var types_43 = require('./types');
var types_44 = require('./types');
var types_45 = require('./types');
var types_46 = require('./types');
var types_47 = require('./types');
var types_48 = require('./types');
var types_49 = require('./types');
var types_50 = require('./types');
var types_51 = require('./types');
var types_52 = require('./types');
var types_53 = require('./types');
var types_54 = require('./types');
var types_55 = require('./types');
var types_56 = require('./types');
var types_57 = require('./types');
var types_58 = require('./types');
var types_59 = require('./types');
var types_60 = require('./types');
var types_61 = require('./types');
var types_62 = require('./types');
var types_63 = require('./types');
var types_64 = require('./types');
var types_65 = require('./types');
var types_66 = require('./types');
var types_67 = require('./types');
var types_68 = require('./types');
var types_69 = require('./types');
var types_70 = require('./types');
var types_71 = require('./types');
var types_72 = require('./types');
var types_73 = require('./types');
var types_74 = require('./types');
var types_75 = require('./types');
var types_76 = require('./types');
var types_77 = require('./types');
var types_78 = require('./types');
var types_79 = require('./types');
var types_80 = require('./types');
var types_81 = require('./types');
var types_82 = require('./types');
var types_83 = require('./types');
var types_84 = require('./types');
var types_85 = require('./types');
var base_1 = require('./base');
var tables_1 = require('./tables');
var Tokens_1 = require('./Tokens');
var numericLiteral_1 = require('./numericLiteral');
var grammarName_1 = require('./grammarName');
var SYM = tables_1.ParseTables.sym;
var LONG_THRESHOLD = Math.pow(2, 53);
function syntaxError(message, lineNumber) {
  asserts_1.assert(base_1.isString(message), "message must be a string");
  asserts_1.assert(base_1.isNumber(lineNumber), "lineNumber must be a number");
  var e = new SyntaxError(message);
  e['lineNumber'] = lineNumber;
  return e;
}
var Compiling = (function() {
  function Compiling(encoding) {
    this.c_encoding = encoding;
  }
  return Compiling;
}());
function REQ(n, type) {
  if (n.type !== type) {
    asserts_1.fail("node must have type " + type + " = " + grammarName_1.grammarName(type) + ", but was " + n.type + " = " + grammarName_1.grammarName(n.type) + ".");
  }
}
function strobj(s) {
  if (typeof s !== 'string') {
    asserts_1.fail("expecting string, got " + (typeof s));
  }
  return s;
}
function numStmts(n) {
  switch (n.type) {
    case SYM.single_input:
      if (tree_1.CHILD(n, 0).type === Tokens_1.Tokens.T_NEWLINE)
        return 0;
      else
        return numStmts(tree_1.CHILD(n, 0));
    case SYM.file_input:
      var cnt = 0;
      for (var i = 0; i < tree_1.NCH(n); ++i) {
        var ch = tree_1.CHILD(n, i);
        if (ch.type === SYM.stmt) {
          cnt += numStmts(ch);
        }
      }
      return cnt;
    case SYM.stmt:
      return numStmts(tree_1.CHILD(n, 0));
    case SYM.compound_stmt:
      return 1;
    case SYM.simple_stmt:
      return Math.floor(tree_1.NCH(n) / 2);
    case SYM.suite:
      if (tree_1.NCH(n) === 1)
        return numStmts(tree_1.CHILD(n, 0));
      else {
        var cnt_1 = 0;
        for (var i = 2; i < tree_1.NCH(n) - 1; ++i) {
          cnt_1 += numStmts(tree_1.CHILD(n, i));
        }
        return cnt_1;
      }
    default:
      {
        throw new Error("Non-statement found");
      }
  }
}
function forbiddenCheck(c, n, x, lineno) {
  if (x === "None")
    throw syntaxError("assignment to None", lineno);
  if (x === "True" || x === "False")
    throw syntaxError("assignment to True or False is forbidden", lineno);
}
function setContext(c, e, ctx, n) {
  asserts_1.assert(ctx !== types_10.AugStore && ctx !== types_9.AugLoad);
  var s = null;
  var exprName = null;
  if (e instanceof types_7.Attribute) {
    if (ctx === types_73.Store)
      forbiddenCheck(c, n, e.attr, n.lineno);
    e.ctx = ctx;
  } else if (e instanceof types_58.Name) {
    if (ctx === types_73.Store)
      forbiddenCheck(c, n, void 0, n.lineno);
    e.ctx = ctx;
  } else if (e instanceof types_76.Subscript) {
    e.ctx = ctx;
  } else if (e instanceof types_50.List) {
    e.ctx = ctx;
    s = e.elts;
  } else if (e instanceof types_79.Tuple) {
    if (e.elts.length === 0) {
      throw syntaxError("can't assign to ()", n.lineno);
    }
    e.ctx = ctx;
    s = e.elts;
  } else if (e instanceof types_49.Lambda) {
    exprName = "lambda";
  } else if (e instanceof types_17.Call) {
    exprName = "function call";
  } else if (e instanceof types_15.BoolOp) {
    exprName = "operator";
  } else {
    switch (e.constructor) {
      case types_15.BoolOp:
      case types_11.BinOp:
      case types_81.UnaryOp:
        exprName = "operator";
        break;
      case types_35.GeneratorExp:
        exprName = "generator expression";
        break;
      case types_85.Yield:
        exprName = "yield expression";
        break;
      case types_51.ListComp:
        exprName = "list comprehension";
        break;
      case types_24.Dict:
      case types_63.Num:
      case types_74.Str:
        exprName = "literal";
        break;
      case types_19.Compare:
        exprName = "comparison expression";
        break;
      case types_41.IfExp:
        exprName = "conditional expression";
        break;
      default:
        {
          throw new Error("unhandled expression in assignment");
        }
    }
  }
  if (exprName) {
    throw syntaxError("can't " + (ctx === types_73.Store ? "assign to" : "delete") + " " + exprName, n.lineno);
  }
  if (s) {
    for (var i = 0; i < s.length; ++i) {
      setContext(c, s[i], ctx, n);
    }
  }
}
var operatorMap = {};
(function() {
  operatorMap[Tokens_1.Tokens.T_VBAR] = types_13.BitOr;
  asserts_1.assert(operatorMap[Tokens_1.Tokens.T_VBAR] !== undefined, "" + Tokens_1.Tokens.T_VBAR);
  operatorMap[Tokens_1.Tokens.T_VBAR] = types_13.BitOr;
  operatorMap[Tokens_1.Tokens.T_CIRCUMFLEX] = types_14.BitXor;
  operatorMap[Tokens_1.Tokens.T_AMPER] = types_12.BitAnd;
  operatorMap[Tokens_1.Tokens.T_LEFTSHIFT] = types_53.LShift;
  operatorMap[Tokens_1.Tokens.T_RIGHTSHIFT] = types_71.RShift;
  operatorMap[Tokens_1.Tokens.T_PLUS] = types_1.Add;
  operatorMap[Tokens_1.Tokens.T_MINUS] = types_75.Sub;
  operatorMap[Tokens_1.Tokens.T_STAR] = types_57.Mult;
  operatorMap[Tokens_1.Tokens.T_SLASH] = types_25.Div;
  operatorMap[Tokens_1.Tokens.T_DOUBLESLASH] = types_32.FloorDiv;
  operatorMap[Tokens_1.Tokens.T_PERCENT] = types_56.Mod;
}());
function getOperator(n) {
  asserts_1.assert(operatorMap[n.type] !== undefined, "" + n.type);
  return operatorMap[n.type];
}
function astForCompOp(c, n) {
  REQ(n, SYM.comp_op);
  if (tree_1.NCH(n) === 1) {
    n = tree_1.CHILD(n, 0);
    switch (n.type) {
      case Tokens_1.Tokens.T_LESS:
        return types_54.Lt;
      case Tokens_1.Tokens.T_GREATER:
        return types_37.Gt;
      case Tokens_1.Tokens.T_EQEQUAL:
        return types_27.Eq;
      case Tokens_1.Tokens.T_LESSEQUAL:
        return types_55.LtE;
      case Tokens_1.Tokens.T_GREATEREQUAL:
        return types_38.GtE;
      case Tokens_1.Tokens.T_NOTEQUAL:
        return types_61.NotEq;
      case Tokens_1.Tokens.T_NAME:
        if (n.value === "in")
          return types_45.In;
        if (n.value === "is")
          return types_47.Is;
    }
  } else if (tree_1.NCH(n) === 2) {
    if (tree_1.CHILD(n, 0).type === Tokens_1.Tokens.T_NAME) {
      if (tree_1.CHILD(n, 1).value === "in")
        return types_62.NotIn;
      if (tree_1.CHILD(n, 0).value === "is")
        return types_48.IsNot;
    }
  }
  throw new Error("invalid comp_op");
}
function seqForTestlist(c, n) {
  asserts_1.assert(n.type === SYM.testlist || n.type === SYM.listmaker || n.type === SYM.testlist_gexp || n.type === SYM.testlist_safe || n.type === SYM.testlist1);
  var seq = [];
  for (var i = 0; i < tree_1.NCH(n); i += 2) {
    asserts_1.assert(tree_1.CHILD(n, i).type === SYM.IfExpr || tree_1.CHILD(n, i).type === SYM.old_test);
    seq[i / 2] = astForExpr(c, tree_1.CHILD(n, i));
  }
  return seq;
}
function astForSuite(c, n) {
  REQ(n, SYM.suite);
  var seq = [];
  var pos = 0;
  var ch;
  if (tree_1.CHILD(n, 0).type === SYM.simple_stmt) {
    n = tree_1.CHILD(n, 0);
    var end = tree_1.NCH(n) - 1;
    if (tree_1.CHILD(n, end - 1).type === Tokens_1.Tokens.T_SEMI) {
      end -= 1;
    }
    for (var i = 0; i < end; i += 2) {
      seq[pos++] = astForStmt(c, tree_1.CHILD(n, i));
    }
  } else {
    for (var i = 2; i < tree_1.NCH(n) - 1; ++i) {
      ch = tree_1.CHILD(n, i);
      REQ(ch, SYM.stmt);
      var num = numStmts(ch);
      if (num === 1) {
        seq[pos++] = astForStmt(c, ch);
      } else {
        ch = tree_1.CHILD(ch, 0);
        REQ(ch, SYM.simple_stmt);
        for (var j = 0; j < tree_1.NCH(ch); j += 2) {
          if (tree_1.NCH(tree_1.CHILD(ch, j)) === 0) {
            asserts_1.assert(j + 1 === tree_1.NCH(ch));
            break;
          }
          seq[pos++] = astForStmt(c, tree_1.CHILD(ch, j));
        }
      }
    }
  }
  asserts_1.assert(pos === numStmts(n));
  return seq;
}
function astForExceptClause(c, exc, body) {
  REQ(exc, SYM.except_clause);
  REQ(body, SYM.suite);
  if (tree_1.NCH(exc) === 1)
    return new types_28.ExceptHandler(null, null, astForSuite(c, body), exc.lineno, exc.col_offset);
  else if (tree_1.NCH(exc) === 2)
    return new types_28.ExceptHandler(astForExpr(c, tree_1.CHILD(exc, 1)), null, astForSuite(c, body), exc.lineno, exc.col_offset);
  else if (tree_1.NCH(exc) === 4) {
    var e = astForExpr(c, tree_1.CHILD(exc, 3));
    setContext(c, e, types_73.Store, tree_1.CHILD(exc, 3));
    return new types_28.ExceptHandler(astForExpr(c, tree_1.CHILD(exc, 1)), e, astForSuite(c, body), exc.lineno, exc.col_offset);
  } else {
    throw new Error("wrong number of children for except clause");
  }
}
function astForTryStmt(c, n) {
  var nc = tree_1.NCH(n);
  var nexcept = (nc - 3) / 3;
  var orelse = [];
  var finally_ = null;
  REQ(n, SYM.try_stmt);
  var body = astForSuite(c, tree_1.CHILD(n, 2));
  if (tree_1.CHILD(n, nc - 3).type === Tokens_1.Tokens.T_NAME) {
    if (tree_1.CHILD(n, nc - 3).value === "finally") {
      if (nc >= 9 && tree_1.CHILD(n, nc - 6).type === Tokens_1.Tokens.T_NAME) {
        orelse = astForSuite(c, tree_1.CHILD(n, nc - 4));
        nexcept--;
      }
      finally_ = astForSuite(c, tree_1.CHILD(n, nc - 1));
      nexcept--;
    } else {
      orelse = astForSuite(c, tree_1.CHILD(n, nc - 1));
      nexcept--;
    }
  } else if (tree_1.CHILD(n, nc - 3).type !== SYM.except_clause) {
    throw syntaxError("malformed 'try' statement", n.lineno);
  }
  if (nexcept > 0) {
    var handlers = [];
    for (var i = 0; i < nexcept; ++i)
      handlers[i] = astForExceptClause(c, tree_1.CHILD(n, 3 + i * 3), tree_1.CHILD(n, 5 + i * 3));
    var exceptSt = new types_77.TryExcept(body, handlers, orelse, n.lineno, n.col_offset);
    if (!finally_)
      return exceptSt;
    body = [exceptSt];
  }
  asserts_1.assert(finally_ !== null);
  return new types_78.TryFinally(body, finally_, n.lineno, n.col_offset);
}
function astForDottedName(c, n) {
  REQ(n, SYM.dotted_name);
  var lineno = n.lineno;
  var col_offset = n.col_offset;
  var id = strobj(tree_1.CHILD(n, 0).value);
  var e = new types_58.Name(id, types_52.Load, lineno, col_offset);
  for (var i = 2; i < tree_1.NCH(n); i += 2) {
    id = strobj(tree_1.CHILD(n, i).value);
    e = new types_7.Attribute(e, id, types_52.Load, lineno, col_offset);
  }
  return e;
}
function astForDecorator(c, n) {
  REQ(n, SYM.decorator);
  REQ(tree_1.CHILD(n, 0), Tokens_1.Tokens.T_AT);
  REQ(tree_1.CHILD(n, tree_1.NCH(n) - 1), Tokens_1.Tokens.T_NEWLINE);
  var nameExpr = astForDottedName(c, tree_1.CHILD(n, 1));
  if (tree_1.NCH(n) === 3)
    return nameExpr;
  else if (tree_1.NCH(n) === 5)
    return new types_17.Call(nameExpr, [], [], null, null, n.lineno, n.col_offset);
  else
    return astForCall(c, tree_1.CHILD(n, 3), nameExpr);
}
function astForDecorators(c, n) {
  REQ(n, SYM.decorators);
  var decoratorSeq = [];
  for (var i = 0; i < tree_1.NCH(n); ++i) {
    decoratorSeq[i] = astForDecorator(c, tree_1.CHILD(n, i));
  }
  return decoratorSeq;
}
function astForDecorated(c, n) {
  REQ(n, SYM.decorated);
  var decoratorSeq = astForDecorators(c, tree_1.CHILD(n, 0));
  asserts_1.assert(tree_1.CHILD(n, 1).type === SYM.funcdef || tree_1.CHILD(n, 1).type === SYM.classdef);
  var thing = null;
  if (tree_1.CHILD(n, 1).type === SYM.funcdef) {
    thing = astForFuncdef(c, tree_1.CHILD(n, 1), decoratorSeq);
  } else if (tree_1.CHILD(n, 1).type === SYM.classdef) {
    thing = astForClassdef(c, tree_1.CHILD(n, 1), decoratorSeq);
  } else {
    throw new Error("astForDecorated");
  }
  if (thing) {
    thing.lineno = n.lineno;
    thing.col_offset = n.col_offset;
  }
  return thing;
}
function astForWithVar(c, n) {
  REQ(n, SYM.with_var);
  return astForExpr(c, tree_1.CHILD(n, 1));
}
function astForWithStmt(c, n) {
  var suiteIndex = 3;
  asserts_1.assert(n.type === SYM.with_stmt);
  var contextExpr = astForExpr(c, tree_1.CHILD(n, 1));
  var optionalVars;
  if (tree_1.CHILD(n, 2).type === SYM.with_var) {
    optionalVars = astForWithVar(c, tree_1.CHILD(n, 2));
    setContext(c, optionalVars, types_73.Store, n);
    suiteIndex = 4;
  }
  return new types_84.WithStatement(contextExpr, optionalVars, astForSuite(c, tree_1.CHILD(n, suiteIndex)), n.lineno, n.col_offset);
}
function astForExecStmt(c, n) {
  var globals = null;
  var locals = null;
  var nchildren = tree_1.NCH(n);
  asserts_1.assert(nchildren === 2 || nchildren === 4 || nchildren === 6);
  REQ(n, SYM.exec_stmt);
  var expr1 = astForExpr(c, tree_1.CHILD(n, 1));
  if (nchildren >= 4) {
    globals = astForExpr(c, tree_1.CHILD(n, 3));
  }
  if (nchildren === 6) {
    locals = astForExpr(c, tree_1.CHILD(n, 5));
  }
  return new types_29.Exec(expr1, globals, locals, n.lineno, n.col_offset);
}
function astForIfStmt(c, n) {
  REQ(n, SYM.if_stmt);
  if (tree_1.NCH(n) === 4)
    return new types_40.IfStatement(astForExpr(c, tree_1.CHILD(n, 1)), astForSuite(c, tree_1.CHILD(n, 3)), [], n.lineno, n.col_offset);
  var s = tree_1.CHILD(n, 4).value;
  var decider = s.charAt(2);
  if (decider === 's') {
    return new types_40.IfStatement(astForExpr(c, tree_1.CHILD(n, 1)), astForSuite(c, tree_1.CHILD(n, 3)), astForSuite(c, tree_1.CHILD(n, 6)), n.lineno, n.col_offset);
  } else if (decider === 'i') {
    var nElif = tree_1.NCH(n) - 4;
    var hasElse = false;
    var orelse = [];
    if (tree_1.CHILD(n, nElif + 1).type === Tokens_1.Tokens.T_NAME && tree_1.CHILD(n, nElif + 1).value.charAt(2) === 's') {
      hasElse = true;
      nElif -= 3;
    }
    nElif /= 4;
    if (hasElse) {
      orelse = [new types_40.IfStatement(astForExpr(c, tree_1.CHILD(n, tree_1.NCH(n) - 6)), astForSuite(c, tree_1.CHILD(n, tree_1.NCH(n) - 4)), astForSuite(c, tree_1.CHILD(n, tree_1.NCH(n) - 1)), tree_1.CHILD(n, tree_1.NCH(n) - 6).lineno, tree_1.CHILD(n, tree_1.NCH(n) - 6).col_offset)];
      nElif--;
    }
    for (var i = 0; i < nElif; ++i) {
      var off = 5 + (nElif - i - 1) * 4;
      orelse = [new types_40.IfStatement(astForExpr(c, tree_1.CHILD(n, off)), astForSuite(c, tree_1.CHILD(n, off + 2)), orelse, tree_1.CHILD(n, off).lineno, tree_1.CHILD(n, off).col_offset)];
    }
    return new types_40.IfStatement(astForExpr(c, tree_1.CHILD(n, 1)), astForSuite(c, tree_1.CHILD(n, 3)), orelse, n.lineno, n.col_offset);
  }
  throw new Error("unexpected token in 'if' statement");
}
function astForExprlist(c, n, context) {
  REQ(n, SYM.ExprList);
  var seq = [];
  for (var i = 0; i < tree_1.NCH(n); i += 2) {
    var e = astForExpr(c, tree_1.CHILD(n, i));
    seq[i / 2] = e;
    if (context)
      setContext(c, e, context, tree_1.CHILD(n, i));
  }
  return seq;
}
function astForDelStmt(c, n) {
  REQ(n, SYM.del_stmt);
  return new types_23.DeleteStatement(astForExprlist(c, tree_1.CHILD(n, 1), types_22.Del), n.lineno, n.col_offset);
}
function astForGlobalStmt(c, n) {
  REQ(n, SYM.GlobalStmt);
  var s = [];
  for (var i = 1; i < tree_1.NCH(n); i += 2) {
    s[(i - 1) / 2] = strobj(tree_1.CHILD(n, i).value);
  }
  return new types_36.Global(s, n.lineno, n.col_offset);
}
function astForNonLocalStmt(c, n) {
  REQ(n, SYM.NonLocalStmt);
  var s = [];
  for (var i = 1; i < tree_1.NCH(n); i += 2) {
    s[(i - 1) / 2] = strobj(tree_1.CHILD(n, i).value);
  }
  return new types_59.NonLocal(s, n.lineno, n.col_offset);
}
function astForAssertStmt(c, n) {
  REQ(n, SYM.assert_stmt);
  if (tree_1.NCH(n) === 2) {
    return new types_5.Assert(astForExpr(c, tree_1.CHILD(n, 1)), null, n.lineno, n.col_offset);
  } else if (tree_1.NCH(n) === 4) {
    return new types_5.Assert(astForExpr(c, tree_1.CHILD(n, 1)), astForExpr(c, tree_1.CHILD(n, 3)), n.lineno, n.col_offset);
  }
  throw new Error("improper number of parts to assert stmt");
}
function aliasForImportName(c, n) {
  loop: while (true) {
    switch (n.type) {
      case SYM.ImportSpecifier:
        {
          var str = null;
          var name_1 = strobj(tree_1.CHILD(n, 0).value);
          if (tree_1.NCH(n) === 3) {
            str = tree_1.CHILD(n, 2).value;
          }
          return new types_2.Alias(name_1, str == null ? null : strobj(str));
        }
      case SYM.dotted_as_name:
        if (tree_1.NCH(n) === 1) {
          n = tree_1.CHILD(n, 0);
          continue loop;
        } else {
          var a = aliasForImportName(c, tree_1.CHILD(n, 0));
          asserts_1.assert(!a.asname);
          a.asname = strobj(tree_1.CHILD(n, 2).value);
          return a;
        }
      case SYM.dotted_name:
        if (tree_1.NCH(n) === 1)
          return new types_2.Alias(strobj(tree_1.CHILD(n, 0).value), null);
        else {
          var str = '';
          for (var i = 0; i < tree_1.NCH(n); i += 2)
            str += tree_1.CHILD(n, i).value + ".";
          return new types_2.Alias(strobj(str.substr(0, str.length - 1)), null);
        }
      case Tokens_1.Tokens.T_STAR:
        {
          return new types_2.Alias(strobj("*"), null);
        }
      case Tokens_1.Tokens.T_NAME:
        {
          return new types_2.Alias(strobj(n.value), null);
        }
      default:
        {
          throw syntaxError("unexpected import name " + grammarName_1.grammarName(n.type), n.lineno);
        }
    }
  }
}
function parseModuleSpecifier(c, moduleSpecifierNode) {
  REQ(moduleSpecifierNode, SYM.ModuleSpecifier);
  var N = tree_1.NCH(moduleSpecifierNode);
  var ret = "";
  for (var i = 0; i < N; ++i) {
    var child = tree_1.CHILD(moduleSpecifierNode, i);
    ret = ret + parsestr(c, child.value);
  }
  return ret;
}
function astForImportStmt(c, importStatementNode) {
  REQ(importStatementNode, SYM.import_stmt);
  var lineno = importStatementNode.lineno;
  var col_offset = importStatementNode.col_offset;
  var nameOrFrom = tree_1.CHILD(importStatementNode, 0);
  if (nameOrFrom.type === SYM.import_name) {
    var n = tree_1.CHILD(nameOrFrom, 1);
    REQ(n, SYM.dotted_as_names);
    var aliases = [];
    for (var i = 0; i < tree_1.NCH(n); i += 2) {
      aliases[i / 2] = aliasForImportName(c, tree_1.CHILD(n, i));
    }
    return new types_42.ImportStatement(aliases, lineno, col_offset);
  } else if (nameOrFrom.type === SYM.import_from) {
    var mod = null;
    var moduleName = "";
    var ndots = 0;
    var nchildren = void 0;
    var idx = void 0;
    for (idx = 1; idx < tree_1.NCH(nameOrFrom); ++idx) {
      var child = tree_1.CHILD(nameOrFrom, idx);
      var childType = child.type;
      if (childType === SYM.dotted_name) {
        throw syntaxError("unknown import statement " + grammarName_1.grammarName(childType) + ".", child.lineno);
      } else if (childType === SYM.ModuleSpecifier) {
        moduleName = parseModuleSpecifier(c, child);
        break;
      } else if (childType !== Tokens_1.Tokens.T_DOT) {
        throw syntaxError("unknown import statement " + grammarName_1.grammarName(childType) + ".", child.lineno);
      }
      ndots++;
    }
    ++idx;
    var n = nameOrFrom;
    switch (tree_1.CHILD(nameOrFrom, idx).type) {
      case Tokens_1.Tokens.T_STAR:
        {
          n = tree_1.CHILD(nameOrFrom, idx);
          nchildren = 1;
          break;
        }
      case Tokens_1.Tokens.T_LPAR:
        {
          n = tree_1.CHILD(n, idx + 1);
          nchildren = tree_1.NCH(n);
          break;
        }
      case SYM.ImportList:
        {
          n = tree_1.CHILD(n, idx);
          nchildren = tree_1.NCH(n);
          if (nchildren % 2 === 0)
            throw syntaxError("trailing comma not allowed without surrounding parentheses", n.lineno);
        }
    }
    var aliases = [];
    if (n.type === Tokens_1.Tokens.T_STAR) {
      aliases[0] = aliasForImportName(c, n);
    } else {
      REQ(n, SYM.import_from);
      var importListNode = tree_1.CHILD(n, tree_1.FIND(n, SYM.ImportList));
      astForImportList(c, importListNode, aliases);
    }
    moduleName = mod ? mod.name : moduleName;
    return new types_43.ImportFrom(strobj(moduleName), aliases, ndots, lineno, col_offset);
  } else {
    throw syntaxError("unknown import statement " + grammarName_1.grammarName(nameOrFrom.type) + ".", nameOrFrom.lineno);
  }
}
function astForImportList(c, importListNode, aliases) {
  REQ(importListNode, SYM.ImportList);
  var N = tree_1.NCH(importListNode);
  for (var i = 0; i < N; i++) {
    var child = tree_1.CHILD(importListNode, i);
    if (child.type === SYM.ImportSpecifier) {
      aliases.push(aliasForImportName(c, child));
    }
  }
}
function astForTestlistGexp(c, n) {
  asserts_1.assert(n.type === SYM.testlist_gexp || n.type === SYM.argument);
  if (tree_1.NCH(n) > 1 && tree_1.CHILD(n, 1).type === SYM.gen_for)
    return astForGenexp(c, n);
  return astForTestlist(c, n);
}
function astForListcomp(c, n) {
  function countListFors(c, n) {
    var nfors = 0;
    var ch = tree_1.CHILD(n, 1);
    count_list_for: while (true) {
      nfors++;
      REQ(ch, SYM.list_for);
      if (tree_1.NCH(ch) === 5)
        ch = tree_1.CHILD(ch, 4);
      else
        return nfors;
      count_list_iter: while (true) {
        REQ(ch, SYM.list_iter);
        ch = tree_1.CHILD(ch, 0);
        if (ch.type === SYM.list_for)
          continue count_list_for;
        else if (ch.type === SYM.list_if) {
          if (tree_1.NCH(ch) === 3) {
            ch = tree_1.CHILD(ch, 2);
            continue count_list_iter;
          } else
            return nfors;
        }
        break;
      }
      break;
    }
    throw new Error("TODO: Should this be returning void 0?");
  }
  function countListIfs(c, n) {
    var nifs = 0;
    while (true) {
      REQ(n, SYM.list_iter);
      if (tree_1.CHILD(n, 0).type === SYM.list_for)
        return nifs;
      n = tree_1.CHILD(n, 0);
      REQ(n, SYM.list_if);
      nifs++;
      if (tree_1.NCH(n) === 2)
        return nifs;
      n = tree_1.CHILD(n, 2);
    }
  }
  REQ(n, SYM.listmaker);
  asserts_1.assert(tree_1.NCH(n) > 1);
  var elt = astForExpr(c, tree_1.CHILD(n, 0));
  var nfors = countListFors(c, n);
  var listcomps = [];
  var ch = tree_1.CHILD(n, 1);
  for (var i = 0; i < nfors; ++i) {
    REQ(ch, SYM.list_for);
    var forch = tree_1.CHILD(ch, 1);
    var t = astForExprlist(c, forch, types_73.Store);
    var expression = astForTestlist(c, tree_1.CHILD(ch, 3));
    var lc = void 0;
    if (tree_1.NCH(forch) === 1)
      lc = new types_20.Comprehension(t[0], expression, []);
    else
      lc = new types_20.Comprehension(new types_79.Tuple(t, types_73.Store, ch.lineno, ch.col_offset), expression, []);
    if (tree_1.NCH(ch) === 5) {
      ch = tree_1.CHILD(ch, 4);
      var nifs = countListIfs(c, ch);
      var ifs = [];
      for (var j = 0; j < nifs; ++j) {
        REQ(ch, SYM.list_iter);
        ch = tree_1.CHILD(ch, 0);
        REQ(ch, SYM.list_if);
        ifs[j] = astForExpr(c, tree_1.CHILD(ch, 1));
        if (tree_1.NCH(ch) === 3)
          ch = tree_1.CHILD(ch, 2);
      }
      if (ch.type === SYM.list_iter)
        ch = tree_1.CHILD(ch, 0);
      lc.ifs = ifs;
    }
    listcomps[i] = lc;
  }
  return new types_51.ListComp(elt, listcomps, n.lineno, n.col_offset);
}
function astForUnaryExpr(c, n) {
  if (tree_1.CHILD(n, 0).type === Tokens_1.Tokens.T_MINUS && tree_1.NCH(n) === 2) {
    var pfactor = tree_1.CHILD(n, 1);
    if (pfactor.type === SYM.UnaryExpr && tree_1.NCH(pfactor) === 1) {
      var ppower = tree_1.CHILD(pfactor, 0);
      if (ppower.type === SYM.PowerExpr && tree_1.NCH(ppower) === 1) {
        var patom = tree_1.CHILD(ppower, 0);
        if (patom.type === SYM.AtomExpr) {
          var pnum = tree_1.CHILD(patom, 0);
          if (pnum.type === Tokens_1.Tokens.T_NUMBER) {
            pnum.value = "-" + pnum.value;
            return astForAtomExpr(c, patom);
          }
        }
      }
    }
  }
  var expression = astForExpr(c, tree_1.CHILD(n, 1));
  switch (tree_1.CHILD(n, 0).type) {
    case Tokens_1.Tokens.T_PLUS:
      return new types_81.UnaryOp(types_80.UAdd, expression, n.lineno, n.col_offset);
    case Tokens_1.Tokens.T_MINUS:
      return new types_81.UnaryOp(types_82.USub, expression, n.lineno, n.col_offset);
    case Tokens_1.Tokens.T_TILDE:
      return new types_81.UnaryOp(types_46.Invert, expression, n.lineno, n.col_offset);
  }
  throw new Error("unhandled UnaryExpr");
}
function astForForStmt(c, n) {
  var seq = [];
  REQ(n, SYM.for_stmt);
  if (tree_1.NCH(n) === 9) {
    seq = astForSuite(c, tree_1.CHILD(n, 8));
  }
  var nodeTarget = tree_1.CHILD(n, 1);
  var _target = astForExprlist(c, nodeTarget, types_73.Store);
  var target;
  if (tree_1.NCH(nodeTarget) === 1)
    target = _target[0];
  else
    target = new types_79.Tuple(_target, types_73.Store, n.lineno, n.col_offset);
  return new types_33.ForStatement(target, astForTestlist(c, tree_1.CHILD(n, 3)), astForSuite(c, tree_1.CHILD(n, 5)), seq, n.lineno, n.col_offset);
}
function astForCall(c, n, func) {
  REQ(n, SYM.arglist);
  var nargs = 0;
  var nkeywords = 0;
  var ngens = 0;
  for (var i = 0; i < tree_1.NCH(n); ++i) {
    var ch = tree_1.CHILD(n, i);
    if (ch.type === SYM.argument) {
      if (tree_1.NCH(ch) === 1)
        nargs++;
      else if (tree_1.CHILD(ch, 1).type === SYM.gen_for)
        ngens++;
      else
        nkeywords++;
    }
  }
  if (ngens > 1 || (ngens && (nargs || nkeywords)))
    throw syntaxError("Generator expression must be parenthesized if not sole argument", n.lineno);
  if (nargs + nkeywords + ngens > 255)
    throw syntaxError("more than 255 arguments", n.lineno);
  var args = [];
  var keywords = [];
  nargs = 0;
  nkeywords = 0;
  var vararg = null;
  var kwarg = null;
  for (var i = 0; i < tree_1.NCH(n); ++i) {
    var ch = tree_1.CHILD(n, i);
    if (ch.type === SYM.argument) {
      if (tree_1.NCH(ch) === 1) {
        if (nkeywords)
          throw syntaxError("non-keyword arg after keyword arg", n.lineno);
        if (vararg)
          throw syntaxError("only named arguments may follow *expression", n.lineno);
        args[nargs++] = astForExpr(c, tree_1.CHILD(ch, 0));
      } else if (tree_1.CHILD(ch, 1).type === SYM.gen_for)
        args[nargs++] = astForGenexp(c, ch);
      else {
        var e = astForExpr(c, tree_1.CHILD(ch, 0));
        if (e.constructor === types_49.Lambda)
          throw syntaxError("lambda cannot contain assignment", n.lineno);
        else if (e.constructor !== types_58.Name)
          throw syntaxError("keyword can't be an expression", n.lineno);
        var key = e.id;
        forbiddenCheck(c, tree_1.CHILD(ch, 0), key, n.lineno);
        for (var k = 0; k < nkeywords; ++k) {
          var tmp = keywords[k].arg;
          if (tmp === key)
            throw syntaxError("keyword argument repeated", n.lineno);
        }
        keywords[nkeywords++] = new types_39.Keyword(key, astForExpr(c, tree_1.CHILD(ch, 2)));
      }
    } else if (ch.type === Tokens_1.Tokens.T_STAR)
      vararg = astForExpr(c, tree_1.CHILD(n, ++i));
    else if (ch.type === Tokens_1.Tokens.T_DOUBLESTAR)
      kwarg = astForExpr(c, tree_1.CHILD(n, ++i));
  }
  return new types_17.Call(func, args, keywords, vararg, kwarg, func.lineno, func.col_offset);
}
function astForTrailer(c, n, leftExpr) {
  REQ(n, SYM.trailer);
  if (tree_1.CHILD(n, 0).type === Tokens_1.Tokens.T_LPAR) {
    if (tree_1.NCH(n) === 2)
      return new types_17.Call(leftExpr, [], [], null, null, n.lineno, n.col_offset);
    else
      return astForCall(c, tree_1.CHILD(n, 1), leftExpr);
  } else if (tree_1.CHILD(n, 0).type === Tokens_1.Tokens.T_DOT)
    return new types_7.Attribute(leftExpr, strobj(tree_1.CHILD(n, 1).value), types_52.Load, n.lineno, n.col_offset);
  else {
    REQ(tree_1.CHILD(n, 0), Tokens_1.Tokens.T_LSQB);
    REQ(tree_1.CHILD(n, 2), Tokens_1.Tokens.T_RSQB);
    n = tree_1.CHILD(n, 1);
    if (tree_1.NCH(n) === 1)
      return new types_76.Subscript(leftExpr, astForSlice(c, tree_1.CHILD(n, 0)), types_52.Load, n.lineno, n.col_offset);
    else {
      var simple = true;
      var slices = [];
      for (var j = 0; j < tree_1.NCH(n); j += 2) {
        var slc = astForSlice(c, tree_1.CHILD(n, j));
        if (slc.constructor !== types_44.Index) {
          simple = false;
        }
        slices[j / 2] = slc;
      }
      if (!simple) {
        return new types_76.Subscript(leftExpr, new types_31.ExtSlice(slices), types_52.Load, n.lineno, n.col_offset);
      }
      var elts = [];
      for (var j = 0; j < slices.length; ++j) {
        var slc = slices[j];
        if (slc instanceof types_44.Index) {
          asserts_1.assert(slc.value !== null && slc.value !== undefined);
          elts[j] = slc.value;
        } else {
          asserts_1.assert(slc instanceof types_44.Index);
        }
      }
      var e = new types_79.Tuple(elts, types_52.Load, n.lineno, n.col_offset);
      return new types_76.Subscript(leftExpr, new types_44.Index(e), types_52.Load, n.lineno, n.col_offset);
    }
  }
}
function astForFlowStmt(c, n) {
  REQ(n, SYM.flow_stmt);
  var ch = tree_1.CHILD(n, 0);
  switch (ch.type) {
    case SYM.break_stmt:
      return new types_16.BreakStatement(n.lineno, n.col_offset);
    case SYM.continue_stmt:
      return new types_21.ContinueStatement(n.lineno, n.col_offset);
    case SYM.yield_stmt:
      return new types_30.ExpressionStatement(astForExpr(c, tree_1.CHILD(ch, 0)), n.lineno, n.col_offset);
    case SYM.return_stmt:
      if (tree_1.NCH(ch) === 1)
        return new types_70.ReturnStatement(null, n.lineno, n.col_offset);
      else
        return new types_70.ReturnStatement(astForTestlist(c, tree_1.CHILD(ch, 1)), n.lineno, n.col_offset);
    case SYM.raise_stmt:
      {
        if (tree_1.NCH(ch) === 1)
          return new types_69.Raise(null, null, null, n.lineno, n.col_offset);
        else if (tree_1.NCH(ch) === 2)
          return new types_69.Raise(astForExpr(c, tree_1.CHILD(ch, 1)), null, null, n.lineno, n.col_offset);
        else if (tree_1.NCH(ch) === 4)
          return new types_69.Raise(astForExpr(c, tree_1.CHILD(ch, 1)), astForExpr(c, tree_1.CHILD(ch, 3)), null, n.lineno, n.col_offset);
        else if (tree_1.NCH(ch) === 6)
          return new types_69.Raise(astForExpr(c, tree_1.CHILD(ch, 1)), astForExpr(c, tree_1.CHILD(ch, 3)), astForExpr(c, tree_1.CHILD(ch, 5)), n.lineno, n.col_offset);
        else {
          throw new Error("unhandled flow statement");
        }
      }
    default:
      {
        throw new Error("unexpected flow_stmt");
      }
  }
}
function astForArguments(c, n) {
  var ch;
  var vararg = null;
  var kwarg = null;
  if (n.type === SYM.parameters) {
    if (tree_1.NCH(n) === 2)
      return new types_3.Arguments([], null, null, []);
    n = tree_1.CHILD(n, 1);
  }
  REQ(n, SYM.varargslist);
  var args = [];
  var defaults = [];
  var foundDefault = false;
  var i = 0;
  var j = 0;
  var k = 0;
  while (i < tree_1.NCH(n)) {
    ch = tree_1.CHILD(n, i);
    switch (ch.type) {
      case SYM.fpdef:
        var complexArgs = 0;
        var parenthesized = false;
        handle_fpdef: while (true) {
          if (i + 1 < tree_1.NCH(n) && tree_1.CHILD(n, i + 1).type === Tokens_1.Tokens.T_EQUAL) {
            defaults[j++] = astForExpr(c, tree_1.CHILD(n, i + 2));
            i += 2;
            foundDefault = true;
          } else if (foundDefault) {
            if (parenthesized && !complexArgs)
              throw syntaxError("parenthesized arg with default", n.lineno);
            throw syntaxError("non-default argument follows default argument", n.lineno);
          }
          if (tree_1.NCH(ch) === 3) {
            ch = tree_1.CHILD(ch, 1);
            if (tree_1.NCH(ch) !== 1) {
              throw syntaxError("tuple parameter unpacking has been removed", n.lineno);
            } else {
              parenthesized = true;
              ch = tree_1.CHILD(ch, 0);
              asserts_1.assert(ch.type === SYM.fpdef);
              continue handle_fpdef;
            }
          }
          if (tree_1.CHILD(ch, 0).type === Tokens_1.Tokens.T_NAME) {
            forbiddenCheck(c, n, tree_1.CHILD(ch, 0).value, n.lineno);
            var id = strobj(tree_1.CHILD(ch, 0).value);
            args[k++] = new types_58.Name(id, types_65.Param, ch.lineno, ch.col_offset);
          }
          i += 2;
          if (parenthesized)
            throw syntaxError("parenthesized argument names are invalid", n.lineno);
          break;
        }
        break;
      case Tokens_1.Tokens.T_STAR:
        forbiddenCheck(c, tree_1.CHILD(n, i + 1), tree_1.CHILD(n, i + 1).value, n.lineno);
        vararg = strobj(tree_1.CHILD(n, i + 1).value);
        i += 3;
        break;
      case Tokens_1.Tokens.T_DOUBLESTAR:
        forbiddenCheck(c, tree_1.CHILD(n, i + 1), tree_1.CHILD(n, i + 1).value, n.lineno);
        kwarg = strobj(tree_1.CHILD(n, i + 1).value);
        i += 3;
        break;
      default:
        {
          throw new Error("unexpected node in varargslist");
        }
    }
  }
  return new types_3.Arguments(args, vararg, kwarg, defaults);
}
function astForFuncdef(c, n, decoratorSeq) {
  REQ(n, SYM.funcdef);
  var name = strobj(tree_1.CHILD(n, 1).value);
  forbiddenCheck(c, tree_1.CHILD(n, 1), tree_1.CHILD(n, 1).value, n.lineno);
  var args = astForArguments(c, tree_1.CHILD(n, 2));
  var body = astForSuite(c, tree_1.CHILD(n, 4));
  return new types_34.FunctionDef(name, args, body, decoratorSeq, n.lineno, n.col_offset);
}
function astForClassBases(c, n) {
  asserts_1.assert(tree_1.NCH(n) > 0);
  REQ(n, SYM.testlist);
  if (tree_1.NCH(n) === 1) {
    return [astForExpr(c, tree_1.CHILD(n, 0))];
  }
  return seqForTestlist(c, n);
}
function astForClassdef(c, n, decoratorSeq) {
  REQ(n, SYM.classdef);
  forbiddenCheck(c, n, tree_1.CHILD(n, 1).value, n.lineno);
  var classname = strobj(tree_1.CHILD(n, 1).value);
  if (tree_1.NCH(n) === 4)
    return new types_18.ClassDef(classname, [], astForSuite(c, tree_1.CHILD(n, 3)), decoratorSeq, n.lineno, n.col_offset);
  if (tree_1.CHILD(n, 3).type === Tokens_1.Tokens.T_RPAR)
    return new types_18.ClassDef(classname, [], astForSuite(c, tree_1.CHILD(n, 5)), decoratorSeq, n.lineno, n.col_offset);
  var bases = astForClassBases(c, tree_1.CHILD(n, 3));
  var s = astForSuite(c, tree_1.CHILD(n, 6));
  return new types_18.ClassDef(classname, bases, s, decoratorSeq, n.lineno, n.col_offset);
}
function astForLambdef(c, n) {
  var args;
  var expression;
  if (tree_1.NCH(n) === 3) {
    args = new types_3.Arguments([], null, null, []);
    expression = astForExpr(c, tree_1.CHILD(n, 2));
  } else {
    args = astForArguments(c, tree_1.CHILD(n, 1));
    expression = astForExpr(c, tree_1.CHILD(n, 3));
  }
  return new types_49.Lambda(args, expression, n.lineno, n.col_offset);
}
function astForGenexp(c, n) {
  asserts_1.assert(n.type === SYM.testlist_gexp || n.type === SYM.argument);
  asserts_1.assert(tree_1.NCH(n) > 1);
  function countGenFors(c, n) {
    var nfors = 0;
    var ch = tree_1.CHILD(n, 1);
    count_gen_for: while (true) {
      nfors++;
      REQ(ch, SYM.gen_for);
      if (tree_1.NCH(ch) === 5)
        ch = tree_1.CHILD(ch, 4);
      else
        return nfors;
      count_gen_iter: while (true) {
        REQ(ch, SYM.gen_iter);
        ch = tree_1.CHILD(ch, 0);
        if (ch.type === SYM.gen_for)
          continue count_gen_for;
        else if (ch.type === SYM.gen_if) {
          if (tree_1.NCH(ch) === 3) {
            ch = tree_1.CHILD(ch, 2);
            continue count_gen_iter;
          } else
            return nfors;
        }
        break;
      }
      break;
    }
    throw new Error("logic error in countGenFors");
  }
  function countGenIfs(c, n) {
    var nifs = 0;
    while (true) {
      REQ(n, SYM.gen_iter);
      if (tree_1.CHILD(n, 0).type === SYM.gen_for)
        return nifs;
      n = tree_1.CHILD(n, 0);
      REQ(n, SYM.gen_if);
      nifs++;
      if (tree_1.NCH(n) === 2)
        return nifs;
      n = tree_1.CHILD(n, 2);
    }
  }
  var elt = astForExpr(c, tree_1.CHILD(n, 0));
  var nfors = countGenFors(c, n);
  var genexps = [];
  var ch = tree_1.CHILD(n, 1);
  for (var i = 0; i < nfors; ++i) {
    REQ(ch, SYM.gen_for);
    var forch = tree_1.CHILD(ch, 1);
    var t = astForExprlist(c, forch, types_73.Store);
    var expression = astForExpr(c, tree_1.CHILD(ch, 3));
    var ge = void 0;
    if (tree_1.NCH(forch) === 1)
      ge = new types_20.Comprehension(t[0], expression, []);
    else
      ge = new types_20.Comprehension(new types_79.Tuple(t, types_73.Store, ch.lineno, ch.col_offset), expression, []);
    if (tree_1.NCH(ch) === 5) {
      ch = tree_1.CHILD(ch, 4);
      var nifs = countGenIfs(c, ch);
      var ifs = [];
      for (var j = 0; j < nifs; ++j) {
        REQ(ch, SYM.gen_iter);
        ch = tree_1.CHILD(ch, 0);
        REQ(ch, SYM.gen_if);
        expression = astForExpr(c, tree_1.CHILD(ch, 1));
        ifs[j] = expression;
        if (tree_1.NCH(ch) === 3)
          ch = tree_1.CHILD(ch, 2);
      }
      if (ch.type === SYM.gen_iter)
        ch = tree_1.CHILD(ch, 0);
      ge.ifs = ifs;
    }
    genexps[i] = ge;
  }
  return new types_35.GeneratorExp(elt, genexps, n.lineno, n.col_offset);
}
function astForWhileStmt(c, n) {
  REQ(n, SYM.while_stmt);
  if (tree_1.NCH(n) === 4)
    return new types_83.WhileStatement(astForExpr(c, tree_1.CHILD(n, 1)), astForSuite(c, tree_1.CHILD(n, 3)), [], n.lineno, n.col_offset);
  else if (tree_1.NCH(n) === 7)
    return new types_83.WhileStatement(astForExpr(c, tree_1.CHILD(n, 1)), astForSuite(c, tree_1.CHILD(n, 3)), astForSuite(c, tree_1.CHILD(n, 6)), n.lineno, n.col_offset);
  throw new Error("wrong number of tokens for 'while' stmt");
}
function astForAugassign(c, n) {
  REQ(n, SYM.augassign);
  n = tree_1.CHILD(n, 0);
  switch (n.value.charAt(0)) {
    case '+':
      return types_1.Add;
    case '-':
      return types_75.Sub;
    case '/':
      {
        if (n.value.charAt(1) === '/') {
          return types_32.FloorDiv;
        } else {
          return types_25.Div;
        }
      }
    case '%':
      return types_56.Mod;
    case '<':
      return types_53.LShift;
    case '>':
      return types_71.RShift;
    case '&':
      return types_12.BitAnd;
    case '^':
      return types_14.BitXor;
    case '|':
      return types_13.BitOr;
    case '*':
      {
        if (n.value.charAt(1) === '*') {
          return types_67.Pow;
        } else {
          return types_57.Mult;
        }
      }
    default:
      {
        throw new Error("invalid augassign");
      }
  }
}
function astForBinop(c, n) {
  var result = new types_11.BinOp(astForExpr(c, tree_1.CHILD(n, 0)), getOperator(tree_1.CHILD(n, 1)), astForExpr(c, tree_1.CHILD(n, 2)), n.lineno, n.col_offset);
  var nops = (tree_1.NCH(n) - 1) / 2;
  for (var i = 1; i < nops; ++i) {
    var nextOper = tree_1.CHILD(n, i * 2 + 1);
    var newoperator = getOperator(nextOper);
    var tmp = astForExpr(c, tree_1.CHILD(n, i * 2 + 2));
    result = new types_11.BinOp(result, newoperator, tmp, nextOper.lineno, nextOper.col_offset);
  }
  return result;
}
function astForTestlist(c, n) {
  asserts_1.assert(tree_1.NCH(n) > 0);
  if (n.type === SYM.testlist_gexp) {
    if (tree_1.NCH(n) > 1) {
      asserts_1.assert(tree_1.CHILD(n, 1).type !== SYM.gen_for);
    }
  } else {
    asserts_1.assert(n.type === SYM.testlist || n.type === SYM.testlist_safe || n.type === SYM.testlist1);
  }
  if (tree_1.NCH(n) === 1) {
    return astForExpr(c, tree_1.CHILD(n, 0));
  } else {
    return new types_79.Tuple(seqForTestlist(c, n), types_52.Load, n.lineno, n.col_offset);
  }
}
function astForExprStmt(c, n) {
  REQ(n, SYM.ExprStmt);
  if (tree_1.NCH(n) === 1)
    return new types_30.ExpressionStatement(astForTestlist(c, tree_1.CHILD(n, 0)), n.lineno, n.col_offset);
  else if (tree_1.CHILD(n, 1).type === SYM.augassign) {
    var ch = tree_1.CHILD(n, 0);
    var expr1 = astForTestlist(c, ch);
    switch (expr1.constructor) {
      case types_35.GeneratorExp:
        throw syntaxError("augmented assignment to generator expression not possible", n.lineno);
      case types_85.Yield:
        throw syntaxError("augmented assignment to yield expression not possible", n.lineno);
      case types_58.Name:
        var varName = expr1.id;
        forbiddenCheck(c, ch, varName, n.lineno);
        break;
      case types_7.Attribute:
      case types_76.Subscript:
        break;
      default:
        throw syntaxError("illegal expression for augmented assignment", n.lineno);
    }
    setContext(c, expr1, types_73.Store, ch);
    ch = tree_1.CHILD(n, 2);
    var expr2 = void 0;
    if (ch.type === SYM.testlist)
      expr2 = astForTestlist(c, ch);
    else
      expr2 = astForExpr(c, ch);
    return new types_8.AugAssign(expr1, astForAugassign(c, tree_1.CHILD(n, 1)), expr2, n.lineno, n.col_offset);
  } else {
    REQ(tree_1.CHILD(n, 1), Tokens_1.Tokens.T_EQUAL);
    var targets = [];
    for (var i = 0; i < tree_1.NCH(n) - 2; i += 2) {
      var ch = tree_1.CHILD(n, i);
      if (ch.type === SYM.YieldExpr)
        throw syntaxError("assignment to yield expression not possible", n.lineno);
      var e = astForTestlist(c, ch);
      setContext(c, e, types_73.Store, tree_1.CHILD(n, i));
      targets[i / 2] = e;
    }
    var value = tree_1.CHILD(n, tree_1.NCH(n) - 1);
    var expression = void 0;
    if (value.type === SYM.testlist)
      expression = astForTestlist(c, value);
    else
      expression = astForExpr(c, value);
    return new types_6.Assign(targets, expression, n.lineno, n.col_offset);
  }
}
function astForIfexpr(c, n) {
  asserts_1.assert(tree_1.NCH(n) === 5);
  return new types_41.IfExp(astForExpr(c, tree_1.CHILD(n, 2)), astForExpr(c, tree_1.CHILD(n, 0)), astForExpr(c, tree_1.CHILD(n, 4)), n.lineno, n.col_offset);
}
function escape(s) {
  return encodeURIComponent(s);
}
function parsestr(c, s) {
  var decodeUtf8 = function(s) {
    return decodeURIComponent(escape(s));
  };
  var decodeEscape = function(s, quote) {
    var len = s.length;
    var ret = '';
    for (var i = 0; i < len; ++i) {
      var c_1 = s.charAt(i);
      if (c_1 === '\\') {
        ++i;
        c_1 = s.charAt(i);
        if (c_1 === 'n')
          ret += "\n";
        else if (c_1 === '\\')
          ret += "\\";
        else if (c_1 === 't')
          ret += "\t";
        else if (c_1 === 'r')
          ret += "\r";
        else if (c_1 === 'b')
          ret += "\b";
        else if (c_1 === 'f')
          ret += "\f";
        else if (c_1 === 'v')
          ret += "\v";
        else if (c_1 === '0')
          ret += "\0";
        else if (c_1 === '"')
          ret += '"';
        else if (c_1 === '\'')
          ret += '\'';
        else if (c_1 === '\n') {} else if (c_1 === 'x') {
          var d0 = s.charAt(++i);
          var d1 = s.charAt(++i);
          ret += String.fromCharCode(parseInt(d0 + d1, 16));
        } else if (c_1 === 'u' || c_1 === 'U') {
          var d0 = s.charAt(++i);
          var d1 = s.charAt(++i);
          var d2 = s.charAt(++i);
          var d3 = s.charAt(++i);
          ret += String.fromCharCode(parseInt(d0 + d1, 16), parseInt(d2 + d3, 16));
        } else {
          ret += "\\" + c_1;
        }
      } else {
        ret += c_1;
      }
    }
    return ret;
  };
  var quote = s.charAt(0);
  var rawmode = false;
  if (quote === 'u' || quote === 'U') {
    s = s.substr(1);
    quote = s.charAt(0);
  } else if (quote === 'r' || quote === 'R') {
    s = s.substr(1);
    quote = s.charAt(0);
    rawmode = true;
  }
  asserts_1.assert(quote !== 'b' && quote !== 'B', "todo; haven't done b'' strings yet");
  asserts_1.assert(quote === "'" || quote === '"' && s.charAt(s.length - 1) === quote);
  s = s.substr(1, s.length - 2);
  if (s.length >= 4 && s.charAt(0) === quote && s.charAt(1) === quote) {
    asserts_1.assert(s.charAt(s.length - 1) === quote && s.charAt(s.length - 2) === quote);
    s = s.substr(2, s.length - 4);
  }
  if (rawmode || s.indexOf('\\') === -1) {
    return strobj(decodeUtf8(s));
  }
  return strobj(decodeEscape(s, quote));
}
function parsestrplus(c, n) {
  REQ(tree_1.CHILD(n, 0), Tokens_1.Tokens.T_STRING);
  var ret = "";
  for (var i = 0; i < tree_1.NCH(n); ++i) {
    var child = tree_1.CHILD(n, i);
    try {
      ret = ret + parsestr(c, child.value);
    } catch (x) {
      throw syntaxError("invalid string (possibly contains a unicode character)", child.lineno);
    }
  }
  return ret;
}
function parsenumber(c, s, lineno) {
  var end = s.charAt(s.length - 1);
  if (end === 'j' || end === 'J') {
    throw syntaxError("complex numbers are currently unsupported", lineno);
  }
  if (s.indexOf('.') !== -1) {
    return numericLiteral_1.floatAST(s);
  }
  var tmp = s;
  var value;
  var radix = 10;
  var neg = false;
  if (s.charAt(0) === '-') {
    tmp = s.substr(1);
    neg = true;
  }
  if (tmp.charAt(0) === '0' && (tmp.charAt(1) === 'x' || tmp.charAt(1) === 'X')) {
    tmp = tmp.substring(2);
    value = parseInt(tmp, 16);
    radix = 16;
  } else if ((s.indexOf('e') !== -1) || (s.indexOf('E') !== -1)) {
    return numericLiteral_1.floatAST(s);
  } else if (tmp.charAt(0) === '0' && (tmp.charAt(1) === 'b' || tmp.charAt(1) === 'B')) {
    tmp = tmp.substring(2);
    value = parseInt(tmp, 2);
    radix = 2;
  } else if (tmp.charAt(0) === '0') {
    if (tmp === "0") {
      value = 0;
    } else {
      if (end === 'l' || end === 'L') {
        return numericLiteral_1.longAST(s.substr(0, s.length - 1), 8);
      } else {
        radix = 8;
        tmp = tmp.substring(1);
        if ((tmp.charAt(0) === 'o') || (tmp.charAt(0) === 'O')) {
          tmp = tmp.substring(1);
        }
        value = parseInt(tmp, 8);
      }
    }
  } else {
    if (end === 'l' || end === 'L') {
      return numericLiteral_1.longAST(s.substr(0, s.length - 1), radix);
    } else {
      value = parseInt(tmp, radix);
    }
  }
  if (value > LONG_THRESHOLD && Math.floor(value) === value && (s.indexOf('e') === -1 && s.indexOf('E') === -1)) {
    return numericLiteral_1.longAST(s, 0);
  }
  if (end === 'l' || end === 'L') {
    return numericLiteral_1.longAST(s.substr(0, s.length - 1), radix);
  } else {
    if (neg) {
      return numericLiteral_1.intAST(-value);
    } else {
      return numericLiteral_1.intAST(value);
    }
  }
}
function astForSlice(c, n) {
  REQ(n, SYM.subscript);
  var ch = tree_1.CHILD(n, 0);
  var lower = null;
  var upper = null;
  var step = null;
  if (ch.type === Tokens_1.Tokens.T_DOT) {
    return new types_26.Ellipsis();
  }
  if (tree_1.NCH(n) === 1 && ch.type === SYM.IfExpr) {
    return new types_44.Index(astForExpr(c, ch));
  }
  if (ch.type === SYM.IfExpr)
    lower = astForExpr(c, ch);
  if (ch.type === Tokens_1.Tokens.T_COLON) {
    if (tree_1.NCH(n) > 1) {
      var n2 = tree_1.CHILD(n, 1);
      if (n2.type === SYM.IfExpr)
        upper = astForExpr(c, n2);
    }
  } else if (tree_1.NCH(n) > 2) {
    var n2 = tree_1.CHILD(n, 2);
    if (n2.type === SYM.IfExpr) {
      upper = astForExpr(c, n2);
    }
  }
  ch = tree_1.CHILD(n, tree_1.NCH(n) - 1);
  if (ch.type === SYM.sliceop) {
    if (tree_1.NCH(ch) === 1) {
      ch = tree_1.CHILD(ch, 0);
      step = new types_58.Name(strobj("None"), types_52.Load, ch.lineno, ch.col_offset);
    } else {
      ch = tree_1.CHILD(ch, 1);
      if (ch.type === SYM.IfExpr)
        step = astForExpr(c, ch);
    }
  }
  return new types_72.Slice(lower, upper, step);
}
function astForAtomExpr(c, n) {
  var c0 = tree_1.CHILD(n, 0);
  switch (c0.type) {
    case Tokens_1.Tokens.T_NAME:
      return new types_58.Name(strobj(c0.value), types_52.Load, n.lineno, n.col_offset);
    case Tokens_1.Tokens.T_STRING:
      {
        return new types_74.Str(parsestrplus(c, n), n.lineno, n.col_offset);
      }
    case Tokens_1.Tokens.T_NUMBER:
      return new types_63.Num(parsenumber(c, c0.value, n.lineno), n.lineno, n.col_offset);
    case Tokens_1.Tokens.T_LPAR:
      {
        var c1 = tree_1.CHILD(n, 1);
        if (c1.type === Tokens_1.Tokens.T_RPAR) {
          return new types_79.Tuple([], types_52.Load, n.lineno, n.col_offset);
        }
        if (c1.type === SYM.YieldExpr) {
          return astForExpr(c, c1);
        }
        if (tree_1.NCH(c1) > 1 && tree_1.CHILD(c1, 1).type === SYM.gen_for) {
          return astForGenexp(c, c1);
        }
        return astForTestlistGexp(c, c1);
      }
    case Tokens_1.Tokens.T_LSQB:
      {
        var c1 = tree_1.CHILD(n, 1);
        if (c1.type === Tokens_1.Tokens.T_RSQB)
          return new types_50.List([], types_52.Load, n.lineno, n.col_offset);
        REQ(c1, SYM.listmaker);
        if (tree_1.NCH(c1) === 1 || tree_1.CHILD(c1, 1).type === Tokens_1.Tokens.T_COMMA)
          return new types_50.List(seqForTestlist(c, c1), types_52.Load, n.lineno, n.col_offset);
        else
          return astForListcomp(c, c1);
      }
    case Tokens_1.Tokens.T_LBRACE:
      {
        var c1 = tree_1.CHILD(n, 1);
        var N = tree_1.NCH(c1);
        var keys = [];
        var values = [];
        for (var i = 0; i < N; i += 4) {
          keys[i / 4] = astForExpr(c, tree_1.CHILD(c1, i));
          values[i / 4] = astForExpr(c, tree_1.CHILD(c1, i + 2));
        }
        return new types_24.Dict(keys, values, n.lineno, n.col_offset);
      }
    case Tokens_1.Tokens.T_BACKQUOTE:
      {
        throw syntaxError("backquote not supported, use repr()", n.lineno);
      }
    default:
      {
        throw new Error("unhandled atom '" + grammarName_1.grammarName(c0.type) + "'");
      }
  }
}
function astForPowerExpr(c, n) {
  REQ(n, SYM.PowerExpr);
  var e = astForAtomExpr(c, tree_1.CHILD(n, 0));
  if (tree_1.NCH(n) === 1)
    return e;
  for (var i = 1; i < tree_1.NCH(n); ++i) {
    var ch = tree_1.CHILD(n, i);
    if (ch.type !== SYM.trailer) {
      break;
    }
    var tmp = astForTrailer(c, ch, e);
    tmp.lineno = e.lineno;
    tmp.col_offset = e.col_offset;
    e = tmp;
  }
  if (tree_1.CHILD(n, tree_1.NCH(n) - 1).type === SYM.UnaryExpr) {
    var f = astForExpr(c, tree_1.CHILD(n, tree_1.NCH(n) - 1));
    return new types_11.BinOp(e, types_67.Pow, f, n.lineno, n.col_offset);
  } else {
    return e;
  }
}
function astForExpr(c, n) {
  LOOP: while (true) {
    switch (n.type) {
      case SYM.IfExpr:
      case SYM.old_test:
        if (tree_1.CHILD(n, 0).type === SYM.LambdaExpr || tree_1.CHILD(n, 0).type === SYM.old_LambdaExpr)
          return astForLambdef(c, tree_1.CHILD(n, 0));
        else if (tree_1.NCH(n) > 1)
          return astForIfexpr(c, n);
      case SYM.OrExpr:
      case SYM.AndExpr:
        if (tree_1.NCH(n) === 1) {
          n = tree_1.CHILD(n, 0);
          continue LOOP;
        }
        var seq = [];
        for (var i = 0; i < tree_1.NCH(n); i += 2) {
          seq[i / 2] = astForExpr(c, tree_1.CHILD(n, i));
        }
        if (tree_1.CHILD(n, 1).value === "and") {
          return new types_15.BoolOp(types_4.And, seq, n.lineno, n.col_offset);
        }
        asserts_1.assert(tree_1.CHILD(n, 1).value === "or");
        return new types_15.BoolOp(types_64.Or, seq, n.lineno, n.col_offset);
      case SYM.NotExpr:
        if (tree_1.NCH(n) === 1) {
          n = tree_1.CHILD(n, 0);
          continue LOOP;
        } else {
          return new types_81.UnaryOp(types_60.Not, astForExpr(c, tree_1.CHILD(n, 1)), n.lineno, n.col_offset);
        }
      case SYM.ComparisonExpr:
        if (tree_1.NCH(n) === 1) {
          n = tree_1.CHILD(n, 0);
          continue LOOP;
        } else {
          var ops = [];
          var cmps = [];
          for (var i = 1; i < tree_1.NCH(n); i += 2) {
            ops[(i - 1) / 2] = astForCompOp(c, tree_1.CHILD(n, i));
            cmps[(i - 1) / 2] = astForExpr(c, tree_1.CHILD(n, i + 1));
          }
          return new types_19.Compare(astForExpr(c, tree_1.CHILD(n, 0)), ops, cmps, n.lineno, n.col_offset);
        }
      case SYM.ArithmeticExpr:
      case SYM.GeometricExpr:
      case SYM.ShiftExpr:
      case SYM.BitwiseOrExpr:
      case SYM.BitwiseXorExpr:
      case SYM.BitwiseAndExpr:
        if (tree_1.NCH(n) === 1) {
          n = tree_1.CHILD(n, 0);
          continue LOOP;
        }
        return astForBinop(c, n);
      case SYM.YieldExpr:
        var exp = null;
        if (tree_1.NCH(n) === 2) {
          exp = astForTestlist(c, tree_1.CHILD(n, 1));
        }
        return new types_85.Yield(exp, n.lineno, n.col_offset);
      case SYM.UnaryExpr:
        if (tree_1.NCH(n) === 1) {
          n = tree_1.CHILD(n, 0);
          continue LOOP;
        }
        return astForUnaryExpr(c, n);
      case SYM.PowerExpr:
        return astForPowerExpr(c, n);
      default:
        {
          throw new Error("unhandled expr");
        }
    }
  }
}
function astForPrintStmt(c, n) {
  var start = 1;
  var dest = null;
  REQ(n, SYM.print_stmt);
  if (tree_1.NCH(n) >= 2 && tree_1.CHILD(n, 1).type === Tokens_1.Tokens.T_RIGHTSHIFT) {
    dest = astForExpr(c, tree_1.CHILD(n, 2));
    start = 4;
  }
  var seq = [];
  for (var i = start,
      j = 0; i < tree_1.NCH(n); i += 2, ++j) {
    seq[j] = astForExpr(c, tree_1.CHILD(n, i));
  }
  var nl = (tree_1.CHILD(n, tree_1.NCH(n) - 1)).type === Tokens_1.Tokens.T_COMMA ? false : true;
  return new types_68.Print(dest, seq, nl, n.lineno, n.col_offset);
}
function astForStmt(c, n) {
  if (n.type === SYM.stmt) {
    asserts_1.assert(tree_1.NCH(n) === 1);
    n = tree_1.CHILD(n, 0);
  }
  if (n.type === SYM.simple_stmt) {
    asserts_1.assert(numStmts(n) === 1);
    n = tree_1.CHILD(n, 0);
  }
  if (n.type === SYM.small_stmt) {
    REQ(n, SYM.small_stmt);
    n = tree_1.CHILD(n, 0);
    switch (n.type) {
      case SYM.ExprStmt:
        return astForExprStmt(c, n);
      case SYM.print_stmt:
        return astForPrintStmt(c, n);
      case SYM.del_stmt:
        return astForDelStmt(c, n);
      case SYM.pass_stmt:
        return new types_66.Pass(n.lineno, n.col_offset);
      case SYM.flow_stmt:
        return astForFlowStmt(c, n);
      case SYM.import_stmt:
        return astForImportStmt(c, n);
      case SYM.GlobalStmt:
        return astForGlobalStmt(c, n);
      case SYM.NonLocalStmt:
        return astForNonLocalStmt(c, n);
      case SYM.exec_stmt:
        return astForExecStmt(c, n);
      case SYM.assert_stmt:
        return astForAssertStmt(c, n);
      default:
        {
          throw new Error("unhandled small_stmt");
        }
    }
  } else {
    var ch = tree_1.CHILD(n, 0);
    REQ(n, SYM.compound_stmt);
    switch (ch.type) {
      case SYM.if_stmt:
        return astForIfStmt(c, ch);
      case SYM.while_stmt:
        return astForWhileStmt(c, ch);
      case SYM.for_stmt:
        return astForForStmt(c, ch);
      case SYM.try_stmt:
        return astForTryStmt(c, ch);
      case SYM.with_stmt:
        return astForWithStmt(c, ch);
      case SYM.funcdef:
        return astForFuncdef(c, ch, []);
      case SYM.classdef:
        return astForClassdef(c, ch, []);
      case SYM.decorated:
        return astForDecorated(c, ch);
      default:
        {
          throw new Error("unhandled compound_stmt");
        }
    }
  }
}
function astFromExpression(n) {
  var c = new Compiling("utf-8");
  return astForExpr(c, n);
}
exports.astFromExpression = astFromExpression;
function astFromParse(n) {
  var c = new Compiling("utf-8");
  var stmts = [];
  var k = 0;
  for (var i = 0; i < tree_1.NCH(n) - 1; ++i) {
    var ch = tree_1.CHILD(n, i);
    if (n.type === Tokens_1.Tokens.T_NEWLINE)
      continue;
    REQ(ch, SYM.stmt);
    var num = numStmts(ch);
    if (num === 1) {
      stmts[k++] = astForStmt(c, ch);
    } else {
      ch = tree_1.CHILD(ch, 0);
      REQ(ch, SYM.simple_stmt);
      for (var j = 0; j < num; ++j) {
        stmts[k++] = astForStmt(c, tree_1.CHILD(ch, j * 2));
      }
    }
  }
  return stmts;
}
exports.astFromParse = astFromParse;
function astDump(node) {
  var _format = function(node) {
    if (node === null) {
      return "None";
    } else if (node['prototype'] && node['prototype']._astname !== undefined && node['prototype']._isenum) {
      return node['prototype']._astname + "()";
    } else if (node['_astname'] !== undefined) {
      var fields = [];
      for (var i = 0; i < node['_fields'].length; i += 2) {
        var a = node['_fields'][i];
        var b = node['_fields'][i + 1](node);
        fields.push([a, _format(b)]);
      }
      var attrs = [];
      for (var i = 0; i < fields.length; ++i) {
        var field = fields[i];
        attrs.push(field[0] + "=" + field[1].replace(/^\s+/, ''));
      }
      var fieldstr = attrs.join(',');
      return node['_astname'] + "(" + fieldstr + ")";
    } else if (Array.isArray(node)) {
      var elems = [];
      for (var i = 0; i < node.length; ++i) {
        var x = node[i];
        elems.push(_format(x));
      }
      var elemsstr = elems.join(',');
      return "[" + elemsstr.replace(/^\s+/, '') + "]";
    } else {
      var ret = void 0;
      if (node === true)
        ret = "True";
      else if (node === false)
        ret = "False";
      else
        ret = "" + node;
      return ret;
    }
  };
  return _format(node);
}
exports.astDump = astDump;

import astnodes = require('./astnodes');
import base = require('./base');
import asserts = require('./asserts');

/* Flags for def-use information */

var DEF_GLOBAL = 1;           /* global stmt */
var DEF_LOCAL = 2;            /* assignment in code block */
var DEF_PARAM = 2 << 1;       /* formal parameter */
var USE = 2 << 2;             /* name is used */
var DEF_STAR = 2 << 3;        /* parameter is star arg */
var DEF_DOUBLESTAR = 2 << 4;  /* parameter is star-star arg */
var DEF_INTUPLE = 2 << 5;     /* name defined in tuple in parameters */
var DEF_FREE = 2 << 6;        /* name used but not defined in nested block */
var DEF_FREE_GLOBAL = 2 << 7; /* free variable is actually implicit global */
var DEF_FREE_CLASS = 2 << 8;  /* free variable from class's method */
var DEF_IMPORT = 2 << 9;      /* assignment occurred via import */

var DEF_BOUND = (DEF_LOCAL | DEF_PARAM | DEF_IMPORT);

/* GLOBAL_EXPLICIT and GLOBAL_IMPLICIT are used internally by the symbol
   table.  GLOBAL is returned from PyST_GetScope() for either of them.
   It is stored in ste_symbols at bits 12-14.
*/
var SCOPE_OFF = 11;
var SCOPE_MASK = 7;

export var LOCAL = 1;
export var GLOBAL_EXPLICIT = 2;
export var GLOBAL_IMPLICIT = 3;
export var FREE = 4;
export var CELL = 5;

/* The following three names are used for the ste_unoptimized bit field */
var OPT_IMPORT_STAR = 1;
var OPT_EXEC = 2;
var OPT_BARE_EXEC = 4;
var OPT_TOPLEVEL = 8;  /* top-level names, including eval and exec */

var GENERATOR = 2;
var GENERATOR_EXPRESSION = 2;

var ModuleBlock = 'module';
export var FunctionBlock = 'function';
var ClassBlock = 'class';

/**
 * @param {string} message
 * @param {string} fileName
 * @param {number=} lineNumber
 */
function syntaxError(message: string, fileName: string, lineNumber?: number) {
    asserts.assert(base.isString(message), "message must be a string");
    asserts.assert(base.isString(fileName), "fileName must be a string");
    if (base.isDef(lineNumber)) {
        asserts.assert(base.isNumber(lineNumber), "lineNumber must be a number");
    }
    var e = new SyntaxError(message);
    e['fileName'] = fileName;
    if (typeof lineNumber === 'number') {
        e['lineNumber'] = lineNumber;
    }
    return e;
}

/**
 * @param {string|null} priv
 * @param {string} name
 */
export function mangleName(priv: string, name: string): string {
    var strpriv: string = null;

    if (priv === null || name === null || name.charAt(0) !== '_' || name.charAt(1) !== '_')
        return name;
    // don't mangle __id__
    if (name.charAt(name.length - 1) === '_' && name.charAt(name.length - 2) === '_')
        return name;
    // don't mangle classes that are all _ (obscure much?)
    strpriv = priv;
    strpriv.replace(/_/g, '');
    if (strpriv === '')
        return name;

    strpriv = priv;
    strpriv.replace(/^_*/, '');
    strpriv = '_' + strpriv + name;
    return strpriv;
}

class Symbol {
    private __name;
    private __flags;
    private __scope;
    private __namespaces;
    constructor(name, flags, namespaces) {
        this.__name = name;
        this.__flags = flags;
        this.__scope = (flags >> SCOPE_OFF) & SCOPE_MASK;
        this.__namespaces = namespaces || [];
    }

    get_name() {
        return this.__name;
        
    }

    is_referenced() {
        return !!(this.__flags & USE);
        
    }

    is_parameter() {
        return !!(this.__flags & DEF_PARAM);
    }

    is_global() {
        return this.__scope === GLOBAL_IMPLICIT || this.__scope == GLOBAL_EXPLICIT;
    }

    is_declared_global() {
        return this.__scope == GLOBAL_EXPLICIT;
    }

    is_local() {
        return !!(this.__flags & DEF_BOUND);
    }

    is_free() {
        return this.__scope == FREE;
    }

    is_imported() {
        return !!(this.__flags & DEF_IMPORT);
    }

    is_assigned() {
        return !!(this.__flags & DEF_LOCAL);
    }

    is_namespace() {
        return this.__namespaces && this.__namespaces.length > 0;
    }
    
    get_namespaces() {
        return this.__namespaces;
    }
}

var astScopeCounter = 0;

export class SymbolTableScope {
    public symFlags;
    private name: string;
    public varnames: string[];
    public children: SymbolTableScope[];
    public blockType: string;
    public isNested: boolean;
    public hasFree: boolean;
    public childHasFree: boolean;
    public generator: boolean;
    public varargs: boolean;
    public varkeywords: boolean;
    public returnsValue: boolean;
    public lineno: number;
    private table: SymbolTable;
    private symbols;
    private _funcParams;
    private _funcLocals;
    private _funcGlobals;
    private _funcFrees;
    private _classMethods;
    /**
     * @constructor
     * @param {Object} table
     * @param {string} name
     * @param {string} type
     * @param {number} lineno
     */
    constructor(table: SymbolTable, name: string, type: string, ast, lineno: number) {
        this.symFlags = {};
        this.name = name;
        this.varnames = [];
        /**
         * @type Array.<SymbolTableScope>
         */
        this.children = [];
        this.blockType = type;
    
        this.isNested = false;
        this.hasFree = false;
        this.childHasFree = false;  // true if child block has free vars including free refs to globals
        this.generator = false;
        this.varargs = false;
        this.varkeywords = false;
        this.returnsValue = false;
    
        this.lineno = lineno;
    
        this.table = table;
    
        if (table.cur && (table.cur.is_nested() || table.cur.blockType === FunctionBlock))
            this.isNested = true;
    
        ast.scopeId = astScopeCounter++;
        table.stss[ast.scopeId] = this;
    
        // cache of Symbols for returning to other parts of code
        this.symbols = {};
    }

    get_type() {
        return this.blockType;
        
    }

    get_name() {
        return this.name;
        
    }

    get_lineno() {
        return this.lineno;
        
    }

    is_nested() {
        return this.isNested;
        
    }

    has_children() {
        return this.children.length > 0;
    }

    get_identifiers() {
        return this._identsMatching(function(x) { return true; });
    }

    lookup(name: string) {
        var sym;
        if (!this.symbols.hasOwnProperty(name)) {
            var flags = this.symFlags[name];
            var namespaces = this.__check_children(name);
            sym = this.symbols[name] = new Symbol(name, flags, namespaces);
        }
        else {
            sym = this.symbols[name];
        }
        return sym;
    }
    
    __check_children(name) {
        var ret = [];
        for (var i = 0; i < this.children.length; ++i) {
            var child = this.children[i];
            if (child.name === name)
                ret.push(child);
        }
        return ret;
    }
    
    _identsMatching(f) {
        var ret = [];
        for (var k in this.symFlags) {
            if (this.symFlags.hasOwnProperty(k)) {
                if (f(this.symFlags[k]))
                    ret.push(k);
            }
        }
        ret.sort();
        return ret;
    }
    
    get_parameters() {
        asserts.assert(this.get_type() == 'function', "get_parameters only valid for function scopes");
        if (!this._funcParams)
            this._funcParams = this._identsMatching(function(x) { return x & DEF_PARAM; });
        return this._funcParams;
    }
    
    get_locals() {
        asserts.assert(this.get_type() == 'function', "get_locals only valid for function scopes");
        if (!this._funcLocals)
            this._funcLocals = this._identsMatching(function(x) { return x & DEF_BOUND; });
        return this._funcLocals;
    }
    
    get_globals() {
        asserts.assert(this.get_type() == 'function', "get_globals only valid for function scopes");
        if (!this._funcGlobals) {
            this._funcGlobals = this._identsMatching(function(x) {
                var masked = (x >> SCOPE_OFF) & SCOPE_MASK;
                return masked == GLOBAL_IMPLICIT || masked == GLOBAL_EXPLICIT;
            });
        }
        return this._funcGlobals;
    }
    
    get_frees() {
        asserts.assert(this.get_type() == 'function', "get_frees only valid for function scopes");
        if (!this._funcFrees) {
            this._funcFrees = this._identsMatching(function(x) {
                var masked = (x >> SCOPE_OFF) & SCOPE_MASK;
                return masked == FREE;
            });
        }
        return this._funcFrees;
    }
    
    get_methods() {
        asserts.assert(this.get_type() == 'class', "get_methods only valid for class scopes");
        if (!this._classMethods) {
            // todo; uniq?
            var all = [];
            for (var i = 0; i < this.children.length; ++i)
                all.push(this.children[i].name);
            all.sort();
            this._classMethods = all;
        }
        return this._classMethods;
    }
    
    getScope(name) {
        var v = this.symFlags[name];
        if (v === undefined) return 0;
        return (v >> SCOPE_OFF) & SCOPE_MASK;
    }
}

export class SymbolTable {
    private fileName: string;
    public cur: SymbolTableScope = null;
    public top: SymbolTableScope = null;
    private stack: SymbolTableScope[] = [];
    /**
     * points at top level module symFlags
     */
    private global = null;
    /**
     * The current class or null.
     */
    private curClass: string = null;
    /**
     * Temporary variable used to generate names of definitions.
     */
    private tmpname: number = 0;
    /**
     * mapping from ast nodes to their scope if they have one. we add an
     * id to the ast node when a scope is created for it, and store it in
     * here for the compiler to lookup later.
     */
    public stss = {};
    constructor(fileName: string) {
        this.fileName = fileName;
    }

    /**
     * Lookup the SymbolTableScope for a scopeId of the AST.
     */
    getStsForAst(ast) {
        asserts.assert(ast.scopeId !== undefined, "ast wasn't added to st?");
        var v = this.stss[ast.scopeId];
        asserts.assert(v !== undefined, "unknown sym tab entry");
        return v;
    }

    SEQStmt(nodes) {
        var len = nodes.length;
        for (var i = 0; i < len; ++i) {
            var val = nodes[i];
            if (val) this.visitStmt(val);
        }
    }

    SEQExpr(nodes) {
        var len = nodes.length;
        for (var i = 0; i < len; ++i) {
            var val = nodes[i];
            if (val) this.visitExpr(val);
        }
    }

    enterBlock(name: string, blockType: string, ast, lineno: number) {
        //  name = fixReservedNames(name);
        var prev: SymbolTableScope = null;
        if (this.cur) {
            prev = this.cur;
            this.stack.push(this.cur);
        }
        this.cur = new SymbolTableScope(this, name, blockType, ast, lineno);
        if (name === 'top') {
            this.global = this.cur.symFlags;
        }
        if (prev) {
            prev.children.push(this.cur);
        }
    }
    
    exitBlock() {
        this.cur = null;
        if (this.stack.length > 0)
            this.cur = this.stack.pop();
    }

    visitParams(args, toplevel) {
        for (var i = 0; i < args.length; ++i) {
            var arg = args[i];
            if (arg.constructor === astnodes.Name) {
                asserts.assert(arg.ctx === astnodes.Param || (arg.ctx === astnodes.Store && !toplevel));
                this.addDef(arg.id, DEF_PARAM, arg.lineno);
            }
            else {
                // Tuple isn't supported
                throw syntaxError("invalid expression in parameter list", this.fileName);
            }
        }
    }
    
    /**
     * This method is called for a Function Definition or a Lambda expression.
     */
    visitArguments(a, lineno: number) {
        if (a.args) this.visitParams(a.args, true);
        if (a.vararg) {
            this.addDef(a.vararg, DEF_PARAM, lineno);
            this.cur.varargs = true;
        }
        if (a.kwarg) {
            this.addDef(a.kwarg, DEF_PARAM, lineno);
            this.cur.varkeywords = true;
        }
    }

    /**
     * @param {number} lineno
     */
    newTmpname(lineno: number) {
        this.addDef("_[" + (++this.tmpname) + "]", DEF_LOCAL, lineno);
    }

    /**
     * @param {string} name
     * @param {number} flag
     * @param {number} lineno
     */
    addDef(name: string, flag: number, lineno: number) {
        var mangled = mangleName(this.curClass, name);
        //  mangled = fixReservedNames(mangled);
        var val = this.cur.symFlags[mangled];
        if (val !== undefined) {
            if ((flag & DEF_PARAM) && (val & DEF_PARAM)) {
                throw syntaxError("duplicate argument '" + name + "' in function definition", this.fileName, lineno);
            }
            val |= flag;
        }
        else {
            val = flag;
        }
        this.cur.symFlags[mangled] = val;
        if (flag & DEF_PARAM) {
            this.cur.varnames.push(mangled);
        }
        else if (flag & DEF_GLOBAL) {
            val = flag;
            var fromGlobal = this.global[mangled];
            if (fromGlobal !== undefined) val |= fromGlobal;
            this.global[mangled] = val;
        }
    }
    
    visitSlice(s) {
        switch (s.constructor) {
            case astnodes.Slice:
                if (s.lower) this.visitExpr(s.lower);
                if (s.upper) this.visitExpr(s.upper);
                if (s.step) this.visitExpr(s.step);
                break;
            case astnodes.ExtSlice:
                for (var i = 0; i < s.dims.length; ++i)
                    this.visitSlice(s.dims[i]);
                break;
            case astnodes.Index:
                this.visitExpr(s.value);
                break;
            case astnodes.Ellipsis:
                break;
        }
    }

    /**
     * @param {Object} s
     */
    visitStmt(s) {
        asserts.assert(s !== undefined, "visitStmt called with undefined");
        switch (s.constructor) {
            case astnodes.FunctionDef:
                this.addDef(s.name, DEF_LOCAL, s.lineno);
                if (s.args.defaults) this.SEQExpr(s.args.defaults);
                if (s.decorator_list) this.SEQExpr(s.decorator_list);
                this.enterBlock(s.name, FunctionBlock, s, s.lineno);
                this.visitArguments(s.args, s.lineno);
                this.SEQStmt(s.body);
                this.exitBlock();
                break;
            case astnodes.ClassDef:
                this.addDef(s.name, DEF_LOCAL, s.lineno);
                this.SEQExpr(s.bases);
                if (s.decorator_list) this.SEQExpr(s.decorator_list);
                this.enterBlock(s.name, ClassBlock, s, s.lineno);
                var tmp = this.curClass;
                this.curClass = s.name;
                this.SEQStmt(s.body);
                this.curClass = tmp;
                this.exitBlock();
                break;
            case astnodes.Return_:
                if (s.value) {
                    this.visitExpr(s.value);
                    this.cur.returnsValue = true;
                    if (this.cur.generator) {
                        throw syntaxError("'return' with argument inside generator", this.fileName);
                    }
                }
                break;
            case astnodes.Delete_:
                this.SEQExpr(s.targets);
                break;
            case astnodes.Assign:
                this.SEQExpr(s.targets);
                this.visitExpr(s.value);
                break;
            case astnodes.AugAssign:
                this.visitExpr(s.target);
                this.visitExpr(s.value);
                break;
            case astnodes.Print:
                if (s.dest) this.visitExpr(s.dest);
                this.SEQExpr(s.values);
                break;
            case astnodes.For_:
                this.visitExpr(s.target);
                this.visitExpr(s.iter);
                this.SEQStmt(s.body);
                if (s.orelse) this.SEQStmt(s.orelse);
                break;
            case astnodes.While_:
                this.visitExpr(s.test);
                this.SEQStmt(s.body);
                if (s.orelse) this.SEQStmt(s.orelse);
                break;
            case astnodes.If_:
                this.visitExpr(s.test);
                this.SEQStmt(s.body);
                if (s.orelse)
                    this.SEQStmt(s.orelse);
                break;
            case astnodes.Raise:
                if (s.type) {
                    this.visitExpr(s.type);
                    if (s.inst) {
                        this.visitExpr(s.inst);
                        if (s.tback)
                            this.visitExpr(s.tback);
                    }
                }
                break;
            case astnodes.TryExcept:
                this.SEQStmt(s.body);
                this.SEQStmt(s.orelse);
                this.visitExcepthandlers(s.handlers);
                break;
            case astnodes.TryFinally:
                this.SEQStmt(s.body);
                this.SEQStmt(s.finalbody);
                break;
            case astnodes.Assert:
                this.visitExpr(s.test);
                if (s.msg) this.visitExpr(s.msg);
                break;
            case astnodes.Import_:
            case astnodes.ImportFrom:
                this.visitAlias(s.names, s.lineno);
                break;
            case astnodes.Exec:
                this.visitExpr(s.body);
                if (s.globals) {
                    this.visitExpr(s.globals);
                    if (s.locals)
                        this.visitExpr(s.locals);
                }
                break;
            case astnodes.Global:
                var nameslen = s.names.length;
                for (var i = 0; i < nameslen; ++i) {
                    var name = mangleName(this.curClass, s.names[i]);
                    //              name = fixReservedNames(name);
                    var cur = this.cur.symFlags[name];
                    if (cur & (DEF_LOCAL | USE)) {
                        if (cur & DEF_LOCAL) {
                            throw syntaxError("name '" + name + "' is assigned to before global declaration", this.fileName, s.lineno);
                        }
                        else {
                            throw syntaxError("name '" + name + "' is used prior to global declaration", this.fileName, s.lineno);
                        }
                    }
                    this.addDef(name, DEF_GLOBAL, s.lineno);
                }
                break;
            case astnodes.Expr:
                this.visitExpr(s.value);
                break;
            case astnodes.Pass:
            case astnodes.Break_:
            case astnodes.Continue_:
                // nothing
                break;
            case astnodes.With_:
                this.newTmpname(s.lineno);
                this.visitExpr(s.context_expr);
                if (s.optional_vars) {
                    this.newTmpname(s.lineno);
                    this.visitExpr(s.optional_vars);
                }
                this.SEQStmt(s.body);
                break;
    
            default:
                asserts.fail("Unhandled type " + s.constructor.name + " in visitStmt");
        }
    }

    visitExpr(e) {
        asserts.assert(e !== undefined, "visitExpr called with undefined");
        //print("  e: ", e.constructor.name);
        switch (e.constructor) {
            case astnodes.BoolOp:
                this.SEQExpr(e.values);
                break;
            case astnodes.BinOp:
                this.visitExpr(e.left);
                this.visitExpr(e.right);
                break;
            case astnodes.UnaryOp:
                this.visitExpr(e.operand);
                break;
            case astnodes.Lambda:
                this.addDef("lambda", DEF_LOCAL, e.lineno);
                if (e.args.defaults)
                    this.SEQExpr(e.args.defaults);
                this.enterBlock("lambda", FunctionBlock, e, e.lineno);
                this.visitArguments(e.args, e.lineno);
                this.visitExpr(e.body);
                this.exitBlock();
                break;
            case astnodes.IfExp:
                this.visitExpr(e.test);
                this.visitExpr(e.body);
                this.visitExpr(e.orelse);
                break;
            case astnodes.Dict:
                this.SEQExpr(e.keys);
                this.SEQExpr(e.values);
                break;
            case astnodes.ListComp:
                this.newTmpname(e.lineno);
                this.visitExpr(e.elt);
                this.visitComprehension(e.generators, 0);
                break;
            case astnodes.GeneratorExp:
                this.visitGenexp(e);
                break;
            case astnodes.Yield:
                if (e.value) this.visitExpr(e.value);
                this.cur.generator = true;
                if (this.cur.returnsValue) {
                    throw syntaxError("'return' with argument inside generator", this.fileName);
                }
                break;
            case astnodes.Compare:
                this.visitExpr(e.left);
                this.SEQExpr(e.comparators);
                break;
            case astnodes.Call:
                this.visitExpr(e.func);
                this.SEQExpr(e.args);
                for (var i = 0; i < e.keywords.length; ++i)
                    this.visitExpr(e.keywords[i].value);
                //print(JSON.stringify(e.starargs, null, 2));
                //print(JSON.stringify(e.kwargs, null,2));
                if (e.starargs) this.visitExpr(e.starargs);
                if (e.kwargs) this.visitExpr(e.kwargs);
                break;
            case astnodes.Num:
            case astnodes.Str:
                break;
            case astnodes.Attribute:
                this.visitExpr(e.value);
                break;
            case astnodes.Subscript:
                this.visitExpr(e.value);
                this.visitSlice(e.slice);
                break;
            case astnodes.Name:
                this.addDef(e.id, e.ctx === astnodes.Load ? USE : DEF_LOCAL, e.lineno);
                break;
            case astnodes.List:
            case astnodes.Tuple:
                this.SEQExpr(e.elts);
                break;
            default:
                asserts.fail("Unhandled type " + e.constructor.name + " in visitExpr");
        }
    }

    visitComprehension(lcs, startAt) {
        var len = lcs.length;
        for (var i = startAt; i < len; ++i) {
            var lc = lcs[i];
            this.visitExpr(lc.target);
            this.visitExpr(lc.iter);
            this.SEQExpr(lc.ifs);
        }
    }

    /**
     * This is probably not correct for names. What are they?
     * @param {Array.<Object>} names
     * @param {number} lineno
     */
    visitAlias(names, lineno) {
        /* Compute store_name, the name actually bound by the import
            operation.  It is diferent than a->name when a->name is a
            dotted package name (e.g. spam.eggs)
        */
        for (var i = 0; i < names.length; ++i) {
            var a = names[i];
            // DGH: The RHS used to be Python strings.
            var name = a.asname === null ? a.name : a.asname;
            var storename = name;
            var dot = name.indexOf('.');
            if (dot !== -1)
                storename = name.substr(0, dot);
            if (name !== "*") {
                this.addDef(storename, DEF_IMPORT, lineno);
            }
            else {
                if (this.cur.blockType !== ModuleBlock) {
                    throw syntaxError("import * only allowed at module level", this.fileName);
                }
            }
        }
    }

    /**
     * @param {Object} e
     */
    visitGenexp(e) {
        var outermost = e.generators[0];
        // outermost is evaled in current scope
        this.visitExpr(outermost.iter);
        this.enterBlock("genexpr", FunctionBlock, e, e.lineno);
        this.cur.generator = true;
        this.addDef(".0", DEF_PARAM, e.lineno);
        this.visitExpr(outermost.target);
        this.SEQExpr(outermost.ifs);
        this.visitComprehension(e.generators, 1);
        this.visitExpr(e.elt);
        this.exitBlock();
    }

    visitExcepthandlers(handlers) {
        for (var i = 0, eh; eh = handlers[i]; ++i) {
            if (eh.type) this.visitExpr(eh.type);
            if (eh.name) this.visitExpr(eh.name);
            this.SEQStmt(eh.body);
        }
    }

    /**
     * @param {Object} ste The Symbol Table Scope.
     */
    analyzeBlock(ste: SymbolTableScope, bound, free, global) {
        var local = {};
        var scope = {};
        var newglobal = {};
        var newbound = {};
        var newfree = {};
    
        if (ste.blockType == ClassBlock) {
            _dictUpdate(newglobal, global);
            if (bound)
                _dictUpdate(newbound, bound);
        }
    
        for (var name in ste.symFlags) {
            var flags = ste.symFlags[name];
            this.analyzeName(ste, scope, name, flags, bound, local, free, global);
        }
    
        if (ste.blockType !== ClassBlock) {
            if (ste.blockType === FunctionBlock)
                _dictUpdate(newbound, local);
            if (bound)
                _dictUpdate(newbound, bound);
            _dictUpdate(newglobal, global);
        }
    
        var allfree = {};
        var childlen = ste.children.length;
        for (var i = 0; i < childlen; ++i) {
            var c = ste.children[i];
            this.analyzeChildBlock(c, newbound, newfree, newglobal, allfree);
            if (c.hasFree || c.childHasFree)
                ste.childHasFree = true;
        }
    
        _dictUpdate(newfree, allfree);

        if (ste.blockType === FunctionBlock) this.analyzeCells(scope, newfree);

        this.updateSymbols(ste.symFlags, scope, bound, newfree, ste.blockType === ClassBlock);
    
        _dictUpdate(free, newfree);
    }
    
    analyzeChildBlock(entry, bound, free, global, childFree) {
        var tempBound = {};
        _dictUpdate(tempBound, bound);
        var tempFree = {};
        _dictUpdate(tempFree, free);
        var tempGlobal = {};
        _dictUpdate(tempGlobal, global);
    
        this.analyzeBlock(entry, tempBound, tempFree, tempGlobal);
        _dictUpdate(childFree, tempFree);
    }

    analyzeCells(scope, free) {
        for (var name in scope) {
            var flags = scope[name];
            if (flags !== LOCAL) continue;
            if (free[name] === undefined) continue;
            scope[name] = CELL;
            delete free[name];
        }
    }

    /**
     * store scope info back into the st symbols dict. symbols is modified,
     * others are not.
     */
    updateSymbols(symbols, scope, bound, free, classflag) {

        for (var name in symbols) {
            var flags = symbols[name];
            var w = scope[name];
            flags |= w << SCOPE_OFF;
            symbols[name] = flags;
        }
    
        var freeValue = FREE << SCOPE_OFF;
        var pos = 0;
        for (var name in free) {
            var o = symbols[name];
            if (o !== undefined) {
                // it could be a free variable in a method of the class that has
                // the same name as a local or global in the class scope
                if (classflag && (o & (DEF_BOUND | DEF_GLOBAL))) {
                    var i = o | DEF_FREE_CLASS;
                    symbols[name] = i;
                }
                // else it's not free, probably a cell
                continue;
            }
            if (bound[name] === undefined) continue;
            symbols[name] = freeValue;
        }
    }

    /**
     * @param {Object} ste The Symbol Table Scope.
     * @param {string} name
     */
    analyzeName(ste: SymbolTableScope, dict, name, flags, bound, local, free, global) {
        if (flags & DEF_GLOBAL) {
            if (flags & DEF_PARAM) throw syntaxError("name '" + name + "' is local and global", this.fileName, ste.lineno);
            dict[name] = GLOBAL_EXPLICIT;
            global[name] = null;
            if (bound && bound[name] !== undefined) delete bound[name];
            return;
        }
        if (flags & DEF_BOUND) {
            dict[name] = LOCAL;
            local[name] = null;
            delete global[name];
            return;
        }
    
        if (bound && bound[name] !== undefined) {
            dict[name] = FREE;
            ste.hasFree = true;
            free[name] = null;
        }
        else if (global && global[name] !== undefined) {
            dict[name] = GLOBAL_IMPLICIT;
        }
        else {
            if (ste.isNested)
                ste.hasFree = true;
            dict[name] = GLOBAL_IMPLICIT;
        }
    }

    analyze() {
        var free = {};
        var global = {};
        this.analyzeBlock(this.top, null, free, global);
    }
    
}

function _dictUpdate(a, b) {
    for (var kb in b) {
        a[kb] = b[kb];
    }
}

/**
 * Computes the symbol table for the AST module.
 * @param {Object} module
 * @param {string} fileName
 */
export function symbolTable(module: astnodes.Module, fileName: string): SymbolTable {
    var ret = new SymbolTable(fileName);

    ret.enterBlock("top", ModuleBlock, module, 0);

    ret.top = ret.cur;

    for (var i = 0; i < module.body.length; ++i) {
        ret.visitStmt(module.body[i]);
    }

    ret.exitBlock();

    ret.analyze();

    return ret;
}

export function dumpSymbolTable(st: SymbolTable) {

    var pyBoolStr = function(b: boolean) {
        return b ? "True" : "False";
    };

    var pyList = function(l) {
        var ret = [];
        for (var i = 0; i < l.length; ++i) {
            // TODO: Originally, this computed the Python repr().
            ret.push(l[i]);
        }
        return '[' + ret.join(', ') + ']';
    };

    var getIdents = function(obj: SymbolTableScope, indent: string) {
        if (indent === undefined) indent = "";
        var ret = "";
        ret += indent + "Sym_type: " + obj.get_type() + "\n";
        ret += indent + "Sym_name: " + obj.get_name() + "\n";
        ret += indent + "Sym_lineno: " + obj.get_lineno() + "\n";
        ret += indent + "Sym_nested: " + pyBoolStr(obj.is_nested()) + "\n";
        ret += indent + "Sym_haschildren: " + pyBoolStr(obj.has_children()) + "\n";
        if (obj.get_type() === "class") {
            ret += indent + "Class_methods: " + pyList(obj.get_methods()) + "\n";
        }
        else if (obj.get_type() === "function") {
            ret += indent + "Func_params: " + pyList(obj.get_parameters()) + "\n";
            ret += indent + "Func_locals: " + pyList(obj.get_locals()) + "\n";
            ret += indent + "Func_globals: " + pyList(obj.get_globals()) + "\n";
            ret += indent + "Func_frees: " + pyList(obj.get_frees()) + "\n";
        }
        ret += indent + "-- Identifiers --\n";
        var objidents = obj.get_identifiers();
        var objidentslen = objidents.length;
        for (var i = 0; i < objidentslen; ++i) {
            var info = obj.lookup(objidents[i]);
            ret += indent + "name: " + info.get_name() + "\n";
            ret += indent + "  is_referenced: " + pyBoolStr(info.is_referenced()) + "\n";
            ret += indent + "  is_imported: " + pyBoolStr(info.is_imported()) + "\n";
            ret += indent + "  is_parameter: " + pyBoolStr(info.is_parameter()) + "\n";
            ret += indent + "  is_global: " + pyBoolStr(info.is_global()) + "\n";
            ret += indent + "  is_declared_global: " + pyBoolStr(info.is_declared_global()) + "\n";
            ret += indent + "  is_local: " + pyBoolStr(info.is_local()) + "\n";
            ret += indent + "  is_free: " + pyBoolStr(info.is_free()) + "\n";
            ret += indent + "  is_assigned: " + pyBoolStr(info.is_assigned()) + "\n";
            ret += indent + "  is_namespace: " + pyBoolStr(info.is_namespace()) + "\n";
            var nss = info.get_namespaces();
            var nsslen = nss.length;
            ret += indent + "  namespaces: [\n";
            var sub = [];
            for (var j = 0; j < nsslen; ++j) {
                var ns = nss[j];
                sub.push(getIdents(ns, indent + "    "));
            }
            ret += sub.join('\n');
            ret += indent + '  ]\n';
        }
        return ret;
    };
    return getIdents(st.top, '');
};

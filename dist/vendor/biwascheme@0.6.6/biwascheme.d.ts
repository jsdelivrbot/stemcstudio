//
// TypeScript definitions for BiwaScheme 0.6.6
//
// Copyright (c) 2016 David Geo Holmes
// Definitions by: David Geo Holmes <https://github.com/geometryzen>
//
declare module BiwaScheme {

    class Interpreter {
        constructor(errorHandler?: (e: { message: string }) => any);
        evaluate(code: string, after_evaluate?: (result: Object) => any): void;
        resume(): any;
        static expand(expr: any): any;
        static read(code: string): any;
    }

    class Parser {
        static EOS: Object;
        constructor(code: string);
        getObject(): any;
    }

    class Compiler {
        constructor();
        run(expr: any): any;
        static compile(expr: any): any;
    }

    class Bug extends Error {
        constructor(message: string);
    }

    class Error {
        constructor(message: string);
    }

    class Pair {
        constructor(car: any, cdr: any);
    }

    class Pause {
        constructor(callback: (pause: Pause) => any);
        resume(arg: any): any;
    }

    class Record {
        constructor(rtd: any, values: any);
    }

    class Symbol {
        constructor(name: string);
    }

    function array_to_list(items: any): any;
    function assert_closure(items: any): void;
    function assert_date(items: any): void;
    function assert_function(items: any): void;
    function assert_integer(items: any): void;
    function assert_real(items: any): void;
    function assert_string(items: any): void;
    function assert_symbol(items: any): void;
    function define_libfunc(name: string, minArgs: number, maxArgs: number, body: (ar: any[]) => any): void;
    function deprecate(title: string, version: string, alternate: string): void;
    function gensym(): Symbol;
    function isClosure(items: any): boolean;
    function isList(items: any): boolean;
    function isPair(item: any): item is Pair;
    function isRecord(item: any): item is Record;
    function isSymbol(item: any): item is Symbol;
    function inspect(item: any, fallback: Object): any;
    function js_closure(items: any): (...args) => any;
    function js_obj_to_alist(items: any): any;
    function Sym(name: string, leaveCase?: boolean): Symbol;
    function to_display(obj: Object): string;
    function to_write(obj: Object): string;
}
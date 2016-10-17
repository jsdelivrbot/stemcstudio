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
    }

    class Pair {
        constructor(car: any, cdr: any);
    }

    function assert_integer(x: any): void;
    function define_libfunc(name: string, minArgs: number, maxArgs: number, body: (ar: any[]) => any): void;
    function isClosure(x: any): boolean;
    function isList(x: any): boolean;
    function isPair(x: any): x is Pair;
    function to_write(obj: Object): string;
}
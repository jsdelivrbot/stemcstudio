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
        static assert_integer(x: any): void;
        static define_libfunc(name: string, minArgs: number, maxArgs: number, body: (ar: any[]) => any): void;
        static isClosure(x: any): boolean;
        static isList(x: any): boolean;
        static isPair(x: any): x is Pair;
        static to_write(obj: Object): string;
    }

    class Pair {
        constructor(car: any, cdr: any);
    }
}
//
// TypeScript definitions for BiwaScheme 0.6.6
//
// Copyright (c) 2016 David Geo Holmes
// Definitions by: David Geo Holmes <https://github.com/geometryzen>
//
declare module BiwaScheme {

    class Interpreter {
        constructor(errorHandler: (e: { message: string }) => any);
        evaluate(code: string): void;
    }
}
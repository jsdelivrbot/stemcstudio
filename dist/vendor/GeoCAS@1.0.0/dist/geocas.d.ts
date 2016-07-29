//
// geocas.d.ts
//
// This file was created manually in order to support the GeoCAS library.
// These declarations are appropriate when using the library through the global
// variable, 'GeoCAS'.
//
/**
 * Geometric Computer Algebra System.
 */
declare module GeoCAS {

    class Expr {
        toPrefix(): string;
        toString(): string;
    }

    // TODO: Expose other classes so that users can walk their trees.

    class Algebra {
        basis: { [index: number]: Expr };
        constructor(metric: number[][], unused?: string[]);
        scalar(value: number | string): Expr;
        simplify(expr: Expr): Expr;
    }
}

declare module 'GeoCAS' {
    export = GeoCAS;
}

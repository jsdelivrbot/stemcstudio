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
    /*
    class Expr {
        toPrefix(): string;
        toString(): string;
    }
    */
    /*
    class Algebra {
        basis: { [index: number]: Expr };
        constructor(metric: number[][], unused?: string[]);
        scalar(value: number | string): Expr;
        simplify(expr: Expr): Expr;
    }
    */

    interface Blade<T> {
        bitmap: number;
        weight: T;
        __neg__(): Blade<T>;
        __wedge__(rhs: Blade<T>): Blade<T>;
        grade(): number;
        reverse(): Blade<T>;
        gradeInversion(): Blade<T>;
        cliffordConjugate(): Blade<T>;
        zero(): Blade<T>;
    }

    interface Metric<T> {
        toEigenBasis(blade: Blade<T>): Blade<T>[];
        getEigenMetric(): number[];
        toMetricBasis(blades: Blade<T>[]): Blade<T>[];
    }

    interface FieldAdapter<T> {
        add(lhs: T, rhs: T): T;
        sub(lhs: T, rhs: T): T;
        mul(lhs: T, rhs: T): T;
        div(lhs: T, rhs: T): T;
        neg(arg: T): T;
        asString(arg: T): string;
        cos(arg: T): T;
        isField(arg: any): arg is T;
        isOne(arg: T): boolean;
        isZero(arg: T): boolean;
        one(): T;
        scale(arg: T, alpha: number): T;
        sin(arg: T): T;
        sqrt(arg: T): T;
        zero(): T;
    }

    /**
     * A multivector with a parameterized field type.
     */
    interface Multivector<T> {
        blades: Blade<T>[];
        __add__(rhs: Multivector<T>): Multivector<T>;
        __sub__(rhs: Multivector<T>): Multivector<T>;
        __mul__(rhs: T | Multivector<T>): Multivector<T>;
        __rmul__(lhs: T | Multivector<T>): Multivector<T>;
        __div__(rhs: T | Multivector<T>): Multivector<T>;
        __lshift__(rhs: Multivector<T>): Multivector<T>;
        __rshift__(rhs: Multivector<T>): Multivector<T>;
        __vbar__(rhs: Multivector<T>): Multivector<T>;
        __wedge__(rhs: Multivector<T>): Multivector<T>;
        __pos__(): Multivector<T>;
        __neg__(): Multivector<T>;
        inv(): Multivector<T>;
        mul(rhs: Multivector<T>): Multivector<T>;
        mulByScalar(α: T): Multivector<T>;
        div(rhs: Multivector<T>): Multivector<T>;
        divByScalar(α: T): Multivector<T>;
        dual(): Multivector<T>;
        /**
         * Returns the universal exponential function, exp, applied to this, i.e. exp(this).
         */
        exp(): Multivector<T>;
        extractGrade(grade: number): Multivector<T>;
        asString(names: string[]): string;
        rev(): Multivector<T>;
        scalarCoordinate(): T;
        /**
         * Returns the scalar product of this multivector with rhs, i.e. this | rhs. 
         */
        scp(rhs: Multivector<T>): T;
        toString(): string;
    }

    /**
     * Returns a scalar multivector with the specified weight.
     */
    function getScalar<T>(weight: T, metric: number | number[] | Metric<T>, adapter: FieldAdapter<T>): Multivector<T>;

    /**
     * Returns a basis vector by index. index is in the integer range [0 ... dimensions).
     */
    function getBasisVector<T>(index: number, metric: number | number[] | Metric<T>, adapter: FieldAdapter<T>): Multivector<T>;

    /**
     * A ready-made implementation of FieldAdapter<T> with T being a number.
     */
    class NumberFieldAdapter implements FieldAdapter<number> {
        add(lhs: number, rhs: number): number;
        sub(lhs: number, rhs: number): number;
        mul(lhs: number, rhs: number): number;
        div(lhs: number, rhs: number): number;
        neg(arg: number): number;
        asString(arg: number): string;
        cos(arg: number): number;
        isField(arg: any): arg is number;
        isOne(arg: number): boolean;
        isZero(arg: number): boolean;
        one(): number;
        scale(arg: number, alpha: number): number;
        sin(arg: number): number;
        sqrt(arg: number): number;
        zero(): number;
    }
}

declare module 'GeoCAS' {
    export = GeoCAS;
}

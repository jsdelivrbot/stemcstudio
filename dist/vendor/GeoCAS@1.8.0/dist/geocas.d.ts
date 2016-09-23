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
        __vbar__(rhs: Blade<T>, m: number | number[] | Metric<T>): Blade<T>;
        __wedge__(rhs: Blade<T>): Blade<T>;
        grade(): number;
        reverse(): Blade<T>;
        gradeInversion(): Blade<T>;
        cliffordConjugate(): Blade<T>;
        zero(): Blade<T>;
        asString(names?: string[]): string;
    }

    interface Metric<T> {
        toEigenBasis(blade: Blade<T>): Blade<T>[];
        getEigenMetric(): number[];
        toMetricBasis(blades: Blade<T>[]): Blade<T>[];
    }

    interface FieldAdapter<T> {
        one: T;
        zero: T;
        abs(arg: T): T;
        add(lhs: T, rhs: T): T;
        sub(lhs: T, rhs: T): T;
        eq(lhs: T, rhs: T): boolean;
        ne(lhs: T, rhs: T): boolean;
        le(lhs: T, rhs: T): boolean;
        lt(lhs: T, rhs: T): boolean;
        ge(lhs: T, rhs: T): boolean;
        gt(lhs: T, rhs: T): boolean;
        max(lhs: T, rhs: T): T;
        min(lhs: T, rhs: T): T;
        mul(lhs: T, rhs: T): T;
        mulByNumber(arg: T, alpha: number): T;
        div(lhs: T, rhs: T): T;
        neg(arg: T): T;
        asString(arg: T): string;
        cos(arg: T): T;
        isField(arg: any): arg is T;
        isOne(arg: T): boolean;
        isZero(arg: T): boolean;
        sin(arg: T): T;
        sqrt(arg: T): T;
    }

    /**
     * A multivector with a parameterized field type.
     */
    interface Multivector<T> {
        blades: Blade<T>[];
        __add__(rhs: Multivector<T>): Multivector<T>;
        __radd__(rhs: Multivector<T>): Multivector<T>;
        __sub__(rhs: Multivector<T>): Multivector<T>;
        __rsub__(rhs: Multivector<T>): Multivector<T>;
        __mul__(rhs: T | Multivector<T>): Multivector<T>;
        __rmul__(lhs: T | Multivector<T>): Multivector<T>;
        __div__(rhs: T | Multivector<T>): Multivector<T>;
        __lshift__(rhs: Multivector<T>): Multivector<T>;
        __rshift__(rhs: Multivector<T>): Multivector<T>;
        __vbar__(rhs: Multivector<T>): Multivector<T>;
        __wedge__(rhs: Multivector<T>): Multivector<T>;
        __bang__(): Multivector<T>;
        __pos__(): Multivector<T>;
        __neg__(): Multivector<T>;
        __tilde__(): Multivector<T>;
        add(rhs: Multivector<T>): Multivector<T>;
        asString(names: string[]): string;
        cliffordConjugate(): Multivector<T>;
        compress(fraction?: number): Multivector<T>;
        /**
         * direction(M) = M / sqrt(M * ~M)
         */
        direction(): Multivector<T>;
        div(rhs: Multivector<T>): Multivector<T>;
        divByScalar(α: T): Multivector<T>;
        /**
         * dual(M) = M << I, where I is the pseudoscalar of the space.
         */
        dual(): Multivector<T>;
        /**
         * Returns the universal exponential function, exp, applied to this, i.e. exp(this).
         */
        exp(): Multivector<T>;
        extractGrade(grade: number): Multivector<T>;
        gradeInversion(): Multivector<T>;
        inv(): Multivector<T>;
        isZero(): boolean;
        mul(rhs: Multivector<T>): Multivector<T>;
        mulByScalar(α: T): Multivector<T>;
        neg(): Multivector<T>;
        rev(): Multivector<T>;
        scalarCoordinate(): T;
        /**
         * Returns the scalar product of this multivector with rhs, i.e. this | rhs. 
         */
        scp(rhs: Multivector<T>): Multivector<T>;
        sqrt(): Multivector<T>;
        sub(rhs: Multivector<T>): Multivector<T>;
        toString(): string;
    }

    /**
     * A ready-made implementation of FieldAdapter<T> with T being a number.
     */
    class NumberFieldAdapter implements FieldAdapter<number> {
        one: number;
        zero: number;
        abs(arg: number): number;
        add(lhs: number, rhs: number): number;
        sub(lhs: number, rhs: number): number;
        mul(lhs: number, rhs: number): number;
        mulByNumber(arg: number, alpha: number): number;
        div(lhs: number, rhs: number): number;
        eq(lhs: number, rhs: number): boolean;
        ne(lhs: number, rhs: number): boolean;
        le(lhs: number, rhs: number): boolean;
        lt(lhs: number, rhs: number): boolean;
        ge(lhs: number, rhs: number): boolean;
        gt(lhs: number, rhs: number): boolean;
        max(lhs: number, rhs: number): number;
        min(lhs: number, rhs: number): number;
        neg(arg: number): number;
        asString(arg: number): string;
        cos(arg: number): number;
        isField(arg: any): arg is number;
        isOne(arg: number): boolean;
        isZero(arg: number): boolean;
        scale(arg: number, alpha: number): number;
        sin(arg: number): number;
        sqrt(arg: number): number;
    }

    /**
     * 
     */
    interface Algebra<T> {
        /**
         * Returns the adapter used to interact with the parameterized field.
         */
        field: FieldAdapter<T>;
        /**
         * Returns the identity element for multiplication, 1.
         */
        one: Multivector<T>;
        /**
         * Returns the identity element for addition, 0.
         */
        zero: Multivector<T>;
        /**
         * Honoring Grassmann, who called the basis vectors "units".
         */
        unit(index: number): Multivector<T>;
        /**
         * Returns a copy of the basis vectors in an order corresponding to the metric.
         */
        units: Multivector<T>[];
    }

    /**
     * Generates the Geometric Algebra over a field using a specified metric.
     * metric: 
     *   number    : A number indicating the dimensionality of the vector space.
     *   number[]  : The diagonal elements of the metric.
     *   Metric<T> : A general metric for a non-orthogonal basis.
     * field: The adapter for the scalar field over which the vectors operate.
     * labels: An optional array of labels for the basis vectors.
     */
    function algebra<T>(metric: number | number[] | Metric<T>, field: FieldAdapter<T>, labels?: string[]): Algebra<T>;

    /**
     * cos(angle) = (A | ~B) / |A||B|
     */
    function cosineOfAngleBetweenBlades<T>(A: Multivector<T>, B: Multivector<T>): Multivector<T>;
    /**
     * norm(A) = |A| = sqrt(A | ~A)
     */
    function norm<T>(A: Multivector<T>, B: Multivector<T>): Multivector<T>;
    /**
     * squaredNorm(A) = |A|^2 = A | ~A
     */
    function squaredNorm<T>(A: Multivector<T>, B: Multivector<T>): Multivector<T>;
}

declare module 'GeoCAS' {
    export = GeoCAS;
}

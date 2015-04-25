declare class Euclidean2 {
    w: number;
    x: number;
    y: number;
    xy: number;
    /**
     * The Euclidean2 class represents a multivector for a 2-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean2
     * @constructor
     * @param {number} w The scalar part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param {number} y The vector component of the multivector in the y-direction.
     * @param {number} xy The pseudoscalar part of the multivector.
     */
    constructor(w: number, x: number, y: number, xy: number);
    fromCartesian(w: number, x: number, y: number, xy: number): Euclidean2;
    fromPolar(w: number, r: number, theta: number, s: number): Euclidean2;
    coordinates(): number[];
    coordinate(index: number): number;
    static add(a: number[], b: number[]): number[];
    add(rhs: Euclidean2): Euclidean2;
    __add__(other: any): Euclidean2;
    __radd__(other: any): Euclidean2;
    static sub(a: number[], b: number[]): number[];
    sub(rhs: Euclidean2): Euclidean2;
    __sub__(other: any): Euclidean2;
    __rsub__(other: any): Euclidean2;
    static mul(a: number[], b: number[]): number[];
    mul(rhs: any): Euclidean2;
    __mul__(other: any): Euclidean2;
    __rmul__(other: any): Euclidean2;
    scalarMultiply(rhs: number): Euclidean2;
    div(rhs: any): Euclidean2;
    __div__(other: any): Euclidean2;
    __rdiv__(other: any): Euclidean2;
    static splat(a: number[], b: number[]): number[];
    splat(rhs: Euclidean2): Euclidean2;
    static wedge(a: number[], b: number[]): number[];
    wedge(rhs: Euclidean2): Euclidean2;
    __wedge__(other: any): Euclidean2;
    __rwedge__(other: any): Euclidean2;
    static lshift(a: number[], b: number[]): number[];
    lshift(rhs: Euclidean2): Euclidean2;
    __lshift__(other: any): Euclidean2;
    __rlshift__(other: any): Euclidean2;
    static rshift(a: number[], b: number[]): number[];
    rshift(rhs: Euclidean2): Euclidean2;
    __rshift__(other: any): Euclidean2;
    __rrshift__(other: any): Euclidean2;
    __vbar__(other: any): Euclidean2;
    __rvbar__(other: any): Euclidean2;
    __pos__(): Euclidean2;
    __neg__(): Euclidean2;
    /**
     * ~ (tilde) produces reversion.
     */
    __tilde__(): Euclidean2;
    grade(index: number): Euclidean2;
    norm(): Euclidean2;
    quad(): Euclidean2;
    isNaN(): boolean;
    toString(): string;
    toStringIJK(): string;
    toStringLATEX(): string;
}
export = Euclidean2;

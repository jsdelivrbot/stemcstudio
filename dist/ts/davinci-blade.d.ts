//
// davinci-blade.d.ts
//
// This file is created manually in order to support the davinci-blade library.
//
declare module blade {
    interface Field<T> {
        add(rhs: T): T;
        sub(rhs: T): T;
        mul(rhs: T): T;
        div(rhs: T): T;
    }
}
declare module blade {
    class Rational implements Field<Rational> {
        private _numer;
        private _denom;
        constructor(n: number, d: number);
        public numer : number;
        public denom : number;
        public add(rhs: any): Rational;
        public sub(rhs: any): Rational;
        public mul(rhs: any): Rational;
        public div(rhs: any): Rational;
        public isZero(): boolean;
        public negative(): Rational;
        public equals(other: any): boolean;
        public toString(): string;
        static ONE: Rational;
        static MINUS_ONE: Rational;
        static ZERO: Rational;
    }
}
declare module blade {
    class Dimensions {
        public L: any;
        public T: any;
        public Q: any;
        public temperature: any;
        public amount: any;
        public intensity: any;
        private _mass;
        constructor(theMass: any, L: any, T: any, Q: any, temperature: any, amount: any, intensity: any);
        public M : Rational;
        public compatible(rhs: Dimensions): Dimensions;
        public mul(rhs: Dimensions): Dimensions;
        public div(rhs: Dimensions): Dimensions;
        public pow(exponent: any): Dimensions;
        public dimensionless(): boolean;
        public isZero(): boolean;
        public negative(): Dimensions;
        public toString(): string;
    }
}
declare module blade {
    class Unit implements Field<Unit> {
        public scale: number;
        public dimensions: Dimensions;
        public labels: string[];
        constructor(scale: number, dimensions: Dimensions, labels: string[]);
        public compatible(rhs: Unit): Unit;
        public add(rhs: Unit): Unit;
        public sub(rhs: Unit): Unit;
        public mul(rhs: any): Unit;
        public div(rhs: any): Unit;
        public pow(rhs: number): Unit;
        public inverse(): Unit;
        public toString(): string;
    }
}
declare module blade {
    interface GeometricQuantity<T> extends Field<T> {
        wedge(rhs: T): T;
        lshift(rhs: T): T;
        rshift(rhs: T): T;
        norm(): T;
        quad(): T;
    }
}
declare module blade {
    class Measure<T> implements GeometricQuantity<Measure<T>> {
        public quantity: any;
        public uom: Unit;
        constructor(quantity: any, uom: Unit);
        public add(rhs: Measure<T>): Measure<T>;
        public sub(rhs: Measure<T>): Measure<T>;
        public mul(rhs: Measure<T>): Measure<T>;
        public div(rhs: Measure<T>): Measure<T>;
        public wedge(rhs: Measure<T>): Measure<T>;
        public lshift(rhs: Measure<T>): Measure<T>;
        public rshift(rhs: Measure<T>): Measure<T>;
        public norm(): Measure<T>;
        public quad(): Measure<T>;
        public toString(): string;
    }
}
declare module blade {
    class Euclidean2 implements GeometricQuantity<Euclidean2> {
        public w: number;
        public x: number;
        public y: number;
        public xy: number;
        constructor(w: number, x: number, y: number, xy: number);
        public fromCartesian(w: number, x: number, y: number, xy: number): Euclidean2;
        public fromPolar(w: number, r: number, theta: number, s: number): Euclidean2;
        public coordinates(): number[];
        public coordinate(index: number): number;
        static add(a: number[], b: number[]): number[];
        public add(rhs: Euclidean2): Euclidean2;
        static sub(a: number[], b: number[]): number[];
        public sub(rhs: Euclidean2): Euclidean2;
        static mul(a: number[], b: number[]): number[];
        public mul(rhs: any): Euclidean2;
        public div(rhs: any): Euclidean2;
        static splat(a: number[], b: number[]): number[];
        public splat(rhs: Euclidean2): Euclidean2;
        static wedge(a: number[], b: number[]): number[];
        public wedge(rhs: Euclidean2): Euclidean2;
        static lshift(a: number[], b: number[]): number[];
        public lshift(rhs: Euclidean2): Euclidean2;
        static rshift(a: number[], b: number[]): number[];
        public rshift(rhs: Euclidean2): Euclidean2;
        public grade(index: number): Euclidean2;
        public norm(): Euclidean2;
        public quad(): Euclidean2;
        public isNaN(): boolean;
        public toString(): string;
        public toStringIJK(): string;
        public toStringLATEX(): string;
    }
}
declare module blade {
    /**
     * A multivector with Cartesian coordinates in a 3D vector space with a Euclidean metric.
     */
    class Euclidean3 implements GeometricQuantity<Euclidean3> {
        /**
         * The `w` property is the grade zero (scalar) part of the Euclidean3 multivector.
         */
        w: number;
        /**
         * The `x` property is the x coordinate of the grade one (vector) part of the Euclidean3 multivector.
         */
        x: number;
        /**
         * The `y` property is the y coordinate of the grade one (vector) part of the Euclidean3 multivector.
         */
        y: number;
        /**
         * The `z` property is the z coordinate of the grade one (vector) part of the Euclidean3 multivector.
         */
        z: number;
        /**
         * The `xy` property is the xy coordinate of the grade two (bivector) part of the Euclidean3 multivector.
         */
        xy: number;
        /**
         * The `yz` property is the yz coordinate of the grade two (bivector) part of the Euclidean3 multivector.
         */
        yz: number;
        /**
         * The `zx` property is the zx coordinate of the grade two (bivector) part of the Euclidean3 multivector.
         */
        zx: number;
        /**
         * The `xyz` property is the grade three (pseudoscalar) part of the Euclidean3 multivector.
         */
        xyz: number;
        /**
         * Constructs a Euclidean3 from its coordinates.
         * @constructor
         * @param {number} w The scalar part of the multivector.
         * @param {number} x The vector component of the multivector in the x-direction.
         * @param {number} y The vector component of the multivector in the y-direction.
         * @param {number} z The vector component of the multivector in the z-direction.
         * @param {number} xy The bivector component of the multivector in the xy-plane.
         * @param {number} yz The bivector component of the multivector in the yz-plane.
         * @param {number} zx The bivector component of the multivector in the zx-plane.
         * @param {number} xyz The pseudoscalar part of the multivector.
         */
        constructor(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number);
        static fromCartesian(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number): Euclidean3;
        coordinates(): number[];
        coordinate(index: number): number;
        add(rhs: Euclidean3): Euclidean3;
        __add__(other: any): Euclidean3;
        __radd__(other: any): Euclidean3;
        sub(rhs: Euclidean3): Euclidean3;
        __sub__(other: any): Euclidean3;
        __rsub__(other: any): Euclidean3;
        mul(rhs: any): Euclidean3;
        __mul__(other: any): any;
        __rmul__(other: any): any;
        scalarMultiply(rhs: number): Euclidean3;
        div(rhs: any): Euclidean3;
        __div__(other: any): Euclidean3;
        __rdiv__(other: any): Euclidean3;
        splat(rhs: Euclidean3): Euclidean3;
        wedge(rhs: Euclidean3): Euclidean3;
        __vbar__(other: any): Euclidean3;
        __rvbar__(other: any): Euclidean3;
        __wedge__(other: any): Euclidean3;
        __rwedge__(other: any): Euclidean3;
        lshift(rhs: Euclidean3): Euclidean3;
        __lshift__(other: any): Euclidean3;
        __rlshift__(other: any): Euclidean3;
        rshift(rhs: Euclidean3): Euclidean3;
        __rshift__(other: any): Euclidean3;
        __rrshift__(other: any): Euclidean3;
        __pos__(): Euclidean3;
        __neg__(): Euclidean3;
        /**
         * ~ (tilde) produces reversion.
         */
        __tilde__(): Euclidean3;
        grade(index: number): Euclidean3;
        dot(vector: Euclidean3): number;
        cross(vector: Euclidean3): Euclidean3;
        length(): number;
        /**
         * Computes the magnitude of this Euclidean3. The magnitude is the square root of the quadrance.
         */
        norm(): Euclidean3;
        /**
         * Computes the quadrance of this Euclidean3. The quadrance is the square of the magnitude.
         */
        quad(): Euclidean3;
        sqrt(): Euclidean3;
        toString(): string;
        toStringIJK(): string;
        toStringLATEX(): string;
    }
}
declare module blade {
    class Color {
        private _red;
        private _green;
        private _blue;
        constructor(red: number, green: number, blue: number);
        luminance(): number;
        toString(): string;
        asFillStyle(): string;
        static luminance(red: number, green: number, blue: number): number;
        /**
         * Converts an angle, radius, height to a color on a color wheel.
         */
        static fromHSL(H: number, S: number, L: number): Color;
    }
}
declare module blade {
    class Complex {
        /**
         * The real part of the complex number.
         */
        x: number;
        /**
         * The imaginary part of the complex number.
         */
        y: number;
        /**
         * Constructs a complex number z = (x, y) or z = x + i * y.
         * @param x The real part of the complex number.
         * @param y The imaginary part of the complex number.
         */
        constructor(x: number, y: number);
        /**
         * __add__ supports operator +(Complex, any)
         */
        __add__(other: any): Complex;
        /**
         * __radd__ supports operator +(any, Complex)
         */
        __radd__(other: any): Complex;
        __sub__(other: any): Complex;
        __rsub__(other: any): Complex;
        __mul__(other: any): Complex;
        __rmul__(other: any): Complex;
        __div__(other: any): Complex;
        __rdiv__(other: any): Complex;
        norm(): number;
        quad(): number;
        arg(): number;
        toString(): string;
    }
}
declare module blade {
    var VERSION: string;
    var UNIT_DIMLESS: Unit;
    var UNIT_KILOGRAM: Unit;
    /**
     * The meter is the length of the path travelled by light in vacuum
     * during a time interval of 1 / 299 792 458 of a second.
     */
    var UNIT_METER: Unit;
    var UNIT_SECOND: Unit;
    var UNIT_AMPERE: Unit;
    var UNIT_KELVIN: Unit;
    var UNIT_MOLE: Unit;
    var UNIT_CANDELA: Unit;
    var UNIT_COULOMB: Unit;
    var UNIT_INCH: Unit;
    var UNIT_FOOT: Unit;
    var UNIT_YARD: Unit;
    var UNIT_MILE: Unit;
    var UNIT_POUND: Unit;
    var UNIT_NEWTON: Unit;
    var UNIT_JOULE: Unit;
    var UNIT_WATT: Unit;
    var UNIT_VOLT: Unit;
    var UNIT_WEBER: Unit;
    var UNIT_TESLA: Unit;
    var UNIT_OHM: Unit;
    var UNIT_SIEMEN: Unit;
    var UNIT_FARAD: Unit;
    var UNIT_HENRY: Unit;
    var UNIT_HERTZ: Unit;
    var UNIT_PASCAL: Unit;
    var units:
    {
        /**
         * The meter is the length of the path travelled by light in vacuum
         * during a time interval of 1 / 299 792 458 of a second.
         */
        meter: Unit;
        kilogram: Unit;
        second: Unit;
    };
}
declare module blade {
    /**
     * Returns a Euclidean 3-dimensional number representing a scalar.
     */
    function scalarE3(w: number): Euclidean3;
    /**
     * Returns a vector from its cartesian components.
     * @param x The component of the vector in the x-axis direction.
     * @param y The component of the vector in the y-axis direction.
     * @param z The component of the vector in the z-axis direction.
     */
    function vectorE3(x: number, y: number, z: number): Euclidean3;
    /**
     * Returns a bivector from its cartesian components.
     * @param xy The bivector component in the xy-plane.
     * @param yz The bivector component in the yz-plane.
     * @param zx The bivector component in the zx-plane.
     */
    function bivectorE3(xy: number, yz: number, zx: number): Euclidean3;
}

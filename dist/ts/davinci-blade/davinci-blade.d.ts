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
    public add(rhs: Rational): Rational;
    public sub(rhs: Rational): Rational;
    public mul(rhs: Rational): Rational;
    public div(rhs: Rational): Rational;
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
    /**
     * The `M` dimension value records the exponent of the mass unit.
     */
    public M : Rational;
    /**
     * The `L` dimension value records the exponent of the length unit.
     */
    public L: Rational;
    /**
     * The `T` dimension value records the exponent of the time unit.
     */
    public T: Rational;
    /**
     * The `Q` dimension value records the exponent of the charge unit.
     */
    public Q: Rational;
    /**
     * The `temperature` dimension value records the exponent of the temperature unit.
     */
    public temperature: Rational;
    /**
     * The `amount` dimension value records the exponent of the amount unit.
     */
    public amount: Rational;
    /**
     * The `intensity` dimension value records the exponent of the intensity unit.
     */
    public intensity: Rational;
    constructor(theMass: Rational, L: Rational, T: Rational, Q: Rational, temperature: Rational, amount: Rational, intensity: Rational);
    public compatible(rhs: Dimensions): Dimensions;
    public mul(rhs: Dimensions): Dimensions;
    public div(rhs: Dimensions): Dimensions;
    public pow(exponent: Rational): Dimensions;
    public dimensionless(): boolean;
    public isZero(): boolean;
    public negative(): Dimensions;
    public toString(): string;
  }
}

declare module blade {
  class Unit implements Field<Unit> {
    /**
     * The `scale` property (usually 1) is a multiplier of the unit dimensions and choice of units.
     */
    public scale: number;
    /**
     * The `dimensions` property holds a vector of rational numbers representing mass, length, time, charge, temperature, amount and intensity.
     */
    public dimensions: Dimensions;
    public labels: string[];
    constructor(scale: number, dimensions: Dimensions, labels: string[]);
    /**
     * Returns the argument unit if it is compatible with the target unit, otherwise returns undefined.
     */
    public compatible(rhs: Unit): Unit;
    public add(rhs: Unit): Unit;
    public sub(rhs: Unit): Unit;
    public mul(rhs: Unit): Unit;
    public div(rhs: Unit): Unit;
    public pow(exponent: Rational): Unit;
    public inverse(): Unit;
    /**
     * Returns true if this unit of measure is dimensionless and has unity scale.
     */
    public isUnity(): boolean;
    public toString(): string;
  }
}

declare module blade {
  interface Measure<T> extends Field<T> {
    coordinates(): number[];
    /**
     * The optional `uom` property is the unit of measure. A measure without a uom is equivalent to be a (dimensionless) quantity.
     */
    uom: Unit;
    add(rhs: T): T;
    sub(rhs: T): T;
    mul(rhs: T): T;
    div(rhs: T): T;
    wedge(rhs: T): T;
    lshift(rhs: T): T;
    rshift(rhs: T): T;
    pow(exponent: T): T;
    cos(): T;
    cosh(): T;
    exp(): T;
    norm(): T;
    quad(): T;
    unit(): T;
    scalar(): number;
    toExponential(): string;
    toFixed(digits?: number): string;
    toString(): string;
  }
}

declare module blade {
  class Euclidean2 implements Measure<Euclidean2> {
    public w: number;
    public x: number;
    public y: number;
    public xy: number;
    /**
     * The optional `uom` property is the unit of measure. A measure without a uom is equivalent to be a (dimensionless) quantity.
     */
    public uom: Unit;
    constructor(w: number, x: number, y: number, xy: number, uom?: Unit);
    public fromCartesian(w: number, x: number, y: number, xy: number, uom?: Unit): Euclidean2;
    public fromPolar(w: number, r: number, theta: number, s: number, uom?: Unit): Euclidean2;
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
    /**
     * Returns e (the base of natural logarithms) raised to the power of this Euclidean2.
     */
    public exp(): Euclidean2;
    public norm(): Euclidean2;
    public quad(): Euclidean2;
    public isNaN(): boolean;
    public scalar(): number;
    /**
     * The toExponential() method formats the number using exponential notation.
     */
    toExponential(): string;
    /**
     * The toFixed() method formats the number using fixed-point notation.
     */
    toFixed(digits?: number): string;
    public toString(): string;
    public toStringIJK(): string;
    public toStringLATEX(): string;
  }
}
declare module blade {
  /**
   * A multivector with Cartesian coordinates in a 3D vector space with a Euclidean metric.
   */
  class Euclidean3 implements Measure<Euclidean3> {
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
     * The optional `uom` property is the unit of measure. A measure without a uom is equivalent to be a (dimensionless) quantity.
     */
    uom: Unit;
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
     * @param uom The optional unit of measure.
     */
    constructor(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom?: Unit);
    static fromCartesian(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number, uom?: Unit): Euclidean3;
    coordinates(): number[];
    coordinate(index: number): number;
    add(rhs: Euclidean3): Euclidean3;
    __add__(other: any): Euclidean3;
    __radd__(other: any): Euclidean3;
    sub(rhs: Euclidean3): Euclidean3;
    __sub__(other: any): Euclidean3;
    __rsub__(other: any): Euclidean3;
    mul(rhs: Euclidean3): Euclidean3;
    __mul__(other: any): any;
    __rmul__(other: any): any;
    scalarMultiply(rhs: number): Euclidean3;
    div(rhs: Euclidean3): Euclidean3;
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
     * Computes the cosine of this multivector.
     */
    cos(): Euclidean3;
    /**
     * Computes the magnitude of this Euclidean3. The magnitude is the square root of the quadrance.
     */
    norm(): Euclidean3;
    /**
     * Computes the quadrance of this Euclidean3. The quadrance is the square of the magnitude.
     */
    quad(): Euclidean3;
    /**
     * Returns the square root of the number.
     */
    sqrt(): Euclidean3;
    /**
     * Returns the normalized value of this number.
     */
    unit(): Euclidean3;
    /**
     * Returns the scalar part of this multivector as a number.
     */
    scalar(): number;
    /**
     * The toExponential() method formats the number using exponential notation.
     */
    toExponential(): string;
    /**
     * The toFixed() method formats the number using fixed-point notation.
     */
    toFixed(digits?: number): string;
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
    class Complex implements Measure<Complex> {
        /**
         * The real part of the complex number.
         */
        x: number;
        /**
         * The imaginary part of the complex number.
         */
        y: number;
        /**
         * The optional `uom` property is the unit of measure. A measure without a uom is equivalent to be a (dimensionless) quantity.
         */
        uom: Unit;
        /**
         * Constructs a complex number z = (x, y) or z = x + i * y.
         * @param x The real part of the complex number.
         * @param y The imaginary part of the complex number.
         * @param uom The optional unit of measure.
         */
        constructor(x: number, y: number, uom?: Unit);
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
        arg(): number;
        /**
         * Computes the cosine of this complex number.
         */
        cos(): Complex;
        /**
         * Computes the hyperbolic cosine of this complex number.
         */
        cosh(): Complex;
        /**
         * Computes the exponential of this complex number.
         */
        exp(): Complex;
        norm(): number;
        quad(): number;
        /**
         * Computes the sine of this complex number.
         */
        sin(): Complex;
        /**
         * Computes the hyperbolic sine of this complex number.
         */
        sinh(): Complex;
        /**
         * Computes the unit magnitude complex number associated with this complex number.
         */
        unit(): Complex;
        /**
         * The toExponential() method formats the number using exponential notation.
         */
        toExponential(): string;
        /**
         * The toFixed() method formats the number using fixed-point notation.
         */
        toFixed(digits?: number): string;
        toString(): string;
    }
}
declare module blade {
    /**
     * The version of the blade library.
     */
    var VERSION: string;
    /**
     * Universal Mathematical Functions.
     */
    var universals:
    {
      /**
       * Computes the cosine of the argument.
       */
      cos: <T>(x: T) => T,
      /**
       * Computes the hyperbolic cosine of the argument.
       */
      cosh: <T>(x: T) => T,
      /**
       * Computes the exponential of the argument.
       */
      exp: <T>(x: T) => T,
      /**
       * Computes the magnitude of the argument.
       */
      norm: <T>(x: T) => T,
      /**
       * Computes the quadrance of the argument. The quadrance is the square of the magnitude.
       */
      quad: <T>(x: T) => T,
      /**
       * Computes the sine of the argument.
       */
      sin: <T>(x: T) => T,
      /**
       * Computes the hyperbolic sine of the argument.
       */
      sinh: <T>(x: T) => T,
      /**
       * Returns the square root of a number.
       */
      sqrt: <T>(x: T) => T,
      /**
       * Computes the unit magnitude quantity of the argument.
       */
      unit: <T>(x: T) => T
    },
    var e2ga:
    {
      e1: Euclidean2;
      e2: Euclidean2;
      units:
      {
        ampere: Euclidean2;
        candela: Euclidean2;
        coulomb: Euclidean2;
        farad: Euclidean2;
        foot: Euclidean2;
        henry: Euclidean2;
        hertz: Euclidean2;
        inch: Euclidean2;
        joule: Euclidean2;
        kelvin: Euclidean2;
        kilogram: Euclidean2;
        meter: Euclidean2;
        mile: Euclidean2;
        mole: Euclidean2;
        newton: Euclidean2;
        ohm: Euclidean2;
        pascal: Euclidean2;
        pound: Euclidean2;
        second: Euclidean2;
        siemen: Euclidean2;
        tesla: Euclidean2;
        unity: Euclidean2;
        volt: Euclidean2;
        watt: Euclidean2;
        weber: Euclidean2;
        yard: Euclidean2;
      };
    };
    var e3ga:
    {
      e1: Euclidean3;
      e2: Euclidean3;
      e3: Euclidean3;
      units:
      {
        ampere: Euclidean3;
        candela: Euclidean3;
        coulomb: Euclidean3;
        farad: Euclidean3;
        foot: Euclidean3;
        henry: Euclidean3;
        hertz: Euclidean3;
        inch: Euclidean3;
        joule: Euclidean3;
        kelvin: Euclidean3;
        kilogram: Euclidean3;
        meter: Euclidean3;
        mile: Euclidean3;
        mole: Euclidean3;
        newton: Euclidean3;
        ohm: Euclidean3;
        pascal: Euclidean3;
        pound: Euclidean3;
        second: Euclidean3;
        siemen: Euclidean3;
        tesla: Euclidean3;
        unity: Euclidean3;
        volt: Euclidean3;
        watt: Euclidean3;
        weber: Euclidean3;
        yard: Euclidean3;
      };
    };
    var units:
    {
        ampere: Unit;
        candela: Unit;
        coulomb: Unit;
        farad: Unit;
        foot: Unit;
        henry: Unit;
        hertz: Unit;
        inch: Unit;
        joule: Unit;
        kelvin: Unit;
        kilogram: Unit;
        /**
         * The meter is the length of the path travelled by light in vacuum
         * during a time interval of 1 / 299 792 458 of a second.
         */
        meter: Unit;
        mile: Unit;
        mole: Unit;
        newton: Unit;
        ohm: Unit;
        pascal: Unit;
        pound: Unit;
        second: Unit;
        siemen: Unit;
        tesla: Unit;
        unity: Unit;
        volt: Unit;
        watt: Unit;
        weber: Unit;
        yard: Unit;
    };
}
declare module blade {
    /**
     * Returns a Euclidean 3-dimensional number representing a scalar.
     */
    function scalarE3(w: number, uom?: Unit): Euclidean3;
    /**
     * Returns a vector from its cartesian components.
     * @param x The component of the vector in the x-axis direction.
     * @param y The component of the vector in the y-axis direction.
     * @param z The component of the vector in the z-axis direction.
     * @param uom The optional unit of measure.
     */
    function vectorE3(x: number, y: number, z: number, uom?: Unit): Euclidean3;
    /**
     * Returns a bivector from its cartesian components.
     * @param xy The bivector component in the xy-plane.
     * @param yz The bivector component in the yz-plane.
     * @param zx The bivector component in the zx-plane.
     */
    function bivectorE3(xy: number, yz: number, zx: number, uom? Unit): Euclidean3;
}

//
// davinci-units.d.ts
//
// This file was created manually in order to support the davinci-units library.
// These declarations are appropriate when using the library through the global
// variable, 'UNITS'.
//
/**
 * Mathematical Physics, Units, Dimensions, and Multivectors using Geometric Algebra.
 */
declare module UNITS {

    /**
     * The QQ class represents a rational number.
     * The QQ implementation is that of an immutable value.
     * The numerator and denominator are reduced to their lowest form.
     * Construct new instances using the static valueOf method.
     */
    class QQ {

        /**
         * The denominator.
         */
        denom: number;

        /**
         * The numerator.
         */
        numer: number;

        /**
         *
         */
        add(rhs: QQ): QQ

        /**
         *
         */
        div(rhs: QQ): QQ

        /**
         *
         */
        equals(other: QQ): boolean

        /**
         * Computes the multiplicative inverse of this rational number.
         */
        inv(): QQ

        /**
         * Determines whether this rational number is the multiplicative identity, <b>1</b>.
         */
        isOne(): boolean

        /**
         * Determines whether this rational number is the additive identity, <b>0</b>.
         */
        isZero(): boolean

        /**
         *
         */
        mul(rhs: QQ): QQ

        /**
         * Computes the additive inverse of this rational number.
         */
        neg(): QQ

        /**
         *
         */
        sub(rhs: QQ): QQ

        /**
         *
         */
        toString(): string

        /**
         *
         */
        static valueOf(numer: number, denom: number): QQ
    }

    /**
     * The dimensions of a physical quantity.
     */
    class Dimensions {
        M: QQ;
        L: QQ;
        T: QQ;
        Q: QQ;
        temperature: QQ;
        amount: QQ;
        intensity: QQ;
        constructor(M: QQ, L: QQ, T: QQ, Q: QQ, temperature: QQ, amount: QQ, intensity);
        isOne(): boolean;
        isZero(): boolean;
        inv(): Dimensions;
        neg(): Dimensions;

        /**
         *
         */
        static ONE: Dimensions;

        /**
         *
         */
        static MASS: Dimensions;

        /**
         *
         */
        static LENGTH: Dimensions;

        /**
         *
         */
        static TIME: Dimensions;

        /**
         *
         */
        static CHARGE: Dimensions;

        /**
         *
         */
        static CURRENT: Dimensions;

        /**
         *
         */
        static TEMPERATURE: Dimensions;

        /**
         *
         */
        static AMOUNT: Dimensions;

        /**
         *
         */
        static INTENSITY: Dimensions;
    }

    /**
     * The unit of measure for a physical quantity.
     */
    class Unit {
        multiplier: number;
        dimensions: Dimensions;
        labels: string[];
        constructor(multiplier: number, dimensions: Dimensions, labels: string[]);
        inv(): Unit;
        isOne(): boolean;
        isZero(): boolean;
        neg(): Unit;

        /**
         * Tme multiplicative identity (1).
         */
        static ONE: Unit;

        /**
         * The kilogram.
         */
        static KILOGRAM: Unit;

        /**
         * The meter.
         */
        static METER: Unit;

        /**
         * The second.
         */
        static SECOND: Unit;

        /**
         * The coulomb.
         */
        static COULOMB: Unit;

        /**
         * The ampere.
         */
        static AMPERE: Unit;

        /**
         * The kelvin.
         */
        static KELVIN: Unit;

        /**
         * The mole.
         */
        static MOLE: Unit;

        /**
         * The candela.
         */
        static CANDELA: Unit;
    }

    class G2 {
        a: number
        x: number
        y: number
        b: number
        uom: Unit
        constructor(α?: number, x?: number, y?: number, β?: number, uom?: Unit)
        add(rhs: G2): G2
        addPseudo(β: Unit): G2
        addScalar(α: Unit): G2
        angle(): G2
        copy(M: GeometricE2): G2
        direction(): G2
        exp(): G2
        inv(): G2
        isPinor(): boolean
        isZero(): boolean
        magnitude(): G2
        reflect(n: VectorE2): G2
        rotate(spinor: SpinorE2): G2
        squaredNorm(): G2
        scp(rhs: G2): G2
        toExponential(fractionDigits?: number): string;
        toFixed(fractionDigits?: number): string;
        toPrecision(precision?: number): string;
        toString(radix?: number): string;
        static ampere: G2
        static candela: G2
        static coulomb: G2
        static e1: G2
        static e2: G2
        static I: G2
        static kelvin: G2
        static kilogram: G2
        static meter: G2
        static mole: G2
        static one: G2
        static second: G2
        static zero: G2
        static fromVectorE2(vector: VectorE2): G2
        /**
         * Creates a vector from Cartesian coordinates and an optional unit of measure.
         */
        static vector(x: number, y: number, uom?: Unit): G2
    }

    /**
     * A measure with an optional unit of measure.
     */
    class G3 implements VectorE3, SpinorE3 {
        /**
         * The labels to use for the basis vectors.
         * For G3 there must be eight (8) labels.
         * e.g.
         * [['1'], ['e1'], ['e2'], ['e3'],['e12'], ['e23'], ['e32'], ['e123']]
         * or
         * [["1"], ["i"], ["j"], ["k"], ["ij"], ["jk"], ["ki"], ["I"]]
         */
        static BASIS_LABELS: string[][];
        // FIXME: When TypeScript has been upgraded we can do this...
        // static BASIS_LABELS: (string | string[])[];
        static BASIS_LABELS_GEOMETRIC: string[][];
        static BASIS_LABELS_HAMILTON: string[][];
        static BASIS_LABELS_STANDARD: string[][];
        static BASIS_LABELS_STANDARD_HTML: string[][];

        static ampere: G3;
        static candela: G3;
        static coulomb: G3;
        static e1: G3;
        static e2: G3;
        static e3: G3;
        static kelvin: G3;
        static kilogram: G3;
        static meter: G3;
        static mole: G3;
        static one: G3;
        static second: G3;
        static zero: G3;
        /**
         * The scalar component.
         */
        a: number
        x: number
        y: number
        z: number
        /**
         * The bivector component in the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> plane.
         */
        yz: number
        /**
         * The bivector component in the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> plane.
         */
        zx: number
        /**
         * The bivector component in the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> plane.
         */
        xy: number
        /**
         * The pseudoscalar component.
         */
        b: number
        /**
         * The (optional) unit of measure.
         */
        uom: Unit;
        constructor(α: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, β: number, uom?: Unit)
        add(rhs: G3): G3;
        addPseudo(β: Unit): G3;
        addScalar(α: Unit): G3;
        adj(): G3;
        angle(); G3;
        conj(): G3;
        coordinate(index: number): number;
        cos(): G3;
        cosh(): G3;
        cross(vector: G3): G3;
        cubicBezier(t: number, controlBegin: GeometricE3, controlEnd: GeometricE3, endPoint: GeometricE3): G3;
        distanceTo(point: G3): number;
        div(rhs: G3): G3;
        divByScalar(α: number): G3;
        dual(): G3;
        equals(other: G3): G3;
        exp(): G3;
        ext(rhs: G3): G3;
        /**
         * Extracts the specified grade from this multivector.
         */
        grade(index: number): G3;
        inv(): G3;
        isOne(): boolean;
        isZero(): boolean;
        lco(rhs: G3): G3;
        lerp(target: G3, α: number): G3;
        log(): G3;
        magnitude(): G3;
        mul(rhs: G3): G3;
        neg(): G3;
        norm(): G3;
        pow(exponent: G3): G3;
        quad(): G3;
        quadraticBezier(t: number, controlPoint: GeometricE3, endPoint: GeometricE3): G3;
        rco(rhs: G3): G3;
        reflect(n: VectorE3): G3;
        rev(): G3;
        rotate(s: SpinorE3): G3;
        scale(α: number): G3;
        scp(rhs: G3): G3;
        sin(): G3;
        sinh(): G3;
        slerp(target: G3, α: number): G3;
        sqrt(): G3;
        squaredNorm(): G3;
        sub(rhs: G3): G3;
        toExponential(fractionDigits?: number): string;
        toFixed(fractionDigits?: number): string;
        toPrecision(precision?: number): string;
        toString(radix?: number): string;
        direction(): G3;
        static fromSpinor(spinor: SpinorE3): G3;
        static fromVector(vector: VectorE3): G3;
        /**
         * Computes a random multivector with an optional unit of measure.
         */
        static random(uom?: Unit): G3;
        static scalar(α: number, uom?: Unit): G3;
        static vector(x: number, y: number, z: number, uom?: Unit): G3;
    }

    /**
     *
     */
    interface VectorE1 {
        /**
         * The Cartesian x-coordinate.
         */
        x: number;
    }

    /**
     *
     */
    interface VectorE2 {
        /**
         * The Cartesian x-coordinate or <em>abscissa</em>.
         */
        x: number;
        /**
         * The Cartesian y-coordinate or <em>ordinate</em>.
         */
        y: number;
    }

    /**
     *
     */
    interface SpinorE2 extends Scalar, Pseudo {
    }

    /**
     *
     */
    interface GeometricE2 extends Pseudo, Scalar, SpinorE2, VectorE2 {
    }

    interface Scalar {
        a: number
    }

    interface Pseudo {
        b: number
    }

    /**
     * The even sub-algebra of <code>G3</code>.
     */
    interface SpinorE3 extends Scalar {
        /**
         * The bivector component in the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> plane.
         */
        yz: number;

        /**
         * The bivector component in the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> plane.
         */
        zx: number;

        /**
         * The bivector component in the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> plane.
         */
        xy: number;
    }

    /**
     * The coordinates for a multivector in 3D in geometric Cartesian basis.
     */
    interface GeometricE3 extends Pseudo, Scalar, SpinorE3, VectorE3 {

    }

    /**
     * `Components` of a vector in a 3-dimensional Cartesian coordinate system.
     */
    interface VectorE3 {

        /**
         * The magnitude of the projection onto the standard e1 basis vector. 
         */
        x: number;

        /**
         * The magnitude of the projection onto the standard e2 basis vector. 
         */
        y: number;

        /**
         * The magnitude of the projection onto the standard e2 basis vector. 
         */
        z: number;
    }

    /**
     *
     */
    interface VectorE4 {
        x: number;
        y: number;
        z: number;
        w: number;
    }

    ///////////////////////////////////////////////////////////////////////////////
    /**
     * Universal cosine function.
     */
    function cos<T>(x: T): T;
    /**
     * Universal hyperbolic cosine function.
     */
    function cosh<T>(x: T): T;
    /**
     * Universal exponential function.
     */
    function exp<T>(x: T): T;
    /**
     * Universal (natural) logarithm function.
     */
    function log<T>(x: T): T;
    /**
     *
     */
    function norm<T>(x: T): T;
    /**
     *
     */
    function quad<T>(x: T): T;
    /**
     * Universal sine function.
     */
    function sin<T>(x: T): T;
    /**
     * Universal hyperbolic sine function.
     */
    function sinh<T>(x: T): T;
    /**
     *
     */
    function sqrt<T>(x: T): T;
    ///////////////////////////////////////////////////////////////////////////////
}

declare module 'units' {
    export = UNITS;
}

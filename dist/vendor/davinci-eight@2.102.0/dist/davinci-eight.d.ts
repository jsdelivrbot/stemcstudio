//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
// These declarations are appropriate when using the library through the global
// variable, 'EIGHT'.
//
/**
 * WebGL library for mathematical physics using Geometric Algebra.
 */
declare module EIGHT {

    /**
     * Enables clients of IUnknown instances to declare their references.
     */
    interface IUnknown {
        /**
         * Notifies this instance that something is referencing it.
         */
        addRef(): number;
        /**
         * Notifies this instance that something is dereferencing it.
         */
        release(): number;
    }

    class ShareableArray<T extends IUnknown> extends Shareable {
        length: number;
        /**
         * Collection class for maintaining an array of types derived from IUnknown.
         * Provides a safer way to maintain reference counts than a native array.
         */
        constructor(elements?: T[]);
        get(index: number): T;
        /**
         * Gets the element at the specified index without incrementing the reference count.
         * Use this method when you don't intend to hold onto the returned value.
         */
        getWeakRef(index: number): T;
        indexOf(searchElement: T, fromIndex?: number): number;
        slice(begin?: number, end?: number): ShareableArray<T>;
        splice(index: number, deleteCount: number): ShareableArray<T>;
        forEach(callback: (value: T, index: number) => void): void;
        push(element: T): number;
        /**
         * Pushes an element onto the tail of the list without incrementing the element reference count.
         */
        pushWeakRef(element: T): number;
        pop(): T;
        shift(): T;
    }

    class NumberIUnknownMap<V extends IUnknown> extends Shareable {
        keys: number[];
        constructor()
        exists(key: number): boolean
        get(key: number): V
        getWeakRef(key: number): V
        put(key: number, value: V): void
        putWeakRef(key: number, value: V): void
        forEach(callback: (key: number, value: V) => void)
        remove(key: number): void
    }

    class StringIUnknownMap<V extends IUnknown> extends Shareable {
        keys: string[];
        constructor()
        exists(key: string): boolean
        forEach(callback: (key: string, value: V) => void)
        get(key: string): V
        getWeakref(key: string): V
        put(key: string, value: V): void
        putWeakRef(key: string, value: V): void
        remove(key: string): void
    }

    /**
     * Convenience base class for classes requiring reference counting.
     */
    class Shareable implements IUnknown {
        /**
         * Unique identifier for this instance.
         */
        uuid: string;
        /**
         * type: A human-readable name for the derived class type.
         */
        constructor(type: string);
        /**
         *
         */
        protected destructor(): void
        /**
         * Notifies this instance that something is referencing it.
         */
        addRef(): number;
        /**
         * Notifies this instance that something is dereferencing it.
         */
        release(): number;
    }

    /**
     *
     */
    interface IContextConsumer extends IUnknown {
        /**
         * Called to request the dependent to free any WebGL resources acquired and owned.
         * The dependent may assume that its cached context is still valid in order
         * to properly dispose of any cached resources. In the case of shared objects, this
         * method may be called multiple times for what is logically the same context. In such
         * cases the dependent must be idempotent and respond only to the first request.
         */
        contextFree(context: IContextProvider): void;
        /**
         * Called to inform the dependent of a new WebGL rendering context.
         * The implementation should ignore the notification if it has already
         * received the same context.
         */
        contextGain(context: IContextProvider): void;
        /**
         * Called to inform the dependent of a loss of WebGL rendering context.
         * The dependent must assume that any cached context is invalid.
         * The dependent must not try to use and cached context to free resources.
         * The dependent should reset its state to that for which there is no context.
         */
        contextLost(): void;
    }

    interface IContextListener extends IContextConsumer {
        subscribe(visual: WebGLRenderer): void;
        unsubscribe(): void;
    }

    class ShareableContextListener extends Shareable implements IContextListener {
        contextFree(context: IContextProvider): void;
        contextGain(context: IContextProvider): void;
        contextLost(): void;
        subscribe(visual: WebGLRenderer): void;
        unsubscribe(): void;
    }

    /**
     *
     */
    interface PrimitiveBuffers extends IUnknown {
        uuid: string;
        bind(material: Material, aNameToKeyName?: { [name: string]: string }): void;
        draw(): void;
        unbind(): void;
    }

    /**
     * The draw mode determines how the WebGL pipeline consumes and processes the vertices.
     */
    enum DrawMode {
        /**
         * Each vertex is drawn as an isolated pixel or group of pixes based upon gl_PointSize.
         */
        POINTS,
        /**
         * Vertices are consumed in pairs creating connected line segments.
         */
        LINES,
        /**
         * Connects each vertex to the next by a line segment.
         */
        LINE_STRIP,
        /**
         * Similar to LINE_STRIP except that the last vertex is connected back to the first.
         */
        LINE_LOOP,
        /**
         * Vertices are consumed in groups of three to form triangles.
         */
        TRIANGLES,
        /**
         * After the first triangle, each subsequent point make a new triangle
         * using the previous two points.
         */
        TRIANGLE_STRIP,
        /**
         * After the first triangle, each subsequent point makes a new triangle
         * that incorporates the previous point and the very first point.
         */
        TRIANGLE_FAN
    }

    /**
     * An array of attribute values associated with meta data describing how to interpret the values.
     * {values: number[]; size: number;}
     */
    interface Attribute {
        /**
         * The attribute values.
         */
        values: number[];
        /**
         * The number of values that are associated with a given vertex.
         */
        size: number;
    }

    /**
     * {mode: DrawMode; indices: number[]; attributes: {[name: string]: Attribute};}
     */
    interface Primitive {
        /**
         *
         */
        mode: DrawMode;

        /**
         *
         */
        indices: number[];

        /**
         *
         */
        attributes: { [name: string]: Attribute };
    }

    /**
     *
     */
    interface IContextProgramConsumer {
        contextFree(): void;
        contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
        contextLost(): void;
    }

    /**
     * Manages the lifecycle of an attribute used in a vertex shader.
     */
    class AttribLocation implements IContextProgramConsumer {
        index: number;
        contextFree(): void;
        contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
        contextLost(): void;
        enable(): void;
        disable(): void;
        vertexPointer(size: number, normalized?: boolean, stride?: number, offset?: number): void;
    }

    /**
     * Utility class for managing a shader uniform variable.
     */
    class UniformLocation implements IContextProgramConsumer {
        contextFree(): void;
        contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
        contextLost(): void;
        uniform1f(x: number): void;
        uniform2f(x: number, y: number): void;
        uniform3f(x: number, y: number, z: number): void;
        uniform4f(x: number, y: number, z: number, w: number): void;
        /**
         * Sets the uniform location to the value of the specified vector.
         */
        vec1(coords: VectorE1): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified vector.
         */
        vec2(coords: VectorE2): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified vector.
         */
        vec3(coords: VectorE3): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified vector.
         */
        vec4(coords: VectorE4): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified matrix.
         */
        mat2(matrix: Mat2R, transpose?: boolean): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified matrix.
         */
        mat3(matrix: Mat3R, transpose?: boolean): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified matrix.
         */
        mat4(matrix: Mat4R, transpose?: boolean): UniformLocation;

        vector2(coords: number[]): void;
        vector3(coords: number[]): void;
        vector4(coords: number[]): void;
        toString(): string;
    }

    /**
     *
     */
    interface ITexture extends IContextConsumer {
        bind(): void;
        unbind(): void;
    }

    /**
     * A reference-counted wrapper around a `WebGLTexture`.
     * It is associated with the `TEXTURE_2D` target at construction time. 
     */
    interface ITexture2D extends ITexture {

    }

    /**
     * A reference-counted wrapper around a `WebGLTexture`.
     * It is associated with the `TEXTURE_CUBE_MAP` target at construction time. 
     */
    interface ITextureCubeMap extends ITexture {

    }

    /**
     * A rational number.
     */
    class QQ {

        /**
         * The numerator.
         */
        numer: number;

        /**
         * The denominator.
         */
        denom: number;

        /**
         * Constructs a rational number from an ordered pair of integers.
         * @param numer The numerator.
         * @param denom The denominator.
         */
        constructor(numer: number, denom: number);

        /**
         * Computes the multiplicative inverse of this rational number.
         */
        inv(): QQ;

        /**
         * Determines whether this rational number is the multiplicative identity, <b>1</b>.
         */
        isOne(): boolean;

        /**
         * Determines whether this rational number is the additive identity, <b>0</b>.
         */
        isZero(): boolean;

        /**
         * Computes the additive inverse of this rational number.
         */
        neg(): QQ;

        static MINUS_ONE: QQ;

        /**
         * The multiplicative identity <b>1</b> for rational numbers.
         */
        static ONE: QQ;
        static TWO: QQ;

        /**
         * The additive identity <b>0</b> for rational numbers.
         */
        static ZERO: QQ;
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
        α: number
        alpha: number
        x: number
        y: number
        β: number
        beta: number
        uom: Unit
        constructor(α?: number, x?: number, y?: number, β?: number, uom?: Unit)
        direction(): G2
        inv(): G2
        isZero(): boolean
        magnitude(): G2
        scp(rhs: G2): G2
        rotate(spinor: SpinorE2): G2
        toExponential(): string;
        toFixed(digits?: number): string;
        toString(): string;
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
         * For G3m there must be eight (8) labels.
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
        α: number
        alpha: number

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
        β: number
        beta: number
        /**
         * The (optional) unit of measure.
         */
        uom: Unit;
        constructor(α: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, β: number, uom?: Unit)
        add(rhs: G3): G3;
        addPseudo(β: number): G3;
        addScalar(α: number): G3;
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
        toExponential(): string;
        toFixed(digits?: number): string;
        toString(): string;
        direction(): G3;
        static fromSpinorE3(spinor: SpinorE3): G3;
        static fromVectorE3(vector: VectorE3): G3;
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
    class AbstractMatrix {
        elements: Float32Array;
        dimensions: number;
        callback: () => Float32Array;
        modified: boolean;
        constructor(elements: Float32Array, dimensions: number);
    }

    /**
     * A 2x2 (square) matrix of <code>number</code>.
     */
    class Mat2R extends AbstractMatrix {

        /**
         * Constructs a new <code>Mat2R</code> wrapper around a <code>Float32Array</code>.
         * The elements are expected to be in column-major order.
         */
        constructor(elements: Float32Array);

        /**
         * Sets this matrix to the value of <code>this</code> + <code>rhs</code>.
         */
        add(rhs: Mat2R): Mat2R;

        /**
         * Creates a copy of this matrix.
         */
        clone(): Mat2R;

        /**
         * Computes the determinant of this matrix.
         */
        det(): number;

        /**
         * Sets this matrix to its multiplicative inverse.
         */
        inv(): Mat2R;

        /**
         * Determines whether this matrix is the multiplicative identity.
         */
        isOne(): boolean;

        /**
         * Determines whether this matrix is the additive identity.
         */
        isZero(): boolean;

        /**
         * Sets this matrix to the value of <code>this</code> * <code>rhs</code>.
         */
        mul(rhs: Mat2R): Mat2R;

        /**
         * Sets this matrix to the value of <code>a</code> * <code>b</code>.
         */
        mul2(a: Mat2R, b: Mat2R): Mat2R;

        /**
         * Sets this matrix to its additive inverse.
         */
        neg(): Mat2R;

        /**
         * Sets this matrix to the multiplicative identity, <em>1</em>. 
         */
        one(): Mat2R;

        /**
         * <p>
         * Sets this matrix to a matrix that effects a reflection in the
         * line normal to the unit vector <code>n</code>.
         * </p>
         * <p>
         * this ⟼ reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
         * </p>
         */
        reflection(n: VectorE1): Mat2R;

        /**
         * Computes the row corresponding to the zero-based index, <code>i</code>.
         */
        row(i: number): Array<number>;

        /**
         * Sets this matrix to the value of <code>this</code> * <code>α</code>.
         */
        scale(α: number): Mat2R;

        /**
         * Sets the elements of this matrix.
         * The parameters are in row-major order.
         */
        set(n11: number, n12: number, n21: number, n22: number): Mat2R;

        /**
         * Sets this matrix to the value of <code>this</code> - <code>rhs</code>.
         */
        sub(rhs: Mat2R): Mat2R;

        /**
         * Computes a string representation of this matrix in exponential notation.
         */
        toExponential(): string;

        /**
         * Computes a string representation of this matrix with a fixed number of digits.
         */
        toFixed(digits?: number): string;

        /**
         * Computes a string representation of this matrix.
         */
        toString(): string;

        /**
         * Sets this matrix to the additive identity, <em>0</em>. 
         */
        zero(): Mat2R;

        /**
         * Creates a matrix that is the multiplicative identity, <em>1</em>. 
         */
        static one(): Mat2R;

        /**
         * <P>
         * Creates a matrix that effects a reflection in the line normal
         * to the unit vector <code>n</code>.
         * </p>
         * <p>
         * reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
         * </p>
         */
        static reflection(n: VectorE1): Mat2R;

        /**
         * Creates a matrix that is the additive identity, <em>0</em>. 
         */
        static zero(): Mat2R;
    }

    /**
     * A 3x3 (square) matrix of <code>number</code>.
     */
    class Mat3R extends AbstractMatrix {

        /**
         * Constructs a new <code>Mat3R</code> wrapper around a <code>Float32Array</code>.
         * The elements are expected to be in column-major order.
         */
        constructor(elements: Float32Array);

        /**
         * Sets this matrix to the value of <code>this</code> + <code>rhs</code>.
         */
        add(rhs: Mat3R): Mat3R;

        /**
         * Creates a copy of this matrix.
         */
        clone(): Mat3R;

        /**
         *
         */
        copy(m: Mat3R): Mat3R;

        /**
         *
         */
        det(): number;

        /**
         *
         */
        inv(): Mat3R;

        /**
         *
         */
        isOne(): boolean;

        /**
         *
         */
        isZero(): boolean;

        /**
         *
         */
        mul(rhs: Mat3R): Mat3R;

        /**
         *
         */
        mul2(a: Mat3R, b: Mat3R): Mat3R;

        /**
         *
         */
        neg(): Mat3R;

        /**
         * Sets this matrix to the identity element for multiplication, <b>1</b>.
         */
        one(): Mat4R;

        reflection(n: VectorE3): Mat3R;
        row(i: number): number[];
        scale(alpha: number): Mat3R;
        set(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Mat3R;
        sub(rhs: Mat3R): Mat3R;
        toString(): string;
        transpose(): Mat3R;
        zero(): Mat3R;

        /**
         *
         */
        normalFromMat4R(matrix: Mat4R): void;

        /**
         * Generates a new identity matrix.
         */
        static one(): Mat3R;
        static reflection(n: VectorE2): Mat3R;
        static zero(): Mat3R;
    }

    /**
     *
     */
    class Mat4R extends AbstractMatrix {
        constructor(elements: Float32Array);

        /**
         * Returns a copy of this matrix instance.
         */
        clone(): Mat4R;

        /**
         *
         */
        compose(scale: VectorE3, attitude: SpinorE3, position: VectorE3): Mat4R;

        /**
         *
         */
        copy(matrix: Mat4R): Mat4R;

        /**
         * Computes the determinant of the matrix.
         */
        det(): number;

        /**
         *
         */
        frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4R;

        /**
         *
         */
        invert(m: Mat4R, throwOnSingular?: boolean): Mat4R;

        /**
         *
         */
        mul(rhs: Mat4R): Mat4R;

        /**
         *
         */
        mul2(a: Mat4R, b: Mat4R): Mat4R;

        /**
         * Generates a new identity matrix.
         */
        static one(): Mat4R;

        /**
         * Sets this matrix to the identity element for multiplication, <b>1</b>.
         */
        one(): Mat4R;

        /**
         *
         */
        reflection(n: VectorE3): Mat4R;

        /**
         *
         */
        rmul(lhs: Mat4R): Mat4R;

        /**
         *
         */
        rotate(spinor: SpinorE3): Mat4R;

        /**
         * Generates a new rotation matrix.
         */
        static rotation(spinor: SpinorE3): Mat4R;

        /**
         *
         */
        rotation(spinor: SpinorE3): Mat4R;

        /**
         *
         */
        rotationAxis(axis: VectorE3, angle: number): Mat4R;

        /**
         *
         */
        row(i): Array<number>;

        /**
         *
         */
        scale(scale: VectorE3): Mat4R;

        /**
         *
         */
        scaleXYZ(scale: VectorE3): Mat4R;

        /**
         * Generates a new scaling matrix.
         */
        static scaling(scale: VectorE3): Mat4R;

        /**
         *
         */
        scaling(scale: VectorE3): Mat4R;

        /**
         *
         */
        toFixed(digits?: number): string;

        /**
         *
         */
        toString(): string;

        /**
         *
         */
        translate(displacement: VectorE3): Mat4R;

        /**
         * Generates a new translation matrix.
         */
        static translation(vector: VectorE3): Mat4R;

        /**
         *
         */
        translation(displacement: VectorE3): Mat4R;

        /**
         *
         */
        transpose(): Mat4R;

        /**
         * Creates a new matrix with all elements zero.
         */
        static zero(): Mat4R;
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

    /**
     * The Geometric Algebra of the Euclidean plane
     */
    class G2m extends VectorN<number> implements GeometricE2 {
        /**
         * The labels to use for the basis vectors.
         * For G2m there must be four (4) labels.
         * The first is the scalar symbol.
         * The second is the first vector symbol.
         * The third is the second vector symbol.
         * The fourth is the symbol for the pseudoscalar.
         * e.g.
         * [['1'], ['e1'], ['e2'], ['e12']]
         * or
         * [['1'], ['e1'], ['e2'], ['I']]
         * For compass directions you might use
         * [['1'], ['E'], ['N'], ['ccw']]
         * You can also use different symbols depending upon the sign.
         * The symbol for the negative sign goes on the left, positive on the right.
         * [['1'], ['W','E'], ['S','N'], ['clockwise','ccw']]
         * You can also use Unicode symbols
         * 
         */
        static BASIS_LABELS: string[][];
        // FIXME: When TypeScript has been upgraded we can do this...
        // static BASIS_LABELS: (string | string[])[];

        /**
         * Constructs a <code>G2m</code>.
         * The multivector is initialized to zero.
         */
        constructor();
        /**
         * The coordinate corresponding to the unit standard basis scalar.
         */
        α: number
        alpha: number
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
         */
        x: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
         */
        y: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
         */
        β: number;
        beta: number;
        xy: number;

        /**
         * <p>
         * <code>this ⟼ this + M * α</code>
         * </p>
         * @param M
         * @param α
         */
        add(M: GeometricE2, α?: number): G2m;

        /**
         * <p>
         * <code>this ⟼ this + v * α</code>
         * </p>
         * @param v
         * @param α
         */
        addVector(v: VectorE2, α?: number): G2m;

        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @param a
         * @param b
         */
        add2(a: GeometricE2, b: GeometricE2): G2m;

        /**
         * The bivector whose area (magnitude) is θ/2, where θ is the radian measure. 
         */
        angle(): G2m;

        /**
         *
         */
        clone(): G2m;

        /**
         * Sets this <em>multivector</em> to its <em>Clifford conjugate</em>.
         * <p>
         * <code>this ⟼ conj(this)</code>
         * </p>
         */
        conj(): G2m;

        /**
         * Sets this multivector to be a copy of another multivector.
         * <p>
         * <code>this ⟼ copy(M)</code>
         * </p>
         * @param M
         */
        copy(M: GeometricE2): G2m;

        /**
         * Sets this multivector to be a copy of a spinor.
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @param spinor
         */
        copySpinor(spinor: SpinorE2): G2m;
        /**
         * Sets this multivector to be a copy of a vector.
         * <p>
         * <code>this ⟼ copyVector(vector)</code>
         * </p>
         * @param vector
         */
        copyVector(vector: VectorE2): G2m;

        /**
         * Sets this multivector to the result of division by another multivector.
         * <p>
         * <code>this ⟼ this / m</code>
         * </p>
         * @param m
         */
        div(m: GeometricE2): G2m;

        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @param α
         */
        divByScalar(α: number): G2m;

        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @param a
         * @param b
         */
        div2(a: SpinorE2, b: SpinorE2): G2m;

        /**
         * <p>
         * <code>this ⟼ dual(m) = I * m</code>
         * </p>
         * Notice that the dual of a vector is related to the spinor by the right-hand rule.
         * @param m The vector whose dual will be used to set this spinor.
         */
        dual(m: VectorE2): G2m;

        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         */
        exp(): G2m;

        /**
         * <p>
         * <code>this ⟼ this ^ m</code>
         * </p>
         * @param m
         */
        ext(m: GeometricE2): G2m;

        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         * @param a
         * @param b
         */
        ext2(a: GeometricE2, b: GeometricE2): G2m;

        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         */
        inv(): G2m;

        /**
         * Sets this multivector to the left contraction with another multivector.
         * <p>
         * <code>this ⟼ this << m</code>
         * </p>
         * @param m
         */
        lco(m: GeometricE2): G2m;

        /**
         * Sets this multivector to the left contraction of two multivectors. 
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         * @param a
         * @param b
         */
        lco2(a: GeometricE2, b: GeometricE2): G2m;

        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @param target
         * @param α
         */
        lerp(target: GeometricE2, α: number): G2m;

        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @param a
         * @param b
         * @param α
         */
        lerp2(a: GeometricE2, b: GeometricE2, α: number): G2m;

        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         */
        log(): G2m;

        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         */
        magnitude(): G2m;

        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @param m
         */
        mul(m: GeometricE2): G2m;

        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @param a
         * @param b
         */
        mul2(a: GeometricE2, b: GeometricE2): G2m;

        /**
         * <p>
         * <code>this ⟼ -1 * this</code>
         * </p>
         */
        neg(): G2m;

        /**
         * <p>
         * <code>this ⟼ sqrt(this * conj(this))</code>
         * </p>
         */
        norm(): G2m;

        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         */
        direction(): G2m;

        /**
         * <p>
         * <code>this ⟼ this | ~this = scp(this, rev(this))</code>
         * </p>
         */
        quad(): G2m;

        /**
         * Computes the squared norm, scp(A, rev(A)).
         */
        squaredNorm(): G2m;

        /**
         * Sets this multivector to the right contraction with another multivector.
         * <p>
         * <code>this ⟼ this >> m</code>
         * </p>
         * @param m
         */
        rco(m: GeometricE2): G2m;

        /**
         * Sets this multivector to the right contraction of two multivectors.
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         * @param a
         * @param b
         */
        rco2(a: GeometricE2, b: GeometricE2): G2m;

        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @param n
         */
        reflect(n: VectorE2): G2m;

        /**
         * <p>
         * <code>this ⟼ rev(this)</code>
         * </p>
         */
        rev(): G2m;

        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
         * </p>
         * @param R
         */
        rotate(R: SpinorE2): G2m;

        /**
         * <p>
         * Sets this multivector to a rotor representing a rotation from a to b.
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         * </p>
         * @param a The <em>from</em> vector.
         * @param b The <em>to</em> vector.
         */
        rotorFromDirections(a: VectorE2, b: VectorE2): G2m;

        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @param B
         * @param θ
         */
        rotorFromGeneratorAngle(B: SpinorE2, θ: number): G2m;

        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @param α
         */
        scale(α: number): G2m;

        /**
         * <p>
         * <code>this ⟼ scp(this, m)</code>
         * </p>
         * @param m
         */
        scp(m: GeometricE2): G2m;

        /**
         * <p>
         * <code>this ⟼ scp(a, b)</code>
         * </p>
         * @param a
         * @param b
         */
        scp2(a: GeometricE2, b: GeometricE2): G2m;

        /**
         * <p>
         * <code>this ⟼ a * b = a · b + a ^ b</code>
         * </p>
         * Sets this G2m to the geometric product a * b of the vector arguments.
         * @param a
         * @param b
         */
        spinor(a: VectorE2, b: VectorE2): G2m;
        /**
         * <p>
         * <code>this ⟼ this - M * α</code>
         * </p>
         * @param M
         * @param α
         */
        sub(M: GeometricE2, α?: number): G2m;
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @param a
         * @param b
         */
        sub2(a: GeometricE2, b: GeometricE2): G2m;

        /**
         * Returns a string representing the number in exponential notation.
         * @param fractionDigits
         */
        toExponential(): string;

        /**
         * Returns a string representing the number in fixed-point notation.
         * @param fractionDigits
         */
        toFixed(fractionDigits?: number): string;

        /**
         * Returns a string representation of the number.
         */
        toString(): string;

        /**
         * The identity element for addition, <b>0</b>.
         */
        static zero: G2m;

        /**
         * The identity element for multiplication, <b>1</b>.
         */
        static one: G2m;

        /**
         * Basis vector corresponding to the <code>x</code> coordinate.
         */
        static e1: G2m;

        /**
         * Basis vector corresponding to the <code>y</code> coordinate.
         */
        static e2: G2m;

        /**
         * Basis vector corresponding to the <code>β</code> coordinate.
         */
        static I: G2m;

        /**
         * Creates a copy of a multivector.  
         * @param M
         */
        static copy(M: GeometricE2): G2m;

        /**
         * Creates a copy of a scalar.
         * @param α
         */
        static fromScalar(α: number): G2m

        /**
         * Creates a copy of a spinor.
         * @param spinor
         */
        static fromSpinor(spinor: SpinorE2): G2m

        /**
         * Creates a copy of a vector.
         * @param vector
         */
        static fromVector(vector: VectorE2): G2m

        /**
         * Linear interpolation of two multivectors.
         * <code>A + α * (B - A)</code>
         * @param A
         * @param B
         * @param α
         */
        static lerp(A: GeometricE2, B: GeometricE2, α: number): G2m

        /**
         * Computes the rotor corresponding to a rotation from vector <code>a</code> to vector <code>b</code>.
         * @param a
         * @param b
         */
        static rotorFromDirections(a: VectorE2, b: VectorE2): G2m

        /**
         * Creates a vector from Cartesian coordinates
         */
        static vector(x: number, y: number): G2m
    }

    /**
     *
     */
    class VectorN<T> {
        callback: () => T[];
        coords: T[];
        modified: boolean;
        constructor(coords: T[], modified?: boolean, size?: number);
        clone(): VectorN<T>;
        getComponent(index: number): T;
        pop(): T;
        push(value: T): number;
        setComponent(index: number, value: T): void;
        toArray(array?: T[], offset?: number): T[];
        toLocaleString(): string;
        toString(): string;
    }

    /**
     *
     */
    class R1m extends VectorN<number> implements VectorE1 {
        x: number;
        constructor(coords?: number[], modified?: boolean);
    }

    /**
     *
     */
    class R2m extends VectorN<number> implements VectorE2 {
        x: number
        y: number
        constructor(coords?: number[], modified?: boolean)
        add(v: VectorE2): R2m
        add2(a: VectorE2, b: VectorE2): R2m
        applyMatrix(m: Mat2R): R2m
        clone(): R2m
        copy(v: VectorE2): R2m
        cubicBezier(t: number, controlBegin: VectorE2, endPoint: VectorE2): R2m
        distanceTo(point: VectorE2): number
        lerp(v: VectorE2, α: number): R2m
        lerp2(a: VectorE2, b: VectorE2, α: number): R2m
        magnitude(): number
        neg(): R2m
        quadraticBezier(t: number, controlPoint: VectorE2, endPoint: VectorE2): R2m
        rotate(spinor: SpinorE2): R2m
        scale(α: number): R2m
        squaredNorm(): number
        set(x: number, y: number): R2m
        sub(v: VectorE2): R2m
        sub2(a: VectorE2, b: VectorE2): R2m
        toExponential(): string
        toFixed(fractionDigits?: number): string
        toString(): string
        zero(): R2m
        static copy(v: VectorE2): R2m
        static lerp(a: VectorE2, b: VectorE2, α: number): R2m
        static random(): R2m
        static vector(x: number, y: number): R2m
    }

    interface Scalar {
        α: number
        alpha: number
    }

    interface Pseudo {
        β: number
        beta: number
    }

    /**
     * The even sub-algebra of <code>G3m</code>.
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

        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         */
        magnitude(): SpinorE3;

        /**
         * The <em>squared norm</em>, as a <code>number</code>.
         */
        squaredNorm(): SpinorE3;
    }

    /**
     * The coordinates for a multivector in 3D in geometric Cartesian basis.
     */
    interface GeometricE3 extends Pseudo, Scalar, SpinorE3, VectorE3 {

    }

    /**
     * A mutable multivector in 3D with a Euclidean metric.
     */
    class G3m extends VectorN<number> implements GeometricE3 {
        /**
         * The coordinate corresponding to the unit standard basis scalar.
         */
        α: number
        alpha: number
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
         */
        x: number
        /**
         * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
         */
        y: number
        /**
         * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
         */
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
         * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
         */
        xy: number
        /**
         * The pseudoscalar coordinate of the multivector.
           */
        β: number
        beta: number
        /**
         * Constructs a <code>G3m</code>.
         * The multivector is initialized to zero.
         */
        constructor();

        /**
         * <p>
         * <code>this ⟼ this + M * α</code>
         * </p>
         * @param M
         * @param α
         */
        add(M: GeometricE3, α?: number): G3m;

        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @param a
         * @param b
         */
        add2(a: GeometricE3, b: GeometricE3): G3m;

        addPseudo(β: number): G3m;

        addScalar(α: number): G3m;

        /**
         * <p>
         * <code>this ⟼ this + v * α</code>
         * </p>
         * @param v
         * @param α
         */
        addVector(v: VectorE3, α?: number): G3m;

        align(m: GeometricE3): G3m;

        /**
         * The bivector whose area (magnitude) is θ/2, where θ is the radian measure. 
         */
        angle(): G3m;

        /**
         *
         */
        clone(): G3m;

        /**
         * Sets this <em>multivector</em> to its <em>Clifford conjugate</em>.
         * <p>
         * <code>this ⟼ conj(this)</code>
         * </p>
         */
        conj(): G3m;

        /**
         * <p>
         * <code>this ⟼ copy(M)</code>
         * </p>
         */
        copy(M: GeometricE3): G3m;

        /**
         * this ⟼ copy(α)
         */
        copyScalar(α: number): G3m;

        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         */
        copySpinor(spinor: SpinorE3): G3m;

        /**
         * <p>
         * <code>this ⟼ copyVector(vector)</code>
         * </p>
         */
        copyVector(vector: VectorE3): G3m;

        /**
         * Sets this multivector to the result of division by another multivector.
         * <p>
         * <code>this ⟼ this / m</code>
         * </p>
         */
        div(m: GeometricE3): G3m;

        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         */
        divByScalar(α: number): G3m;

        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @param a
         * @param b
         */
        div2(a: SpinorE3, b: SpinorE3): G3m;

        /**
         * <p>
         * <code>this ⟼ dual(m) = I * m</code>
         * </p>
         * Notice that the dual of a vector is related to the spinor by the right-hand rule.
         * @param m The vector whose dual will be used to set this spinor.
         */
        dual(m: VectorE3): G3m;

        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         */
        exp(): G3m;

        /**
         * <p>
         * <code>this ⟼ this ^ m</code>
         * </p>
         * @param m
         */
        ext(m: GeometricE3): G3m;

        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         * @param a
         * @param b
         */
        ext2(a: GeometricE3, b: GeometricE3): G3m;

        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         */
        inv(): G3m;

        /**
         * Sets this multivector to the left contraction with another multivector.
         * <p>
         * <code>this ⟼ this << m</code>
         * </p>
         * @param m
         */
        lco(m: GeometricE3): G3m;

        /**
         * Sets this multivector to the left contraction of two multivectors. 
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         * @param a
         * @param b
         */
        lco2(a: GeometricE3, b: GeometricE3): G3m;

        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @param target
         * @param α
         */
        lerp(target: GeometricE3, α: number): G3m;

        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @param α {number}
         */
        lerp2(a: GeometricE3, b: GeometricE3, α: number): G3m;

        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         */
        log(): G3m;

        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         */
        magnitude(): G3m;

        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @param m {GeometricE3}
         */
        mul(m: GeometricE3): G3m;

        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @param a
         * @param b
         */
        mul2(a: GeometricE3, b: GeometricE3): G3m;

        /**
         * <p>
         * <code>this ⟼ -1 * this</code>
         * </p>
         */
        neg(): G3m;

        /**
         * <p>
         * <code>this ⟼ sqrt(this * conj(this))</code>
         * </p>
         */
        norm(): G3m

        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         */
        direction(): G3m

        /**
         * <p>
         * <code>this ⟼ this | ~this = scp(this, rev(this))</code>
         * </p>
         */
        quad(): G3m;

        /**
         * Sets this multivector to the right contraction with another multivector.
         * <p>
         * <code>this ⟼ this >> m</code>
         * </p>
         * @param m
         */
        rco(m: GeometricE3): G3m;

        /**
         * Sets this multivector to the right contraction of two multivectors.
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         * @param a
         * @param b
         */
        rco2(a: GeometricE3, b: GeometricE3): G3m;

        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @param n
         */
        reflect(n: VectorE3): G3m;

        /**
         * <p>
         * <code>this ⟼ rev(this)</code>
         * </p>
         */
        rev(): G3m;

        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
         * </p>
         * @param R
         */
        rotate(R: SpinorE3): G3m;

        /**
         * <p>
         * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
         * </p>
         * @param axis
         * @param θ
         */
        rotorFromAxisAngle(axis: VectorE3, θ: number): G3m;

        /**
         * <p>
         * Sets this multivector to a rotor representing a rotation from a to b.
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         * </p>
         * @param a The <em>from</em> vector.
         * @param b The <em>to</em> vector.
         */
        rotorFromDirections(a: VectorE3, b: VectorE3): G3m;

        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @param B
         * @param θ
         */
        rotorFromGeneratorAngle(B: SpinorE3, θ: number): G3m;

        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @param α
         */
        scale(α: number): G3m;

        /**
         * <p>
         * <code>this ⟼ scp(this, m)</code>
         * </p>
         * @param m
         */
        scp(m: GeometricE3): G3m;

        /**
         * <p>
         * <code>this ⟼ scp(a, b)</code>
         * </p>
         * @param a
         * @param b
         */
        scp2(a: GeometricE3, b: GeometricE3): G3m;

        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this G3m to the geometric product a * b of the vector arguments.
         * @param a
         * @param b
         */
        spinor(a: VectorE3, b: VectorE3): G3m;

        /**
         * Computes the <em>squared norm</em> of this multivector.
         */
        squaredNorm(): G3m;

        /**
         * <p>
         * <code>this ⟼ this - M * α</code>
         * </p>
         * @param M
         * @param α
         */
        sub(M: GeometricE3, α?: number): G3m;

        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @param a
         * @param b
         */
        sub2(a: GeometricE3, b: GeometricE3): G3m;

        /**
         * Returns a string representing the number in exponential notation.
         */
        toExponential(): string;

        /**
         * Returns a string representing the number in fixed-point notation.
         * @param fractionDigits
         */
        toFixed(fractionDigits?: number): string;

        /**
         * Returns a string representation of the number.
         */
        toString(): string;

        /**
         * The identity element for addition, <b>0</b>.
         */
        static zero: G3m;

        /**
         * The identity element for multiplication, <b>1</b>.
         */
        static one: G3m;

        /**
         * Basis vector corresponding to the <code>x</code> coordinate.
         */
        static e1: G3m;

        /**
         * Basis vector corresponding to the <code>y</code> coordinate.
         */
        static e2: G3m;

        /**
         * Basis vector corresponding to the <code>z</code> coordinate.
         */
        static e3: G3m;

        /**
         * Basis vector corresponding to the <code>β</code> coordinate.
         */
        static I: G3m;

        /**
         * Creates a copy of a spinor.
         * @param spinor
         */
        static fromSpinor(spinor: SpinorE3): G3m;

        /**
         * Creates a copy of a vector.
         * @param vector
         */
        static fromVector(vector: VectorE3): G3m;

        /**
         * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
         * @param a The <em>from</em> vector.
         * @param b The <em>to</em> vector.
         */
        static rotorFromDirections(a: VectorE3, b: VectorE3): G3m;
    }

    /**
     * The even sub-algebra of <code>G3m</code>.
     */
    class SpinG3m extends VectorN<number> implements SpinorE3 {
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

        /**
         * The scalar component.
         */
        α: number;
        alpha: number;

        /**
         * Constructs a <code>Spin3</code> with value <em>1</em>
         */
        constructor();
        /**
         * this ⟼ this + spinor * α
         */
        add(spinor: SpinorE3, α?: number): SpinG3m;

        add2(a: SpinorE3, b: SpinorE3): SpinG3m;

        /**
         * The bivector whose area (magnitude) is θ/2, where θ is the radian measure. 
         */
        angle(): SpinG3m;

        /**
         * Computes a copy of this spinor.
         */
        clone(): SpinG3m;

        /**
         * Sets this spinor to be a copy of the <code>spinor</code> argument.
         * this ⟼ copy(spinor)
         */
        copy(spinor: SpinorE3): SpinG3m;

        divByScalar(scalar: number): SpinG3m;

        /**
         * this ⟼ dual(v) = I * v
         */
        dual(v: VectorE3): SpinG3m;

        /**
         * this ⟼ exp(this)
         */
        exp(): SpinG3m;
        inv(): SpinG3m;
        lerp(target: SpinorE3, α: number): SpinG3m;

        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         */
        log(): SpinG3m;

        magnitude(): SpinG3m;

        mul(rhs: SpinorE3): SpinG3m;

        /**
         * Sets this SpinG3m to the geometric product of the vectors a and b, a * b.
         */
        mul2(a: SpinorE3, b: SpinorE3): SpinG3m;

        /**
         * this ⟼ this / magnitude(this)
         * <em>s.direction()</em> scales the target spinor, <em>s</em>, so that it has unit magnitude.
         */
        direction(): SpinG3m;

        /**
         * this ⟼ this * α
         */
        scale(α: number): SpinG3m;

        squaredNorm(): SpinG3m;

        rev(): SpinG3m;

        reflect(n: VectorE3): SpinG3m;

        /**
         * this ⟼ R * this * rev(R)
         */
        rotate(R: SpinorE3): SpinG3m;

        /**
         * this ⟼ exp(- dual(axis) * θ / 2)
         * <code>axis</code> The direction (unit vector) of the rotation.
         * <code>θ</code> The angle of the rotation, measured in radians.
         */
        rotorFromAxisAngle(axis: VectorE3, θ: number): SpinG3m;

        /**
         * <p>
         * Sets this multivector to a rotor representing a rotation from a to b.
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         * </p>
         * @param a {VectorE3} The <em>from</em> vector.
         * @param b {VectorE3} The <em>to</em> vector.
         */
        rotorFromDirections(a: VectorE3, b: VectorE3): SpinG3m;

        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @param B {SpinorE3}
         * @param θ {number}
         */
        rotorFromGeneratorAngle(B: SpinorE3, θ: number): SpinG3m;

        /**
         * this ⟼ this - spinor * α
         */
        sub(spinor: SpinorE3, α?: number): SpinG3m;
        /**
         *
         */
        sub2(a: SpinorE3, b: SpinorE3): SpinG3m;
        toString(): string;
        /**
         * this ⟼ a * b
         */
        spinor(a: VectorE3, b: VectorE3): SpinG3m;
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

        /**
         * The optional unit of measure.
         */
        uom?: Unit;
    }

    /**
     *
     */
    class R3m extends VectorN<number> implements VectorE3 {
        x: number;
        y: number;
        z: number;
        constructor(coordinates?: number[], modified?: boolean);
        /**
         * this += alpha * vector
         */
        add(vector: VectorE3, alpha?: number): R3m;
        add2(a: VectorE3, b: VectorE3): R3m;
        applyMatrix4(m: Mat4R): R3m;
        applyMatrix(m: Mat3R): R3m;
        clone(): R3m;
        copy(v: VectorE3): R3m;
        static copy(vector: VectorE3): R3m;
        copyCoordinates(coordinates: number[]): R3m;
        cross(v: VectorE3): R3m;
        cross2(a: VectorE3, b: VectorE3): R3m;
        distanceTo(point: VectorE3): number;
        divByScalar(rhs: number): R3m;
        static dot(a: VectorE3, b: VectorE3): number;
        dot(v: VectorE3): number;
        lerp(target: VectorE3, α: number): R3m;
        static lerp(a: VectorE3, b: VectorE3, α: number): R3m;
        lerp2(a: VectorE3, b: VectorE3, α: number): R3m;
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         */
        magnitude(): number;
        neg(): R3m;
        direction(): R3m;
        quadranceTo(point: VectorE3): number;
        static random(): R3m;
        reflect(n: VectorE3): R3m;
        rotate(rotor: SpinorE3): R3m;
        scale(rhs: number): R3m;
        set(x: number, y: number, z: number): R3m;
        squaredNorm(): number;
        sub(rhs: VectorE3): R3m;
        sub2(a: VectorE3, b: VectorE3): R3m;
        toExponential(): string;
        toFixed(digits?: number): string;
        toString(): string;
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

    /**
     *
     */
    class R4m extends VectorN<number> implements VectorE4 {
        x: number
        y: number
        z: number
        w: number
        constructor(coords?: number[], modified?: boolean)
        applyMatrix(m: Mat4R): R4m
        clone(): R4m
        copy(v: VectorE4): R4m
    }

    /**
     *
     */
    interface FacetVisitor {
        uniform1f(name: string, x: number): void;
        uniform2f(name: string, x: number, y: number): void;
        uniform3f(name: string, x: number, y: number, z: number): void;
        uniform4f(name: string, x: number, y: number, z: number, w: number): void;
        mat2(name: string, matrix: Mat2R, transpose: boolean): void;
        mat3(name: string, matrix: Mat3R, transpose: boolean): void;
        mat4(name: string, matrix: Mat4R, transpose: boolean): void;
        vec2(name: string, vector: VectorE2): void;
        vec3(name: string, vector: VectorE3): void;
        vec4(name: string, vector: VectorE4): void;
        vector2(name: string, coords: number[]): void;
        vector3(name: string, coords: number[]): void;
        vector4(name: string, coords: number[]): void;
    }

    /**
     * A provider of a collection of 'uniform' variables for use in a WebGL program.
     */
    interface Facet {
        setProperty(name: string, value: number[]): Facet;
        setUniforms(visitor: FacetVisitor): void;
    }

    /**
     *
     */
    interface ColorRGB {
        r: number;
        g: number;
        b: number;
    }

    /**
     *
     */
    interface ColorRGBA extends ColorRGB {
        α: number;
    }

    /**
     *
     */
    class Color extends VectorN<number> implements ColorRGB {
        static black: Color;
        static blue: Color;
        static green: Color;
        static cyan: Color;
        static red: Color;
        static magenta: Color;
        static yellow: Color;
        static white: Color;
        r: number;
        g: number;
        b: number;
        luminance: number;
        constructor(r: number, g: number, b: number);
        clone(): Color;
        interpolate(target: ColorRGB, alpha: number): Color;

        static fromColor(color: ColorRGB): Color;
        static fromCoords(coords: number[]): Color;
        static fromHSL(H: number, S: number, L: number): Color;
        static fromRGB(red: number, green: number, blue: number): Color;
        static interpolate(a: ColorRGB, b: ColorRGB, alpha: number): Color;
    }

    /**
     * A collection of primitives, one for each canvas.
     */
    interface IGraphicsBuffers extends IContextConsumer {
        /**
         *
         */
        draw(program: Material): void;
    }

    /**
     *
     */
    interface AttribMetaInfo {
        /**
         * The type keyword as it appears in the GLSL shader program.
         */
        glslType: string,
    }

    /**
     *
     */
    interface UniformMetaInfo {
        /**
         * Specifies an optional override of the name used as a key.
         */
        name?: string;
        /**
         * The type keyword as it appears in the GLSL shader program.
         */
        glslType: string;
    }

    /**
     *
     */
    interface IContextProvider extends IUnknown {
        createArrayBuffer(): ShareableWebGLBuffer;
        createElementArrayBuffer(): ShareableWebGLBuffer;
        createPrimitiveBuffers(primitive: Primitive, usage?: number): PrimitiveBuffers;
        createTexture2D(): ITexture2D;
        createTextureCubeMap(): ITextureCubeMap;
        gl: WebGLRenderingContext;
        canvas: HTMLCanvasElement;
    }

    /**
     * A set of <em>state variables</em> for graphics modeling in Euclidean 2D space.
     */
    class ModelE2 extends Shareable {
        /**
         * The <em>position</em>, a vector. Initialized to <em>0</em>
         */
        X: G2m;
        /**
         * The <em>attitude</em>, a unitary spinor. Initialized to <em>1</em>.
         */
        R: G2m;
        /**
         * Constructs a <code>ModelE2</code> at the origin and with unity attitude.
         * Initializes <code>X</code> to <code>0</code>.
         * Initializes <code>R</code> to <code>1</code>.
         */
        constructor();
        getProperty(name: string): number[];
        setProperty(name: string, value: number[]): ModelE2;
    }

    /**
     * A collection of properties governing GLSL uniforms for Computer Graphics Modeling.
     */
    class ModelFacet implements Facet {

        /**
         * The position, a vector.
         */
        X: G3m

        /**
         * The attitude, a unitary spinor.
         */
        R: G3m

        /**
         * The overall scale.
         */
        scaleXYZ: R3m

        /**
         * The matrix that is used for the uniform conventionally named 'uModel'.
         */
        matrix: Mat4R

        /**
         * Constructs a ModelFacet at the origin and with unity attitude.
         */
        constructor()
        getProperty(name: string): number[]
        setProperty(name: string, value: number[]): ModelFacet
        setUniforms(visitor: FacetVisitor): void
    }

    /**
     * Record reference count changes and debug reference counts.
     *
     * Instrumenting reference counting:
     *   constructor():
     *     refChange(uuid, 'YourClassName',+1);
     *   addRef():
     *     refChange(uuid, 'YourClassName',+1);
     *   release():
     *     refChange(uuid, 'YourClassName',-1);
     *
     * Debugging reference counts:
     *   Start tracking reference counts:
     *     refChange('start'[, 'where']);
     *     The system will record reference count changes.
     *   Stop tracking reference counts:
     *     refChange('stop'[, 'where']);
     *     The system will compute the total outstanding number of reference counts.
     *   Dump tracking reference counts:
     *     refChange('dump'[, 'where']);
     *     The system will log net reference count changes to the console.
     *   Don't track reference counts (default):
     *     refChange('reset'[, 'where']);
     *     The system will clear statistics and enter will not record changes.
     *   Trace reference counts for a particular class:
     *     refChange('trace', 'YourClassName');
     *     The system will report reference count changes on the specified class.
     *
     * Returns the number of outstanding reference counts for the 'stop' command.
     */
    function refChange(uuid: string, name?: string, change?: number): number;

    /**
     * Canonical variable names, which also act as semantic identifiers for name overrides.
     * These names must be stable to avoid breaking custom vertex and fragment shaders.
     */
    class GraphicsProgramSymbols {
        /**
         * 'aColor'
         */
        static ATTRIBUTE_COLOR: string;
        /**
         * 'aGeometryIndex'
         */
        static ATTRIBUTE_GEOMETRY_INDEX: string;
        /**
         * 'aNormal'
         */
        static ATTRIBUTE_NORMAL: string;
        /**
         * 'aPosition'
         */
        static ATTRIBUTE_POSITION: string;
        /**
         * 'aTextureCoords'
         */
        static ATTRIBUTE_TEXTURE_COORDS: string;

        static UNIFORM_AMBIENT_LIGHT: string;
        static UNIFORM_COLOR: string;
        static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string;
        static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string;
        static UNIFORM_POINT_LIGHT_COLOR: string;
        static UNIFORM_POINT_LIGHT_POSITION: string;
        static UNIFORM_PROJECTION_MATRIX: string;
        static UNIFORM_REFLECTION_ONE_MATRIX: string;
        static UNIFORM_REFLECTION_TWO_MATRIX: string;
        static UNIFORM_MODEL_MATRIX: string;
        static UNIFORM_NORMAL_MATRIX: string;
        static UNIFORM_VIEW_MATRIX: string;

        static VARYING_COLOR: string;
        static VARYING_LIGHT: string;
    }
  
    ///////////////////////////////////////////////////////

    /**
     *
     */
    class Scene {
        constructor()
        add(mesh: Mesh): void
        addRef(): number
        contextFree(context: IContextProvider): void
        contextGain(context: IContextProvider): void
        contextLost(): void
        draw(ambients: Facet[]): void
        findOne(match: (mesh: Mesh) => boolean): Mesh
        findOneByName(name: string): Mesh
        findByName(name: string): ShareableArray<Mesh>
        release(): number
        remove(mesh: Mesh): void
        subscribe(visual: WebGLRenderer): void
        traverse(callback: (mesh: Mesh) => void): void
        unsubscribe(): void
    }

    /**
     *
     */
    class PerspectiveCamera extends AbstractFacet {
        /**
         * The aspect ratio of the viewport, i.e., width / height.
         */
        aspect: number;
        /**
         * The position of the camera.
         */
        eye: R3m;
        /**
         * The distance to the far plane of the viewport.
         */
        far: number;
        /**
         * The field of view is the angle in the camera horizontal plane that the viewport subtends at the camera.
         * The field of view is measured in radians.
         */
        fov: number;
        /**
         * The point (position vector) that the camera looks at.
         */
        look: R3m;
        /**
         *The distance to the near plane of the viewport.
         */
        near: number;
        /**
         *
         */
        position: R3m;
        /**
         * Optional name used for finding this instance.
         */
        name: string;
        /**
         * The "guess" direction that is used to generate the upwards direction for the camera. 
         */
        up: R3m;
        /**
         * The projection matrix
         */
        projectionMatrix: Mat4R;
        /**
         * The view matrix
         */
        viewMatrix: Mat4R;
        /**
         * fov...: The `fov` property.
         * aspect: The `aspect` property.
         * near..: The `near` property.
         * far...: The `far` property.
         */
        constructor(fov?: number, aspect?: number, near?: number, far?: number);
        /**
         *
         */
        set(data: { [key: string]: any }, ignore?: boolean): void;
        setAspect(aspect: number): PerspectiveCamera
        setEye(eye: VectorE3): PerspectiveCamera
        setFar(far: number): PerspectiveCamera
        setFov(fov: number): PerspectiveCamera
        setLook(look: VectorE3): PerspectiveCamera
        setNear(near: number): PerspectiveCamera
        setUp(up: VectorE3): PerspectiveCamera
        /**
         *
         */
        setUniforms(visitor: FacetVisitor): void
    }

    class WebGLRenderer implements IUnknown {
        addRef(): number;
        release(): number;
        /**
         * If the canvas property has not been initialized by calling `start()`,
         * then any attempt to access this property will trigger the construction of
         * a new HTML canvas element which will remain in effect for this WebGLRenderer
         * until `stop()` is called.
         */
        canvas: HTMLCanvasElement;

        /**
         *
         */
        commands: ShareableArray<IContextConsumer>;

        /**
         * @param gl The underlying <code>WebGLRenderingContext</code>.
         */
        gl: WebGLRenderingContext;

        /**
         * Constructs a <code>WebGLRenderer</code> using <code>WebGLContextAttributes</code>.
         */
        constructor(attributes?: WebGLContextAttributes);

        /**
         *
         */
        addContextListener(user: IContextConsumer): void;

        /**
         * <p>
         * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
         * <p>
         */
        clearColor(red: number, green: number, blue: number, alpha: number): WebGLRenderer;

        /**
         * Turns off specific WebGL capabilities for this context.
         */
        disable(capability: Capability): WebGLRenderer;

        /**
         * Turns on specific WebGL capabilities for this context.
         */
        enable(capability: Capability): WebGLRenderer;

        /**
         *
         */
        clear(): void;

        /**
         *
         */
        removeContextListener(user: IContextConsumer): void;

        /**
         * Initializes the WebGL context for the specified <code>canvas</code>.
         */
        start(canvas: HTMLCanvasElement): WebGLRenderer;

        /**
         * Terminates the <code>WebGLRenderingContext</code> for the underlying canvas.
         */
        stop(): WebGLRenderer;

        /**
         *
         */
        synchronize(user: IContextConsumer): void;

        /**
         * Defines what part of the canvas will be used in rendering the drawing buffer.
         * @param x
         * @param y
         * @param width
         * @param height
         */
        viewport(x: number, y: number, width: number, height: number): WebGLRenderer;
    }

    interface Geometry extends IContextConsumer {
        partsLength: number;
        addPart(geometry: Geometry): void;
        removePart(index: number): void;
        getPart(index: number): Geometry;
        draw(material: Material): void;
    }

    class GeometryPrimitive extends Shareable implements Geometry {
        constructor(dataSource: Primitive);
        partsLength: number;
        addPart(geometry: Geometry): void;
        removePart(index: number): void;
        getPart(index: number): Geometry;
        draw(material: Material): void;
        contextFree(context: IContextProvider): void;
        contextGain(context: IContextProvider): void;
        contextLost(): void;
    }

    class GeometryContainer extends Shareable implements Geometry {
        constructor();
        partsLength: number;
        addPart(geometry: Geometry): void;
        removePart(index: number): void;
        draw(material: Material): void;
        getPart(index: number): Geometry;
        contextFree(context: IContextProvider): void;
        contextGain(context: IContextProvider): void;
        contextLost(): void;
    }

    class ArrowGeometry extends GeometryContainer {
        constructor();
    }

    class CuboidGeometry extends GeometryContainer {
        constructor(options?: { width?: number, height?: number, depth?: number });
    }

    class CylinderGeometry extends GeometryContainer {
        constructor();
    }

    class SphereGeometry extends GeometryContainer {
        constructor();
    }

    class TetrahedronGeometry extends GeometryContainer {
        constructor(radius?: number)
    }

    /**
     *
     */
    class Material {
        program: WebGLProgram;
        programId: string;
        vertexShader: string;
        fragmentShader: string;
        addRef(): number;
        attributes(): { [name: string]: AttribLocation };
        contextFree(manager: IContextProvider): void;
        contextGain(manager: IContextProvider): void;
        contextLost(): void;
        constructor(vertexShader: string, fragmentShader: string, attribs?: string[]);
        disableAttrib(name: string): void;
        enableAttrib(name: string): void;
        release(): number;
        uniform1f(name: string, x: number): void;
        uniform2f(name: string, x: number, y: number): void;
        uniform3f(name: string, x: number, y: number, z: number): void;
        uniform4f(name: string, x: number, y: number, z: number, w: number): void;
        mat2(name: string, matrix: Mat2R, transpose: boolean): void;
        mat3(name: string, matrix: Mat3R, transpose: boolean): void;
        mat4(name: string, matrix: Mat4R, transpose: boolean): void;
        uniforms(): { [name: string]: UniformLocation };
        vec2(name: string, vector: VectorE2): void;
        vec3(name: string, vector: VectorE3): void;
        vec4(name: string, vector: VectorE4): void;
        use(): void;
        vector2(name: string, coords: number[]): void;
        vector3(name: string, coords: number[]): void;
        vector4(name: string, coords: number[]): void;
    }


    /**
     * A collection of primitives, a single graphics program, and some facets.
     * The primitives provide attribute arguments to the graphics program.
     * The facets provide uniform arguments to the graphics program. 
     */
    class Mesh extends Shareable {

        /**
         *
         */
        geometry: Geometry;

        /**
         *
         */
        material: Material;

        /**
         * A user-assigned name that allows the composite object to be found.
         */
        name: string;

        /**
         * Determines whether this Mesh will be rendered.
         */
        visible: boolean;

        /**
         *
         */
        constructor(geometry: Geometry, material: Material, type?: string);

        /**
         *
         */
        subscribe(visual: WebGLRenderer): void;

        /**
         *
         */
        unsubscribe(): void;

        setUniforms(): void;

        /**
         *
         */
        draw(ambients: Facet[]): void;

        contextFree(manager: IContextProvider): void;
        contextGain(manager: IContextProvider): void;
        contextLost(): void;

        /**
         * Gets a facet of this composite object by name.
         * Facets provide uniform arguments to the graphics program.
         */
        getFacet(name: string): Facet;

        /**
         * Sets a facet of this composite object by name.
         * Facets provide uniform arguments to the graphics program.
         */
        setFacet(name: string, facet: Facet): void;
    }

    /**
     * A <code>Material</code> based upon scripts in a DOM.
     */
    class HTMLScriptsMaterial extends Material {
        /**
         * Constructs a <code>Material</code> using scripts in a Document Object Model (DOM).
         * scriptIds: The id properties of the script elements. Defaults to [].
         * dom:       The document object model. Defaults to document.
         */
        constructor(scriptIds?: string[], dom?: Document);
    }

    /**
     *
     */
    class PointMaterial extends Material {
        constructor();
    }

    /**
     *
     */
    class LineMaterial extends Material {
        constructor();
    }

    /**
     *
     */
    class MeshMaterial extends Material {
        constructor();
    }

    class AbstractFacet implements Facet {
        getProperty(name: string): number[];
        setProperty(name: string, value: number[]): Facet;
        setUniforms(visitor: FacetVisitor): void;
    }

    class AmbientLight extends AbstractFacet {
        color: Color;
        constructor(color: ColorRGB);
    }

    /**
     *
     */
    class ColorFacet extends AbstractFacet implements ColorRGBA {
        r: number;
        g: number;
        b: number;
        α: number
        constructor(name?: string);
        scaleRGB(α: number): ColorFacet;
        scaleRGBA(α: number): ColorFacet;
        setColorRGB(color: ColorRGB): ColorFacet;
        setColorRGBA(color: ColorRGBA): ColorFacet;
        setRGB(red: number, green: number, blue: number): ColorFacet;
        setRGBA(red: number, green: number, blue: number, alpha: number): ColorFacet;
    }

    /**
     * <code>DirectionalLight</code> provides two uniform values.
     * GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION
     * GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR
     */
    class DirectionalLight extends AbstractFacet {
        /**
         * The <em>direction</em> (unit vector) in which the light is travelling.
         */
        direction: R3m;
        /**
         * The <em>color</em> of the light.
         */
        color: Color;
        /**
         * Constructs a <code>DirectionalLight</code>.
         * @param direction The initial direction.
         * @param color The initial color.
         */
        constructor(direction: VectorE3, color: ColorRGB);
        /**
         * Sets the <code>direction</code> property by copying a vector.
         * The direction is normalized to be a unit vector.
         * @param direction
         */
        setDirection(direction: VectorE3): DirectionalLight;
    }


    class PointSizeFacet extends AbstractFacet {
        pointSize: number
        constructor(pointSize?: number);
    }

    /**
     * A (name: string, vector: R3m) pair that can be used to set a uniform variable.
     */
    class Vector3Facet extends AbstractFacet {
        constructor(name: string, vector: R3m);
    }

    /**
     *
     */
    class ReflectionFacetE2 extends Shareable implements Facet {
        /**
         * The vector perpendicular to the (hyper-)plane of reflection.
         */
        public normal: R2m;

        /**
         * @param name The name of the uniform variable associated with this facet.
         */
        constructor(name: string);

        /**
         * @param name
         */
        getProperty(name: string): Array<number>;

        /**
         * @param name
         * @param value
         */
        setProperty(name: string, value: Array<number>): ReflectionFacetE2;

        /**
         *
         */
        setUniforms(visitor: FacetVisitor): void;
    }

    /**
     *
     */
    class ReflectionFacetE3 extends Shareable implements Facet {
        /**
         * The vector perpendicular to the (hyper-)plane of reflection.
         *
         */
        public normal: R3m;

        /**
         * @param name The name of the uniform variable associated with this facet.
         */
        constructor(name: string);

        /**
         * @param name
         */
        getProperty(name: string): Array<number>;

        /**
         * @param name
         * @param value
         */
        setProperty(name: string, value: Array<number>): ReflectionFacetE3;

        /**
         *
         */
        setUniforms(visitor: FacetVisitor): void;
    }

    /**
     * The enumerated blending factors for use with <code>WebGLBlendFunc</code>.
     * Assuming destination with RGBA values of (R<sub>d</sub>, G<sub>d</sub>, B<sub>d</sub>, A<sub>d</sub>),
     * and source fragment with values (R<sub>s</sub>, G<sub>s</sub>, B<sub>s</sub>, A<sub>s</sub>),
     * <ul>
     * <li>R<sub>result</sub> = R<sub>s</sub> * S<sub>r</sub> + R<sub>d</sub> * D<sub>r</sub></li>
     * </ul>
     */
    enum BlendFactor {
        /**
         *
         */
        DST_ALPHA,

        /**
         *
         */
        DST_COLOR,

        /**
         *
         */
        ONE,

        /**
         *
         */
        ONE_MINUS_DST_ALPHA,

        /**
         *
         */
        ONE_MINUS_DST_COLOR,

        /**
         *
         */
        ONE_MINUS_SRC_ALPHA,

        /**
         *
         */
        ONE_MINUS_SRC_COLOR,

        /**
         *
         */
        SRC_ALPHA,

        /**
         *
         */
        SRC_ALPHA_SATURATE,

        /**
         *
         */
        SRC_COLOR,

        /**
         *
         */
        ZERO
    }

    /**
     * `blendFunc(sfactor: number, dfactor: number): void`
     */
    class WebGLBlendFunc extends Shareable {
        sfactor: BlendFactor;
        dfactor: BlendFactor;
        constructor(sfactor: BlendFactor, dfactor: BlendFactor);

        /**
         *
         */
        contextFree(manager: IContextProvider): void;

        /**
         *
         */
        contextGain(manager: IContextProvider): void;

        /**
         *
         */
        contextLost(): void;
    }

    /**
     * `clearColor(red: number, green: number, blue: number, alpha: number): void`
     */
    class WebGLClearColor extends Shareable {
        red: number;
        green: number;
        blue: number;
        alpha: number;
        constructor(red?: number, green?: number, blue?: number, alpha?: number);
        /**
         *
         */
        contextFree(manager: IContextProvider): void;
        /**
         *
         */
        contextGain(manager: IContextProvider): void;
        /**
         *
         */
        contextLost(): void;
    }

    /**
     * A capability that may be enabled or disabled for a <code>WebGLRenderingContext</code>.
     */
    enum Capability {
        /**
         * Blend computed fragment color values with color buffer values.
         */
        BLEND,

        /**
         * Let polygons be culled.
         */
        CULL_FACE,

        /**
         * Enable updates of the depth buffer.
         */
        DEPTH_TEST,

        /**
         * Add an offset to the depth values of a polygon's fragments.
         */
        POLYGON_OFFSET_FILL,

        /**
         * Abandon fragments outside a scissor rectangle.
         */
        SCISSOR_TEST
    }

    /**
     * `disable(capability: number): void`
     */
    class WebGLDisable extends Shareable {
        /**
         *
         */
        constructor(capability: Capability);
        /**
         *
         */
        contextFree(manager: IContextProvider): void;
        /**
         *
         */
        contextGain(manager: IContextProvider): void;
        /**
         *
         */
        contextLost(): void;
    }

    /**
     * `enable(capability: number): void`
     */
    class WebGLEnable extends Shareable {
        /**
         *
         */
        constructor(capability: Capability);
        /**
         *
         */
        contextFree(manager: IContextProvider): void;
        /**
         *
         */
        contextGain(manager: IContextProvider): void;
        /**
         *
         */
        contextLost(): void;
    }

    ///////////////////////////////////////////////////////////////////////////////

    /**
     *
     */
    class Object3D extends Mesh {
        modelFacet: ModelFacet
        modelMatrix: Mat4R
        colorFacet: ColorFacet
        /**
         *
         */
        constructor(geometry: Geometry, material: Material, type?: string)
    }

    class RigidBody extends Object3D {

        /**
         *
         */
        axis: G3;

        /**
         * Mass
         */
        m: G3;

        /**
         * Color
         */
        color: Color;

        /**
         * Angular Momentum (bivector)
         */
        L: G3;

        /**
         * Momentum
         */
        P: G3;

        /**
         * Attitude (spinor)
         */
        R: G3;

        /**
         * Position (vector)
         */
        X: G3;

        /**
         * Position (vector)
         */
        pos: G3;

        /**
         * Configures the trail left behind a moving rigid body.
         */
        trail: { enabled: boolean; interval: number; retain: number };

        /**
         *
         */
        constructor(geometry: Geometry, material: Material, type?: string)
    }

    class Arrow extends RigidBody {
        constructor(options?: { axis?: VectorE3 })
        length: number;
    }

    class Sphere extends RigidBody {
        constructor(options?: { axis?: VectorE3 })
        radius: number;
    }

    class Box extends RigidBody {
        constructor(options?: { axis?: VectorE3 })
        width: number;
        height: number;
        depth: number;
    }

    class Cylinder extends RigidBody {
        constructor(options?: { axis?: VectorE3 })
        radius: number;
        length: number;
    }

    class Tetrahedron extends RigidBody {
        constructor(options?: { axis?: VectorE3 })
        radius: number;
    }

    class Trail {

        /**
         *
         */
        maxLength: number

        /**
         *
         */
        spacing: number

        /**
         * Constructs a trail for the specified rigidBody.
         * The maximum number of trail points defaults to 10.
         */
        constructor(rigidBody: RigidBody, maxLength?: number);

        /**
         * Records the graphics model variables.
         */
        snapshot(): void;

        /**
         * @method draw
         * @param ambients {Facet[]}
         * @return {void}
         */
        draw(ambients: Facet[]): void;
    }

    /**
     *
     */
    interface World extends IUnknown {
        add(mesh: Mesh): void
        arrow(
            options?: {
                axis?: VectorE3;
                color?: Color;
                pos?: VectorE3;
            }): Arrow
        box(
            options?: {
                axis?: VectorE3;
                width?: number;
                height?: number;
                depth?: number;
            }): Box
        sphere(
            options?: {
                color?: Color;
                pos?: VectorE3;
                radius?: number;
            }): Sphere
        cylinder(
            options?: {
                axis?: VectorE3;
                pos?: VectorE3;
                radius?: number;
            }): Cylinder
        ambients: Facet[]
        canvas: HTMLCanvasElement
    }

    /**
     *
     */
    function bootstrap(
        canvasId: string,
        animate: (timestamp: number) => any,
        options?: {
            height?: number;
            memcheck?: boolean;
            onload?: () => any;
            onunload?: () => any;
            width?: number;
        }): World;

    ///////////////////////////////////////////////////////////////////////////////
    class TrackballCameraControls extends Shareable {
        public rotateSpeed: number
        public zoomSpeed: number
        public panSpeed: number
        constructor(camera: PerspectiveCamera)
        protected destructor(): void
        public subscribe(domElement: HTMLElement): void
        public unsubscribe()
        public handleResize()
        public update()
    }
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    function cos<T>(x: T): T;
    function cosh<T>(x: T): T;
    function exp<T>(x: T): T;
    function log<T>(x: T): T;
    function norm<T>(x: T): T;
    function quad<T>(x: T): T;
    function sin<T>(x: T): T;
    function sinh<T>(x: T): T;
    function sqrt<T>(x: T): T;
    ///////////////////////////////////////////////////////////////////////////////
}

declare module 'eight' {
    export = EIGHT;
}

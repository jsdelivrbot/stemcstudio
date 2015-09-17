//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
// These declarations are appropriate when using the library through the global
// variable, 'EIGHT'.
//
/**
 * @module EIGHT
 */
declare module EIGHT {

/**
 * @module EIGHT
 * @interface IUnknown
 */
interface IUnknown {
  addRef(): number;
  release(): number;
}

/**
 * @module EIGHT
 * @interface ContextListener
 */
interface ContextListener {
  /**
   * Called to request the dependent to free any WebGL resources acquired and owned.
   * The dependent may assume that its cached context is still valid in order
   * to properly dispose of any cached resources. In the case of shared objects, this
   * method may be called multiple times for what is logically the same context. In such
   * cases the dependent must be idempotent and respond only to the first request.
   * @method contextFree
   * @param canvasId {number} Determines the context for which resources are being freed.
   */
  contextFree(canvasId: number): void;
  /**
   * Called to inform the dependent of a new WebGLRenderingContext.
   * The implementation should ignore the notification if it has already
   * received the same context.
   * @method contextGain
   * @param manager {ContextManager} If there's something strange in your neighborhood.
   */
  contextGain(manager: ContextManager): void;
  /**
   * Called to inform the dependent of a loss of WebGLRenderingContext.
   * The dependent must assume that any cached context is invalid.
   * The dependent must not try to use and cached context to free resources.
   * The dependent should reset its state to that for which there is no context.
   * @method contextLoss
   * @param canvasId {number} Determines the context for which resources are being lost.
   */
  contextLoss(canvasId: number): void;
}

/**
 * @module EIGHT
 * @interface IResource
 */
interface IResource extends IUnknown, ContextListener {

}

/**
 * @module EIGHT
 * @interface IMesh
 */
interface IMesh extends IUnknown {
  uuid: string;
  bind(program: IProgram, aNameToKeyName?: {[name: string]: string}): void;
  draw(): void;
  unbind(): void;
}

/**
 * @module EIGHT
 * @class DrawElements
 */
class DrawElements {
  public k: number;
  public indices: VectorN<number>;
  public attributes: {[name: string]: DrawAttribute};
  constructor(k: number, indices: VectorN<number>, attributes: {[name: string]: DrawAttribute});
}

/**
 * @module EIGHT
 * @class DrawAttribute
 */
class DrawAttribute {
  public values: VectorN<number>;
  public size: number;
  constructor(values: VectorN<number>, size: number);
}

/**
 * @module EIGHT
 * @class Simplex
 * A simplex is the generalization of a triangle or tetrahedron to arbitrary dimensions.
 * A k-simplex is the convex hull of its k + 1 vertices.
 */
class Simplex {
  public vertices: Vertex[];
  /**
   * @class Simplex
   * @constructor
   * @param k {number} The initial number of vertices in the simplex is k + 1.
   */
  constructor(k: number);
  /**
   * An empty set can be consired to be a -1 simplex (algebraic topology).
   */
  public static K_FOR_EMPTY = -1;
  /**
   * A single point may be considered a 0-simplex.
   */
  public static K_FOR_POINT = 0;
  /**
   * A line segment may be considered a 1-simplex.
   */
  public static K_FOR_LINE_SEGMENT = 1;
  /**
   * A 2-simplex is a triangle.
   */
  public static K_FOR_TRIANGLE = 2;
  /**
   * A 3-simplex is a tetrahedron.
   */
  public static K_FOR_TETRAHEDRON = 3;
  /**
   * A 4-simplex is a 5-cell.
   */
  public static K_FOR_FIVE_CELL = 4;
  public static computeFaceNormals(simplex: Simplex, name: string);
  public static indices(simplex: Simplex): number[];
  /**
   * Applies the boundary operation n times.
   * @param n {number} The number of times to apply the boundary operation.
   * triangles are converted into three lines.
   * lines are converted into two points.
   * points are converted into the empty geometry.
   */
  public static boundary(geometry: Simplex[], n?: number): Simplex[];
  /**
   * Applies the subdivide operation n times.
   * @param n {number} The number of times to apply the subdivide operation.
   * The subdivide operation computes the midpoint of all pairs of vertices
   * and then uses the original points and midpoints to create new simplices
   * that span the original simplex. 
   */
  public static subdivide(geometry: Simplex[], n?: number): Simplex[];
}

/**
 * @module EIGHT
 * @class Vertex
 */
 class Vertex {
  public attributes: { [name: string]: VectorN<number> };
  public opposing: Simplex[] = [];
  public parent: Simplex;
  constructor();
}

/**
 * @module EIGHT
 * @interface GeometryInfo
 */
interface GeometryInfo {
  k: number;
  attributes: { [key: string]: { size: number; name?: string } };
}

/**
 * @module EIGHT
 * @function checkGeometry
 * Computes the mapping from attribute name to size.
 * Reports inconsistencies in the geometry by throwing exceptions.
 * When used with toDrawElements(), allows names and sizes to be mapped.
 */
function checkGeometry(geometry: Simplex[]): GeometryInfo;

/**
 * @module EIGHT
 * @function computeFaceNormales
 */
function computeFaceNormals(simplex: Simplex, positionName?: string, normalName?: string): void;

/**
 * @module EIGHT
 * @function cube
 * Creates a cube of the specified side length.
 *
 *    6------ 5
 *   /|      /|
 *  1-------0 |
 *  | |     | |
 *  | 7-----|-4
 *  |/      |/
 *  2-------3
 *
 * The triangle simplices are:
 * 1-2-0, 3-0-2, ...
 */
function cube(size?: number): Simplex[];

/**
 * @module EIGHT
 * @function quadrilateral
 *
 *  b-------a
 *  |       | 
 *  |       |
 *  |       |
 *  c-------d
 *
 * The quadrilateral is split into two triangles: b-c-a and d-a-c, like a "Z".
 * The zeroth vertex for each triangle is opposite the other triangle.
 */
function quadrilateral(a: VectorN<number>, b: VectorN<number>, c: vectorN<number>, d: VectorN<number>, attributes?: { [name: string]: VectorN<number>[] }, triangles?: Simplex[]): Simplex[];

/**
 * @module EIGHT
 * @function square
 *
 *  b-------a
 *  |       | 
 *  |       |
 *  |       |
 *  c-------d
 *
 * The square is split into two triangles: b-c-a and d-a-c, like a "Z".
 * The zeroth vertex for each triangle is opposite the other triangle.
 */
function square(size?: number): Simplex[];

/**
 * @module EIGHT
 * @function terahedron
 *
 * The tetrahedron is composed of four triangles: abc, bdc, cda, dba.
 */
function tetrahedron(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes: { [name: string]: VectorN<number>[] } = {}, triangles: Simplex[] = []): Simplex[];

/**
 * @module EIGHT
 * @function triangle
 */
function triangle(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes?: { [name: string]: VectorN<number>[] }, triangles?: Simplex[]): Simplex[];

/**
 * @module EIGHT
 * @function toDrawElements
 * geometry to DrawElements conversion.
 */
function toDrawElements(geometry: Simplex[], geometryInfo?: GeometryInfo): DrawElements;

/**
 * @module EIGHT
 * @interface ContextProgramListener
 */
interface ContextProgramListener {
  contextFree(): void;
  contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
  contextLoss(): void;
}

/**
 * @module EIGHT
 * @class AttribLocation
 * @implements ContextProgramListener
 * Manages the lifecycle of an attribute used in a vertex shader.
 */
class AttribLocation implements ContextProgramListener {
  index: number;
  constructor(name: string, size: number, type: number);
  contextFree(): void;
  contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
  contextLoss(): void;
  enable(): void;
  disable(): void;
  vertexPointer(size: number, normalized?: boolean, stride?: number, offset?: number): void;
}

/**
 * @module EIGHT
 * @interface IBuffer
 */
interface IBuffer extends IResource {
  /**
   * @method bind
   */
  bind();
  /**
   * @method unbind
   */
  unbind();
}

/**
 * @module EIGHT
 * @class UniformLocation
 */
class UniformLocation implements ContextProgramListener {
  constructor(monitor: ContextManager, name: string);
  contextFree(): void;
  contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
  contextLoss(): void;
  uniform1f(x: number): void;
  uniform2f(x: number, y: number): void;
  uniform3f(x: number, y: number, z: number): void;
  uniform4f(x: number, y: number, z: number, w: number): void;
  matrix1(transpose: boolean, matrix: Matrix1): void;
  matrix2(transpose: boolean, matrix: Matrix2): void;
  matrix3(transpose: boolean, matrix: Matrix3): void;
  matrix4(transpose: boolean, matrix: Matrix4): void;
  vector1(vector: Vector1): void;
  vector2(vector: Vector2): void;
  vector3(vector: Vector3): void;
  vector4(vector: Vector4): void;
}

/**
 * @module EIGHT
 * @interface ITexture
 */
interface ITexture extends IResource {
  bind(): void;
  unbind(): void;
}

/**
 * @module EIGHT
 * @interface ITexture2D
 */
interface ITexture2D extends ITexture {

}

/**
 * @module EIGHT
 * @interface ITextureCubeMap
 */
interface ITextureCubeMap extends ITexture {

}

/**
 * @module EIGHT
 * @interface Mutable
 */
interface Mutable<T> {
  data: T;
  callback: () => T;
}

/**
 * @module EIGHT
 * @interface LinearElement
 */
interface LinearElement<I, M, S> {
  add(rhs: I): M;
  clone(): M;
  copy(source: I): M;
  difference(a: I, b: I): M;
  divideScalar(scalar: number): M;
  lerp(target: I, alpha: number): M;
  multiplyScalar(scalar: number): M;
//reflect(vector: I): M;
  rotate(rotor: S): M;
  sub(rhs: I): M;
  sum(a: I, b: I): M;
}

/**
 * @module EIGHT
 * @interface GeometricElement
 */
interface GeometricElement<I, M> extends LinearElement<I, M, I> {
  exp(): M;
  magnitude(): number;
  multiply(element: I): M;
  product(a: I, b: I): M;
  quaditude(): number;
}

/**
 * @module EIGHT
 * @class Matrix1
 */
class Matrix1 {
  public data: Float32Array;
  constructor(data: Float32Array);
}

/**
 * @module EIGHT
 * @class Matrix2
 */
class Matrix2 {
  public data: Float32Array;
  constructor(data: Float32Array);
}

/**
 * @module EIGHT
 * @class Matrix3
 */
class Matrix3 {
  public data: Float32Array;
  constructor(data: Float32Array);
  /**
   * Generates a new identity matrix.
   */
  static identity(): Matrix3;
  /**
   *
   */
  identity(): Matrix4;
  /**
   *
   */
  normalFromMatrix4(matrix: Matrix4): void;
}

/**
 * @module EIGHT
 * @class Matrix4
 */
class Matrix4 {
  public data: Float32Array;
  constructor(data: Float32Array);
  /**
   * Generates a new identity matrix.
   */
  static identity(): Matrix4;
  /**
   * Generates a new scaling matrix.
   */
  static scaling(scale: Cartesian3): Matrix4;
  /**
   * Generates a new translation matrix.
   */
  static translation(vector: Cartesian3): Matrix4;
  /**
   * Generates a new rotation matrix.
   */
  static rotation(spinor: Spinor3Coords): Matrix4;
  /**
   *
   */
  copy(matrix: Matrix4): Matrix4;
  /**
   *
   */
  determinant(): number;
  /**
   *
   */
  identity(): Matrix4;
  invert(m: Matrix4, throwOnSingular?: boolean): Matrix4;
  multiply(matrix: Matrix4): Matrix4;
  product(a: Matrix4, b: Matrix4): Matrix4;
  rotate(spinor: Spinor3Coords): void;
  rotation(spinor: Spinor3Coords): void;
  scale(scale: Cartesian3): void;
  scaling(scale: Cartesian3): void;
  translate(displacement: Cartesian3): void;
  translation(displacement: Cartesian3): void;
  frustum(left: number, right: number, bottom: number, top: number, near: number, far: number);
  toString(): string;
  toFixed(digits?: number): string;
}

/**
 * @module EIGHT
 * @interface Cartesian1
 */
interface Cartesian1 {
  x: number;
}

/**
 * @module EIGHT
 * @interface Cartesian2
 */
interface Cartesian2 {
  x: number;
  y: number;
}

/**
 * @module EIGHT
 * @class VectorN
 */
class VectorN<T> implements Mutable<T[]> {
  public callback: () => T[];
  public data: T[];
  public modified: boolean;
  constructor(data: T[], modified?: boolean, size?: number);
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
 * @module EIGHT
 * @class Vector1
 */
class Vector1 extends VectorN<number> implements Cartesian1 {
  public x: number;
  constructor(data?: number[], modified?: boolean);
}

/**
 * @module EIGHT
 * @class Vector2
 */
class Vector2 extends VectorN<number> implements Cartesian2 {
  public x: number;
  public y: number;
  constructor(data?: number[], modified?: boolean);
  add(v: Cartesian2): Vector2;
  sum(a: Cartesian2, b: Cartesian2): Vector2;
  copy(v: Cartesian2): Vector2;
  magnitude(): number;
  multiplyScalar(s: number): Vector2;
  quaditude(): number;
  set(x: number, y: number): Vector2;
  sub(v: Cartesian2): Vector2;
  difference(a: Cartesian2, b: Cartesian2): Vector2;
}

/**
 * @module EIGHT
 * @interface Rotor3
 * R = mn (i.e. a versor), with the constraint that R * ~R = ~R * R = 1
 *
 * The magnitude constraint means that a Rotor3 can be implemented with a unit scale,
 * leaving only 3 parameters. This should improve computational efficiency.
 */
interface Rotor3 extends Spinor3Coords {
  modified: boolean;
  copy(spinor: Spinor3Coords): Rotor3;
  exp(): Rotor3;
  multiply(spinor: Spinor3Coords): Rotor3;
  multiplyScalar(s: number): Rotor3;
  product(a: Spinor3Coords, b: Spinor3Coords): Rotor3;
  reverse(): Rotor3;
  toString(): string;
  wedgeVectors(m: Cartesian3, n: Cartesian3): Rotor3;
}

/**
 * @module EIGHT
 * @function rotor3
 */
function rotor3(): Rotor3;

/**
 * @module EIGHT
 * @interface Spinor3Coords
 */
interface Spinor3Coords {
  yz: number;
  zx: number;
  xy: number;
  w: number;
}

/**
 * @module EIGHT
 * @class Spinor3
 */
class Spinor3 extends VectorN<number> implements Spinor3Coords, GeometricElement<Spinor3Coords, Spinor3> {
  public yz: number;
  public zx: number;
  public xy: number;
  public w: number;
  constructor(data?: number[], modified?: boolean);
  add(rhs: Spinor3Coords): Spinor3;
  clone(): Spinor3;
  copy(spinor: Spinor3Coords): Spinor3;
  divideScalar(scalar: number): Spinor3;
  exp(): Spinor3;
  multiply(rhs: Spinor3Coords): Spinor3;
  multiplyScalar(scalar: number): Spinor3;
  /**
   * Sets this Spinor3 to the geometric product of the vectors a and b, a * b.
   */
  product(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
  reverse(): Spinor3;
  rotate(rotor: Spinor3Coords): Spinor3;
  toString(): string;
  /**
   * Sets this Spinor3 to the outer product of the vectors a and b, a ^ b.
   */
  wedgeVectors(a: Cartesian3, b: Cartesian3) Spinor3;
}

/**
 * @module EIGHT
 * @interface Cartesian3
 */
interface Cartesian3 {
  x: number;
  y: number;
  z: number;
}

/**
 * @module EIGHT
 * @class Vector3
 */
 class Vector3 extends VectorN<number> implements Cartesian3, LinearElement<Cartesian3, Vector3, Spinor3Coords> {
  public x: number;
  public y: number;
  public z: number;
  public static e1: Vector3;
  public static e2: Vector3;
  public static e3: Vector3;
  public static copy(vector: Cartesian3): Vector3;
  constructor(data?: number[], modified?: boolean);
  add(rhs: Cartesian3): Vector3;
  clone(): Vector3;
  copy(v: Cartesian3): Vector3;
  cross(v: Cartesian3): Vector3;
  crossVectors(a: Cartesian3, b: Cartesian3): Vector3;
  difference(a: Cartesian3, b: Cartesian3): Vector3;
  distanceTo(position: Cartesian3): number;
  divideScalar(rhs: number): Vector3;
  magnitude(): number;
  lerp(target: Cartesian3, alpha: number): Vector3;
  multiplyScalar(rhs: number): Vector3;
  normalize(): Vector3;
  quaditude(): number;
  quadranceTo(position: Cartesian3): number;
  rotate(rotor: Spinor3Coords): Vector3;
  set(x: number, y: number, z: number): Vector3;
  setMagnitude(magnitude: number): Vector3;
  sub(rhs: Cartesian3): Vector3;
  sum(a: Cartesian3, b: Cartesian3): Vector3;
}

/**
 * @module EIGHT
 * @interface Cartesian4
 */
interface Cartesian4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 * @module EIGHT
 * @class Vector4
 */
class Vector4 extends VectorN<number> implements Cartesian4 {
  public x: number;
  public y: number;
  public z: number;
  public w: number;
  constructor(data?: number[], modified?: boolean);
}

/**
 * @module EIGHT
 * @interface UniformDataVisitor
 */
interface UniformDataVisitor {
  uniform1f(name: string, x: number);
  uniform2f(name: string, x: number, y: number);
  uniform3f(name: string, x: number, y: number, z: number);
  uniform4f(name: string, x: number, y: number, z: number, w: number);
  uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1);
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2);
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3);
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4);
  uniformVector1(name: string, vector: Vector1);
  uniformVector2(name: string, vector: Vector2);
  uniformVector3(name: string, vector: Vector3);
  uniformVector4(name: string, vector: Vector4);
}

/**
 * @module EIGHT
 * @interface UniformData
 */
interface UniformData {
  accept(visitor: UniformDataVisitor);
}

/**
 * @module EIGHT
 * @interface View
 * Provides the uniform for the model to view coordinates transformation.
 */
interface View extends UniformData {
  /**
   * The position of the view reference point, VRP.
   */
  eye: Vector3;
  /**
   * A special point in the world coordinates that defines the viewplane normal, VPN or n.
   * n = eye - look, normalized to unity.
   */
  look: Cartesian3;
  /**
   * A unit vector used to determine the view horizontal direction, u.
   * u = cross(up, n), and
   * v = cross(n, u).
   */
  up: Vector3;
  /**
   * Convenience method for setting the eye property allowing chainable method calls.
   */
  setEye(eye: Cartesian3): View;
  /**
   * Convenience method for setting the look property allowing chainable method calls.
   */
  setLook(look: Cartesian3): View;
  /**
   * Convenience method for setting the up property allowing chainable method calls.
   */
  setUp(up: Cartesian3): View;
}

/**
 * @module EIGHT
 * @interface Frustum
 */
 interface Frustum extends View {
  left: number;
  right: number;
  bottom: number;
  top: number;
  near: number;
  far: number;
  /**
   * Convenience method for setting the eye property allowing chainable method calls.
   */
  setEye(eye: Cartesian3): Frustum;
  /**
   * Convenience method for setting the look property allowing chainable method calls.
   */
  setLook(look: Cartesian3): Frustum;
  /**
   * Convenience method for setting the up property allowing chainable method calls.
   */
  setUp(up: Cartesian3): Frustum;
}

/**
 * @module EIGHT
 * @interface Perspective
 * A transformation from the 3D world coordinates or view volume to the canonical view volume.
 * The canonical view volume is the cube that extends from -1 to +1
 * in all cartesian directions. 
 */
interface Perspective extends View {
  /**
   * field of view angle in the view volume vertical plane, measured in radians.
   */
  fov: number;
  /**
   * ratio of width divided by height of the view volume.
   */
  aspect: number;
  /**
   * distance to the near plane of the view volume from the view reference point.
   */
  near: number;
  /**
   * distance to the far plane of the view volume from the view reference point.
   */
  far: number;
  /**
   * Convenience method for setting the fov property allowing chainable method calls.
   */
  setFov(fov: number): Perspective;
  /**
   * Convenience method for setting the aspect property allowing chainable method calls.
   */
  setAspect(aspect: number): Perspective;
  /**
   * Convenience method for setting the near property allowing chainable method calls.
   */
  setNear(near: number): Perspective;
  /**
   * Convenience method for setting the far property allowing chainable method calls.
   */
  setFar(far: number): Perspective;
  /**
   * Convenience method for setting the eye property allowing chainable method calls.
   */
  setEye(eye: Cartesian3): Perspective;
  /**
   * Convenience method for setting the look property allowing chainable method calls.
   */
  setLook(look: Cartesian3): Perspective;
  /**
   * Convenience method for setting the up property allowing chainable method calls.
   */
  setUp(up: Cartesian3): Perspective;
}

/**
 * @module THREE
 * @class Face3
 */
class Face3 {
  public a: number;
  public b: number;
  public c: number;
  public vertexNormals: Cartesian3[];
  constructor(a: number, b: number, c: number, vertexNormals?: Cartesian3[]);
}

/**
 * @module THREE
 * @class Sphere
 */
 class Sphere {
  public center: Cartesian3;
  public radius: number;
  constructor(center?: Cartesian3, radius?: number);
  setFromPoints(points: Cartesian3[]);
}
/**
 * @module THREE
 * @class Geometry
 * Base class for geometries.
 * A geometry holds faces and vertices used to describe a 3D mesh.
 */
class Geometry {
  public simplices: Simplex[];
  public dynamic: boolean;
  public verticesNeedUpdate: boolean;
  public elementsNeedUpdate: boolean;
  public uvsNeedUpdate: boolean;
  constructor();
  /**
   * Applies the boundary operation to the geometry.
   * Tetrahedrons become Triangles.
   * Triangles become Line Segments.
   * Line Segments become Points.
   * Points become an empty simplex.
   * An empty simplex vanishes.
   * count: The number of times to apply the boundary operation. Default is one (1).
   */
  public boundary(count?: number): void;
  /**
   * Updates the normals property of each face by creating a per-face normal.
   */
  public computeFaceNormals(): void;
  /**
   * Updates the normals property of each face by creating per-vertex normals averaged over adjacent faces.
   */
  public computeVertexNormals(): void;
  /**
   * Merges vertices which are separated by less than the specified quadrance.
   */
  public mergeVertices(precisionPoints?: number): void;
  /**
   * Subdivides the simplices of the geometry to produce finer detail.
   * count: The number of times to subdivide. Default is one (1).
   */
  public subdivide(count?: number): void;
}


/**
 * @module EIGHT
 * @class Color
 */
 class Color
{
  public red: number;
  public green: number;
  public blue: number;
  public data: number[];
  public modified: boolean;
  constructor(data?: number[]);
  public static fromHSL(H: number, S: number, L: number): Color;
  public static fromRGB(red: number, green: number, blue: number): Color;
}

/**
 * @module EIGHT
 * @interface IProgram
 * A vertex shader and a fragment shader combined into a program.
 */
interface IProgram extends IResource, UniformDataVisitor
{
  /**
   * @property program
   * @type WebGLProgram
   */
  program: WebGLProgram;
  /**
   * @property programId
   * @type string
   */
  programId: string;
  /**
   * @property vertexShader
   * @type string
   */
  vertexShader: string;
  /**
   * @property fragmentShader
   * @type string
   */
  fragmentShader: string;
  /**
   * Makes the program the current program for WebGL.
   * @method use
   * @param canvasId {number} Determines which WebGLProgram to use.
   */
  use(canvasId: number): void;
  /**
   * A map of attribute name to attribute location for active attributes.
   */
  attributes: { [name: string]: AttribLocation };
  /**
   * A map of uniform name to uniform location for active uniforms.
   */
  uniforms: { [name: string]: UniformLocation };
}

/**
 * @module EIGHT
 * @interface WindowAnimationRunner
 */
interface WindowAnimationRunner
{
  start(): void;
  stop(): void;
  reset(): void;
  lap(): void;
  time: number;
  isRunning: boolean;
  isPaused: boolean;
}

/**
 * @module EIGHT
 * @function frustum
 * Constructs and returns a Frustum.
 */
function frustum(left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number): Frustum;

/**
 * @module EIGHT
 * @function frustumMatrix
 * Computes a frustum matrix.
 */
function frustumMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number, matrix?: Float32Array): Float32Array;

/**
 * @module EIGHT
 * @function perspective
 * Constructs and returns a Perspective.
 */
function perspective(options?: {fov?: number; aspect?: number; near?: number; far?: number; projectionMatrixName?: string; viewMatrixName?: string}): Perspective;

/**
 * @module EIGHT
 * @function perspectiveMatrix
 * Computes a perspective matrix.
 */
function perspectiveMatrix(fov: number, aspect: number, near: number, far: number, matrix?: Matrix4): Matrix4;

/**
 * @module EIGHT
 * @function view
 * Constructs and returns a View.
 */
function view(): View;

/**
 * @module EIGHT
 * @function viewMatrix
 * Computes a view matrix.
 */
function viewMatrix(eye: Cartesian3, look: Cartesian3, up: Cartesian3, matrix?: Matrix4): Matrix4;

/**
 * @module EIGHT
 * @function shaderProgram
 * @param monitors {ContextMonitor[]}
 * Constructs a program from the specified vertex and fragment shader codes.
 */
function shaderProgram(monitors: ContextMonitor[], vertexShader: string, fragmentShader: string, bindings?: string[]): IProgram;

/**
 * @module EIGHT
 * @function programFromScripts
 * @param monitors {ContextMonitor[]}
 * Constructs a program from the specified vertex and fragment shader script element identifiers.
 */
function programFromScripts(monitors: ContextMonitor[], vsId: string, fsId: string, $document: Document, bindings?: string[]): IProgram;

/**
 * @class AttribMetaInfo
 */
interface AttribMetaInfo {
  /**
   * @property glslType {string} The type keyword as it appears in the GLSL shader program.
   * This property is used for program generation.
   */
  glslType: string,
}

/**
 * @interface UniformMetaInfo
 */
interface UniformMetaInfo {
  /**
   * @property name {string} Specifies an optional override of the name used as a key in UniformMetaInfos.
   */
  name?: string;
  /**
   * @property glslType {string} The type keyword as it appears in the GLSL shader program.
   */
  glslType: string;
}

/**
 * @module EIGHT
 * @function smartProgram
 * @param monitors {ContextMonitor[]}
 * @param attributes
 * @param uniformsList
 * @param bindings Used for setting indices.
 * Constructs a program by introspecting a geometry.
 */
function smartProgram(monitors: ContextMonitor[], attributes: {[name:string]:AttribMetaInfo}, uniforms: {[name:string]:UniformMetaInfo}, bindings?: string[]): IProgram;

/**
 * @module THREE
 * @class ArrowGeometry
 */
class ArrowGeometry extends Geometry {
  constructor();
}

/**
 * @module THREE
 * @class VortexGeometry
 */
class VortexGeometry extends Geometry {
  constructor();
}

/**
 * @module THREE
 * @class PolyhedronGeometry
 */
class PolyhedronGeometry extends Geometry {
  constructor(vertices: number[], indices: number[], radius?:  number, detail?: number);
}

/**
 * @module THREE
 * @class DodecahedronGeometry
 */
class DodecahedronGeometry extends PolyhedronGeometry {
  constructor(radius?: number, detail?: number);
}

/**
 * @module THREE
 * @class IcosahedronGeometry
 */
class IcosahedronGeometry extends PolyhedronGeometry {
  constructor(radius?: number, detail?: number);
}

/**
 * @module THREE
 * @class KleinBottleGeometry
 */
class KleinBottleGeometry extends SurfaceGeometry {
  constructor(uSegments: number, vSegments: number);
}

/**
 * @module THREE
 * @class MobiusStripGeometry
 */
class MobiusStripGeometry extends SurfaceGeometry {
  constructor(uSegments: number, vSegments: number);
}

/**
 * @module THREE
 * @class OctahedronGeometry
 */
class OctahedronGeometry extends PolyhedronGeometry {
  constructor(radius?: number, detail?: number);
}

/**
 * @module THREE
 * @class SurfaceGeometry
 */
class SurfaceGeometry extends Geometry {
  /**
   * Constructs a parametric surface geometry from a function.
   * parametricFunction The function that determines a 3D point corresponding to the two parameters.
   * uSegments The number of segments for the u parameter.
   * vSegments The number of segments for the v parameter.
   */
  constructor(parametricFunction: (u: number, v: number) => Cartesian3, uSegments: number, vSegments: number);
}

/**
 * @module THREE
 * @class SphereGeometry
 */
class SphereGeometry extends Geometry {
  constructor(
    radius?: number,
    widthSegments?: number,
    heightSegments?: number,
    phiStart?: number,
    phiLength?: number,
    thetaStart?: number,
    thetaLength?: number);
}

/**
 * @module THREE
 * @class TetrahedronGeometry
 */
class TetrahedronGeometry extends PolyhedronGeometry {
  constructor(radius?: number, detail?: number);
}

/**
 * @module THREE
 * @class TubeGeometry
 */
class TubeGeometry extends Geometry {
  constructor(
    path: Curve,
    segments?: number,
    radius?: number,
    radialSegments?: number,
    closed?: boolean,
    taper?: (u: number)=>number);
}

/**
 * @module THREE
 * @class Curve
 */
class Curve {
  constructor();
}

/**
 * @module EIGHT
 * @function animation
 * Constructs and returns a WindowAnimationRunner.
 */
function animation(
  animate: {(time: number): void;},
  options?: {
    setUp?: () => void;
    tearDown?: { (animateException): void; };
    terminate?: (time: number) => boolean;
    window?: Window}): WindowAnimationRunner;

/**
 * @module EIGHT
 * @interface ContextMonitor
 */
interface ContextMonitor {
  /**
   *
   */
  addContextListener(user: ContextListener): void;
  /**
   *
   */
  removeContextListener(user: ContextListener): void;
}

/**
 * @module EIGHT
 * @interface ContextManager
 */
interface ContextManager extends IUnknown, ContextMonitor
{
  /**
   * Starts the monitoring of the WebGL context.
   */
  start(): void;
  /**
   * Stops the monitoring of the WebGL context.
   */
  stop(): void;
  /**
   *
   */
  addContextListener(user: ContextListener): ContextManager;
  /**
   *
   */
  removeContextListener(user: ContextListener): ContextManager;
  /**
   *
   */
  clearColor(red: number, green: number, blue: number, alpha: number): void;
  /**
   *
   */
  clearDepth(depth: number): void;
  /**
   * Creates a new IBuffer instance that binds to the ARRAY_BUFFER target.
   */
  createArrayBuffer(): IBuffer;
  /**
   * Creates a new IBuffer instance that binds to the ELEMENT_ARRAY_BUFFER target.
   */
  createElementArrayBuffer(): IBuffer;
  /**
   * Creates a new IMesh instance from a DrawElements data structure.
   * @param elements {DrawElements} The elements to be drawn.
   * @param mode {number} The mode to be used for drawing. Ust be consistent with elements.k property.
   * @param usage {number} A hint about how the underlying buffers will be used.
   */
  createDrawElementsMesh(elements: DrawElements, mode?: number, usage?: number): IMesh;
  /**
   * Creates a new Texture2D instance that binds to the TEXTURE_2D target.
   */
  createTexture2D(): Texture2D;
  /**
   * Creates a new TextureCubeMap instance that binds to the TEXTURE_CUBE_MAP target.
   */
  createTextureCubeMap(): TextureCubeMap;
  /**
   * Render geometric primitives from bound and enabled vertex data.
   *
   * Parameters
   *   mode [in] Specifies the kind of geometric primitives to render from a given set of vertex attributes.
   *   first [in] The first element to render in the array of vector points.
   *   count [in] The number of vector points to render.
   *              For example, N triangles would have count 3 * N using TRIANGLES mode.
   * Return value
   *   This method does not return a value.
   * Remarks
   *   None.
   */
  drawArrays(mode: number, first: number, count: number): void;
  /**
   *
   */
  drawElements(mode: number, count: number, type: number, offset: number): void;
  /**
   *
   */
  depthFunc(func: number): void;
  /**
   *
   */
  enable(capability: number): void;
  /**
   *
   */
  context: WebGLRenderingContext;
  /**
   * Determines whether the framework mirrors the WebGL state machine in order to optimize redundant calls.
   */
  mirror: boolean;
}

/**
 * @function webgl
 * Constructs and returns a ContextManager.
 * @param canvas {HTMLCanvasElement} The HTML5 Canvas to be used for WebGL rendering.
 * @param canvasId {number} The optional user-defined integer identifier for the canvas. Default is zero (0).
 * @param attributes {WebGLContextAttributes} Optional attributes for initializing the context.
 */
function webgl(canvas: HTMLCanvasElement, canvasId?: number, attributes?: WebGLContextAttributes): ContextManager;

/**
 * @class Model
 */
class Model implements UniformData {
  public position: Vector3;
  public attitude: Spinor3;
  public scale: Vector3;
  public color: Vector3;
  /**
   * Model implements UniformData required for manipulating a body.
   */ 
  constructor();
  accept(visitor: UniformDataVisitor);
}

/**
 * @module EIGHT
 * @var VERSION
 * The version string of the davinci-eight module.
 */
var VERSION: string;

/**
 * @module EIGHT
 * @function refChange
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
 * @module EIGHT
 * @class Symbolic
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 */
class Symbolic {
  /**
   * 'aColor'
   */
  static ATTRIBUTE_COLOR: string;
  /**
   * 'aMaterialIndex'
   */
  static ATTRIBUTE_MATERIAL_INDEX: string;
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
  static ATTRIBUTE_TEXTURE_COORDS:string;

  static UNIFORM_AMBIENT_LIGHT: string;
  static UNIFORM_COLOR: string;
  static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string;
  static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string;
  static UNIFORM_POINT_LIGHT_COLOR: string;
  static UNIFORM_POINT_LIGHT_POSITION: string;
  static UNIFORM_PROJECTION_MATRIX: string;
  static UNIFORM_MODEL_MATRIX: string;
  static UNIFORM_NORMAL_MATRIX: string;
  static UNIFORM_VIEW_MATRIX: string;

  static VARYING_COLOR: string;
  static VARYING_LIGHT: string;
}
////////////////////////////////////////////////////////
// scene
///////////////////////////////////////////////////////

/**
 * @interface ContextUnique
 */
interface ContextUnique {
  /**
   * The identifier of a canvas must be unique and stable.
   * For speed we assume a low cardinality number.
   */
  canvasId: number;
}

/**
 * @interface ContextController
 */
interface ContextController {
  start(): void;
  stop(): void;
  // FIXME: kill
  // kill(): void;
}

/**
 * @interface ContextKahuna
 * @extends ContextController
 * @extends ContextManager
 * @extends ContextMonitor
 * @extends ContextUnique
 */
interface ContextKahuna extends ContextController, ContextManager, ContextMonitor, ContextUnique {

}

/**
 * @interface ContextController
 */
interface ContextController {
  start(): void;
  stop(): void;
  // FIXME: kill
  // kill(): void;
}

/**
 * The Drawable interface indicates that the implementation can make a call
 * to either drawArrays or drawElements on the WebGLRenderingContext.
 * @interface IDrawable
 * @extends IResource
 */
interface IDrawable extends IResource {
  /**
   * @property material
   * Implementations returning this property should call addRef() on the program prior to returning it.
   */
  material: IProgram;
  /**
   * @method draw
   */
  draw(): void;
}

/**
 * @interface IComposite
 */

/**
 * @module EIGHT
 * @class Object3D
 */
class Object3D {
  constructor();
}

/**
 * @interface IDrawList
 * @extends ContextListener
 * @extends IUnknown
 * @extends UniformDataVisitor
 *
 * ContextListener because it prefers a WebGLRenderingContext outside the animation loop.
 * IUnknown because it is responsible for holding references to the drawables.
 * UniformDataVisitor because... FIXME 
 */
interface IDrawList extends ContextListener, IUnknown, UniformDataVisitor {
  add(drawable: IDrawable): void;
  addRef(): number;
  release(): number;
  remove(drawable: IDrawable): void;
  traverse(callback: (drawable: IDrawable) => void): void;
}

// FIXME: Bit confusing right now that IDrawList does not actually extend IUnknown.
// It should: the only thing stopping the drawables from going zombie is the Scene.
// It remains unclear as to what ContextManager should do.

/**
 * @module EIGHT
 * @class Scene
 * @implements IDrawList
 */
class Scene implements IDrawList {
  constructor(monitors: ContextMonitor[]);
  add(drawable: IDrawable): void;
  addRef(): number;
  contextFree(canvasId: number): void;
  contextGain(manager: ContextManager): void;
  contextLoss(canvasId: number): void;
  release(): number;
  remove(drawable: IDrawable): void;
  traverse(callback: (drawable: IDrawable) => void): void;
  uniform1f(name: string, x: number);
  uniform2f(name: string, x: number, y: number);
  uniform3f(name: string, x: number, y: number, z: number);
  uniform4f(name: string, x: number, y: number, z: number, w: number);
  uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1);
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2);
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3);
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4);
  uniformVector1(name: string, vector: Vector1);
  uniformVector2(name: string, vector: Vector2);
  uniformVector3(name: string, vector: Vector3);
  uniformVector4(name: string, vector: Vector4);
}

/**
 * @module EIGHT
 * @interface ICamera
 * @extends IDrawable
 */
interface ICamera extends IDrawable {
}

/**
 * @module EIGHT
 * @class PerspectiveCamera
 * @implements ICamera
 * @implements UniformData
 */
class PerspectiveCamera implements ICamera, UniformData {
  position: Vector3;
  /**
   * @property material
   * @type {IProgram}
   * Just in case the camera becomes visible.
   */
  material: IProgram;
  constructor(fov?: number, aspect?: number, near?: number, far?: number);
  addRef(): number;
  accept(visitor: UniformDataVisitor): void;
  contextFree(canvasId: number): void;
  contextGain(manager: ContextManager): void;
  contextLoss(canvasId: number): void;
  draw(): void;
  release(): number;
}

/**
 * @module EIGHT
 * @class WebGLRenderer
 */
class WebGLRenderer implements ContextController, ContextMonitor {
  canvasId: number;
  context: WebGLRenderingContext;
  domElement: HTMLCanvasElement;
  /**
   * @constructor
   * @param canvas {HTMLCanvasElement}
   * @param canvasId {number}
   * @param attributes {WebGLContextAttributes}
   */
  constructor(canvas?: HTMLCanvasElement, canvasId?: number, attributes?: WebGLContextAttributes);
  addContextListener(user: ContextListener): void;
  createDrawElementsMesh(elements: DrawElements, mode?: number, usage?: number): IMesh;
  removeContextListener(user: ContextListener): void;
  render(scene: Scene, ambiends: UniformData): void;
  setClearColor(color: number, alpha?: number): void;
  setSize(width: number, height: number, updateStyle?: boolean): void;
  start(): void;
  stop(): void;
}

/**
 * @class BoxGeometry
 * @extends Geometry
 */
class BoxGeometry extends Geometry {
  /**
   * @constructor
   * width: The side length in the x-axis direction.
   * height: The side length in the y-axis direction.
   * depth: The side length in the z-axis direction.
   * widthSegments: The number of line segments in the x-axis direction.
   * heightSegments: The number of line segments in the y-axis direction.
   * depthSegments: The number of line segments in the z-axis direction.
   * wireFrame determines whether the geometry computes line segments or triangles.
   */
  constructor(width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number, wireFrame?: boolean);
}

/**
 * @module EIGHT
 * @class Material
 * @implements IProgram
 */
class Material implements IProgram {
  program: WebGLProgram;
  programId: string;
  vertexShader: string;
  fragmentShader: string;
  attributes: { [name: string]: AttribLocation };
  uniforms: { [name: string]: UniformLocation };
  constructor(monitors: ContextMonitor[], name: string);
  addRef(): number;
  release(): number;
  use(canvasId: number): void;
  enableAttrib(name: string): void;
  disableAttrib(name: string): void;
  contextFree(canvasId: number): void;
  contextGain(manager: ContextManager): void;
  contextLoss(canvasId: number): void;
  uniform1f(name: string, x: number): void;
  uniform2f(name: string, x: number, y: number): void;
  uniform3f(name: string, x: number, y: number, z: number): void;
  uniform4f(name: string, x: number, y: number, z: number, w: number): void;
  uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1): void;
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2): void;
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3): void;
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4): void;
  uniformVector1(name: string, vector: Vector1): void;
  uniformVector2(name: string, vector: Vector2): void;
  uniformVector3(name: string, vector: Vector3): void;
  uniformVector4(name: string, vector: Vector4): void;
}

/**
 * @module EIGHT
 * @class Mesh
 * @implements IDrawable
 */
class Mesh<G extends Geometry, M extends IProgram, U extends UniformData> implements IDrawable {
  geometry: G;
  material: M;
  model: U;
  constructor(geometry: G, material: M, model: U);
  addRef(): number;
  release(): number;
  draw(): void;
  contextFree(): void;
  contextGain(manager: ContextManager): void;
  contextLoss(): void;
}

/**
 * @module EIGHT
 * @class MeshNormalMaterial
 * @extends Material
 */
class MeshNormalMaterial extends Material {
  /**
   * @constructor
   * @param monitors {ContextMonitor[]} The contexts that this material must support.
   */
  constructor(monitors: ContextMonitor[]);
}

} // end of module

declare module 'EIGHT'
{
  export = EIGHT;
}

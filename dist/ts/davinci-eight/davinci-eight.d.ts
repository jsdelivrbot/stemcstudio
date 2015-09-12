//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
// These declarations are appropriate when using the library through the global
// variable, 'EIGHT'.
//
declare module EIGHT {
/**
 *
 */
interface IUnknown {
  addRef(): number;
  release(): number;
}
/**
 *
 */
interface Mesh extends IUnknown {
  uuid: string;
  bind(program: ShaderProgram, aNameToKeyName?: {[name: string]: string}): void;
  draw(): void;
  unbind(): void;
}
/**
 *
 */
class Elements {
  public indices: VectorN<number>;
  public attributes: {[name: string]: ElementsAttribute};
  constructor(indices: VectorN<number>, attributes: {[name: string]: ElementsAttribute});
}
/**
 *
 */
class ElementsAttribute {
  public vector: VectorN<number>;
  public size: number;
  constructor(vector: VectorN<number>, size: number);
}
class Simplex {
  public vertices: Vertex[];
  constructor(points: VectorN<number>[]);
  public static computeFaceNormals(simplex: Simplex, name: string);
  public static indices(face: Simplex): number[];
  public static subdivide(faces: Simplex[]): Simplex[];
}
class Vertex {
  public parent: Simplex;
  public position: VectorN<number>;
  public attributes: { [name: string]: VectorN<number> };
  public index: number;
  constructor(position: VectorN<number>);
}
/**
 *
 */
function computeFaceNormals(simplex: Simplex): void;
/**
 * cube as Simplex[]
 */
function cube(size?: number): Simplex[];
/**
 * quad as Simplex[]
 */
function quad(vecs: VectorN<number>[], attributes?: { [name: string]: VectorN<number>[] }, triangles?: Simplex[]): Simplex[]
/**
 * square as Simplex[]
 */
function square(size?: number): Simplex[];
/**
 * triangle as Simplex[]
 */
function triangle(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes?: { [name: string]: VectorN<number>[] }, triangles?: Simplex[]): Simplex[];
/**
 * Simplex[] => Elements (gl.TRIANGLES) conversion.
 */
function triangles(faces: Simplex[], attribMap: { [name: string]: {name?: string; size: number} }): Elements;
/**
 * @class DrawMode
 */
enum DrawMode {
  /**
   * POINTS
   */
  POINTS,
  LINES,
  TRIANGLES
}
/**
 *
 */
function initWebGL(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes): WebGLRenderingContext;

/**
 *
 */
interface RenderingContextUser extends IUnknown {
  contextFree(): void;
  /**
   * Notification of a new WebGLRenderingContext.
   * @param context The WebGLRenderingContext.
   */
  contextGain(context: WebGLRenderingContext): void;
  /**
   * Notification that any WebGL resources cached are invalid because the WebGLContext has been lost.
   * This is a cue to rest to the initial state without attempting to dispose or free held resources.
   */
  contextLoss(): void;
}

interface DrawableVisitor {
  primitive(mesh: AttribProvider, program: ShaderProgram, model: UniformData);
}
interface RenderingContextProgramUser {
  contextFree(): void;
  contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
  contextLoss(): void;
}
interface Drawable extends RenderingContextUser {
  /**
   *
   */
  program: ShaderProgram;
  /**
   *
   */
  accept(visitor: DrawableVisitor);
}
/**
 *
 */
interface DrawList extends RenderingContextUser, UniformDataVisitor
{
  /**
   * Add a drawable to the DrawList.
   */
  add(drawable: Drawable): void;
  /**
   * Removes a drawable from the DrawList.
   */
  remove(drawable: Drawable): void;
  /**
   * Traverse the drawables in the DrawList.
   */
  traverse(callback: (value: Drawable) => void): void;
}
/**
 * Manages the lifecycle of an attribute used in a vertex shader.
 */
class AttribLocation {
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
 *
 */
class ArrayBuffer implements RenderingContextUser {
//constructor(monitor: RenderingContextMonitor);
  addRef(): number;
  release(): number;
  contextFree(): void;
  contextGain(context: WebGLRenderingContext): void;
  contextLoss(): void;
  bind(target: number);
}
/**
 *
 */
class UniformLocation implements RenderingContextProgramUser {
  constructor(monitor: RenderingContextMonitor, name: string);
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
 *
 */
class Texture implements RenderingContextUser {
  constructor();
  addRef(): number;
  release(): number;
  contextFree(): void;
  contextGain(context: WebGLRenderingContext): void;
  contextLoss(): void;
  /**
   * Binds the Texture to a target.
   * Parameters
   *   type TEXTURE_2D or TEXTURE_CUBE_MAP
   */
  bind(target: number): void;
}
/**
 *
 */
interface Mutable<T> {
  data: T;
  callback: () => T;
}
interface LinearElement<I, M> {
  add(element: I): M;
  clone(): M;
  copy(source: I): M;
  divideScalar(scalar: number): M;
  lerp(target: I, alpha: number): M;
  multiplyScalar(scalar: number): M;
}
interface GeometricElement<I, M> extends LinearElement<I, M> {
  exp(): M;
  multiply(element: I): M;
}
class Matrix1 {
  public data: Float32Array;
  constructor(data: Float32Array);
}
class Matrix2 {
  public data: Float32Array;
  constructor(data: Float32Array);
}
class Matrix3 {
  public data: Float32Array;
  constructor(data: Float32Array);
  identity(): void;
  normalFromMatrix4(matrix: Matrix4): void;
}
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
  // TODO: This should not be here (or should change API).
  static mul(a: Float32Array, b: Float32Array, out: Float32Array): Float32Array
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
  mul(matrix: Matrix4): Matrix4;
  multiplyMatrices(a: Matrix4, b: Matrix4): Matrix4;
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
interface Cartesian1 {
  x: number;
}
interface Cartesian2 {
  x: number;
  y: number;
}
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
class Vector1 extends VectorN<number> implements Cartesian1 {
  public x: number;
  constructor(data?: number[], modified?: boolean);
}
class Vector2 extends VectorN<number> implements Cartesian2 {
  public x: number;
  public y: number;
  constructor(data?: number[], modified?: boolean);
  add(v: Cartesian2): Vector2;
  addVectors(a: Cartesian2, b: Cartesian2): Vector2;
  copy(v: Cartesian2): Vector2;
  magnitude(): number;
  multiplyScalar(s: number): Vector2;
  quaditude(): number;
  set(x: number, y: number): Vector2;
  sub(v: Cartesian2): Vector2;
  subVectors(a: Cartesian2, b: Cartesian2): Vector2;
}
class Quaternion {
  public x: number;
  public y: number;
  public z: number;
  public w: number;
  public onChangeCallback: () => void;
  constructor(x?: number, y?: number, z?: number, w?: number);
  set(x: number, y: number, z: number, w: number);
  clone(): Quaternion;
  conjugate(): Quaternion;
  copy(quaternion: Quaternion): Quaternion;
  dot(v: Quaternion): number;
  inverse(): Quaternion;
  magnitude(): number;
  multiply(q: Quaternion): Quaternion;
  multiplyQuaternions(a: Quaternion, b: Quaternion): Quaternion;
  normalize(): Quaternion;
  onChange(callback: () => void): Quaternion;
  quaditude(): number;
  setFromAxisAngle(axis: Cartesian3, angle: number): Quaternion;
  setFromRotationMatrix(m: Matrix4): Quaternion;
  setFromUnitVectors(vFrom: Vector3, vTo: Vector3);
  slerp(qb: Quaternion, t: number): Quaternion;
  equals(quaternion: Quaternion);
  fromArray(array: number[], offset: number): Quaternion;
  toArray(array: number[], offset): number[];
  public static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): Quaternion;
}
interface Spinor3Coords {
  yz: number;
  zx: number;
  xy: number;
  w: number;
}
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
  toString(): string;
}
interface Cartesian3 {
  x: number;
  y: number;
  z: number;
}
class Vector3 extends VectorN<number> implements Cartesian3, LinearElement<Cartesian3, Vector3> {
  public x: number;
  public y: number;
  public z: number;
  public static e1: Vector3;
  public static e2: Vector3;
  public static e3: Vector3;
  public static copy(vector: Cartesian3): Vector3;
  constructor(data?: number[], modified?: boolean);
  add(v: Cartesian3): Vector3;
  addVectors(a: Cartesian3, b: Cartesian3): Vector3;
  applyQuaternion(q: { x: number, y: number, z: number, w: number }): Vector3;
  clone(): Vector3;
  copy(v: Cartesian3): Vector3;
  cross(v: Cartesian3): Vector3;
  crossVectors(a: Cartesian3, b: Cartesian3): Vector3;
  distanceTo(position: Cartesian3): number;
  divideScalar(s: number): Vector3;
  magnitude(): number;
  lerp(target: Cartesian3, alpha: number): Vector3;
  multiplyScalar(s: number): Vector3;
  normalize(): Vector3;
  quaditude(): number;
  quadranceTo(position: Cartesian3): number;
  set(x: number, y: number, z: number): Vector3;
  setMagnitude(magnitude: number): Vector3;
  sub(v: Cartesian3): Vector3;
  subVectors(a: Cartesian3, b: Cartesian3): Vector3;
}
interface Cartesian4 {
  x: number;
  y: number;
  z: number;
  w: number;
}
class Vector4 extends VectorN<number> implements Cartesian4 {
  public x: number;
  public y: number;
  public z: number;
  public w: number;
  constructor(data?: number[], modified?: boolean);
}
/**
 *
 */
interface UniformMetaInfo {
  /**
   * An optional override of the name that appears as the key in UniformMetaInfos.
   */
  name?: string;
  glslType: string;
}
interface UniformMetaInfos {
  [name: string]: UniformMetaInfo
}

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

interface UniformData {
  accept(visitor: UniformDataVisitor);
}
/**
 * Provides the runtime and design time data required to use a uniform in a vertex shader.
 */
interface UniformProvider extends UniformData {
  getUniformMeta(): UniformMetaInfos;
}
/**
 *
 */
class DefaultAttribProvider implements AttribProvider {
  public drawMode: DrawMode;
  public dynamic: boolean;
  constructor();
  draw(): void;
  update(): void;
  getAttribMeta(): AttribMetaInfos;
}
/**
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
interface AttribDataInfo {

}
interface AttribDataInfos {
  [name: string]: AttribDataInfo;
}
interface AttribMetaInfo {
  glslType: string,
  size: number,
  /**
   * An optional override of the name that appers as the key in AttributeMetaInfos.
   */
  name?: string,
  type?: number,
  normalized?: boolean,
  stride?: number,
  offset?: number
}
interface AttribMetaInfos {
  [name: string]: AttribMetaInfo;
}
/**
 * The generator of calls to drawArrays or drawElements and a source of attribute data.
 * This interface must be implemented in order to define a mesh.
 */
interface AttribProvider extends RenderingContextUser
{
  draw(): void;
  /**
   * Determines how the thing will be drawn.
   */
  drawMode: DrawMode;
  /**
   * Determines whether this geometry changes. If so, update may be called repeatedly.
   */
  dynamic: boolean;
  /**
   * Provides the data information corresponsing to provided attribute values. 
   * @method getAttribData
   * @return {AttribDataInfos} The data information corresponding to all attributes supported.
   */
  getAttribData(): AttribDataInfos;
  /**
   * Declares the vertex shader attributes the geometry can supply and information required for binding.
   */
  getAttribMeta(): AttribMetaInfos;
  /**
   * Notifies the mesh that it should update its array buffers.
   */
  update(): void;
}
class Face3 {
  public a: number;
  public b: number;
  public c: number;
  public vertexNormals: Cartesian3[];
  constructor(a: number, b: number, c: number, vertexNormals?: Cartesian3[]);
}
class Sphere {
  public center: Cartesian3;
  public radius: number;
  constructor(center?: Cartesian3, radius?: number);
  setFromPoints(points: Cartesian3[]);
}
/**
 * Base class for geometries.
 * A geometry holds faces and vertices used to describe a 3D mesh.
 */
class Geometry3 {
  public vertices: Cartesian3[];
  public faces: Face3[];
  public faceVertexUvs: Cartesian2[][][];
  public dynamic: boolean;
  public verticesNeedUpdate: boolean;
  public elementsNeedUpdate: boolean;
  public uvsNeedUpdate: boolean;
  constructor();
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
}
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
class GeometryAdapter implements AttribProvider
{
  drawMode: DrawMode;
  dynamic: boolean;
  constructor(monitor: RenderingContextMonitor, geometry: Geometry3, options?: {drawMode?: DrawMode});
  draw(): void;
  getAttribData(): AttribDataInfos;
  getAttribMeta(): AttribMetaInfos;
  update(): void;
  addRef(): number;
  release(): number;
  contextFree(): void;
  contextGain(context: WebGLRenderingContext): void;
  contextLoss(): void;
}
class BarnGeometry extends Geometry3 {
  constructor();
}
class BoxGeometry extends Geometry3 {
  constructor(
    width: number,
    height: number,
    depth: number,
    widthSegments?:number,
    heightSegments?:number,
    depthSegments?:number);
}
class CylinderGeometry extends Geometry3 {
  constructor(
    radiusTop?: number,
    radiusBottom?: number,
    height?: number,
    radialSegments?: number,
    heightSegments?: number,
    openEnded?: boolean,
    thetaStart?: number,
    thetaLength?: number);
}
class EllipticalCylinderGeometry extends Geometry3 {
  constructor();
}
/**
 * A vertex shader and a fragment shader combined into a program.
 */
interface ShaderProgram extends RenderingContextUser, UniformDataVisitor
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
   * Makes the ShaderProgram the current program for WebGL.
   * @method use
   */
  use(): ShaderProgram;
  /**
   * Sets the attributes provided into the appropriate locations.
   */
  setAttributes(values: AttribDataInfos);
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
 *
 */
interface Composite<M> extends Drawable {
  model: M;
}
/**
 * The combination of a geometry, model and a program.
 */
interface Primitive<MESH extends AttribProvider, MODEL extends UniformData> extends Composite<MODEL>
{
  mesh: MESH;
}
interface Renderer extends RenderingContextUser
{
  /**
   * The (readonly) cached WebGLRenderingContext. The context may sometimes be undefined.
   */
  context: WebGLRenderingContext;
  /**
   * Defines whether the renderer should automatically clear its output before rendering.
   */
  autoClear: boolean;
  /**
   * Specify the clear values for the color buffers.
   */
  clearColor(red: number, green: number, blue: number, alpha: number): void;
  /**
   * Render the contents of the drawList.
   * This is a convenience method that calls clear and then traverses the DrawList calling draw on each Drawable.
   */
  render(drawList: DrawList): void;
}
interface RendererParameters {
}
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
interface Workbench3D
{
  setUp(): void;
  tearDown(): void;
}
/**
 * Constructs and returns a DrawList.
 */
function scene(): DrawList;
/**
 * Constructs and returns a Frustum.
 */
function frustum(left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number): Frustum;
/**
 * Computes a frustum matrix.
 */
function frustumMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number, matrix?: Float32Array): Float32Array;
/**
 * Constructs and returns a Perspective.
 */
function perspective(options?: {fov?: number; aspect?: number; near?: number; far?: number; projectionMatrixName?: string; viewMatrixName?: string}): Perspective;
/**
 * Computes a perspective matrix.
 */
function perspectiveMatrix(fov: number, aspect: number, near: number, far: number, matrix?: Matrix4): Matrix4;
/**
 * Constructs and returns a View.
 */
function view(): View;
/**
 * Computes a view matrix.
 */
function viewMatrix(eye: Cartesian3, look: Cartesian3, up: Cartesian3, matrix?: Matrix4): Matrix4;
/**
 * Constructs and returns a Renderer.
 * @param options Optional parameters for modifying the WebGL context.
 */
function renderer(canvas: HTMLCanvasElement, options?: RendererParameters): Renderer;
/**
 * Constructs a ShaderProgram from the specified vertex and fragment shader codes.
 */
function shaderProgram(monitor: RenderingContextMonitor, vertexShader: string, fragmentShader: string, attribs?: string[]): ShaderProgram;
/**
 * Constructs a ShaderProgram from the specified vertex and fragment shader script element identifiers.
 */
function programFromScripts(monitor: RenderingContextMonitor, vsId: string, fsId: string, $document: Document, attribs?: string[]): ShaderProgram;
/**
 * Constructs a ShaderProgram by introspecting a geometry.
 */
function smartProgram(monitor: RenderingContextMonitor, attributes: AttribMetaInfos, uniformsList: UniformMetaInfos[], attribs?: string[]): ShaderProgram;
/**
 * Constructs a Drawable from the specified attribute provider and program.
 * @param geometry
 * @param shaderProgram
 */
function primitive<MESH extends AttribProvider, MODEL extends UniformData>(attributes: MESH, program: ShaderProgram, uniforms: MODEL): Primitive<MESH, MODEL>;
/**
 *
 */
interface ArrowOptions {
  axis?: Cartesian3;
  flavor?: number;
  coneHeight?: number;
  wireFrame?: boolean;
}
/**
 *
 */
class ArrowBuilder {
  axis: Cartesian3;
  flavor: number;
  coneHeight: number;
  wireFrame: boolean;
  constructor(options?: ArrowOptions);
  setAxis(axis: Cartesian3): ArrowBuilder;
  setFlavor(flavor: number): ArrowBuilder;
  setConeHeight(coneHeight: number): ArrowBuilder;
  setWireFrame(wireFrame: boolean): ArrowBuilder;
  buildMesh(monitor: RenderingContextMonitor): AttribProvider;
}
/**
 * Constructs and returns an arrow mesh.
 */
function arrowMesh(monitor: RenderingContextMonitor, options?: ArrowOptions): AttribProvider;
/**
 *
 */
interface BoxOptions {
  width?: number;
  height?: number;
  number?: number;
  widthSegments?: number;
  heightSegments?: number;
  numberSegments?: number;
  wireFrame?: boolean;
  positionVarName?: string;
  normalVarName?: string;
}
/**
 *
 */
class BoxBuilder {
  width: number;
  height: number;
  number: number;
  widthSegments: number;
  heightSegments: number;
  numberSegments: number;
  wireFrame: boolean;
  positionVarName: string;
  constructor(options?: BoxOptions);
  setWidth(width: number): BoxBuilder;
  setHeight(height: number): BoxBuilder;
  setDepth(depth: number): BoxBuilder;
  setWidthSegments(widthSegments: number): BoxBuilder;
  setHeightSegments(heightSegments: number): BoxBuilder;
  setDepthSegments(depthSegments: number): BoxBuilder;
  setWireFrame(wireFrame: boolean): BoxBuilder;
  setPositionVarName(positionVarName: string): BoxBuilder;
  buildMesh(monitor: RenderingContextMonitor): AttribProvider;
}
/**
 * Constructs and returns a box mesh.
 */
function boxMesh(monitor: RenderingContextMonitor, options?: BoxOptions): AttribProvider;
/**
 *
 */
interface CylinderOptions {
  radiusTop?: number;
  radiusBottom?: number;
  height?: number;
}
/**
 *
 */
class CylinderArgs {
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments: number;
  heightSegments: number;
  openEnded: boolean;
  wireFrame: boolean;
  constructor(options?: CylinderOptions);
  setRadiusTop(radiusTop: number): CylinderArgs;
  setRadiusBottom(radiusBottom: number): CylinderArgs;
  setHeight(height: number): CylinderArgs;
  setRadialSegments(radialSegments: number): CylinderArgs;
  setHeightSegments(heightSegments: number): CylinderArgs;
  setOpenEnded(openEnded: boolean): CylinderArgs;
  setThetaStart(thetaStart: number): CylinderArgs;
  setThetaLength(thetaLength: number): CylinderArgs;
  setWireFrame(wireFrame: boolean): CylinderArgs;
}
/**
 *
 */
class CylinderMeshBuilder extends CylinderArgs {
  constructor(options?: CylinderOptions);
  setRadiusTop(radiusTop: number): CylinderMeshBuilder;
  setRadiusBottom(radiusBottom: number): CylinderMeshBuilder;
  setHeight(height: number): CylinderMeshBuilder;
  setRadialSegments(radialSegments: number): CylinderMeshBuilder;
  setHeightSegments(heightSegments: number): CylinderMeshBuilder;
  setOpenEnded(openEnded: boolean): CylinderMeshBuilder;
  setThetaStart(thetaStart: number): CylinderMeshBuilder;
  setThetaLength(thetaLength: number): CylinderMeshBuilder;
  setWireFrame(wireFrame: boolean): CylinderMeshBuilder;
  buildMesh(monitor: RenderingContextMonitor): AttribProvider;
}
/**
 * Constructs and returns a cylinder mesh.
 */
function cylinderMesh(monitor: RenderingContextMonitor, options?: CylinderOptions): AttribProvider;
/**
 *
 */
interface SphereOptions {
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  phiStart?: number;
  phiLength?: number;
  thetaStart?: number;
  thetaLength?: number;
  wireFrame?: boolean;
}
/**
 *
 */
class SphereBuilder {
  radius: number;
  widthSegments: number;
  heightSegments: number;
  phiStart: number;
  phiLength: number;
  thetaStart: number;
  thetaLength: number;
  wireFrame: boolean;
  constructor(options?: SphereOptions);
  setRadius(radius: number): SphereBuilder;
  setWidthSegments(widthSegments: number): SphereBuilder;
  setHeightSegments(heightSegments: number): SphereBuilder;
  setPhiStart(phiStart: number): SphereBuilder;
  setPhiLength(phiLength: number): SphereBuilder;
  setThetaStart(phiStart: number): SphereBuilder;
  setThetaLength(phiLength: number): SphereBuilder;
  setWireFrame(wireFrame: boolean): SphereBuilder;
  buildMesh(monitor: RenderingContextMonitor): AttribProvider;
}
/**
 * Constructs and returns an vortex mesh.
 */
function sphereMesh(monitor: RenderingContextMonitor, options?: SphereOptions): AttribProvider;
/**
 * Constructs and returns an vortex mesh.
 */
function vortexMesh(monitor: RenderingContextMonitor, options?: {wireFrame?: boolean}): AttribProvider;
/**
 *
 */
interface CuboidMesh extends AttribProvider {
  /**
   * The axis corresponding to e1.
   */
  a: Vector3;
  /**
   * The axis corresponding to e2.
   */
  b: Vector3;
  /**
   * The axis corresponding to e3.
   */
  c: Vector3;
  /**
   * The color of the cuboid.
   */
  color: Color;
  /**
   * The cuboid should be rendered using a gray scale.
   */
  grayScale: boolean;
}
/**
 * Constructs and returns a cuboid mesh.
 */
function cuboid(spec?: {
  position?:{
    name?:string
  },
  color?:{
    name?:string,
    value?:Color
  }
  normal?:{
    name?:string
  }
}): CuboidMesh;
/**
 * A surface generated by the parametric equation:
 * a * cos(phi) * sin(theta) + b * cos(theta) + c * sin(phi) * sin(theta),
 * where phi and theta are the conventional spherical coordinates.
 */
interface EllipsoidMesh extends AttribProvider {
  /**
   * The axis corresponding to (theta, phi) = (PI/2,0).
   */
  a: Vector3;
  /**
   * The axis corresponding to theta = 0.
   */
  b: Vector3;
  /**
   * The axis corresponding to (theta, phi) = (PI/2,PI/2).
   */
  c: Vector3;
  /**
   * The number of segments in the theta parameter.
   */
  thetaSegments: number;
  /**
   * The theta starting angle in radians.
   */
  thetaStart: number;
  /**
   * The theta sweep angle in radians.
   */
  thetaLength: number;
  /**
   * The number of segments in the phi parameter.
   */
  phiSegments: number;
  /**
   * The phi starting angle in radians.
   */
  phiStart: number;
  /**
   * The phi sweep angle in radians.
   */
  phiLength: number;
}
class ArrowGeometry extends Geometry3 {
  constructor();
}
class VortexGeometry extends Geometry3 {
  constructor();
}
class PolyhedronGeometry extends Geometry3 {
  constructor(vertices: number[], indices: number[], radius?:  number, detail?: number);
}
class DodecahedronGeometry extends PolyhedronGeometry {
  constructor(radius?: number, detail?: number);
}
class IcosahedronGeometry extends PolyhedronGeometry {
  constructor(radius?: number, detail?: number);
}
class KleinBottleGeometry extends SurfaceGeometry {
  constructor(uSegments: number, vSegments: number);
}
class MobiusStripGeometry extends SurfaceGeometry {
  constructor(uSegments: number, vSegments: number);
}
class OctahedronGeometry extends PolyhedronGeometry {
  constructor(radius?: number, detail?: number);
}
class SurfaceGeometry extends Geometry3 {
  /**
   * Constructs a parametric surface geometry from a function.
   * parametricFunction The function that determines a 3D point corresponding to the two parameters.
   * uSegments The number of segments for the u parameter.
   * vSegments The number of segments for the v parameter.
   */
  constructor(parametricFunction: (u: number, v: number) => Cartesian3, uSegments: number, vSegments: number);
}
class SphereGeometry extends Geometry3 {
  constructor(
    radius?: number,
    widthSegments?: number,
    heightSegments?: number,
    phiStart?: number,
    phiLength?: number,
    thetaStart?: number,
    thetaLength?: number);
}
class TetrahedronGeometry extends PolyhedronGeometry {
  constructor(radius?: number, detail?: number);
}
class TubeGeometry extends Geometry3 {
  constructor(
    path: Curve,
    segments?: number,
    radius?: number,
    radialSegments?: number,
    closed?: boolean,
    taper?: (u: number)=>number);
}
/**
 * Constructs and returns an ellipsoid mesh.
 */
function ellipsoid(): EllipsoidMesh;
/**
 * Constructs and returns a prism mesh.
 */
function prism(): AttribProvider;
/**
 *
 */
class Curve {
  constructor();
}
/**
 * Constructs and returns a new Workbench3D.
 */
function workbench(canvas: HTMLCanvasElement, viewport: Viewport, view: View, window: Window): Workbench3D;
/**
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
 *
 */
interface RenderingContextMonitor extends IUnknown
{
  /**
   * Starts the monitoring of the WebGL context.
   */
  start(): RenderingContextMonitor;
  /**
   * Stops the monitoring of the WebGL context.
   */
  stop(): RenderingContextMonitor;
  /**
   *
   */
  addContextUser(user: RenderingContextUser): RenderingContextMonitor;
  /**
   *
   */
  removeContextUser(user: RenderingContextUser): RenderingContextMonitor;
  /**
   *
   */
  clearColor(red: number, green: number, blue: number, alpha: number): void;
  /**
   *
   */
  clearDepth(depth: number): void;
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
   * Creates a new Texture instance.
   * Images may be bound to a Texture.
   * and adds it as a context user to the monitor.
   */
  texture(): Texture;
  /**
   * Creates a new ArrayBuffer instance.
   */
  vertexBuffer(): ArrayBuffer;
  /**
   * Determines whether the framework mirrors the WebGL state machine in order to optimize redundant calls.
   */
  mirror: boolean;
  /**
   *
   */
  createMesh(elements: Elements, mode: number, usage?: number): Mesh;
}
/**
 * Constructs and returns a RenderingContextMonitor.
 */
function webgl(
  canvas: HTMLCanvasElement,
  attributes?: {
    alpha?: boolean,
    antialias?: boolean,
    depth?: boolean,
    premultipliedAlpha?: boolean,
    preserveDrawingBuffer?: boolean,
    stencil?: boolean
  }
  ): RenderingContextMonitor;
/**
 *
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
 * The version string of the davinci-eight module.
 */
var VERSION: string;
/**
 *
 */
function refChange(uuid: string, change: number, name: string): void;

}

declare module 'EIGHT'
{
  export = EIGHT;
}

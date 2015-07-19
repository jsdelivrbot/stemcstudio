//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
// These declarations are appropriate when using the library through the global
// variable, 'EIGHT'.
//
declare module EIGHT
{
  /**
   *
   */
  class RenderingContextUser {
    /**
     * Notify the target that it is no longer required, and request to free, dispose, or delete any WebGL resources acquired and owned by the target.
     */
    contextFree(): void;
    /**
     * Notification of a new WebGLRenderingContext.
     * @param context The WebGLRenderingContext.
     * @param contextId A unique identifier used to distinguish the context.
     */
    contextGain(context: WebGLRenderingContext, contextGainId: string): void;
    /**
     * Notification that any WebGL resources cached are invalid because the WebGLContext has been lost.
     * This is a cue to rest to the initial state without attempting to dispose or free held resources.
     */
    contextLoss(): void;
    /**
     * Determines whether this context user has a valid WebGLRenderingContext.
     */
    hasContext(): boolean;
  }
  class Drawable extends RenderingContextUser {
    drawGroupName: string;
    useProgram();
    draw(view: VertexUniformProvider);
  }
  class World extends RenderingContextUser
  {
    drawGroups: {[drawGroupName:string]: Drawable[]},
    /**
     * Add a drawable to the root node of the world.
     */
    add(drawable: Drawable): void;
  }
  /**
   * Manages the lifecycle of an attribute used in a vertex shader.
   */
  class ShaderAttributeVariable {
    constructor(name: string, size: number, normalized?: boolean, stride?: number, offset?: number) {
    }
    contextFree();
    contextGain(context: WebGLRenderingContext, program: WebGLProgram);
    contextLoss();
    enable();
    disable();
    bind();
    bufferData(data: VertexAttributeProvider);
  }
  class ShaderUniformVariable {
    constructor(name: string, type: string);
    contextFree();
    contextGain(context: WebGLRenderingContext, program: WebGLProgram);
    contextLoss();
    vec3(v: Vector3);
    mat3(transpose: boolean, matrix: Float32Array);
    mat4(transpose: boolean, matrix: Float32Array);
  }
  class Matrix3 {
    public elements: number[];
    constructor();
    identity(): void;
    normalFromMatrix4(matrix: Matrix4): void;
  }
  class Matrix4 {
    public elements: number[];
    constructor();
    identity(): void;
    mul(matrix: Matrix4): void;
    translate(position: { x: number, y: number, z: number }): void;
    rotate(rotation: { yz: number, zx: number, xy: number, w: number }): void;
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number);
  }
  interface Spinor3Coords {
    yz: number;
    zx: number;
    xy: number;
    w: number;
  }
  class Spinor3 implements Spinor3Coords {
    public yz: number;
    public zx: number;
    public xy: number;
    public w: number;
    constructor(spinor?: { yz: number, zx: number, xy: number, w: number });
    clone(): Spinor3;
    toString(): string;
  }
  interface Cartesian3 {
    x: number;
    y: number;
    z: number;
  }
  class Vector3 implements Cartesian3 {
    public x: number;
    public y: number;
    public z: number;
    public static e1: Vector3;
    public static e2: Vector3;
    public static e3: Vector3;
    constructor(vector?: { x: number, y: number, z: number });
    multiplyScalar(s: number): Vector3;
    clone(): Vector3;
    normalize(): Vector3;
  }
  /**
   *
   */
  interface UniformMetaInfo {
    name: string;
    type: string;
  }
  interface UniformMetaInfos {
    [property: string]: UniformMetaInfo
  }
  /**
   * Provides the runtime and design time data required to use a uniform in a vertex shader.
   */
  class VertexUniformProvider {
    getUniformVector3(name: string): Vector3;
    getUniformMatrix3(name: string): { transpose: boolean; matrix3: Float32Array };
    getUniformMatrix4(name: string): { transpose: boolean; matrix4: Float32Array };
    getUniformMetaInfos(): UniformMetaInfos;
  }
  /**
   *
   */
  class AmbientLight extends VertexUniformProvider {
    constructor(color: Color);
  }
  /**
   *
   */
  class ChainedVertexUniformProvider extends VertexUniformProvider {
    constructor(one: VertexUniformProvider, two: VertexUniformProvider);
  }
  /**
   *
   */
  class View extends VertexUniformProvider {
    eye: Cartesian3;
    look: Cartesian3;
    up: Cartesian3;
  }
  class Frustum extends View {
    left: number;
    right: number;
    bottom: number;
    top: number;
    near: number;
    far: number;
  }
  /**
   * A transformation from the 3D world to the canonical view volume.
   * The canonical view volume is the cube that extends from -1 to +1
   * in all cartesian directions. 
   */
  class LinearPerspectiveCamera extends View {
    fov: number;
    aspect: number;
    near: number;
    far: number;
  }
  interface AttributeMetaInfo {
    name: string,
    type: string,
    size: number,
    normalized: boolean,
    stride: number,
    offset: number
  }
  interface AttributeMetaInfos {
    [property: string]: AttributeMetaInfo;
  }
  /**
   * A Geometry is the generator of calls to drawArrays or drawElements.
   */
  class VertexAttributeProvider
  {
    draw(context: WebGLRenderingContext): void;
    /**
     * Determines how the thing will be drawn.
     * 0 <=> POINTS, 1 <=> LINES, 2 <=> TRIANGLES
     */
    drawMode: number;
    /**
     * Determines whether this Geometry changes. If so, update may be called repeatedly.
     */
    dynamics(): boolean;
    /**
     * Declares the vertex shader attributes the geometry can supply and information required for binding.
     */
    getAttributeMetaInfos(): AttributeMetaInfos;
    /**
     * Determines whether this Geometry uses WebGL's drawElements() for rendering.
     */
    hasElements(): boolean;
    /**
     * Returns the elements used in an index buffer implementation.
     * An implementation of Geometry is not required to support index buffers and may return undefined.
     */
    getElements(): Uint16Array;
    /**
     * Returns the data when drawing using arrays. 
     */
    getVertexAttributeData(name: string): Float32Array;
    /**
     * Notifies the mesh that it should update its array buffers.
     */
    update(attributes: ShaderVariableDecl[]): void;
  }
  class Face3 {
    constructor(a: number, b: number, c: number);
  }
  /**
   * Base class for geometries.
   * A geometry holds all data necessary to describe a 3D model.
   */
  class Geometry {
    /**
     * Set to true if the faces array has been updated.
     */
    public elementsNeedUpdate: boolean;
    /**
     * Array of vertices.
     * The array of vertices holds every position of points in the model.
     * To signal an update in this array, Geometry.verticesNeedUpdate needs to be set to true.
     */
    public vertices: Vector3[];
    /**
     * Set to true if the vertices array has been updated.
     */
    public verticesNeedUpdate: boolean;
    /**
     * Array of triangles.
     * The array of faces describe how each vertex in the model is connected with each other.
     * To signal an update in this array, Geometry.elementsNeedUpdate needs to be set to true.
     */
    public faces: Face3[];
    /**
     * The constructor takes no arguments.
     */
    constructor();
    computeBoundingSphere(): void;
  }
  class Color
  {
    public red: number;
    public green: number;
    public blue: number;
    public alpha: number;
    constructor(red: number, green: number, blue: number, alpha?: number);
  }
  class GeometryAdapter extends VertexAttributeProvider
  {
    public color: Color;
    constructor(geometry: Geometry, options? {drawMode?: number});
  }
  class CurveGeometry extends VertexAttributeProvider {
    constructor(
      n: number,
      generator: (i: number, time: number) => {x: number; y: number; z: number});
  }
  class LatticeVertexAttributeProvider extends VertexAttributeProvider {
    constructor(
      I: number,
      J: number,
      K: number,
      generator: (i: number, j: number, k: number, time: number) => { x: number; y: number; z: number });
  }
  class BoxGeometry extends Geometry {
    constructor(
      width: number,
      height: number,
      depth: number,
      widthSegments?:number,
      heightSegments?:number,
      depthSegments?:number);
  }
  class CylinderGeometry extends Geometry {
    constructor(
      radiusTop?: number,
      radiusBottom?: number,
      height?: number,
      radialSegments?: number,
      heightSegments?: number,
      openEnded?: boolean,
      thetaStart?: number,
      thetaLength?: number):
  }
  class RGBGeometry extends VertexAttributeProvider {
    constructor();
  }
  /**
   * A vertex shader and a fragment shader combined into a program.
   */
  class ShaderProgram extends RenderingContextUser
  {
    attributes: {modifiers: string[], type: string, name: string}[];
    uniforms: {modifiers: string[], type: string, name: string}[];
    varyings: {modifiers: string[], type: string, name: string}[];
    program: WebGLProgram;
    programId: string;
    vertexShader: string;
    fragmentShader: string;
  }
  /**
   * The combination of a geometry, model and a shaderProgram.
   */
  class DrawableModel<G, M extends VertexUniformProvider, P extends ShaderProgram> extends Drawable
  {
    mesh: G;
    model: M
    shaderProgram: P;
  }
  interface RenderingContextMonitor
  {
    /**
     * Starts the monitoring of the WebGL context.
     */
    start(context: WebGLRenderingContext): void;
    /**
     * Stops the monitoring of the WebGL context.
     */
    stop(): void;
  }
  class Renderer
  {
    domElement: HTMLCanvasElement;
    context: WebGLRenderingContext;
    contextFree(): void;
    contextGain(gl: WebGLRenderingContext, contextGainId: string): void;
    contextLoss(): void;
    render(world: World, views: VertexUniformProvider[]): void;
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    setSize(width: number, height: number): void;
  }
  class WebGLRenderer extends Renderer {
    setClearColor(color: number, alpha?: number): void;
  }
  interface RendererParameters {
    alpha?: boolean;
    antialias?: boolean;
    canvas?: HTMLCanvasElement;
    depth?: boolean;
    premultipliedAlpha?: boolean;
    preserveDrawingBuffer?: boolean;
    stencil?: boolean;
  }
  interface WindowAnimationRunner
  {
    start(): void;
    stop(): void;
    reset(): void;
    lap(): void;
    time(): number;
    isRunning: boolean;
    isPaused: boolean;
  }
  interface Workbench3D
  {
    setUp(): void;
    tearDown(): void;
  }
  /**
   * Constructs and returns a World.
   */
  function world(): World;
  function view(): View;
  /**
   * Constructs and returns a LinearPerspectiveCamera.
   */
  function frustum(
    left?: number,
    right?: number,
    bottom?: number,
    top?: number,
    near?: number,
    far?: number): Frustum;
  function perspective(
    /**
     * The field of view angle in the y-direction, measured in radians.
     */
    fov?: number,
    aspect?: number,
    near?: number,
    far?: number): LinearPerspectiveCamera;
  /**
   * Constructs and returns a WebGL renderer.
   * @param parameters Optional parameters for modifying the WebGL context.
   */
  function renderer(parameters?: RendererParameters): Renderer;
  /**
   * Constructs a ShaderProgram from the specified shader codes.
   */
  function pointsProgram(): ShaderProgram;
  /**
   * Constructs a ShaderProgram from the specified vertex and fragment shader codes.
   */
  function shaderProgram(vertexShader: string, fragmentShader: string): ShaderProgram;
  /**
   * Constructs a ShaderProgram by introspecting a Geometry.
   */
  function smartProgram(attributes: AttributeMetaInfos, uniformsList: UniformMetaInfos[]): ShaderProgram;
  /**
   * Constructs a Drawable from the specified attribute provider and program.
   * @param geometry
   * @param shaderProgram
   */
  function drawableModel<G extends VertexAttributeProvider, M extends VertexUniformProvider, P extends ShaderProgram>(geometry: G, model: M, shaderProgram: P): DrawableModel<G, M, P>;
  /**
   *
   */
  class Model extends VertexUniformProvider {
    public position: Cartesian3;
    public attitude: Spinor3Coords;
    constructor();
  }
  /**
   * Constructs and returns a box mesh.
   */
  function box(): VertexAttributeProvider;
  /**
   *
   */
  interface CuboidVertexAttributeProvider extends VertexAttributeProvider {
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
  }): CuboidVertexAttributeProvider;
  /**
   * A surface generated by the parametric equation:
   * a * cos(phi) * sin(theta) + b * cos(theta) + c * sin(phi) * sin(theta),
   * where phi and theta are the conventional spherical coordinates.
   */
  interface EllipsoidGeometry extends VertexAttributeProvider {
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
  class ArrowGeometry extends Geometry {
    constructor();
  }
  class VortexGeometry extends Geometry {
    constructor();
  }
  class PolyhedronGeometry extends Geometry {
    constructor(vertices: number[], indices: number[], radius?:  number, detail?: number);
  }
  class DodecahedronGeometry extends PolyhedronGeometry {
    constructor(radius?: number, detail?: number);
  }
  class IcosahedronGeometry extends PolyhedronGeometry {
    constructor(radius?: number, detail?: number);
  }
  class KleinBottleGeometry extends ParametricGeometry {
    constructor(uSegments: number, vSegments: number);
  }
  class MobiusStripGeometry extends ParametricGeometry {
    constructor(uSegments: number, vSegments: number);
  }
  class OctahedronGeometry extends PolyhedronGeometry {
    constructor(radius?: number, detail?: number);
  }
  class ParametricGeometry extends Geometry {
    constructor(parametricFunction: (u: number, v: number) => Vector3, uSegments: number, vSegments: number);
  }
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
  class TetrahedronGeometry extends PolyhedronGeometry {
    constructor(radius?: number, detail?: number);
  }
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
   * Constructs and returns an ellipsoid mesh.
   */
  function ellipsoid(): EllipsoidGeometry;
  /**
   * Constructs and returns a prism mesh.
   */
  function prism(): VertexAttributeProvider;
  /**
   *
   */
  class Curve() {
  }
  /**
   * Constructs and returns a new Workbench3D.
   */
  function workbench(canvas: HTMLCanvasElement, renderer: Renderer, view: View, window: Window): Workbench3D;
  /**
   * Constructs and returns a WindowAnimationRunner.
   */
  function animationRunner(tick: {(time: number): void;}, terminate: {(time: number): boolean;}, setUp: {(): void;}, tearDown: {(e: Error): void;}, window: Window): WindowAnimationRunner;
  /**
   * Constructs and returns a RenderingContextMonitor.
   */
  function contextMonitor(
    canvas: HTMLCanvasElement,
    contextFree: {(): void;},
    contextGain: {(context: WebGLRenderingContext, contextGainId: string): void;},
    contextLoss: {(): void;}
    ): RenderingContextMonitor;

  /**
   * The version string of the davinci-eight module.
   */
  var VERSION: string;
}

declare module 'EIGHT'
{
  export = EIGHT;
}

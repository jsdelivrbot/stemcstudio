// Type definitions for MathBox 1.0.0
// Project: N/A
// Definitions by: David Holmes <http://github.com/mathdoodle>

/**
 * Functional constructor for MathBox.
 */
declare var mathBox: (options: {
    cameraControls: boolean;
    cursor: boolean;
    controlClass;
    elementResize: boolean;
    fullscreen: boolean;
    screenshot: boolean;
    stats: boolean;
    scale: number;
}) => MathBox.IMathBox;

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////
/**
 * The mathbox module
 */
declare module MathBox {

  class Director {
    constructor(mathbox: IStage, script: {}[][][]) {
    }
    forward(): void;
    back(): void;
  }

  interface IMathBox {
    /**
     */
    start(): IStage;
  }

  interface IStage {
    /**
     *
     */
    animate(selector: string, options: {orbit?: number, phi?: number, offset?: number[]}, animate: {delay?: number, duration?: number}): void;
    /**
     * Adds an axis primitive to the scene.
     *
     * Parameters:
     *   axis
     *   offset
     *   n
     *   ticks
     *   tickUnit
     *   tickScale
     *   arrow
     *     Whether to include an arrow on the axis. Defaults to true.
     *   size
     *     Size of the arrow relative to the stage. Defaults to 0.07
     */
    axis(options: {id: string, axis: number, color: number, ticks: number, lineWidth: number, size?: number, labels?: boolean, distance?: number, arrow?: boolean, offset?: number[]}): IStage;
    /**
     *
     */
    bezier(): IStage;
    /**
     *
     */
    bezierSurface(): IStage;
    /**
     * Parameters:
     *   orbit
     *     Distance from the center. Default is 3.5.
     *   phi
     *     Longitude angle in XZ, in radians, relative to 0 degrees on the X axis. Default is a quarter turn.
     *   theta
     *     Latitude angle towayds Y, in radians, relative to the XZ plane. Default is 0.
     *   lookAt
     *     Point of focus in space. Default is [0, 0, 0].
     */
    camera(options: {orbit?: number, phi?: number, theta?: number, lookAt?: number[]}): IStage;
    /**
     * Adds a Curve primitive to the scene.
     *
     * Parameters:
     *   n
     *     Number of points. Default is 64.
     *   color
     *
     *   domain
     *     Input domain. Default is [0, 1]
     *   data
     *     Array of data points, each an array of 2 or 3 elements. Default is null.
     *   expression
     *   points
     *     Whether to draw points. Default is false.
     *   line
     *     Whether to draw lines. Default is true.
     *   lineWidth
     */
    curve(options: {n:number, domain?: number[], data?: number[][], color?: number, lineWidth?: number}): IStage;
    /**
     * Adds a Grid primitive to the scene.
     *
     * Parameters:
     *   axis
     *   offset
     *   show
     *   n
     *   ticks
     *   tickUnit
     *   tickScale
     */
    grid(options: {axis?: number[], color?: number, lineWidth?: number, offset?: number[]}): IStage;
    /**
     *
     */
    set(selector: string, options): IStage;
    /**
     * Adds a Surface primitive to the scene.
     *
     * Parameters:
     *   n
     *   domain
     *   data
     *   expression
     *   points
     *   line
     *     Whether to draw wireframe lines. Default is false.
     *   mesh
     *     Whether to draw a solid mesh. Default is true.
     *   doubleSided
     *   flipSided
     *     Whether to flip a single sided mesh. Default is false.
     *   shaded
     *     Whether to shade the surface. Default is true.
     *
     * Syntax:
     * .surface({
     *   n: [ 64, 64 ],                         // Number of points in each direction
     *   domain: [[0, 1], [0, 1]],              // X/Y Input domain
     *   data: null,                            // Array of array of data points, each an array of 2 or 3 elements
     *   expression: function (x, y, i, j) {    // Live expression for data points.
     *     return 0;                            // Return single value or array of 2/3 elements.
     *   },
     *   points: false,                         // Whether to draw points
     *   line: false,                           // Whether to draw wireframe lines
     *   mesh: true,                            // Whether to draw a solid mesh
     *   doubleSided: true,                     // Whether the mesh is double sided
     *   flipSided: false,                      // Whether to flip a single sided mesh
     *   shaded: true,                          // Whether to shade the surface
     * })
     */
    surface(options: {shaded?: boolean, domain?: number[][], n?: number[], expression?: (x: number, y: number) => number[], color?: number, opacity?: number}): IStage;
    /**
     */
    transition(duration : number): IStage;
    /**
     * Adds a Vector primitive to the scene.
     *
     * Parameters:
     *   n
     *     Number of vectors. Default is 1.
     *   data
     *     Array of alternating start and end points, each an array of 2 or 3 elements. Default is null.
     *   expression
     *     Live expression for start/end points. Default is function returning 0.
     *   line
     *     Whether to draw vector lines. Default is true.
     *   arrow
     *     Whether to draw arrow heads. Default is true.
     *   size
     *     Size of the arrowhead relative to the stage. Default is 0.07.
     */
    vector(options: {n?: number, data?: number[][], expression?: (i, end) => number[], line?: boolean, arrow?: boolean, size?: number}): IStage;
    /**
     * Defines a specific mathematical coordinate frame.
     *
     * Parameters:
     *   type
     *     'cartesian' | 'projective' | 'polar' | 'sphere'
     *   polar
     *   range
     *   scale
     *     Scale in X, Y, Z
     *   projective
     */
    viewport(options: {type: string, polar?: number, range?: number[][], scale?: number[], projective?: number[][]}): IStage;
    /**
     *
     */
    world(): IWorld;
  }

  interface IWorld {
    /**
     *
     */
    loop(): ILoop;
  }

  interface ILoop {
    /**
     *
     */
    hookPreRender(callback: () => void): void;
  }
}

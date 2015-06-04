// Type definitions for MathBox 1.0.0
// Project: N/A
// Definitions by: David Holmes <http://github.com/mathdoodle>

/**
 * Functional constructor for MathBox.
 */
declare var mathBox: (options: {
    cameraControls?: boolean;
    cursor?: boolean;
    controlClass?;
    elementResize?: boolean;
    fullscreen?: boolean;
    screenshot?: boolean;
    stats?: boolean;
    scale?: number;
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

  interface IStyleOptions {
    /**
     * Color in hex. e.g. 0xRRGGBB
     */
    color: number;
  }

  interface IAxisOptions extends IStyleOptions {
    /**
     * 0 = X, 1 = Y, 2 = Z
     */
    axis: number;
  }

  interface IStage {
    /**
     *
     */
    animate(selector: string, options: {orbit?: number, phi?: number, offset?: number[]}, animate: {delay?: number, duration?: number}): void;
    /**
     * Adds an Axis primitive to the scene.
     *
     * .axis({
     *   axis: 0,           // 0 = X, 1 = Y, 2 = Z
     *   offset: [0, 0, 0], // Shift axis position
     *   n: 2,              // Number of points on axis line (set to higher for curved viewports)
     *   ticks: 10,         // Approximate number of ticks on axis (ticks are spaced at sensible units).
     *   tickUnit: 1,       // Base unit for ticks. Set to π e.g. to space ticks at multiples of π.
     *   tickScale: 10,     // Integer denoting the base for recursive division. 2 = binary, 10 = decimal
     *   arrow: true,       // Whether to include an arrow on the axis
     *   size: .07,         // Size of the arrow relative to the stage.
     * })
     */
    axis(options: IAxisOptions): IStage;
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
     * .vector({
     *   n: 1,                              // Number of vectors
     *   data: null,                        // Array of alternating start and end points,
     *                                      // each an array of 2 or 3 elements
     *   expression: function (i, end) {    // Live expression for start/end points.
     *     return 0;                        // Return single value or array of 2/3 elements.
     *   },
     *   line: true,                        // Whether to draw vector lines
     *   arrow: true,                       // Whether to draw arrowheads
     *   size: .07,                         // Size of the arrowhead relative to the stage
     * })
     */
    vector(options: {
      n?: number,
      data?: number[][],
      expression?: (i: number, end: number) => number[],
      line?: boolean,
      arrow?: boolean,
      size?: number}): IStage;
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

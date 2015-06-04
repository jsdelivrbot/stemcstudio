// Type definitions for MathBox 1.0.0
// Project: N/A
// Definitions by: David Holmes <http://github.com/mathdoodle>

/**
 * Functional constructor for MathBox.
 *
 * Configuration
 *
 * {
 *   // Whether to allow mouse control of the camera.
 *   cameraControls: true,
 *   // Override the class to use for mouse controls.
 *   controlClass: ThreeBox.OrbitControls,
 *   // Whether to show the mouse cursor.
 *   // When set to false, the cursor auto-hides after a short delay.
 *   cursor: true,
 *   // Whether to track resizing of the containing element.
 *   elementResize: true,
 *   // Enable fullscreen mode with 'f' (browser support is buggy)
 *   fullscreen: true,
 *   // Render at scaled resolution, e.g. scale 2 is half the width/height.
 *   // Fractional values allowed.
 *   scale: 1,
 *   // Enable screenshot taking with 'p'
 *   screenshot: true,
 *   // Show FPS stats in the corner
 *   stats: true,
 * }
 */
declare var mathBox: (options: MathBox.MathBoxOptions) => MathBox.IMathBox;

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////
/**
 * The mathbox module
 */
declare module MathBox {

  interface MathBoxOptions {
    cameraControls?: boolean;
    cursor?: boolean;
    controlClass?;
    elementResize?: boolean;
    fullscreen?: boolean;
    screenshot?: boolean;
    stats?: boolean;
    scale?: number;
  }

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

  interface StyleOptions {
    /**
     * Color in hex.
     */
    color?: number;
    /**
     * Opacity.
     */
    opacity?: number;
    /**
     * Line width for curves and wireframes.
     */
    lineWidth?: number;
    /**
     * Point size for point rendering.
     */
    pointSize?: number;
    /**
     *
     */
    map?: any;
    /**
     *
     */
    mapColor?: number;
    /**
     *
     */
    mapOpacity?: number;
    /**
     *
     */
    mathScale?: number[];
    /**
     *
     */
    mathRotation?: number[];
    /**
     *
     */
    mathPosition?: number[];
    /**
     *
     */
    world?: number[];
    /**
     *
     */
    worldRotation?: number[];
    /**
     *
     */
    worldPosition?: number[];
  }

  interface AxisOptions extends StyleOptions {
    /**
     * 0 = X, 1 = Y, 2 = Z
     */
    axis?: number;
  }

  /**
   * grid() options. 
   */
  interface GridOptions extends StyleOptions {
    /**
     * Primary and secondary grid axis (0 = X, 1 = Y, 2 = Z).
     */
    axis?: number[];
    offset?: number[];
    show?: boolean[];
    n?: number;
    ticks?: number[];
    tickUnit?: number[];
    tickScale?: number[];
  }

  interface SurfaceOptions extends StyleOptions {
    /**
     * Number of points in each direction.
     */
    n?: number[];
    /**
     * X/Y Input domain.
     */
    domain?: number[][];
    /**
     * Array of array of data points, each an array of 2 or 3 elements.
     */
    data?: number[][];
    /**
     * Live expression for data points.
     */
    expression?: (x: number, y: number) => number[];
    /**
     * Whether to draw points.
     */
    points?: boolean;
    /**
     * Whether to draw wireframe lines.
     */
    line?: boolean;
    /**
     * Whether to draw a solid mesh.
     */
    mesh?: boolean;
    /**
     * Whether the mesh is double sided.
     */
    doubleSided?: boolean;
    /**
     * Whether to flip a single sided mesh.
     */
    flipSided?: boolean;
    /**
     * Whether to shade the surface.
     */
    shaded?: boolean;
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
    axis(options: AxisOptions): IStage;
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
     * .grid({
     *   axis: [ 0, 1 ],         // Primary and secondary grid axis (0 = X, 1 = Y, 2 = Z)
     *   offset: [0, 0, 0],      // Shift grid position
     *   show: [ true, true ],   // Show horizontal and vertical direction
     *   n: 2,                   // Number of points on grid line (set to higher for curved viewports)
     *   ticks: [ 10, 10 ],      // Approximate number of ticks on axis (ticks are spaced at sensible units).
     *   tickUnit: [ 1, 1],      // Base unit for ticks on each axis. Set to π e.g. to space ticks at multiples of π.
     *   tickScale: [ 10, 10 ],  // Integer denoting the base for recursive division on each axis. 2 = binary, 10 = decimal
     * })
     */
    grid(options: GridOptions): IStage;
    /**
     *
     */
    set(selector: string, options): IStage;
    /**
     * Set the speed multiplier.
     */
    speed(multiplier: number): IStage;
    /**
     * Get the speed multiplier.
     */
    speed(): number;
    /**
     * Adds a Surface primitive to the scene.
     *
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
    surface(options: SurfaceOptions): IStage;
    /**
     * Set the transition duration.
     */
    transition(duration: number): IStage;
    /**
     * Get the transition duration.
     */
    transition(): number;
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
    /**
     *
     */
    unhookPreRender(callback: () => void): void;
  }
}

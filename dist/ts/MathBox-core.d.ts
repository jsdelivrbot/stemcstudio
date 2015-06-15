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
// FIXME: It would be better for the options to come after the element?
declare var mathBox: (element: HTMLElement, options: MathBox.MathBoxOptions) => MathBox.IMathBox;

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
  /**
   * Script-based director.
   *
   * Applies operations to mathbox one by one by stepping forward.
   * Can step backwards by automatically applying inverse operations.
   */
  class Director {
    /**
     * Constructs a Director object using the specified stage and script.
     * A script (slideshow) is an array of steps (slides).
     * A step (slide) is an array of operations (transitions).
     * An operation is an array of [verb, selector, options, animate]
     */
    constructor(stage: Stage, script?: {}[][][]) {
    }
    /**
     * Get clock time for a give slide.
     */
    clock(stepIndex: number, reset: boolean): number;
    /**
     * Invert the given operation.
     * verb     = op[0]
     * selector = op[1]
     * options  = op[2]
     * animate  = op[3]
     */
    invert(op: any[]): any[];
    /**
     * Correct reversed delays by measuring total track length and adding the missing final / reversed initial delay.
     * rollback is an array of operations (an array of arrays)
     */
    invertDelay(rollback: any[]): any;
    /**
     * Apply the given script step.
     * step is an array of operations.
     */
    apply(step, rollback, instant: boolean, skipping: boolean);
    /**
     * Insert new script step after current step and execute.
     * script may be an array of operations, or a single operation.
     * The argument should probably be thought of as a step.
     */
    insert(script): Director;
    /**
     * Is at the given step.
     */
    is(stepIndex: number): boolean;
    /**
     * Go to the given step in the script.
     * The step index wraps around.
     * step(0) is before the first step.
     * step(1) runs the first step.
     * instant(aneous) completes the step without animating.
     */
    go(stepIndex: number, instant?: boolean): void;
    /**
     * Helper to detect rapid skipping, so existing animations can be sped up.
     */
    skipping(): boolean;
    /**
     * Go one step forward.
     * instant(aneous) makes the transition immediate.
     * delay in milliseconds delays the transition.
     */
    forward(instant?: boolean, delay?: number): void;
    /**
     * Go one step backward.
     * instant(aneous) makes the transition immediate.
     * delay in milliseconds delays the transition.
     */
    back(instant?: boolean, delay?: number): void;
    /**
     * Returns the stage that the director is working with.
     */
    stage(): Stage;
  }

  interface IMathBox {
    /**
     */
    start(): Stage;
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
   * curve() options. 
   */
  interface CurveOptions extends StyleOptions {
    /**
     * Number of points. Default is 64.
     */
    n?: number;
    /**
     * Input domain. Default is [0, 1].
     */
    domain?: number[];
    /**
     * Array of array of data points, each an array of 2 or 3 elements.
     */
    data?: number[][];
    /**
     * Live expression for data points.
     */
    expression?: (x: number) => number[];
    /**
     * Whether to draw points.
     */
    points?: boolean;
    /**
     * Whether to draw wireframe lines.
     */
    line?: boolean;
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

  interface PlatonicOptions extends StyleOptions {
    type?: string;
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

  interface Stage {
    /**
     * Primitive insertion.
     */
    add(object, animate): void;
    /**
     *
     */
    animate(selector: string, options: {orbit?: number, phi?: number, offset?: number[]}, animate: {delay?: number, duration?: number}): void;
    /**
     * Adds an Axis primitive.
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
    axis(options: AxisOptions): Stage;
    /**
     *
     */
    bezier(): Stage;
    /**
     *
     */
    bezierSurface(): Stage;
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
    camera(options: {orbit?: number, phi?: number, theta?: number, lookAt?: number[]}): Stage;
    /**
     * Adds a Curve primitive.
     *
     * Parameters:
     *   n
     *     Number of points. Default is 64.
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
    curve(options?: CurveOptions): Stage;
    /**
     * get (finalized) properties of a primitive.
     */
    get(selector: string): any;
    /**
     * Adds a Grid primitive.
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
    grid(options?: GridOptions): Stage;
    /**
     * Adds a Platonic Solid primitive.
     */
    platonic(options?: PlatonicOptions): Stage;
    /**
     * Primitive removal.
     */
    remove(object, animate): void;
    /**
     * Select primitives by type or ID.
     */
    select(selector: string, includeDead): any[];
    /**
     *
     */
    set(selector: string, options): Stage;
    /**
     * Set the speed multiplier.
     */
    speed(multiplier: number): Stage;
    /**
     * Get the speed multiplier.
     */
    speed(): number;
    /**
     * Adds a Surface primitive.
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
    surface(options: SurfaceOptions): Stage;
    /**
     *
     */
    start(): Stage;
    /**
     *
     */
    stop(): Stage;
    /**
     * Set the transition duration.
     */
    transition(duration: number): Stage;
    /**
     * Get the transition duration.
     */
    transition(): number;
    /**
     * Update before render.
     */
    update(): void;
    /**
     * Adds a Vector primitive.
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
      size?: number}): Stage;
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
    viewport(options: {type: string, polar?: number, range?: number[][], scale?: number[], projective?: number[][]}): Stage;
    /**
     *
     */
    world(): World;
  }

  interface World {
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

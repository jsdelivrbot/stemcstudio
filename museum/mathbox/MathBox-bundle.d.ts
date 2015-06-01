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
    animate(selector: string, options: {orbit?: number, phi?: number, offset?: number[]}, animate: {delay?: number, duration: number}): void;
    /**
     *
     */
    axis(options: {id: string, axis: number, color: number, ticks: number, lineWidth: number, size?: number, labels?: boolean, distance?: number, arrow?: boolean, offset?: number[]}): IStage;
    /**
     *
     */
    camera(options: {orbit: number, phi: number, theta: number}): IStage;
    /**
     *
     */
    curve(options: {n:number, domain?: number[], data?: number[][], color?: number, lineWidth: number}): IStage;
    /**
     *
     */
    grid(options: {axis: number[], color: number, lineWidth?: number, offset?: number[]}): IStage;
    /**
     *
     */
    set(selector: string, options): IStage;
    /**
     *
     */
    surface(options: {shaded?: boolean, domain?: [][], n?: number[], expression?: (x: number, y: number) => number[], color?: number, opacity?: number}): IStage;
    /**
     *
     */
    transition(duration : number): IStage;
    /**
     * Adds a Vector primitive into the scene.
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
     *
     */
    viewport(options: {type: string, polar?: number, range: number[][], scale: number[], projective?: number[][]}): IStage;
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
// Type definitions for ThreeBox 1.0.0
// Project: N/A
// Definitions by: David Holmes <http://github.com/mathdoodle>

/**
 * ThreeBox is a plug-in for tQuery/Three.js which provides an improved boilerplate set up.
 *
 * It lets you easily embed Three.js scenes as elements in a web page, rather than just as a full-screen render.
 * User-friendly mouse controls are also included.
 */
declare var ThreeBox: threebox.IThreeBox;
/**
 * Pi is the ratio of a circle's diameter to its radius, in Euclidean space.
 */
declare var π: number;
/**
 * Tau is the angle of a complete turn in Euclidean space.
 */
declare var τ: number;

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////
declare module threebox {

  interface IThreeBox {
    /**
     * Loads additional HTML content.
     *
     * Syntax:
     *
     *   ThreeBox.preload([
     *   ], function() {
     *     // This code will be executed when the files have been loaded.
     *   });
     */
    preload(files: string[], callback: () => void): void;
    /**
     *
     */
    OrbitControls;
  }
}
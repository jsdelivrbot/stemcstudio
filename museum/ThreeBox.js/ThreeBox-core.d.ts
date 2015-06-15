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
     *   ], function(assets) {
     *     // This code will be executed when the files have been loaded.
     *   });
     */
    preload(files: string[], callback: (assets?: {[name:string]: any}) => void): void;
    /**
     *
     */
    OrbitControls;
  }
}
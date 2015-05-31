// Type definitions for MathBox 1.0.0
// Project: N/A
// Definitions by: David Holmes <http://github.com/mathdoodle>

/**
 *
 */
declare var mathBox: (options) => mathbox.IMathBox;

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////
declare module mathbox {

  interface IMathBox {
    /**
     */
    start(): IStage;
  }

  interface IStage {
    /**
     *
     */
    camera(options): IStage;
    /**
     *
     */
    set(selector, options): IStage;
    /**
     *
     */
    surface(options): IStage;
    /**
     *
     */
    transition(duration : number): IStage;
    /**
     *
     */
    viewport(options): IStage;
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
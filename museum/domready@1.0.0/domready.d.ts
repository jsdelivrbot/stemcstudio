// Type definitions for DomReady 1.0.0
// Project: N/A
// Definitions by: David Holmes <http://github.com/mathdoodle>

/**
 * DomReady is a "good-citizen" approach to browser-neutral script loading. 
 */
declare var DomReady: domready.IDomReady;

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////
declare module domready {

  interface IDomReady {
    /**
     * The callback function in the argument list is called once the DOM is ready,
     * and is called immediately if the DOM is already ready.
     *
     * This static method may be called multiple times. If the DOM is not ready, the
     * callback is place on a queue.
     *
     * Syntax:
     *
     *   DomReady.ready(function() {
     *     // This code will be executed when the DOM has been loaded.
     *   });
     */
    ready(callback: () => void, args?): void;
  }
}
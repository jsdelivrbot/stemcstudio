// Type definitions for DomReady 1.0.0
// Project: N/A
// Definitions by: David Holmes <http://github.com/mathdoodle>

/**
 * DomReady is a "good-citizen" approach to browser-neutral script loading. 
 */
declare var DomReady: domready.IDomReady;

///////////////////////////////////////////////////////////////////////////////
// ng module (angular.js)
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
     *     // This code will be invoked when the DOM is ready.
     *   });
     */
    ready(callback: () => void, args?): void;
  }
}
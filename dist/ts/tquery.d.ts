// Type definitions for tQuery 1.0.0
// Project: N/A
// Definitions by: David Holmes <http://github.com/mathdoodle>

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////
declare module tQuery {

  /**
   * The tQuery World.
   */
  export class World {
    static registerInstance(name: string, callback: (arg1: any) => any);
    start(): World;
  }

  export class Cylinder {
    addTo(world: World): Cylinder;
  }

  export function createWorld(): World;

  export function createCylinder(): Cylinder;

  export function data(context, name: string, ctx?: any): any;

  export function extend(base: {}, more: {}): void;

  export function removeData(context, name: string): void;
}
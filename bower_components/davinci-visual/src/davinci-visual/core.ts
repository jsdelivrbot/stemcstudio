/// <reference path="../../vendor/davinci-blade/dist/davinci-blade.d.ts"/>
/**
 *
 */
module visual {
    /**
     * The version of the visual module.
     */
    export var VERSION: string = '0.0.52';
    /**
     * Returns a grade zero Euclidean 3D multivector (scalar).
     * @param w The scalar value.
     */
    export function scalarE3(w: number) {
      return new blade.Euclidean3(w, 0, 0, 0, 0, 0, 0, 0);
    }
    /**
     * Returns a grade one Euclidean 3D multivector (vector) with the specified Cartesian coordinates.
     * @param x The x-coordinate.
     * @param y The y-coordinate.
     * @param z The z-coordinate.
     */
    export function vectorE3(x: number, y: number, z: number) {
      return new blade.Euclidean3(0, x, y, z, 0, 0, 0, 0);
    }
    /**
     * Returns a grade two Euclidean 3D multivector (bivector) with the specified Cartesian coordinates.
     * @param xy The xy-coordinate.
     * @param yz The yz-coordinate.
     * @param zx The zx-coordinate.
     */
    export function bivectorE3(xy: number, yz: number, zx: number) {
      return new blade.Euclidean3(0, 0, 0, 0, xy, yz, zx, 0);
    }
    /**
     * Returns a grade three Euclidean 3D multivector (pseudoscalar).
     * @param xyz The pseudoscalar value.
     */
    export function pseudoE3(xyz: number) {
      return new blade.Euclidean3(0, 0, 0, 0, 0, 0, 0, xyz);
    }
};

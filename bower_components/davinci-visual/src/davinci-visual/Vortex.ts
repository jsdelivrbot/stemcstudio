/// <reference path="VortexGeometry.ts"/>
/// <reference path="Mesh.ts"/>
module visual {
    /**
     * Vortex is used to represent geometric objects with a non-zero curl.
     */
    export class Vortex extends Mesh<VortexGeometry, THREE.MeshLambertMaterial> {
        constructor(parameters?: {radius?: number; radiusCone?: number; color?: number; opacity?: number; transparent?: boolean}) {
            parameters = parameters || {radius: 1.0, radiusCone: 0.08, color: 0xFFFFFF, opacity: 1.0, transparent: false};
            parameters.radius = parameters.radius || 1.0;
            parameters.radiusCone = parameters.radiusCone || 0.08;
            parameters.color = typeof parameters.color === 'number' ? parameters.color : 0xFFFFFF;
            parameters.opacity = typeof parameters.opacity === 'number' ? parameters.opacity : 1.0;
            parameters.transparent = typeof parameters.transparent === 'boolean' ? parameters.transparent : false;
            var material = new THREE.MeshLambertMaterial({color: parameters.color, opacity: parameters.opacity, transparent: parameters.transparent});
            super(new VortexGeometry(parameters.radius, parameters.radiusCone, 0.01, 0.02, 0.075), material);
        }
    }
}

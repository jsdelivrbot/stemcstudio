/// <reference path="ArrowGeometry.ts"/>
/// <reference path="Mesh.ts"/>
module visual {
    export class Arrow extends Mesh<ArrowGeometry, THREE.MeshLambertMaterial> {
        constructor(parameters?: { scale?: number; axis?: { x: number; y: number; z: number}; color?: number; opacity?: number; transparent?: boolean }) {
            parameters = parameters || {};
            var scale = parameters.scale || 1.0;
            var attitude = new THREE.Quaternion(0,0,0,1);
            var segments: number = undefined;
            var length: number = 1.0 * scale;
            var radiusShaft = 0.01 * scale;
            var radiusCone = 0.08 * scale;
            var lengthCone = 0.2 * scale;
            var axis = parameters.axis || {x: 0, y: 0, z: 1};
            parameters.color = typeof parameters.color === 'number' ? parameters.color : 0xFFFFFF;
            parameters.opacity = typeof parameters.opacity === 'number' ? parameters.opacity : 1.0;
            parameters.transparent = typeof parameters.transparent === 'boolean' ? parameters.transparent : false;
            var material = new THREE.MeshLambertMaterial({color: parameters.color, opacity: parameters.opacity, transparent: parameters.transparent});
            super(new ArrowGeometry(scale, attitude, segments, length, radiusShaft, radiusCone, lengthCone, axis), material);
        }
    }
}

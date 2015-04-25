/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="Mesh.ts"/>
module visual {
    export class Box extends Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial> {
        constructor(parameters?: {width?: number; height?: number; depth?: number; color?: number; opacity?: number; transparent?: boolean}) {
            parameters = parameters || {};
            parameters.width = parameters.width || 1.0;
            parameters.height = parameters.height || 1.0;
            parameters.depth = parameters.depth || 1.0;
            parameters.color = typeof parameters.color === 'number' ? parameters.color : 0xFFFFFF;
            parameters.opacity = typeof parameters.opacity === 'number' ? parameters.opacity : 1.0;
            parameters.transparent = typeof parameters.transparent === 'boolean' ? parameters.transparent : false;
            var material = new THREE.MeshLambertMaterial({color: parameters.color, opacity: parameters.opacity, transparent: parameters.transparent});
            super(new THREE.BoxGeometry(parameters.width, parameters.height, parameters.depth), material);
        }
    }
}

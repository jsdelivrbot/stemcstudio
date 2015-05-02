/// <reference path="../typings/threejs/three.d.ts" />
/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
/// <reference path="../typings/createjs/createjs.d.ts" />
declare module visual {
}
declare module visual {
    class RevolutionGeometry extends THREE.Geometry {
        constructor(points: any, generator: any, segments: any, phiStart: any, phiLength: any, attitude: any);
    }
}
declare module visual {
    class ArrowGeometry extends RevolutionGeometry {
        constructor(scale: number, attitude: THREE.Quaternion, segments: number, length: number, radiusShaft: number, radiusCone: number, lengthCone: number, axis: {
            x: number;
            y: number;
            z: number;
        });
    }
}
declare module visual {
    /**
     * Visual provides the common behavior for all Mesh (Geometry, Material) objects.
     */
    class Mesh<G extends THREE.Geometry, M extends THREE.Material> extends THREE.Mesh {
        geometry: G;
        material: M;
        constructor(geometry: G, material: M);
        pos: blade.Euclidean3;
        attitude: blade.Euclidean3;
    }
}
declare module visual {
    class Arrow extends Mesh<ArrowGeometry, THREE.MeshLambertMaterial> {
        constructor(parameters?: {
            scale?: number;
            axis?: {
                x: number;
                y: number;
                z: number;
            };
            color?: number;
            opacity?: number;
            transparent?: boolean;
        });
    }
}
declare module visual {
    class Box extends Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial> {
        constructor(parameters?: {
            width?: number;
            height?: number;
            depth?: number;
            color?: number;
            opacity?: number;
            transparent?: boolean;
        });
    }
}
declare module visual {
    class Sphere extends Mesh<THREE.SphereGeometry, THREE.MeshLambertMaterial> {
        constructor(parameters?: {
            radius?: number;
            widthSegments?: number;
            heightSegments?: number;
            phiStart?: number;
            phiLength?: number;
            thetaStart?: number;
            thetaLength?: number;
            color?: number;
            opacity?: number;
            transparent?: boolean;
        });
    }
}
declare module visual {
    interface TrackBall {
        enabled: boolean;
        rotateSpeed: number;
        zoomSpeed: number;
        panSpeed: number;
        noRotate: boolean;
        noZoom: boolean;
        noPan: boolean;
        staticMoving: boolean;
        dynamicDampingFactor: number;
        minDistance: number;
        maxDistance: number;
        keys: number[];
        update: () => void;
        handleResize: () => void;
        setSize(width: number, height: number): void;
    }
}
declare module visual {
    class Workbench2D {
        canvas: HTMLCanvasElement;
        wnd: Window;
        private sizer;
        constructor(canvas: HTMLCanvasElement, wnd: Window);
        setSize(width: number, height: number): void;
        setUp(): void;
        tearDown(): void;
    }
}
declare module visual {
    class Workbench3D {
        canvas: HTMLCanvasElement;
        renderer: THREE.WebGLRenderer;
        camera: THREE.PerspectiveCamera;
        controls: TrackBall;
        wnd: Window;
        private sizer;
        constructor(canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, controls: TrackBall, wnd: Window);
        setSize(width: number, height: number): void;
        setUp(): void;
        tearDown(): void;
    }
}
declare module visual {
    var trackball: (object: THREE.Object3D, wnd: Window) => TrackBall;
}
declare module visual {
    class Visual {
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        workbench3D: Workbench3D;
        canvas2D: HTMLCanvasElement;
        workbench2D: Workbench2D;
        stage: createjs.Stage;
        controls: TrackBall;
        constructor(wnd: Window, canvas?: HTMLCanvasElement);
        add(object: THREE.Object3D): void;
        /**
         * Resizes the canvas to (width, height), and also sets the viewport to fit that size.
         */
        setSize(width: number, height: number): void;
        setUp(): void;
        tearDown(): void;
        /**
         * Render the 3D scene using the camera.
         */
        update(): void;
    }
}
declare module visual {
    class VortexGeometry extends THREE.Geometry {
        constructor(radius: number, radiusCone: number, radiusShaft: number, lengthCone: number, lengthShaft: number, arrowSegments?: number, radialSegments?: number);
    }
}
declare module visual {
    /**
     * Vortex is used to represent geometric objects with a non-zero curl.
     */
    class Vortex extends Mesh<VortexGeometry, THREE.MeshLambertMaterial> {
        constructor(parameters?: {
            radius?: number;
            radiusCone?: number;
            color?: number;
            opacity?: number;
            transparent?: boolean;
        });
    }
}
/**
 *
 */
declare module visual {
    /**
     * The version of the visual module.
     */
    var VERSION: string;
    /**
     * Returns a grade zero Euclidean 3D multivector (scalar).
     * @param w The scalar value.
     */
    function scalarE3(w: number): blade.Euclidean3;
    /**
     * Returns a grade one Euclidean 3D multivector (vector) with the specified Cartesian coordinates.
     * @param x The x-coordinate.
     * @param y The y-coordinate.
     * @param z The z-coordinate.
     */
    function vectorE3(x: number, y: number, z: number): blade.Euclidean3;
    /**
     * Returns a grade two Euclidean 3D multivector (bivector) with the specified Cartesian coordinates.
     * @param xy The xy-coordinate.
     * @param yz The yz-coordinate.
     * @param zx The zx-coordinate.
     */
    function bivectorE3(xy: number, yz: number, zx: number): blade.Euclidean3;
    /**
     * Returns a grade three Euclidean 3D multivector (pseudoscalar).
     * @param xyz The pseudoscalar value.
     */
    function pseudoE3(xyz: number): blade.Euclidean3;
}

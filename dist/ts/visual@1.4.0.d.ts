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
        wnd: Window;
        private sizer;
        constructor(canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, wnd: Window);
        setSize(width: number, height: number): void;
        setUp(): void;
        tearDown(): void;
    }
}
declare module visual {
    /**
     * An convenient abstraction for doodles consisting of a THREE.Scene, THREE.PerspeciveCamera and THREE.WebGLRenderer.
     * The camera is set looking along the y-axis so that the x-axis is to the right and the z-axis is up.
     * The camera field of view is initialized to 45 degrees.
     * When used for a canvas over the entire window, the `setUp` and `tearDown` methods provide `resize` handling.
     * When used for a smaller canvas, the width and height properties control the canvas size.
     * This convenience class does not provide lighting of the scene.
     */
    class DoodleCanvas {
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        workbench3D: Workbench3D;
        canvas3D: HTMLCanvasElement;
        canvas2D: HTMLCanvasElement;
        workbench2D: Workbench2D;
        stage: createjs.Stage;
        /**
         * Constructs a `DoodleCanvas` associated with the specified window and canvas.
         * @param $window The window in which the visualization will operate.
         * @param canvas The canvas element (HTMLCanvasElement) or the `id` (string) property of a canvas element in which the visualization will operate.
         */
        constructor($window: Window, canvas?: any);
        /**
         * The `width` property of the doodle canvas.
         */
        /**
         * The `width` property of the doodle canvas.
         */
        width: number;
        /**
         * The `height` property of the doodle canvas.
         */
        /**
         * The `height` property of the doodle canvas.
         */
        height: number;
        /**
         * Adds an object, typically a THREE.Mesh or THREE.Camera to the underlying THREE.Scene.
         */
        add(object: THREE.Object3D): void;
        /**
         * Removes an object, typically a THREE.Mesh or THREE.Camera from the underlying THREE.Scene.
         */
        remove(object: THREE.Object3D): void;
        /**
         * Resizes the canvas to (width, height), and also sets the viewport to fit that size.
         */
        setSize(width: number, height: number): void;
        /**
         * Performs one-time setup of the doodle canvas when being used to support full window.
         */
        setUp(): void;
        /**
         * Performs one-time teardown of the doodle canvas when being used to support full window.
         */
        tearDown(): void;
        /**
         * Render the 3D scene using the default camera.
         */
        update(): void;
    }
}
declare module visual {
    interface ITrackBall {
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
 * The `visual` modile provides convenience abstractions for 3D modeling.
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
declare module visual {
    var trackball: (object: THREE.Object3D, wnd: Window) => ITrackBall;
}

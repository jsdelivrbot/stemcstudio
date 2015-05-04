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
     * Mesh provides the common behavior for all Mesh (Geometry, Material) objects.
     * Mesh may be used in place of a THREE.Mesh and provides additional features
     * for Geometric Algebra manipulations.
     */
    class Mesh<G extends THREE.Geometry, M extends THREE.Material> extends THREE.Mesh {
        /**
         * The geometry used in constructing the Mesh.
         */
        geometry: G;
        /**
         * The material used in constructing the Mesh.
         */
        material: M;
        constructor(geometry: G, material: M);
        /**
         * The get `pos` property is a position vector that is a copy of this.position.
         * The set `pos` property manipulates this.position using a vector.
         */
        pos: blade.Euclidean3;
        /**
         * The get `attitude` property is a rotor and a copy of this.quaternion.
         * The set `attitude` property manipulates this.quaternion using a rotor.
         */
        attitude: blade.Euclidean3;
    }
}
declare module visual {
    /**
     * A class for generating an ArrowGeometry with THREE.MeshLambertMaterial.
     * The default arguments create a unit arrow which is yellow and opaque.
     */
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
    /**
     * A class for generating a THREE.BoxGeometry with THREE.MeshLambertMaterial.
     * The default arguments create a unit cube which is red and opaque.
     */
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
    /**
     * An interface representing a stopwatch.
     */
    interface IStopwatch {
        /**
         * The `start` method puts the anumation runner into the running state.
         */
        start(): void;
        /**
         * The `stop` method pauses the animation runner from the running state.
         */
        stop(): void;
        /**
         * The `reset` method sets the time to zero from the paused state.
         */
        reset(): void;
        /**
         *The `lap` method records the time in the running state.
         */
        lap(): void;
        /**
         * The readonly `time` property contains the elapsed time on the animation runner.
         */
        time: number;
        /**
         * The readonly `isRunning` property determines whether the animation runner is running.
         */
        isRunning: boolean;
        /**
         * The readonly `isPaused` property determines whether the animation runner as been paused.
         */
        isPaused: boolean;
    }
}
declare module visual {
    /**
     * A class for generating a THREE.SphereGeometry with THREE.MeshLambertMaterial.
     * The default arguments create a unity radius sphere which is blue and opaque.
     */
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
     * A class for generating a VortexGeometry with THREE.MeshLambertMaterial.
     * The default arguments create a unity radius ring which is green and opaque.
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
     * An convenient abstraction for 3D modeling consisting of a THREE.Scene, THREE.PerspeciveCamera and THREE.WebGLRenderer.
     * The camera is set looking along the y-axis so that the x-axis is to the right and the z-axis is up.
     * The camera field of view is initialized to 45 degrees.
     * When used for a canvas over the entire window, the `setUp` and `tearDown` methods provide `resize` handling.
     * When used for a smaller canvas, the width and height properties control the canvas size.
     * This convenience class does not provide lighting of the scene.
     */
    class WebGLCanvas {
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        workbench3D: Workbench3D;
        canvas3D: HTMLCanvasElement;
        canvas2D: HTMLCanvasElement;
        workbench2D: Workbench2D;
        stage: createjs.Stage;
        /**
         * Constructs a `WebGLCanvas` associated with the specified window and canvas.
         * @param $window The window in which the visualization will operate.
         * @param canvas The canvas element (HTMLCanvasElement) or the `id` (string) property of a canvas element in which the visualization will operate.
         */
        constructor($window: Window, canvas?: any);
        /**
         * The `width` property of the canvas.
         */
        width: number;
        /**
         * The `height` property of the canvas.
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
         * Performs one-time setup of the canvas when being used to support full window.
         */
        setUp(): void;
        /**
         * Performs one-time teardown of the canvas when being used to support full window.
         */
        tearDown(): void;
        /**
         * Render the 3D scene using the default camera.
         */
        update(): void;
    }
}
declare module visual {
    /**
     * Creates an object implementing a stopwatch API that makes callbacks to user-supplied functions.
     * @param tick The `tick` function is called for each animation frame.
     * @param terminate The `terminate` function is called to determine whether the animation should stop.
     * @param setUp The `setUp` function is called synchronously each time the start() method is called.
     * @param tearDown The `tearDown` function is called asynchronously each time the animation is stopped.
     */
    function animationRunner(tick: (t: number) => void, terminate: (t: number) => void, setUp: () => void, tearDown: (ex: any) => void, $window?: Window): IStopwatch;
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

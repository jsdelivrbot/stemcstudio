var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../typings/threejs/three.d.ts"/>
var visual;
(function (visual) {
    var RevolutionGeometry = (function (_super) {
        __extends(RevolutionGeometry, _super);
        function RevolutionGeometry(points, generator, segments, phiStart, phiLength, attitude) {
            _super.call(this);
            segments = segments || 12;
            phiStart = phiStart || 0;
            phiLength = phiLength || 2 * Math.PI;
            // Determine heuristically whether the user intended to make a complete revolution.
            var isClosed = Math.abs(2 * Math.PI - Math.abs(phiLength - phiStart)) < 0.0001;
            // The number of vertical half planes (phi constant).
            var halfPlanes = isClosed ? segments : segments + 1;
            var inverseSegments = 1.0 / segments;
            var phiStep = (phiLength - phiStart) * inverseSegments;
            var i;
            var j;
            var il;
            var jl;
            for (i = 0, il = halfPlanes; i < il; i++) {
                var phi = phiStart + i * phiStep;
                var halfAngle = phi / 2;
                var cosHA = Math.cos(halfAngle);
                var sinHA = Math.sin(halfAngle);
                var rotor = new THREE.Quaternion(generator.x * sinHA, generator.y * sinHA, generator.z * sinHA, cosHA);
                for (j = 0, jl = points.length; j < jl; j++) {
                    var pt = points[j];
                    var vertex = new THREE.Vector3(pt.x, pt.y, pt.z);
                    // The generator tells us how to rotate the points.
                    vertex.applyQuaternion(rotor);
                    // The attitude tells us where we want the symmetry axis to be.
                    if (attitude) {
                        vertex.applyQuaternion(attitude);
                    }
                    this.vertices.push(vertex);
                }
            }
            var inversePointLength = 1.0 / (points.length - 1);
            var np = points.length;
            // The denominator for modulo index arithmetic.
            var wrap = np * halfPlanes;
            for (i = 0, il = segments; i < il; i++) {
                for (j = 0, jl = points.length - 1; j < jl; j++) {
                    var base = j + np * i;
                    var a = base % wrap;
                    var b = (base + np) % wrap;
                    var c = (base + 1 + np) % wrap;
                    var d = (base + 1) % wrap;
                    var u0 = i * inverseSegments;
                    var v0 = j * inversePointLength;
                    var u1 = u0 + inverseSegments;
                    var v1 = v0 + inversePointLength;
                    this.faces.push(new THREE.Face3(d, b, a));
                    this.faceVertexUvs[0].push([
                        new THREE.Vector2(u0, v0),
                        new THREE.Vector2(u1, v0),
                        new THREE.Vector2(u0, v1)
                    ]);
                    this.faces.push(new THREE.Face3(d, c, b));
                    this.faceVertexUvs[0].push([
                        new THREE.Vector2(u1, v0),
                        new THREE.Vector2(u1, v1),
                        new THREE.Vector2(u0, v1)
                    ]);
                }
            }
            this.computeFaceNormals();
            this.computeVertexNormals();
        }
        return RevolutionGeometry;
    })(THREE.Geometry);
    visual.RevolutionGeometry = RevolutionGeometry;
})(visual || (visual = {}));
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="RevolutionGeometry.ts"/>
var visual;
(function (visual) {
    var ArrowGeometry = (function (_super) {
        __extends(ArrowGeometry, _super);
        function ArrowGeometry(scale, attitude, segments, length, radiusShaft, radiusCone, lengthCone, axis) {
            scale = scale || 1;
            attitude = attitude || new THREE.Quaternion(0, 0, 0, 1);
            length = (length || 1) * scale;
            radiusShaft = (radiusShaft || 0.01) * scale;
            radiusCone = (radiusCone || 0.08) * scale;
            lengthCone = (lengthCone || 0.20) * scale;
            axis = axis || new THREE.Vector3(0, 0, 1);
            var lengthShaft = length - lengthCone;
            var halfLength = length / 2;
            var permutation = function (direction) {
                if (direction.x) {
                    return 2;
                }
                else if (direction.y) {
                    return 1;
                }
                else {
                    return 0;
                }
            };
            var orientation = function (direction) {
                if (direction.x > 0) {
                    return +1;
                }
                else if (direction.x < 0) {
                    return -1;
                }
                else if (direction.y > 0) {
                    return +1;
                }
                else if (direction.y < 0) {
                    return -1;
                }
                else if (direction.z > 0) {
                    return +1;
                }
                else if (direction.z < 0) {
                    return -1;
                }
                else {
                    return 0;
                }
            };
            var computeArrow = function (direction) {
                var cycle = permutation(direction);
                var sign = orientation(direction);
                var i = (cycle + 0) % 3;
                var j = (cycle + 1) % 3;
                var k = (cycle + 2) % 3;
                var shL = halfLength * sign;
                var data = [
                    [0, 0, halfLength * sign],
                    [radiusCone, 0, (lengthShaft - halfLength) * sign],
                    [radiusShaft, 0, (lengthShaft - halfLength) * sign],
                    [radiusShaft, 0, (-halfLength) * sign],
                    [0, 0, (-halfLength) * sign]
                ];
                var points = data.map(function (point) {
                    return new THREE.Vector3(point[i], point[j], point[k]);
                });
                var generator = new THREE.Quaternion(direction.x, direction.y, direction.z, 0);
                return { "points": points, "generator": generator };
            };
            var arrow = computeArrow(axis);
            _super.call(this, arrow.points, arrow.generator, segments, 0, 2 * Math.PI, attitude);
        }
        return ArrowGeometry;
    })(visual.RevolutionGeometry);
    visual.ArrowGeometry = ArrowGeometry;
})(visual || (visual = {}));
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="../../vendor/davinci-blade/dist/davinci-blade.d.ts"/>
var visual;
(function (visual) {
    /**
     * Mesh provides the common behavior for all Mesh (Geometry, Material) objects.
     * Mesh may be used in place of a THREE.Mesh and provides additional features
     * for Geometric Algebra manipulations.
     */
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, material) {
            this.geometry = geometry;
            this.material = material;
            _super.call(this, geometry, this.material);
        }
        Object.defineProperty(Mesh.prototype, "pos", {
            /**
             * The get `pos` property is a position vector that is a copy of this.position.
             * The set `pos` property manipulates this.position using a vector.
             */
            get: function () {
                var position = this.position;
                return new blade.Euclidean3(0, position.x, position.y, position.z, 0, 0, 0, 0);
            },
            set: function (vector) {
                this.position.set(vector.x, vector.y, vector.z);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "attitude", {
            /**
             * The get `attitude` property is a rotor and a copy of this.quaternion.
             * The set `attitude` property manipulates this.quaternion using a rotor.
             */
            get: function () {
                var q = this.quaternion;
                return new blade.Euclidean3(q.w, 0, 0, 0, -q.z, -q.x, -q.y, 0);
            },
            set: function (rotor) {
                this.quaternion.set(-rotor.yz, -rotor.zx, -rotor.xy, rotor.w);
            },
            enumerable: true,
            configurable: true
        });
        return Mesh;
    })(THREE.Mesh);
    visual.Mesh = Mesh;
})(visual || (visual = {}));
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="ArrowGeometry.ts"/>
/// <reference path="Mesh.ts"/>
var visual;
(function (visual) {
    /**
     * A class for generating an ArrowGeometry with THREE.MeshLambertMaterial.
     * The default arguments create a unit arrow which is yellow and opaque.
     */
    var Arrow = (function (_super) {
        __extends(Arrow, _super);
        function Arrow(parameters) {
            parameters = parameters || {};
            var scale = parameters.scale || 1.0;
            var attitude = new THREE.Quaternion(0, 0, 0, 1);
            var segments = undefined;
            var length = 1.0 * scale;
            var radiusShaft = 0.01 * scale;
            var radiusCone = 0.08 * scale;
            var lengthCone = 0.2 * scale;
            var axis = parameters.axis || { x: 0, y: 0, z: 1 };
            parameters.color = typeof parameters.color === 'number' ? parameters.color : 0xFFFF00;
            parameters.opacity = typeof parameters.opacity === 'number' ? parameters.opacity : 1.0;
            parameters.transparent = typeof parameters.transparent === 'boolean' ? parameters.transparent : false;
            var material = new THREE.MeshLambertMaterial({ color: parameters.color, opacity: parameters.opacity, transparent: parameters.transparent });
            _super.call(this, new visual.ArrowGeometry(scale, attitude, segments, length, radiusShaft, radiusCone, lengthCone, axis), material);
        }
        return Arrow;
    })(visual.Mesh);
    visual.Arrow = Arrow;
})(visual || (visual = {}));
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="Mesh.ts"/>
var visual;
(function (visual) {
    /**
     * A class for generating a THREE.BoxGeometry with THREE.MeshLambertMaterial.
     * The default arguments create a unit cube which is red and opaque.
     */
    var Box = (function (_super) {
        __extends(Box, _super);
        function Box(parameters) {
            parameters = parameters || {};
            parameters.width = parameters.width || 1.0;
            parameters.height = parameters.height || 1.0;
            parameters.depth = parameters.depth || 1.0;
            parameters.color = typeof parameters.color === 'number' ? parameters.color : 0xFF0000;
            parameters.opacity = typeof parameters.opacity === 'number' ? parameters.opacity : 1.0;
            parameters.transparent = typeof parameters.transparent === 'boolean' ? parameters.transparent : false;
            var material = new THREE.MeshLambertMaterial({ color: parameters.color, opacity: parameters.opacity, transparent: parameters.transparent });
            _super.call(this, new THREE.BoxGeometry(parameters.width, parameters.height, parameters.depth), material);
        }
        return Box;
    })(visual.Mesh);
    visual.Box = Box;
})(visual || (visual = {}));
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="Mesh.ts"/>
var visual;
(function (visual) {
    /**
     * A class for generating a THREE.SphereGeometry with THREE.MeshLambertMaterial.
     * The default arguments create a unity radius sphere which is blue and opaque.
     */
    var Sphere = (function (_super) {
        __extends(Sphere, _super);
        function Sphere(parameters) {
            parameters = parameters || {};
            parameters.radius = parameters.radius || 1.0;
            parameters.widthSegments = parameters.widthSegments || 24;
            parameters.heightSegments = parameters.heightSegments || 18;
            parameters.color = typeof parameters.color === 'number' ? parameters.color : 0x0000FF;
            parameters.opacity = typeof parameters.opacity === 'number' ? parameters.opacity : 1.0;
            parameters.transparent = typeof parameters.transparent === 'boolean' ? parameters.transparent : false;
            var material = new THREE.MeshLambertMaterial({ color: parameters.color, opacity: parameters.opacity, transparent: parameters.transparent });
            _super.call(this, new THREE.SphereGeometry(parameters.radius, parameters.widthSegments, parameters.heightSegments, parameters.phiStart, parameters.phiLength, parameters.thetaStart, parameters.thetaLength), material);
        }
        return Sphere;
    })(visual.Mesh);
    visual.Sphere = Sphere;
})(visual || (visual = {}));
/// <reference path="../../typings/threejs/three.d.ts"/>
var visual;
(function (visual) {
    var VortexGeometry = (function (_super) {
        __extends(VortexGeometry, _super);
        function VortexGeometry(radius, radiusCone, radiusShaft, lengthCone, lengthShaft, arrowSegments, radialSegments) {
            _super.call(this);
            var scope = this;
            var n = 9;
            radius = radius || 1;
            radiusCone = radiusCone || 0.08;
            radiusShaft = radiusShaft || 0.01;
            lengthCone = lengthCone || 0.2;
            lengthShaft = lengthShaft || 0.8;
            arrowSegments = arrowSegments || 8;
            var circleSegments = arrowSegments * n;
            radialSegments = radialSegments || 12;
            var twoPI = Math.PI * 2;
            var R = radius;
            var center = new THREE.Vector3();
            var uvs = [];
            var normals = [];
            var alpha = lengthShaft / (lengthCone + lengthShaft);
            var factor = twoPI / arrowSegments;
            var theta = alpha / (n - 2);
            function computeAngle(circleSegments, i) {
                var m = i % n;
                if (m === n - 1) {
                    return computeAngle(circleSegments, i - 1);
                }
                else {
                    var a = (i - m) / n;
                    return factor * (a + m * theta);
                }
            }
            function computeRadius(i) {
                var m = i % n;
                if (m === n - 1) {
                    return radiusCone;
                }
                else {
                    return radiusShaft;
                }
            }
            for (var j = 0; j <= radialSegments; j++) {
                // v is the angle inside the vortex tube.
                var v = twoPI * j / radialSegments;
                var cosV = Math.cos(v);
                var sinV = Math.sin(v);
                for (var i = 0; i <= circleSegments; i++) {
                    // u is the angle in the xy-plane measured from the x-axis clockwise about the z-axis.
                    var u = computeAngle(circleSegments, i);
                    var cosU = Math.cos(u);
                    var sinU = Math.sin(u);
                    center.x = R * cosU;
                    center.y = R * sinU;
                    var vertex = new THREE.Vector3();
                    var r = computeRadius(i);
                    vertex.x = (R + r * cosV) * cosU;
                    vertex.y = (R + r * cosV) * sinU;
                    vertex.z = r * sinV;
                    this['vertices'].push(vertex);
                    uvs.push(new THREE.Vector2(i / circleSegments, j / radialSegments));
                    normals.push(vertex.clone().sub(center).normalize());
                }
            }
            for (var j = 1; j <= radialSegments; j++) {
                for (var i = 1; i <= circleSegments; i++) {
                    var a = (circleSegments + 1) * j + i - 1;
                    var b = (circleSegments + 1) * (j - 1) + i - 1;
                    var c = (circleSegments + 1) * (j - 1) + i;
                    var d = (circleSegments + 1) * j + i;
                    var face = new THREE.Face3(a, b, d, [normals[a], normals[b], normals[d]]);
                    face.normal.add(normals[a]);
                    face.normal.add(normals[b]);
                    face.normal.add(normals[d]);
                    face.normal.normalize();
                    this.faces.push(face);
                    this.faceVertexUvs[0].push([uvs[a].clone(), uvs[b].clone(), uvs[d].clone()]);
                    face = new THREE.Face3(b, c, d, [normals[b], normals[c], normals[d]]);
                    face.normal.add(normals[b]);
                    face.normal.add(normals[c]);
                    face.normal.add(normals[d]);
                    face.normal.normalize();
                    this.faces.push(face);
                    this.faceVertexUvs[0].push([uvs[b].clone(), uvs[c].clone(), uvs[d].clone()]);
                }
            }
        }
        return VortexGeometry;
    })(THREE.Geometry);
    visual.VortexGeometry = VortexGeometry;
})(visual || (visual = {}));
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="VortexGeometry.ts"/>
/// <reference path="Mesh.ts"/>
var visual;
(function (visual) {
    /**
     * Vortex is used to represent geometric objects with a non-zero curl.
     * A class for generating a VortexGeometry with THREE.MeshLambertMaterial.
     * The default arguments create a unity radius ring which is green and opaque.
     */
    var Vortex = (function (_super) {
        __extends(Vortex, _super);
        function Vortex(parameters) {
            parameters = parameters || { radius: 1.0, radiusCone: 0.08, color: 0x00FF00, opacity: 1.0, transparent: false };
            parameters.radius = parameters.radius || 1.0;
            parameters.radiusCone = parameters.radiusCone || 0.08;
            parameters.color = typeof parameters.color === 'number' ? parameters.color : 0x00FF00;
            parameters.opacity = typeof parameters.opacity === 'number' ? parameters.opacity : 1.0;
            parameters.transparent = typeof parameters.transparent === 'boolean' ? parameters.transparent : false;
            var material = new THREE.MeshLambertMaterial({ color: parameters.color, opacity: parameters.opacity, transparent: parameters.transparent });
            _super.call(this, new visual.VortexGeometry(parameters.radius, parameters.radiusCone, 0.01, 0.02, 0.075), material);
        }
        return Vortex;
    })(visual.Mesh);
    visual.Vortex = Vortex;
})(visual || (visual = {}));
var visual;
(function (visual) {
    function removeElementsByTagName(doc, tagName) {
        var elements = doc.getElementsByTagName(tagName);
        for (var i = elements.length - 1; i >= 0; i--) {
            var e = elements[i];
            e.parentNode.removeChild(e);
        }
    }
    var Workbench2D = (function () {
        function Workbench2D(canvas, wnd) {
            this.canvas = canvas;
            this.wnd = wnd;
            function onWindowResize(event) {
                var width = wnd.innerWidth;
                var height = wnd.innerHeight;
                canvas.width = width;
                canvas.height = height;
            }
            this.sizer = onWindowResize;
        }
        Workbench2D.prototype.setSize = function (width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
        };
        Workbench2D.prototype.setUp = function () {
            this.wnd.document.body.insertBefore(this.canvas, this.wnd.document.body.firstChild);
            this.wnd.addEventListener('resize', this.sizer, false);
            this.sizer(null);
        };
        Workbench2D.prototype.tearDown = function () {
            this.wnd.removeEventListener('resize', this.sizer, false);
            removeElementsByTagName(this.wnd.document, "canvas");
        };
        return Workbench2D;
    })();
    visual.Workbench2D = Workbench2D;
})(visual || (visual = {}));
var visual;
(function (visual) {
    function removeElementsByTagName(doc, tagName) {
        var elements = doc.getElementsByTagName(tagName);
        for (var i = elements.length - 1; i >= 0; i--) {
            var e = elements[i];
            e.parentNode.removeChild(e);
        }
    }
    /**
     *
     */
    var Workbench3D = (function () {
        function Workbench3D(canvas, renderer, camera, $window, embedCanvas) {
            this.canvas = canvas;
            this.renderer = renderer;
            this.camera = camera;
            this.$window = $window;
            this.embedCanvas = embedCanvas;
            var self = this;
            function onWindowResize(event) {
                var width = $window.innerWidth;
                var height = $window.innerHeight;
                self.setSize(width, height);
            }
            this.resizeHandler = onWindowResize;
        }
        Workbench3D.prototype.setSize = function (width, height) {
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        };
        /**
         * The `setUp` method causes the Workbench3D to start handling window resize events for the canvas.
         * The canvas is inserted as the first element in the document body if requested with `embedCanvas`.
         */
        Workbench3D.prototype.setUp = function () {
            this.originalWidth = this.canvas.width;
            this.originalHeight = this.canvas.height;
            if (this.embedCanvas) {
                this.$window.document.body.insertBefore(this.canvas, this.$window.document.body.firstChild);
            }
            this.$window.addEventListener('resize', this.resizeHandler, false);
            this.setSize(this.$window.innerWidth, this.$window.innerHeight);
        };
        /**
         * The `tearDown` method causes the Workbench3D to stop handling window resize events for the canvas.
         * The canvas is removed from its parent if it was originally inserted by the workbench.
         * The canvas is restored to its original dimensions.
         */
        Workbench3D.prototype.tearDown = function () {
            this.$window.removeEventListener('resize', this.resizeHandler, false);
            if (this.embedCanvas) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            this.canvas.width = this.originalWidth;
            this.canvas.height = this.originalHeight;
        };
        return Workbench3D;
    })();
    visual.Workbench3D = Workbench3D;
})(visual || (visual = {}));
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="../../typings/createjs/createjs.d.ts"/>
/// <reference path="Workbench2D.ts"/>
/// <reference path="Workbench3D.ts"/>
var visual;
(function (visual) {
    /**
     * An convenient abstraction for 3D modeling consisting of a THREE.Scene, THREE.PerspeciveCamera and THREE.WebGLRenderer.
     * The camera is set looking along the y-axis so that the x-axis is to the right and the z-axis is up.
     * The camera field of view is initialized to 45 degrees.
     * When used for a canvas over the entire window, the `setUp` and `tearDown` methods provide `resize` handling.
     * When used for a smaller canvas, the width and height properties control the canvas size.
     * This convenience class does not provide lighting of the scene.
     */
    var WebGLCanvas = (function () {
        // FIXME: We'll need TypeScript 1.4+ to be able to use union types for canvas.
        /**
         * Constructs a `WebGLCanvas` associated with the specified window and canvas.
         * @param $window The window in which the visualization will operate.
         * @param canvas The canvas element (HTMLCanvasElement) or the `id` (string) property of a canvas element in which the visualization will operate.
         */
        function WebGLCanvas($window, canvas) {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(45, 1.0, 0.1, 10000);
            // We assume the `physical` convention that x is to the right, z is up, and y is away from the camera.
            this.camera.position.set(0, -5, 0);
            this.camera.up.set(0, 0, 1);
            this.camera.lookAt(this.scene.position);
            if (typeof canvas === 'string') {
                this.canvas3D = document.getElementById(canvas);
                if (this.canvas3D) {
                    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas3D });
                }
                else {
                    throw new Error(canvas + " is not a valid canvas element identifier.");
                }
                this.workbench3D = new visual.Workbench3D(this.canvas3D, this.renderer, this.camera, $window, false);
            }
            else if (typeof canvas === 'object') {
                this.canvas3D = canvas;
                this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
                this.workbench3D = new visual.Workbench3D(this.canvas3D, this.renderer, this.camera, $window, false);
            }
            else {
                this.renderer = new THREE.WebGLRenderer();
                this.canvas3D = this.renderer.domElement;
                this.workbench3D = new visual.Workbench3D(this.canvas3D, this.renderer, this.camera, $window, true);
            }
            this.canvas2D = $window.document.createElement("canvas");
            this.canvas2D.style.position = "absolute";
            this.canvas2D.style.top = "0px";
            this.canvas2D.style.left = "0px";
            this.workbench2D = new visual.Workbench2D(this.canvas2D, $window);
            if (typeof createjs !== 'undefined') {
                this.stage = new createjs.Stage(this.canvas2D);
                this.stage.autoClear = true;
            }
        }
        Object.defineProperty(WebGLCanvas.prototype, "width", {
            /**
             * The `width` property of the canvas.
             */
            get: function () {
                return this.canvas3D.width;
            },
            set: function (width) {
                this.canvas3D.width = width;
                this.canvas2D.width = width;
                this.workbench3D.setSize(width, this.canvas3D.height);
                this.workbench2D.setSize(width, this.canvas3D.height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebGLCanvas.prototype, "height", {
            /**
             * The `height` property of the canvas.
             */
            get: function () {
                return this.canvas3D.height;
            },
            set: function (height) {
                this.canvas3D.height = height;
                this.canvas2D.height = height;
                this.workbench3D.setSize(this.canvas3D.width, height);
                this.workbench2D.setSize(this.canvas3D.width, height);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Adds an object, typically a THREE.Mesh or THREE.Camera to the underlying THREE.Scene.
         */
        WebGLCanvas.prototype.add = function (object) {
            return this.scene.add(object);
        };
        /**
         * Removes an object, typically a THREE.Mesh or THREE.Camera from the underlying THREE.Scene.
         */
        WebGLCanvas.prototype.remove = function (object) {
            return this.scene.remove(object);
        };
        /**
         * Resizes the canvas to (width, height), and also sets the viewport to fit that size.
         */
        WebGLCanvas.prototype.setSize = function (width, height) {
            this.workbench3D.setSize(width, height);
            this.workbench2D.setSize(width, height);
        };
        /**
         * Performs one-time setup of the canvas when being used to support full window.
         */
        WebGLCanvas.prototype.setUp = function () {
            this.workbench3D.setUp();
            this.workbench2D.setUp();
        };
        /**
         * Performs one-time teardown of the canvas when being used to support full window.
         */
        WebGLCanvas.prototype.tearDown = function () {
            this.workbench3D.tearDown();
            this.workbench2D.tearDown();
        };
        /**
         * Render the 3D scene using the default camera.
         */
        WebGLCanvas.prototype.update = function () {
            this.renderer.render(this.scene, this.camera);
            if (this.stage) {
                this.stage.update();
            }
        };
        return WebGLCanvas;
    })();
    visual.WebGLCanvas = WebGLCanvas;
})(visual || (visual = {}));
var visual;
(function (visual) {
    /**
     * Creates an object implementing a stopwatch API that makes callbacks to user-supplied functions.
     * @param tick The `tick` function is called for each animation frame.
     * @param terminate The `terminate` function is called to determine whether the animation should stop.
     * @param setUp The `setUp` function is called synchronously each time the start() method is called.
     * @param tearDown The `tearDown` function is called asynchronously each time the animation is stopped.
     */
    function animationRunner(tick, terminate, setUp, tearDown, $window) {
        // TODO: Use enum when TypeScript compiler version is appropriate.
        var STATE_INITIAL = 1;
        var STATE_RUNNING = 2;
        var STATE_PAUSED = 3;
        var stopSignal = false; // 27 is Esc
        //  var pauseKeyPressed = false;  // 19
        //  var enterKeyPressed = false;  // 13
        var startTime = undefined;
        var elapsed = 0;
        var MILLIS_PER_SECOND = 1000;
        var requestID = null;
        var exception = undefined;
        var state = STATE_INITIAL;
        var animate = function (timestamp) {
            if (startTime) {
                elapsed = elapsed + timestamp - startTime;
            }
            startTime = timestamp;
            if (stopSignal || terminate(elapsed / MILLIS_PER_SECOND)) {
                // Clear the stopSignal.
                stopSignal = false;
                $window.cancelAnimationFrame(requestID);
                if (that.isRunning) {
                    state = STATE_PAUSED;
                    startTime = undefined;
                }
                else {
                    // TODO: Can we recover?
                    console.error("stopSignal received while not running.");
                }
                $window.document.removeEventListener('keydown', onDocumentKeyDown, false);
                try {
                    tearDown(exception);
                }
                catch (e) {
                    console.log("Exception thrown from tearDown function: " + e);
                }
            }
            else {
                requestID = $window.requestAnimationFrame(animate);
                try {
                    tick(elapsed / MILLIS_PER_SECOND);
                }
                catch (e) {
                    exception = e;
                    stopSignal = true;
                }
            }
        };
        var onDocumentKeyDown = function (event) {
            // TODO: It would be nice for all key responses to be soft-defined.
            // In other words, a mapping of event (keyCode) to action (start, stop, reset)
            if (event.keyCode === 27) {
                stopSignal = true;
                event.preventDefault();
            }
            /*
            else if (event.keyCode === 19) {
                pauseKeyPressed = true;
                event.preventDefault();
            }
            else if (event.keyCode === 13) {
                enterKeyPressed = true;
                event.preventDefault();
            }
            */
        };
        // The public API is that of the classic stopwatch.
        // The states are INITIAL, RUNNING, PAUSED.
        var that = {
            start: function () {
                if (!that.isRunning) {
                    setUp();
                    $window.document.addEventListener('keydown', onDocumentKeyDown, false);
                    state = STATE_RUNNING;
                    requestID = $window.requestAnimationFrame(animate);
                }
                else {
                    throw new Error("The `start` method may only be called when not running.");
                }
            },
            stop: function () {
                if (that.isRunning) {
                    stopSignal = true;
                }
                else {
                    throw new Error("The `stop` method may only be called when running.");
                }
            },
            reset: function () {
                if (that.isPaused) {
                    startTime = undefined;
                    elapsed = 0;
                    state = STATE_INITIAL;
                }
                else {
                    throw new Error("The `reset` method may only be called when paused.");
                }
            },
            get time() {
                return elapsed / MILLIS_PER_SECOND;
            },
            lap: function () {
                if (that.isRunning) {
                }
                else {
                    throw new Error("The `lap` method may only be called when running.");
                }
            },
            get isRunning() {
                return state === STATE_RUNNING;
            },
            get isPaused() {
                return state === STATE_PAUSED;
            }
        };
        return that;
    }
    visual.animationRunner = animationRunner;
})(visual || (visual = {}));
/// <reference path="../../vendor/davinci-blade/dist/davinci-blade.d.ts"/>
/**
 * The `visual` modile provides convenience abstractions for 3D modeling.
 */
var visual;
(function (visual) {
    /**
     * The version of the visual module.
     */
    visual.VERSION = '1.6.0';
    /**
     * Returns a grade zero Euclidean 3D multivector (scalar).
     * @param w The scalar value.
     */
    function scalarE3(w) {
        return new blade.Euclidean3(w, 0, 0, 0, 0, 0, 0, 0);
    }
    visual.scalarE3 = scalarE3;
    /**
     * Returns a grade one Euclidean 3D multivector (vector) with the specified Cartesian coordinates.
     * @param x The x-coordinate.
     * @param y The y-coordinate.
     * @param z The z-coordinate.
     */
    function vectorE3(x, y, z) {
        return new blade.Euclidean3(0, x, y, z, 0, 0, 0, 0);
    }
    visual.vectorE3 = vectorE3;
    /**
     * Returns a grade two Euclidean 3D multivector (bivector) with the specified Cartesian coordinates.
     * @param xy The xy-coordinate.
     * @param yz The yz-coordinate.
     * @param zx The zx-coordinate.
     */
    function bivectorE3(xy, yz, zx) {
        return new blade.Euclidean3(0, 0, 0, 0, xy, yz, zx, 0);
    }
    visual.bivectorE3 = bivectorE3;
    /**
     * Returns a grade three Euclidean 3D multivector (pseudoscalar).
     * @param xyz The pseudoscalar value.
     */
    function pseudoE3(xyz) {
        return new blade.Euclidean3(0, 0, 0, 0, 0, 0, 0, xyz);
    }
    visual.pseudoE3 = pseudoE3;
})(visual || (visual = {}));
;

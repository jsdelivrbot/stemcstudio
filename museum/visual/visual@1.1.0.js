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
     * Visual provides the common behavior for all Mesh (Geometry, Material) objects.
     */
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, material) {
            this.geometry = geometry;
            this.material = material;
            _super.call(this, geometry, this.material);
        }
        Object.defineProperty(Mesh.prototype, "pos", {
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
/// <reference path="ArrowGeometry.ts"/>
/// <reference path="Mesh.ts"/>
var visual;
(function (visual) {
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
            parameters.color = typeof parameters.color === 'number' ? parameters.color : 0xFFFFFF;
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
    var Box = (function (_super) {
        __extends(Box, _super);
        function Box(parameters) {
            parameters = parameters || {};
            parameters.width = parameters.width || 1.0;
            parameters.height = parameters.height || 1.0;
            parameters.depth = parameters.depth || 1.0;
            parameters.color = typeof parameters.color === 'number' ? parameters.color : 0xFFFFFF;
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
    var Sphere = (function (_super) {
        __extends(Sphere, _super);
        function Sphere(parameters) {
            parameters = parameters || {};
            parameters.radius = parameters.radius || 1.0;
            parameters.color = typeof parameters.color === 'number' ? parameters.color : 0xFFFFFF;
            parameters.opacity = typeof parameters.opacity === 'number' ? parameters.opacity : 1.0;
            parameters.transparent = typeof parameters.transparent === 'boolean' ? parameters.transparent : false;
            var material = new THREE.MeshLambertMaterial({ color: parameters.color, opacity: parameters.opacity, transparent: parameters.transparent });
            _super.call(this, new THREE.SphereGeometry(parameters.radius, parameters.widthSegments, parameters.heightSegments, parameters.phiStart, parameters.phiLength, parameters.thetaStart, parameters.thetaLength), material);
        }
        return Sphere;
    })(visual.Mesh);
    visual.Sphere = Sphere;
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
    var Workbench3D = (function () {
        function Workbench3D(canvas, renderer, camera, controls, wnd) {
            this.canvas = canvas;
            this.renderer = renderer;
            this.camera = camera;
            this.controls = controls;
            this.wnd = wnd;
            var self = this;
            function onWindowResize(event) {
                var width = wnd.innerWidth;
                var height = wnd.innerHeight;
                self.setSize(width, height);
                controls.handleResize();
            }
            this.sizer = onWindowResize;
        }
        Workbench3D.prototype.setSize = function (width, height) {
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.controls.setSize(width, height);
        };
        Workbench3D.prototype.setUp = function () {
            this.wnd.document.body.insertBefore(this.canvas, this.wnd.document.body.firstChild);
            this.wnd.addEventListener('resize', this.sizer, false);
            this.sizer(null);
        };
        Workbench3D.prototype.tearDown = function () {
            this.wnd.removeEventListener('resize', this.sizer, false);
            removeElementsByTagName(this.wnd.document, "canvas");
        };
        return Workbench3D;
    })();
    visual.Workbench3D = Workbench3D;
})(visual || (visual = {}));
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="TrackBall.ts"/>
var visual;
(function (visual) {
    visual.trackball = function (object, wnd) {
        var document = wnd.document;
        var documentElement = document.documentElement;
        var screen = { left: 0, top: 0, width: 0, height: 0 };
        var api = {
            enabled: true,
            rotateSpeed: 1.0,
            zoomSpeed: 1.2,
            panSpeed: 0.3,
            noRotate: false,
            noZoom: false,
            noPan: false,
            staticMoving: false,
            dynamicDampingFactor: 0.2,
            minDistance: 0,
            maxDistance: Infinity,
            keys: [65, 83, 68],
            update: function () {
                eye.subVectors(object.position, target);
                if (!api.noRotate) {
                    rotateCamera();
                }
                if (!api.noZoom) {
                    zoomCamera();
                }
                if (!api.noPan) {
                    panCamera();
                }
                object.position.addVectors(target, eye);
                checkDistances();
                object.lookAt(target);
                if (lastPosition.distanceToSquared(object.position) > EPS) {
                    // TODO      dispatchEvent( changeEvent );
                    lastPosition.copy(object.position);
                }
            },
            handleResize: function () {
                var box = documentElement.getBoundingClientRect();
                screen.left = box.left + wnd.pageXOffset - documentElement.clientLeft;
                screen.top = box.top + wnd.pageYOffset - documentElement.clientTop;
                screen.width = box.width;
                screen.height = box.height;
            },
            setSize: function (width, height) {
                screen.width = width;
                screen.height = height;
            }
        };
        var getMouseOnScreen = (function () {
            var vector = new THREE.Vector2();
            return function (pageX, pageY) {
                vector.set((pageX - screen.left) / screen.width, (pageY - screen.top) / screen.height);
                return vector;
            };
        }());
        var getMouseOnCircle = (function () {
            var vector = new THREE.Vector2();
            return function (pageX, pageY) {
                vector.set(((pageX - screen.width * 0.5 - screen.left) / (screen.width * 0.5)), ((screen.height + 2 * (screen.top - pageY)) / screen.width));
                return vector;
            };
        }());
        var moveCurr = new THREE.Vector2();
        var movePrev = new THREE.Vector2();
        var eye = new THREE.Vector3();
        var target = new THREE.Vector3();
        var lastAxis = new THREE.Vector3();
        var lastAngle = 0;
        var rotateCamera = (function () {
            var axis = new THREE.Vector3(), quaternion = new THREE.Quaternion(), eyeDirection = new THREE.Vector3(), objectUpDirection = new THREE.Vector3(), objectSidewaysDirection = new THREE.Vector3(), moveDirection = new THREE.Vector3(), angle;
            return function () {
                moveDirection.set(moveCurr.x - movePrev.x, moveCurr.y - movePrev.y, 0);
                angle = moveDirection.length();
                if (angle) {
                    eye.copy(object.position).sub(target);
                    eyeDirection.copy(eye).normalize();
                    objectUpDirection.copy(object.up).normalize();
                    objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize();
                    objectUpDirection.setLength(moveCurr.y - movePrev.y);
                    objectSidewaysDirection.setLength(moveCurr.x - movePrev.x);
                    moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));
                    axis.crossVectors(moveDirection, eye).normalize();
                    angle *= api.rotateSpeed;
                    quaternion.setFromAxisAngle(axis, angle);
                    eye.applyQuaternion(quaternion);
                    object.up.applyQuaternion(quaternion);
                    lastAxis.copy(axis);
                    lastAngle = angle;
                }
                else if (!api.staticMoving && lastAngle) {
                    lastAngle *= Math.sqrt(1.0 - api.dynamicDampingFactor);
                    eye.copy(object.position).sub(target);
                    quaternion.setFromAxisAngle(lastAxis, lastAngle);
                    eye.applyQuaternion(quaternion);
                    object.up.applyQuaternion(quaternion);
                }
                movePrev.copy(moveCurr);
            };
        }());
        var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };
        var state = STATE.NONE;
        var prevState = STATE.NONE;
        var zoomStart = new THREE.Vector2();
        var zoomEnd = new THREE.Vector2();
        var touchZoomDistanceStart = 0;
        var touchZoomDistanceEnd = 0;
        var panStart = new THREE.Vector2();
        var panEnd = new THREE.Vector2();
        var zoomCamera = function () {
            var factor;
            if (state === STATE.TOUCH_ZOOM_PAN) {
                factor = touchZoomDistanceStart / touchZoomDistanceEnd;
                touchZoomDistanceStart = touchZoomDistanceEnd;
                eye.multiplyScalar(factor);
            }
            else {
                factor = 1.0 + (zoomEnd.y - zoomStart.y) * api.zoomSpeed;
                if (factor !== 1.0 && factor > 0.0) {
                    eye.multiplyScalar(factor);
                    if (api.staticMoving) {
                        zoomStart.copy(zoomEnd);
                    }
                    else {
                        zoomStart.y += (zoomEnd.y - zoomStart.y) * api.dynamicDampingFactor;
                    }
                }
            }
        };
        var panCamera = (function () {
            var mouseChange = new THREE.Vector2(), objectUp = new THREE.Vector3(), pan = new THREE.Vector3();
            return function () {
                mouseChange.copy(panEnd).sub(panStart);
                if (mouseChange.lengthSq()) {
                    mouseChange.multiplyScalar(eye.length() * api.panSpeed);
                    pan.copy(eye).cross(object.up).setLength(mouseChange.x);
                    pan.add(objectUp.copy(object.up).setLength(mouseChange.y));
                    object.position.add(pan);
                    target.add(pan);
                    if (api.staticMoving) {
                        panStart.copy(panEnd);
                    }
                    else {
                        panStart.add(mouseChange.subVectors(panEnd, panStart).multiplyScalar(api.dynamicDampingFactor));
                    }
                }
            };
        }());
        var checkDistances = function () {
            if (!api.noZoom || !api.noPan) {
                if (eye.lengthSq() > api.maxDistance * api.maxDistance) {
                    object.position.addVectors(target, eye.setLength(api.maxDistance));
                }
                if (eye.lengthSq() < api.minDistance * api.minDistance) {
                    object.position.addVectors(target, eye.setLength(api.minDistance));
                }
            }
        };
        var EPS = 0.000001;
        var lastPosition = new THREE.Vector3();
        // events
        var changeEvent = { type: 'change' };
        var startEvent = { type: 'start' };
        var endEvent = { type: 'end' };
        // for reset
        var target0 = target.clone();
        var position0 = object.position.clone();
        var up0 = object.up.clone();
        var reset = function () {
            state = STATE.NONE;
            prevState = STATE.NONE;
            target.copy(target0);
            object.position.copy(position0);
            object.up.copy(up0);
            eye.subVectors(object.position, target);
            object.lookAt(target);
            // TODO    dispatchEvent( changeEvent );
            lastPosition.copy(object.position);
        };
        // listeners
        function keydown(event) {
            if (api.enabled === false)
                return;
            wnd.removeEventListener('keydown', keydown);
            prevState = state;
            if (state !== STATE.NONE) {
                return;
            }
            else if (event.keyCode === api.keys[STATE.ROTATE] && !api.noRotate) {
                state = STATE.ROTATE;
            }
            else if (event.keyCode === api.keys[STATE.ZOOM] && !api.noZoom) {
                state = STATE.ZOOM;
            }
            else if (event.keyCode === api.keys[STATE.PAN] && !api.noPan) {
                state = STATE.PAN;
            }
        }
        function keyup(event) {
            if (api.enabled === false)
                return;
            state = prevState;
            wnd.addEventListener('keydown', keydown, false);
        }
        function mousedown(event) {
            if (api.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            if (state === STATE.NONE) {
                state = event.button;
            }
            if (state === STATE.ROTATE && !api.noRotate) {
                moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
                movePrev.copy(moveCurr);
            }
            else if (state === STATE.ZOOM && !api.noZoom) {
                zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
                zoomEnd.copy(zoomStart);
            }
            else if (state === STATE.PAN && !api.noPan) {
                panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
                panEnd.copy(panStart);
            }
            document.addEventListener('mousemove', mousemove, false);
            document.addEventListener('mouseup', mouseup, false);
            // TODO dispatchEvent(startEvent);
        }
        function mousemove(event) {
            if (api.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            if (state === STATE.ROTATE && !api.noRotate) {
                movePrev.copy(moveCurr);
                moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
            }
            else if (state === STATE.ZOOM && !api.noZoom) {
                zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
            }
            else if (state === STATE.PAN && !api.noPan) {
                panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
            }
        }
        function mouseup(event) {
            if (api.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            state = STATE.NONE;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            // TODO dispatchEvent( endEvent );
        }
        function mousewheel(event) {
            if (api.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            var delta = 0;
            if (event.wheelDelta) {
                delta = event.wheelDelta / 40;
            }
            else if (event.detail) {
                delta = -event.detail / 3;
            }
            zoomStart.y += delta * 0.01;
            //        dispatchEvent( startEvent );
            //        dispatchEvent( endEvent );
        }
        function touchstart(event) {
            if (api.enabled === false)
                return;
            switch (event.touches.length) {
                case 1:
                    state = STATE.TOUCH_ROTATE;
                    moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                    movePrev.copy(moveCurr);
                    break;
                case 2:
                    state = STATE.TOUCH_ZOOM_PAN;
                    var dx = event.touches[0].pageX - event.touches[1].pageX;
                    var dy = event.touches[0].pageY - event.touches[1].pageY;
                    touchZoomDistanceEnd = touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);
                    var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                    var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                    panStart.copy(getMouseOnScreen(x, y));
                    panEnd.copy(panStart);
                    break;
                default:
                    state = STATE.NONE;
            }
            // dispatchEvent( startEvent );
        }
        function touchmove(event) {
            if (api.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            switch (event.touches.length) {
                case 1:
                    movePrev.copy(moveCurr);
                    moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                    break;
                case 2:
                    var dx = event.touches[0].pageX - event.touches[1].pageX;
                    var dy = event.touches[0].pageY - event.touches[1].pageY;
                    touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);
                    var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                    var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                    panEnd.copy(getMouseOnScreen(x, y));
                    break;
                default:
                    state = STATE.NONE;
            }
        }
        function touchend(event) {
            if (api.enabled === false)
                return;
            switch (event.touches.length) {
                case 1:
                    movePrev.copy(moveCurr);
                    moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                    break;
                case 2:
                    touchZoomDistanceStart = touchZoomDistanceEnd = 0;
                    var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                    var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                    panEnd.copy(getMouseOnScreen(x, y));
                    panStart.copy(panEnd);
                    break;
            }
            state = STATE.NONE;
            // dispatchEvent( endEvent );
        }
        // This works, bit we don't unhook it.
        documentElement.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        }, false);
        documentElement.addEventListener('mousedown', mousedown, false);
        documentElement.addEventListener('mousewheel', mousewheel, false);
        documentElement.addEventListener('DOMMouseScroll', mousewheel, false); // firefox
        documentElement.addEventListener('touchstart', touchstart, false);
        documentElement.addEventListener('touchend', touchend, false);
        documentElement.addEventListener('touchmove', touchmove, false);
        wnd.addEventListener('keydown', keydown, false);
        wnd.addEventListener('keyup', keyup, false);
        api.handleResize();
        // force an update at start
        api.update();
        return api;
    };
})(visual || (visual = {}));
/// <reference path="../../typings/createjs/createjs.d.ts"/>
/// <reference path="Workbench2D.ts"/>
/// <reference path="Workbench3D.ts"/>
/// <reference path="trackball.ts"/>
/// <reference path="TrackBall.ts"/>
var visual;
(function (visual) {
    var Visual = (function () {
        function Visual(wnd, canvas) {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(45, 1.0, 0.1, 10000);
            var ambientLight = new THREE.AmbientLight(0x111111);
            this.scene.add(ambientLight);
            var pointLight = new THREE.PointLight(0xFFFFFF);
            pointLight.position.set(10.0, 10.0, 10.0);
            this.scene.add(pointLight);
            var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
            directionalLight.position.set(0.0, 1.0, 0.0);
            this.scene.add(directionalLight);
            this.camera.position.set(4.0, 4.0, 4.0);
            this.camera.up.set(0, 0, 1);
            this.camera.lookAt(this.scene.position);
            this.controls = visual.trackball(this.camera, wnd);
            if (canvas) {
                this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
                this.workbench3D = new visual.Workbench3D(canvas, this.renderer, this.camera, this.controls, wnd);
            }
            else {
                this.renderer = new THREE.WebGLRenderer();
                this.workbench3D = new visual.Workbench3D(this.renderer.domElement, this.renderer, this.camera, this.controls, wnd);
            }
            this.renderer.setClearColor(new THREE.Color(0x080808), 1.0);
            this.canvas2D = wnd.document.createElement("canvas");
            this.canvas2D.style.position = "absolute";
            this.canvas2D.style.top = "0px";
            this.canvas2D.style.left = "0px";
            this.workbench2D = new visual.Workbench2D(this.canvas2D, wnd);
            if (typeof createjs !== 'undefined') {
                this.stage = new createjs.Stage(this.canvas2D);
                this.stage.autoClear = true;
            }
            this.controls.rotateSpeed = 1.0;
            this.controls.zoomSpeed = 1.2;
            this.controls.panSpeed = 0.8;
            this.controls.noZoom = false;
            this.controls.noPan = false;
            this.controls.staticMoving = true;
            this.controls.dynamicDampingFactor = 0.3;
            this.controls.keys = [65, 83, 68];
            function render() {
            }
            //  this.controls.addEventListener( 'change', render );
        }
        Visual.prototype.add = function (object) {
            this.scene.add(object);
        };
        /**
         * Resizes the canvas to (width, height), and also sets the viewport to fit that size.
         */
        Visual.prototype.setSize = function (width, height) {
            this.workbench3D.setSize(width, height);
            this.workbench2D.setSize(width, height);
            this.controls.setSize(width, height);
        };
        Visual.prototype.setUp = function () {
            this.workbench3D.setUp();
            this.workbench2D.setUp();
        };
        Visual.prototype.tearDown = function () {
            this.workbench3D.tearDown();
            this.workbench2D.tearDown();
        };
        /**
         * Render the 3D scene using the camera.
         */
        Visual.prototype.update = function () {
            this.renderer.render(this.scene, this.camera);
            this.controls.update();
            if (this.stage) {
                this.stage.update();
            }
        };
        return Visual;
    })();
    visual.Visual = Visual;
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
/// <reference path="VortexGeometry.ts"/>
/// <reference path="Mesh.ts"/>
var visual;
(function (visual) {
    /**
     * Vortex is used to represent geometric objects with a non-zero curl.
     */
    var Vortex = (function (_super) {
        __extends(Vortex, _super);
        function Vortex(parameters) {
            parameters = parameters || { radius: 1.0, radiusCone: 0.08, color: 0xFFFFFF, opacity: 1.0, transparent: false };
            parameters.radius = parameters.radius || 1.0;
            parameters.radiusCone = parameters.radiusCone || 0.08;
            parameters.color = typeof parameters.color === 'number' ? parameters.color : 0xFFFFFF;
            parameters.opacity = typeof parameters.opacity === 'number' ? parameters.opacity : 1.0;
            parameters.transparent = typeof parameters.transparent === 'boolean' ? parameters.transparent : false;
            var material = new THREE.MeshLambertMaterial({ color: parameters.color, opacity: parameters.opacity, transparent: parameters.transparent });
            _super.call(this, new visual.VortexGeometry(parameters.radius, parameters.radiusCone, 0.01, 0.02, 0.075), material);
        }
        return Vortex;
    })(visual.Mesh);
    visual.Vortex = Vortex;
})(visual || (visual = {}));
/// <reference path="../../vendor/davinci-blade/dist/davinci-blade.d.ts"/>
/**
 *
 */
var visual;
(function (visual) {
    /**
     * The version of the visual module.
     */
    visual.VERSION = '1.1.0';
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

/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="TrackBall.ts"/>
module visual {

export var trackball = function(object: THREE.Object3D, wnd: Window): TrackBall {
    var document = wnd.document;
    var documentElement = document.documentElement;
    var screen = {left: 0, top: 0, width: 0, height: 0};
    var api: TrackBall = {
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
        keys: [65 /*A*/, 83 /*S*/, 68 /*D*/],
        update: function() {
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
            if (lastPosition.distanceToSquared( object.position) > EPS) {
                // TODO      dispatchEvent( changeEvent );
                lastPosition.copy(object.position);
            }
        },
        handleResize: function() {
            var box = documentElement.getBoundingClientRect();
            screen.left = box.left + wnd.pageXOffset - documentElement.clientLeft;
            screen.top = box.top + wnd.pageYOffset - documentElement.clientTop;
            screen.width = box.width;
            screen.height = box.height;
        }
    };
    var getMouseOnScreen: (pageX: number, pageY: number) => THREE.Vector2 = (function() {
        var vector = new THREE.Vector2();
        return function (pageX: number, pageY: number) {
            vector.set((pageX - screen.left) / screen.width, (pageY - screen.top) / screen.height);
            return vector;
        };
    }());
    var getMouseOnCircle: (pageX: number, pageY: number) => THREE.Vector2 = ( function () {
        var vector = new THREE.Vector2();
        return function (pageX: number, pageY: number) {
            vector.set(
                ( ( pageX - screen.width * 0.5 - screen.left ) / ( screen.width * 0.5 ) ),
                ( ( screen.height + 2 * ( screen.top - pageY ) ) / screen.width )
            );
        return vector;
        };
    }() );
    var moveCurr = new THREE.Vector2();
    var movePrev = new THREE.Vector2();
    var eye = new THREE.Vector3();
    var target = new THREE.Vector3();
    var lastAxis = new THREE.Vector3();
    var lastAngle = 0;
    var rotateCamera = (function() {
        var axis = new THREE.Vector3(),
        quaternion = new THREE.Quaternion(),
        eyeDirection = new THREE.Vector3(),
        objectUpDirection = new THREE.Vector3(),
        objectSidewaysDirection = new THREE.Vector3(),
        moveDirection = new THREE.Vector3(),
        angle;
        return function () {
            moveDirection.set( moveCurr.x - movePrev.x, moveCurr.y - movePrev.y, 0 );
            angle = moveDirection.length();
            if ( angle ) {
                eye.copy( object.position ).sub(target);
                eyeDirection.copy(eye).normalize();
                objectUpDirection.copy(object.up).normalize();
                objectSidewaysDirection.crossVectors( objectUpDirection, eyeDirection ).normalize();
                objectUpDirection.setLength(moveCurr.y - movePrev.y);
                objectSidewaysDirection.setLength(moveCurr.x - movePrev.x);
                moveDirection.copy( objectUpDirection.add( objectSidewaysDirection ) );
                axis.crossVectors( moveDirection, eye ).normalize();
                angle *= api.rotateSpeed;
                quaternion.setFromAxisAngle( axis, angle );
                eye.applyQuaternion( quaternion );
                object.up.applyQuaternion( quaternion );
                lastAxis.copy( axis );
                lastAngle = angle;
            }
            else if ( !api.staticMoving && lastAngle ) {
                lastAngle *= Math.sqrt( 1.0 - api.dynamicDampingFactor );
                eye.copy(object.position).sub(target);
                quaternion.setFromAxisAngle(lastAxis, lastAngle);
                eye.applyQuaternion( quaternion );
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
            eye.multiplyScalar( factor );
        }
        else {
            factor = 1.0 + ( zoomEnd.y - zoomStart.y ) * api.zoomSpeed;
            if ( factor !== 1.0 && factor > 0.0 ) {
                eye.multiplyScalar( factor );
                    if ( api.staticMoving ) {
                        zoomStart.copy( zoomEnd );
                    }
                    else {
                        zoomStart.y += ( zoomEnd.y - zoomStart.y ) * api.dynamicDampingFactor;
                    }
            }
        }
    };
    var panCamera = (function() {
        var mouseChange = new THREE.Vector2(),
        objectUp = new THREE.Vector3(),
        pan = new THREE.Vector3();
        return function () {
            mouseChange.copy(panEnd).sub(panStart);
            if ( mouseChange.lengthSq() ) {
                mouseChange.multiplyScalar( eye.length() * api.panSpeed );
                pan.copy(eye).cross(object.up).setLength( mouseChange.x );
                pan.add( objectUp.copy(object.up).setLength( mouseChange.y ) );
                object.position.add( pan );
                target.add( pan );
                if (api.staticMoving ) {
                    panStart.copy(panEnd);
                }
                else {
                    panStart.add( mouseChange.subVectors( panEnd, panStart ).multiplyScalar( api.dynamicDampingFactor ) );
                }
            }
        };
    }());
    var checkDistances = function () {
        if ( !api.noZoom || !api.noPan ) {
            if ( eye.lengthSq() > api.maxDistance * api.maxDistance ) {
                object.position.addVectors( target, eye.setLength( api.maxDistance ) );
            }
            if ( eye.lengthSq() < api.minDistance * api.minDistance ) {
                object.position.addVectors( target, eye.setLength( api.minDistance ) );
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
        target.copy( target0 );
        object.position.copy( position0 );
        object.up.copy( up0 );
        eye.subVectors( object.position, target );
        object.lookAt( target );
        // TODO    dispatchEvent( changeEvent );
        lastPosition.copy( object.position );
    };
    // listeners
    function keydown( event ) {
        if ( api.enabled === false )
            return;
        wnd.removeEventListener( 'keydown', keydown );
        prevState = state;
        if ( state !== STATE.NONE ) {
            return;
        }
        else if ( event.keyCode === api.keys[ STATE.ROTATE ] && !api.noRotate ) {
            state = STATE.ROTATE;
        }
        else if ( event.keyCode === api.keys[ STATE.ZOOM ] && !api.noZoom ) {
            state = STATE.ZOOM;
        }
        else if ( event.keyCode === api.keys[ STATE.PAN ] && !api.noPan ) {
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
        else if (state === STATE.ZOOM && !api.noZoom ) {
            zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
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
    function mousemove( event ) {
        if (api.enabled === false)
            return;
        event.preventDefault();
        event.stopPropagation();
        if (state === STATE.ROTATE && !api.noRotate ) {
            movePrev.copy(moveCurr);
            moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
        }
        else if (state === STATE.ZOOM && !api.noZoom) {
            zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
        } else if (state === STATE.PAN && !api.noPan) {
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
    function mousewheel(event: MouseWheelEvent) {
        if (api.enabled === false)
            return;
        event.preventDefault();
        event.stopPropagation();
        var delta = 0;
        if (event.wheelDelta) { // WebKit / Opera / Explorer 9
            delta = event.wheelDelta / 40;
        }
        else if (event.detail) { // Firefox
            delta = - event.detail / 3;
        }
        zoomStart.y += delta * 0.01;
//        dispatchEvent( startEvent );
//        dispatchEvent( endEvent );
    }
    function touchstart( event ) {
        if (api.enabled === false )
            return;
        switch (event.touches.length) {
            case 1:
                state = STATE.TOUCH_ROTATE;
                moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                movePrev.copy(moveCurr);
                break;
            case 2:
                state = STATE.TOUCH_ZOOM_PAN;
                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                touchZoomDistanceEnd = touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );
                var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                panStart.copy( getMouseOnScreen( x, y ) );
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
                moveCurr.copy( getMouseOnCircle(  event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                break;
            case 2:
                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );
                var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                panEnd.copy( getMouseOnScreen( x, y ) );
                break;
            default:
                state = STATE.NONE;
        }
    }
    function touchend( event ) {
        if (api.enabled === false)
            return;
        switch (event.touches.length) {
            case 1:
                movePrev.copy(moveCurr);
                moveCurr.copy(getMouseOnCircle(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY));
                break;
            case 2:
                touchZoomDistanceStart = touchZoomDistanceEnd = 0;
                var x = (event.touches[ 0 ].pageX + event.touches[ 1 ].pageX) / 2;
                var y = (event.touches[ 0 ].pageY + event.touches[ 1 ].pageY) / 2;
                panEnd.copy(getMouseOnScreen(x, y));
                panStart.copy(panEnd);
                break;
        }
        state = STATE.NONE;
        // dispatchEvent( endEvent );
    }

    // This works, bit we don't unhook it.
    documentElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    documentElement.addEventListener( 'mousedown', mousedown, false );
    documentElement.addEventListener( 'mousewheel', mousewheel, false );
    documentElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox
    documentElement.addEventListener( 'touchstart', touchstart, false );
    documentElement.addEventListener( 'touchend', touchend, false );
    documentElement.addEventListener( 'touchmove', touchmove, false );
    wnd.addEventListener( 'keydown', keydown, false );
    wnd.addEventListener( 'keyup', keyup, false );

    api.handleResize();

    // force an update at start
    api.update();

    return api;
};
}
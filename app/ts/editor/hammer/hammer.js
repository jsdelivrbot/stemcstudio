var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './utils'], function (require, exports, utils_1) {
    "use strict";
    exports.TOUCH_ACTION_COMPUTE = 'compute';
    exports.TOUCH_ACTION_AUTO = 'auto';
    exports.TOUCH_ACTION_MANIPULATION = 'manipulation';
    exports.TOUCH_ACTION_NONE = 'none';
    exports.TOUCH_ACTION_PAN_X = 'pan-x';
    exports.TOUCH_ACTION_PAN_Y = 'pan-y';
    var STOP = 1;
    var FORCED_STOP = 2;
    var VectorE2 = (function () {
        function VectorE2(x, y) {
            this.x = x;
            this.y = y;
        }
        VectorE2.prototype.add = function (other) {
            return new VectorE2(this.x + other.x, this.y + other.y);
        };
        VectorE2.prototype.sub = function (other) {
            return new VectorE2(this.x - other.x, this.y - other.y);
        };
        VectorE2.prototype.div = function (other) {
            return new VectorE2(this.x / other, this.y / other);
        };
        VectorE2.prototype.dot = function (other) {
            return this.x * other.x + this.y * other.y;
        };
        VectorE2.prototype.norm = function () {
            return Math.sqrt(this.quadrance());
        };
        VectorE2.prototype.quadrance = function () {
            return this.x * this.x + this.y * this.y;
        };
        VectorE2.prototype.toString = function () {
            return 'VectorE2(' + this.x + ', ' + this.y + ')';
        };
        return VectorE2;
    })();
    exports.VectorE2 = VectorE2;
    var ClientLocation = (function () {
        function ClientLocation(clientX, clientY) {
            this.clientX = clientX;
            this.clientY = clientY;
        }
        ClientLocation.prototype.moveTo = function (clientX, clientY) {
            this.clientX = clientX;
            this.clientY = clientY;
        };
        ClientLocation.prototype.sub = function (other) {
            return new VectorE2(this.clientX - other.clientX, this.clientY - other.clientY);
        };
        ClientLocation.fromTouch = function (touch) {
            return new ClientLocation(touch.clientX, touch.clientY);
        };
        ClientLocation.prototype.toString = function () {
            return 'ClientLocation(' + this.clientX + ', ' + this.clientY + ')';
        };
        return ClientLocation;
    })();
    exports.ClientLocation = ClientLocation;
    var Session = (function () {
        function Session() {
            this.compEvents = [];
            this.reset();
        }
        Session.prototype.reset = function () {
            this.startTime = Date.now();
            this.compEvents = [];
            this.curRecognizer = undefined;
        };
        Session.prototype.push = function (compEvent) {
            this.compEvents.push(compEvent);
        };
        Session.prototype.computeMovement = function (center) {
            if (center) {
                if (this.compEvents.length > 0) {
                    var prev = this.compEvents[this.compEvents.length - 1];
                    return center.sub(prev.center);
                }
                else {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        };
        Session.prototype.computeVelocity = function (center, deltaTime) {
            if (center) {
                if (this.compEvents.length > 0) {
                    var prev = this.compEvents[this.compEvents.length - 1];
                    return center.sub(prev.center).div(deltaTime - prev.deltaTime);
                }
                else {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        };
        return Session;
    })();
    exports.Session = Session;
    var Manager = (function () {
        function Manager(element) {
            this.handlers = {};
            this.session = new Session();
            this.recognizers = [];
            this.domEvents = false;
            this.enable = true;
            this.cssProps = {};
            this.element = element;
            this.inputTarget = element;
            this.input = new TouchInput(this, inputHandler);
            this.touchAction = new TouchAction(this, exports.TOUCH_ACTION_COMPUTE);
            this.toggleCssProps(true);
        }
        Manager.prototype.stop = function (force) {
            this.session.stopped = force ? FORCED_STOP : STOP;
        };
        Manager.prototype.recognize = function (inputData, touchEvent) {
            var session = this.session;
            if (session.stopped) {
                return;
            }
            this.touchAction.preventDefaults(inputData, touchEvent);
            var recognizer;
            var recognizers = this.recognizers;
            var curRecognizer = session.curRecognizer;
            if (!curRecognizer || (curRecognizer && curRecognizer.state & exports.STATE_RECOGNIZED)) {
                curRecognizer = session.curRecognizer = null;
            }
            var i = 0;
            while (i < recognizers.length) {
                recognizer = recognizers[i];
                if (session.stopped !== FORCED_STOP && (!curRecognizer || recognizer == curRecognizer ||
                    recognizer.canRecognizeWith(curRecognizer))) {
                    recognizer.recognize(inputData);
                }
                else {
                    recognizer.reset();
                }
                if (!curRecognizer && recognizer.state & (exports.STATE_BEGAN | exports.STATE_CHANGED | exports.STATE_RECOGNIZED)) {
                    curRecognizer = session.curRecognizer = recognizer;
                }
                i++;
            }
        };
        Manager.prototype.get = function (eventName) {
            var recognizers = this.recognizers;
            for (var i = 0; i < recognizers.length; i++) {
                if (recognizers[i].eventName === eventName) {
                    return recognizers[i];
                }
            }
            return null;
        };
        Manager.prototype.add = function (recognizer) {
            var existing = this.get(recognizer.eventName);
            if (existing) {
                this.remove(existing);
            }
            this.recognizers.push(recognizer);
            recognizer.manager = this;
            this.touchAction.update();
            return recognizer;
        };
        Manager.prototype.remove = function (recognizer) {
            var recognizers = this.recognizers;
            recognizer = this.get(recognizer.eventName);
            recognizers.splice(utils_1.inArray(recognizers, recognizer), 1);
            this.touchAction.update();
            return this;
        };
        Manager.prototype.on = function (events, handler) {
            var handlers = this.handlers;
            utils_1.each(utils_1.splitStr(events), function (event) {
                handlers[event] = handlers[event] || [];
                handlers[event].push(handler);
            });
            return this;
        };
        Manager.prototype.off = function (events, handler) {
            var handlers = this.handlers;
            utils_1.each(utils_1.splitStr(events), function (event) {
                if (!handler) {
                    delete handlers[event];
                }
                else {
                    handlers[event].splice(utils_1.inArray(handlers[event], handler), 1);
                }
            });
            return this;
        };
        Manager.prototype.emit = function (eventName, data) {
            if (this.domEvents) {
                triggerDomEvent(event, data);
            }
            var handlers = this.handlers[eventName] && this.handlers[eventName].slice();
            if (!handlers || !handlers.length) {
                return;
            }
            var i = 0;
            while (i < handlers.length) {
                handlers[i](data);
                i++;
            }
        };
        Manager.prototype.updateTouchAction = function () {
            this.touchAction.update();
        };
        Manager.prototype.destroy = function () {
            this.element && this.toggleCssProps(false);
            this.handlers = {};
            this.session = undefined;
            this.input.destroy();
            this.element = null;
        };
        Manager.prototype.toggleCssProps = function (add) {
            if (!this.element.style) {
                return;
            }
            var element = this.element;
            utils_1.each(this.cssProps, function (value, name) {
                element.style[utils_1.prefixed(element.style, name)] = add ? value : '';
            });
        };
        Manager.prototype.cancelContextMenu = function () {
        };
        return Manager;
    })();
    exports.Manager = Manager;
    function triggerDomEvent(event, data) {
        var gestureEvent = document.createEvent('Event');
        gestureEvent.initEvent(event, true, true);
        gestureEvent['gesture'] = data;
        data.target.dispatchEvent(gestureEvent);
    }
    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
    var SUPPORT_TOUCH = ('ontouchstart' in window);
    var SUPPORT_POINTER_EVENTS = utils_1.prefixed(window, 'PointerEvent') !== undefined;
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
    var PREFIXED_TOUCH_ACTION = utils_1.prefixed(utils_1.TEST_ELEMENT.style, 'touchAction');
    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;
    var TouchAction = (function () {
        function TouchAction(manager, value) {
            this.manager = manager;
            this.set(value);
        }
        TouchAction.prototype.set = function (value) {
            if (value === exports.TOUCH_ACTION_COMPUTE) {
                value = this.compute();
            }
            if (NATIVE_TOUCH_ACTION && this.manager.element.style) {
                this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
            }
            this.actions = value.toLowerCase().trim();
        };
        TouchAction.prototype.update = function () {
            this.set(exports.TOUCH_ACTION_COMPUTE);
        };
        TouchAction.prototype.compute = function () {
            var actions = [];
            utils_1.each(this.manager.recognizers, function (recognizer) {
                if (recognizer.enabled) {
                    actions = actions.concat(recognizer.getTouchAction());
                }
            });
            return cleanTouchActions(actions.join(' '));
        };
        TouchAction.prototype.preventDefaults = function (input, touchEvent) {
            if (NATIVE_TOUCH_ACTION) {
                return;
            }
            if (this.prevented) {
                touchEvent.preventDefault();
                return;
            }
        };
        TouchAction.prototype.preventSrc = function (srcEvent) {
            this.prevented = true;
            srcEvent.preventDefault();
        };
        return TouchAction;
    })();
    function cleanTouchActions(actions) {
        if (utils_1.inStr(actions, exports.TOUCH_ACTION_NONE)) {
            return exports.TOUCH_ACTION_NONE;
        }
        var hasPanX = utils_1.inStr(actions, exports.TOUCH_ACTION_PAN_X);
        var hasPanY = utils_1.inStr(actions, exports.TOUCH_ACTION_PAN_Y);
        if (hasPanX && hasPanY) {
            return exports.TOUCH_ACTION_PAN_X + ' ' + exports.TOUCH_ACTION_PAN_Y;
        }
        if (hasPanX || hasPanY) {
            return hasPanX ? exports.TOUCH_ACTION_PAN_X : exports.TOUCH_ACTION_PAN_Y;
        }
        if (utils_1.inStr(actions, exports.TOUCH_ACTION_MANIPULATION)) {
            return exports.TOUCH_ACTION_MANIPULATION;
        }
        return exports.TOUCH_ACTION_AUTO;
    }
    exports.INPUT_TYPE_TOUCH = 'touch';
    exports.INPUT_TYPE_PEN = 'pen';
    exports.INPUT_TYPE_MOUSE = 'mouse';
    exports.INPUT_TYPE_KINECT = 'kinect';
    var COMPUTE_INTERVAL = 25;
    exports.INPUT_START = 1;
    exports.INPUT_MOVE = 2;
    exports.INPUT_END = 4;
    exports.INPUT_CANCEL = 8;
    function decodeEventType(eventType) {
        switch (eventType) {
            case exports.INPUT_START: {
                return "START";
            }
            case exports.INPUT_MOVE: {
                return "MOVE";
            }
            case exports.INPUT_END: {
                return "END";
            }
            case exports.INPUT_CANCEL: {
                return "CANCEL";
            }
            default: {
                return "eventType=" + eventType;
            }
        }
    }
    exports.decodeEventType = decodeEventType;
    exports.DIRECTION_UNDEFINED = 0;
    exports.DIRECTION_LEFT = 1;
    exports.DIRECTION_RIGHT = 2;
    exports.DIRECTION_UP = 4;
    exports.DIRECTION_DOWN = 8;
    exports.DIRECTION_HORIZONTAL = exports.DIRECTION_LEFT | exports.DIRECTION_RIGHT;
    exports.DIRECTION_VERTICAL = exports.DIRECTION_UP | exports.DIRECTION_DOWN;
    exports.DIRECTION_ALL = exports.DIRECTION_HORIZONTAL | exports.DIRECTION_VERTICAL;
    var PROPS_XY = ['x', 'y'];
    var PROPS_CLIENT_XY = ['clientX', 'clientY'];
    var Input = (function () {
        function Input(manager, touchElementEvents, touchTargetEvents, touchWindowEvents) {
            var self = this;
            this.manager = manager;
            this.evEl = touchElementEvents;
            this.evTarget = touchTargetEvents;
            this.evWin = touchWindowEvents;
            this.element = manager.element;
            this.target = manager.inputTarget;
            this.domHandler = function (event) {
                if (manager.enable) {
                    self.handler(event);
                }
            };
            this.init();
        }
        Input.prototype.handler = function (event) { };
        Input.prototype.init = function () {
            this.evEl && utils_1.addEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && utils_1.addEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && utils_1.addEventListeners(utils_1.getWindowForElement(this.element), this.evWin, this.domHandler);
        };
        Input.prototype.destroy = function () {
            this.evEl && utils_1.removeEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && utils_1.removeEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && utils_1.removeEventListeners(utils_1.getWindowForElement(this.element), this.evWin, this.domHandler);
        };
        return Input;
    })();
    function inputHandler(manager, eventType, touchEvent) {
        var compEvent = computeIComputedEvent(manager, eventType, touchEvent);
        manager.recognize(compEvent, touchEvent);
        manager.session.push(compEvent);
    }
    function computeIComputedEvent(manager, eventType, touchEvent) {
        var touchesLength = touchEvent.touches.length;
        var changedPointersLen = touchEvent.changedTouches.length;
        var isFirst = (eventType & exports.INPUT_START && (touchesLength - changedPointersLen === 0));
        var isFinal = (eventType & (exports.INPUT_END | exports.INPUT_CANCEL) && (touchesLength - changedPointersLen === 0));
        if (isFirst) {
            manager.session.reset();
        }
        var session = manager.session;
        var center = computeCenter(touchEvent.touches);
        var movement = session.computeMovement(center);
        var timeStamp = Date.now();
        var movementTime = timeStamp - session.startTime;
        var distance = movement ? movement.norm() : 0;
        var direction = getDirection(movement);
        var velocity = session.computeVelocity(center, movementTime);
        var compEvent = {
            center: center,
            movement: movement,
            deltaTime: movementTime,
            direction: direction,
            distance: distance,
            eventType: eventType,
            rotation: 0,
            timeStamp: timeStamp,
            touchesLength: touchEvent.touches.length,
            scale: 1,
            velocity: velocity
        };
        return compEvent;
    }
    function computeCenter(touches) {
        var touchesLength = touches.length;
        if (touchesLength === 1) {
            return ClientLocation.fromTouch(touches[0]);
        }
        else if (touchesLength === 0) {
            return undefined;
        }
        else {
            var x = 0, y = 0, i = 0;
            while (i < touchesLength) {
                x += touches[i].clientX;
                y += touches[i].clientY;
                i++;
            }
            return new ClientLocation(Math.round(x / touchesLength), Math.round(y / touchesLength));
        }
    }
    function getVelocity(deltaTime, x, y) {
        return { x: x / deltaTime || 0, y: y / deltaTime || 0 };
    }
    function getDirection(movement) {
        var N = new VectorE2(0, -1);
        var S = new VectorE2(0, +1);
        var E = new VectorE2(+1, 0);
        var W = new VectorE2(-1, 0);
        var cosineThreshold = Math.cos(7 * Math.PI / 16);
        if (movement) {
            var unit = movement.div(movement.norm());
            var direction = exports.DIRECTION_UNDEFINED;
            if (unit.dot(N) > cosineThreshold) {
                direction |= exports.DIRECTION_UP;
            }
            if (unit.dot(S) > cosineThreshold) {
                direction |= exports.DIRECTION_DOWN;
            }
            if (unit.dot(E) > cosineThreshold) {
                direction |= exports.DIRECTION_RIGHT;
            }
            if (unit.dot(W) > cosineThreshold) {
                direction |= exports.DIRECTION_LEFT;
            }
            return direction;
        }
        else {
            return exports.DIRECTION_UNDEFINED;
        }
    }
    function getDistance(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
        return Math.sqrt((x * x) + (y * y));
    }
    exports.getDistance = getDistance;
    function getAngle(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
        return Math.atan2(y, x) * 180 / Math.PI;
    }
    function getRotation(start, end) {
        return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
    }
    function getScale(start, end) {
        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
    }
    var TOUCH_INPUT_MAP = {
        touchstart: exports.INPUT_START,
        touchmove: exports.INPUT_MOVE,
        touchend: exports.INPUT_END,
        touchcancel: exports.INPUT_CANCEL
    };
    var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';
    var TouchInput = (function (_super) {
        __extends(TouchInput, _super);
        function TouchInput(manager, callback) {
            _super.call(this, manager, undefined, TOUCH_TARGET_EVENTS, undefined);
            this.targetIds = {};
            this.callback = callback;
        }
        TouchInput.prototype.handler = function (event) {
            var eventType = TOUCH_INPUT_MAP[event.type];
            this.callback(this.manager, eventType, event);
        };
        return TouchInput;
    })(Input);
    function getTouches(event, type) {
        var allTouches = utils_1.toArray(event.touches);
        var targetIds = this.targetIds;
        if (type & (exports.INPUT_START | exports.INPUT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches];
        }
        var i, targetTouches, changedTouches = utils_1.toArray(event.changedTouches), changedTargetTouches = [], target = this.target;
        targetTouches = allTouches.filter(function (touch) {
            return utils_1.hasParent(touch.target, target);
        });
        if (type === exports.INPUT_START) {
            i = 0;
            while (i < targetTouches.length) {
                targetIds[targetTouches[i].identifier] = true;
                i++;
            }
        }
        i = 0;
        while (i < changedTouches.length) {
            if (targetIds[changedTouches[i].identifier]) {
                changedTargetTouches.push(changedTouches[i]);
            }
            if (type & (exports.INPUT_END | exports.INPUT_CANCEL)) {
                delete targetIds[changedTouches[i].identifier];
            }
            i++;
        }
        if (!changedTargetTouches.length) {
            return;
        }
        return [
            utils_1.uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
            changedTargetTouches
        ];
    }
    exports.STATE_UNDEFINED = 0;
    exports.STATE_POSSIBLE = 1;
    exports.STATE_BEGAN = 2;
    exports.STATE_CHANGED = 4;
    exports.STATE_RECOGNIZED = 8;
    exports.STATE_CANCELLED = 16;
    exports.STATE_FAILED = 32;
    var Recognizer = (function () {
        function Recognizer(eventName, enabled) {
            this.simultaneous = {};
            this.requireFail = [];
            this.eventName = eventName;
            this.enabled = enabled;
            this.id = utils_1.uniqueId();
            this.manager = null;
            this.state = exports.STATE_POSSIBLE;
        }
        Recognizer.prototype.set = function (options) {
            this.manager && this.manager.updateTouchAction();
            return this;
        };
        Recognizer.prototype.recognizeWith = function (otherRecognizer) {
            var simultaneous = this.simultaneous;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
            if (!simultaneous[otherRecognizer.id]) {
                simultaneous[otherRecognizer.id] = otherRecognizer;
                otherRecognizer.recognizeWith(this);
            }
            return this;
        };
        Recognizer.prototype.dropRecognizeWith = function (otherRecognizer) {
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
            delete this.simultaneous[otherRecognizer.id];
            return this;
        };
        Recognizer.prototype.requireFailure = function (otherRecognizer) {
            var requireFail = this.requireFail;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
            if (utils_1.inArray(requireFail, otherRecognizer) === -1) {
                requireFail.push(otherRecognizer);
                otherRecognizer.requireFailure(this);
            }
            return this;
        };
        Recognizer.prototype.dropRequireFailure = function (otherRecognizer) {
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
            var index = utils_1.inArray(this.requireFail, otherRecognizer);
            if (index > -1) {
                this.requireFail.splice(index, 1);
            }
            return this;
        };
        Recognizer.prototype.hasRequireFailures = function () {
            return this.requireFail.length > 0;
        };
        Recognizer.prototype.canRecognizeWith = function (otherRecognizer) {
            return !!this.simultaneous[otherRecognizer.id];
        };
        Recognizer.prototype.emit = function () {
            var self = this;
            var state = this.state;
            function emit(withState) {
                var eventName = self.eventName + (withState ? stateStr(state) : '');
                self.manager.emit(eventName, undefined);
            }
            if (state < exports.STATE_RECOGNIZED) {
                emit(true);
            }
            emit(false);
            if (state >= exports.STATE_RECOGNIZED) {
                emit(true);
            }
        };
        Recognizer.prototype.tryEmit = function () {
            if (this.canEmit()) {
                return this.emit();
            }
            else {
            }
            this.state = exports.STATE_FAILED;
        };
        Recognizer.prototype.canEmit = function () {
            var i = 0;
            while (i < this.requireFail.length) {
                if (!(this.requireFail[i].state & (exports.STATE_FAILED | exports.STATE_POSSIBLE))) {
                    return false;
                }
                i++;
            }
            return true;
        };
        Recognizer.prototype.recognize = function (compEvent) {
            if (!this.enabled) {
                this.reset();
                this.state = exports.STATE_FAILED;
                return;
            }
            if (this.state & (exports.STATE_RECOGNIZED | exports.STATE_CANCELLED | exports.STATE_FAILED)) {
                this.state = exports.STATE_POSSIBLE;
            }
            this.state = this.process(compEvent);
            if (this.state & (exports.STATE_BEGAN | exports.STATE_CHANGED | exports.STATE_RECOGNIZED | exports.STATE_CANCELLED)) {
                this.tryEmit();
            }
        };
        Recognizer.prototype.process = function (inputData) {
            return exports.STATE_UNDEFINED;
        };
        Recognizer.prototype.getTouchAction = function () { return []; };
        Recognizer.prototype.reset = function () { };
        return Recognizer;
    })();
    exports.Recognizer = Recognizer;
    function stateStr(state) {
        if (state & exports.STATE_CANCELLED) {
            return 'cancel';
        }
        else if (state & exports.STATE_RECOGNIZED) {
            return 'end';
        }
        else if (state & exports.STATE_CHANGED) {
            return 'move';
        }
        else if (state & exports.STATE_BEGAN) {
            return 'start';
        }
        return '';
    }
    exports.stateStr = stateStr;
    function stateDecode(state) {
        var states = [];
        if (state & exports.STATE_POSSIBLE) {
            states.push('STATE_POSSIBLE');
        }
        else if (state & exports.STATE_CANCELLED) {
            states.push('STATE_CANCELLED');
        }
        else if (state & exports.STATE_RECOGNIZED) {
            states.push('STATE_RECOGNIZED');
        }
        else if (state & exports.STATE_CHANGED) {
            states.push('STATE_CHANGED');
        }
        else if (state & exports.STATE_BEGAN) {
            states.push('STATE_BEGAN');
        }
        else if (state & exports.STATE_UNDEFINED) {
            states.push('STATE_UNDEFINED');
        }
        else if (state & exports.STATE_FAILED) {
            states.push('STATE_FAILED');
        }
        else {
            states.push('' + state);
        }
        return states.join(' ');
    }
    exports.stateDecode = stateDecode;
    function directionStr(direction) {
        var ds = [];
        if (direction & exports.DIRECTION_DOWN) {
            ds.push('down');
        }
        if (direction & exports.DIRECTION_UP) {
            ds.push('up');
        }
        if (direction & exports.DIRECTION_LEFT) {
            ds.push('left');
        }
        if (direction & exports.DIRECTION_RIGHT) {
            ds.push('right');
        }
        return ds.join(' ');
    }
    exports.directionStr = directionStr;
    function getRecognizerByNameIfManager(recognizer, manager) {
        if (manager) {
            return manager.get(recognizer.eventName);
        }
        return recognizer;
    }
});

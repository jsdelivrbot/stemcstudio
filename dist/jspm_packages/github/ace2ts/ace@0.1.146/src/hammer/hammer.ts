"use strict";

import { addEventListeners, each, getWindowForElement, hasParent, inArray, inStr, prefixed, removeEventListeners, splitStr, TEST_ELEMENT, toArray, uniqueArray, uniqueId } from './utils';

export interface Touch {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
}

export interface TouchEvent extends Event {
    type: string;
    touches: Touch[];
    changedTouches: Touch[];
}

// magical touchAction value
export var TOUCH_ACTION_COMPUTE = 'compute';
export var TOUCH_ACTION_AUTO = 'auto';
export var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
export var TOUCH_ACTION_NONE = 'none';
export var TOUCH_ACTION_PAN_X = 'pan-x';
export var TOUCH_ACTION_PAN_Y = 'pan-y';

var STOP = 1;
var FORCED_STOP = 2;

export class VectorE2 {
    public x;
    public y;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    add(other: VectorE2): VectorE2 {
        return new VectorE2(this.x + other.x, this.y + other.y);
    }
    sub(other: VectorE2): VectorE2 {
        return new VectorE2(this.x - other.x, this.y - other.y);
    }
    div(other: number): VectorE2 {
        return new VectorE2(this.x / other, this.y / other);
    }
    dot(other: VectorE2): number {
        return this.x * other.x + this.y * other.y;
    }
    norm(): number {
        return Math.sqrt(this.quadrance());
    }
    quadrance(): number {
        return this.x * this.x + this.y * this.y;
    }
    toString(): string {
        return 'VectorE2(' + this.x + ', ' + this.y + ')';
    }
}

export class ClientLocation {
    public clientX;
    public clientY;
    constructor(clientX: number, clientY: number) {
        this.clientX = clientX;
        this.clientY = clientY;
    }
    moveTo(clientX: number, clientY: number) {
        this.clientX = clientX;
        this.clientY = clientY;
    }
    sub(other: ClientLocation): VectorE2 {
        return new VectorE2(this.clientX - other.clientX, this.clientY - other.clientY);
    }
    static fromTouch(touch: { clientX: number; clientY: number }) {
        return new ClientLocation(touch.clientX, touch.clientY);
    }
    toString(): string {
        return 'ClientLocation(' + this.clientX + ', ' + this.clientY + ')';
    }
}

export interface IComputedEvent {
    eventType: number;
    touchesLength: number;
    timeStamp: number;
    center: ClientLocation;
    rotation: number;
    deltaTime: number;
    distance: number;
    movement: VectorE2;
    direction: number;
    scale: number;
    velocity: VectorE2;
}

/**
 * Maintains the history of events for a gesture recognition.
 */
export class Session {
    public startTime: number;
    public stopped: number;
    public curRecognizer: IRecognizer;
    private compEvents: IComputedEvent[] = [];
    constructor() {
        this.reset();
    }
    reset(): void {
        this.startTime = Date.now();
        this.compEvents = [];
        this.curRecognizer = undefined;
    }
    push(compEvent: IComputedEvent): void {
        this.compEvents.push(compEvent);
    }
    computeMovement(center: ClientLocation): VectorE2 {
        if (center) {
            if (this.compEvents.length > 0) {
                var prev: IComputedEvent = this.compEvents[this.compEvents.length - 1];
                return center.sub(prev.center);
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    }
    computeVelocity(center: ClientLocation, deltaTime: number): VectorE2 {
        if (center) {
            if (this.compEvents.length > 0) {
                var prev: IComputedEvent = this.compEvents[this.compEvents.length - 1];
                return center.sub(prev.center).div(deltaTime - prev.deltaTime);
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    }

}

/**
 * The contract for what the Manager requires from a Recognizer.
 */
export interface IRecognizer {
    eventName: string;
    canRecognizeWith(recognizer: IRecognizer): boolean;
    recognizeWith(recognizer: IRecognizer): IRecognizer;
    requireFailure(recognizer: IRecognizer): IRecognizer;
    recognize(inputData: IComputedEvent): void;
    reset(): void;
    state: number;
    manager: IRecognizerCallback;
    id: number;
}

export interface IRecognizerCallback {
    emit(eventName: string, data?);
    get(eventName: string): IRecognizer;
    updateTouchAction(): void;
}

export class Manager implements IRecognizerCallback {
    public handlers = {};
    public session = new Session();
    public recognizers: IRecognizer[] = [];
    public element;
    public input;
    private touchAction: TouchAction;
    // The following properties are defaults.
    private domEvents = false;
    public enable = true;  // What does this enable?
    public inputTarget;
    private cssProps = {};
    private callback: IRecognizerCallback;
    /**
     * Manager
     * @param {HTMLElement} element
     * @constructor
     */
    constructor(element: HTMLElement) {
        this.element = element;
        this.inputTarget = element; // Why would this be different?
        this.input = new TouchInput(this, inputHandler);
        this.touchAction = new TouchAction(this, TOUCH_ACTION_COMPUTE);
        this.toggleCssProps(true);
    }

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop(force: boolean) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    }

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize(inputData: IComputedEvent, touchEvent: TouchEvent): void {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData, touchEvent);

        var recognizer: IRecognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                !curRecognizer || recognizer == curRecognizer || // 2
                recognizer.canRecognizeWith(curRecognizer))) { // 3

                recognizer.recognize(inputData);
            }
            else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_RECOGNIZED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    }

    /**
     * get a recognizer by its event name.
     */
    get(eventName: string): IRecognizer {
        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].eventName === eventName) {
                return recognizers[i];
            }
        }
        return null;
    }

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     */
    add(recognizer: IRecognizer): IRecognizer {
        var existing = this.get(recognizer.eventName);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    }

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @return {Manager}
     */
    remove(recognizer: IRecognizer) {
        var recognizers = this.recognizers;
        recognizer = this.get(recognizer.eventName);
        recognizers.splice(inArray(recognizers, recognizer), 1);

        this.touchAction.update();
        return this;
    }

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @return {EventEmitter} this
     */
    on(events: string, handler): Manager {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    }

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @return {EventEmitter} this
     */
    off(events: string, handler): Manager {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            }
            else {
                handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    }

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {IComputedEvent} data
     */
    emit(eventName: string, data: Event) {
        // we also want to trigger dom events
        if (this.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[eventName] && this.handlers[eventName].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        // Make it look like a normal DOM event?
        /*
        data.type = eventName;
        data.preventDefault = function() {
          data.srcEvent.preventDefault();
        };
        */

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    }

    updateTouchAction(): void {
        this.touchAction.update();
    }

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy() {
        this.element && this.toggleCssProps(false);

        this.handlers = {};
        this.session = undefined;
        this.input.destroy();
        this.element = null;
    }

    toggleCssProps(add: boolean) {
        if (!this.element.style) {
            return;
        }
        var element = this.element;
        each(this.cssProps, function(value, name) {
            element.style[prefixed(element.style, name)] = add ? value : '';
        });
    }

    cancelContextMenu(): void {
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent['gesture'] = data;
    data.target.dispatchEvent(gestureEvent);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

class TouchAction {
    public manager: Manager;
    public actions: string;
    private prevented;
    /**
     * Touch Action
     * sets the touchAction property or uses the js alternative
     * @param {Manager} manager
     * @param {String} value
     * @constructor
     */
    constructor(manager: Manager, value: string) {
        this.manager = manager;
        this.set(value);
    }
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set(value: string) {
        // find out the touch-action by the event handlers
        if (value === TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    }

    /**
     * just re-set the touchAction value
     */
    update() {
        this.set(TOUCH_ACTION_COMPUTE);
    }

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @return {String} value
     */
    compute() {
        var actions: string[] = [];
        // FIXME: Make this type-safe automagically
        each(this.manager.recognizers, function(recognizer: Recognizer) {
            if (recognizer.enabled) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    }

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults(input: IComputedEvent, touchEvent: TouchEvent) {
        // not needed with native support for the touchAction property
        if (NATIVE_TOUCH_ACTION) {
            return;
        }

        // var direction = input.offsetDirection;

        if (this.prevented) {
            touchEvent.preventDefault();
            return;
        }
        /*
        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(touchEvent);
        }
        */
    }

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc(srcEvent) {
        this.prevented = true;
        srcEvent.preventDefault();
    }
}

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @return {*}
 */
function cleanTouchActions(actions: string): string {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // pan-x and pan-y can be combined
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

export var INPUT_TYPE_TOUCH = 'touch';
export var INPUT_TYPE_PEN = 'pen';
export var INPUT_TYPE_MOUSE = 'mouse';
export var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

export var INPUT_START = 1;
export var INPUT_MOVE = 2;
export var INPUT_END = 4;
export var INPUT_CANCEL = 8;

export function decodeEventType(eventType: number) {
    switch (eventType) {
        case INPUT_START: {
            return "START";
        }
        case INPUT_MOVE: {
            return "MOVE";
        }
        case INPUT_END: {
            return "END";
        }
        case INPUT_CANCEL: {
            return "CANCEL";
        }
        default: {
            return "eventType=" + eventType;
        }
    }
}

export var DIRECTION_UNDEFINED = 0;
export var DIRECTION_LEFT = 1;
export var DIRECTION_RIGHT = 2;
export var DIRECTION_UP = 4;
export var DIRECTION_DOWN = 8;

export var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
export var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
export var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

class Input {
    public manager: Manager;
    public element;
    public target;
    public domHandler;
    private evEl;
    private evTarget;
    private evWin;
    /**
     * create new input type manager
     * @param {Manager} manager
     * @return {Input}
     * @constructor
     */
    constructor(
        manager: Manager,
        touchElementEvents: string,
        touchTargetEvents: string,
        touchWindowEvents: string) {
        var self = this;
        this.manager = manager;
        this.evEl = touchElementEvents;
        this.evTarget = touchTargetEvents;
        this.evWin = touchWindowEvents;
        this.element = manager.element;
        this.target = manager.inputTarget;

        // smaller wrapper around the handler, for the scope and the enabled state of the manager,
        // so when disabled the input events are completely bypassed.
        this.domHandler = function(event: TouchEvent) {
            if (manager.enable) {
                self.handler(event);
            }
        };

        this.init();
    }
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler(event: any) { }

    /**
     * bind the events
     */
    init() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }

    /**
     * unbind the events
     */
    destroy() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {Number} eventType
 * @param {IComputedEvent} input
 */
function inputHandler(manager: Manager, eventType: number, touchEvent: TouchEvent) {

    var compEvent: IComputedEvent = computeIComputedEvent(manager, eventType, touchEvent);

    manager.recognize(compEvent, touchEvent);

    manager.session.push(compEvent);
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Manager} manager
 * @param {IComputedEvent} input
 */
function computeIComputedEvent(manager: Manager, eventType: number, touchEvent: TouchEvent): IComputedEvent {
    var touchesLength = touchEvent.touches.length;
    var changedPointersLen = touchEvent.changedTouches.length;
    var isFirst: boolean = (eventType & INPUT_START && (touchesLength - changedPointersLen === 0));
    var isFinal: boolean = (eventType & (INPUT_END | INPUT_CANCEL) && (touchesLength - changedPointersLen === 0));

    //var compEvent: any/*IComputedEvent*/ = {};
    //compEvent.isFirst = !!isFirst;
    //compEvent.isFinal = !!isFinal;

    if (isFirst) {
        manager.session.reset();
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    var session = manager.session;
    //  var pointers = input.pointers;
    //  var pointersLength = pointers.length;

    var center: ClientLocation = computeCenter(touchEvent.touches);
    var movement: VectorE2 = session.computeMovement(center);

    // store the first input to calculate the distance and direction
    /*
    if (!session.firstInput) {
      session.firstInput = snapshot(touchEvent, movement);
    }
  
    // to compute scale and rotation we need to store the multiple touches
    if (touchesLength > 1 && !session.firstMultiple) {
      session.firstMultiple = snapshot(touchEvent, movement);
    }
    else if (touchesLength === 1) {
      session.firstMultiple = undefined;
    }
  
    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
    */

    var timeStamp = Date.now();
    var movementTime = timeStamp - session.startTime;

    //var angle = getAngle(offsetCenter, center);
    var distance: number = movement ? movement.norm() : 0;
    var direction: number = getDirection(movement);

    // var scale = firstMultiple ? getScale(firstMultiple.pointers, touchEvent.touches) : 1;
    // var rotation = firstMultiple ? getRotation(firstMultiple.pointers, touchEvent.touches) : 0;

    var velocity: VectorE2 = session.computeVelocity(center, movementTime);

    // find the correct target
    /*
    var target = manager.element;
    if (hasParent(touchEvent.target, target)) {
        target = input.srcEvent.target;
    }
    */
    //  input.target = target;
    var compEvent: IComputedEvent = {
        center: center,
        movement: movement,
        deltaTime: movementTime,
        direction: direction,
        distance: distance,
        eventType: eventType,
        rotation: 0,
        timeStamp: timeStamp,
        touchesLength: touchEvent.touches.length,
        // type: touchEvent.type,
        scale: 1,
        velocity: velocity
    };
    return compEvent;
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {ClientLocation} center contains `clientX` and `clientY` properties
 */
function computeCenter(touches: Touch[]): ClientLocation {
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

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime: number, x: number, y: number): { x: number; y: number } {
    return { x: x / deltaTime || 0, y: y / deltaTime || 0 };
}

/**
 * get the direction between two points
 * @param {VectorE2} movement
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(movement: VectorE2): number {
    var N = new VectorE2(0, -1);
    var S = new VectorE2(0, +1);
    var E = new VectorE2(+1, 0);
    var W = new VectorE2(-1, 0);
    // Allow combinations of the cardinal directions.
    // A cardinal direction matches if we are within 22.5 degrees either side.
    var cosineThreshold = Math.cos(7 * Math.PI / 16);
    if (movement) {
        var unit = movement.div(movement.norm());
        var direction = DIRECTION_UNDEFINED;
        if (unit.dot(N) > cosineThreshold) {
            direction |= DIRECTION_UP;
        }
        if (unit.dot(S) > cosineThreshold) {
            direction |= DIRECTION_DOWN;
        }
        if (unit.dot(E) > cosineThreshold) {
            direction |= DIRECTION_RIGHT;
        }
        if (unit.dot(W) > cosineThreshold) {
            direction |= DIRECTION_LEFT;
        }
        return direction;
    }
    else {
        return DIRECTION_UNDEFINED;
    }
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
export function getDistance(p1, p2, props?) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props?) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var TOUCH_INPUT_MAP: { [s: string]: number; } = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

class TouchInput extends Input {
    private targetIds = {};
    private callback: (manager: Manager, type: number, data: TouchEvent) => void;
    /**
     * Multi-user touch events input
     * @constructor
     * @extends Input
     */
    constructor(manager: Manager, callback: (manager: Manager, type: number, data: TouchEvent) => void) {
        // FIXME: The base class registers handlers and could be firing events
        // before this constructor has initialized callback?
        super(manager, undefined, TOUCH_TARGET_EVENTS, undefined);
        this.callback = callback;
    }
    handler(event: TouchEvent) {
        var eventType: number = TOUCH_INPUT_MAP[event.type];
        this.callback(this.manager, eventType, event);
    }
}

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @return {undefined|Array} [all, changed]
 */
function getTouches(event: TouchEvent, type: number) {
    var allTouches = toArray(event.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(event.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                     Recognized
 */
export var STATE_UNDEFINED = 0;
export var STATE_POSSIBLE = 1;
export var STATE_BEGAN = 2;
export var STATE_CHANGED = 4;
export var STATE_RECOGNIZED = 8;
export var STATE_CANCELLED = 16;
export var STATE_FAILED = 32;

export class Recognizer implements IRecognizer {
    public id;
    public manager: IRecognizerCallback;
    public eventName: string;
    public enabled: boolean;
    public state: number;
    public simultaneous = {}; // TODO: Type as map of string to Recognizer.
    public requireFail: IRecognizer[] = [];
    /**
     * Recognizer
     * Every recognizer needs to extend from this class.
     * @constructor
     */
    constructor(eventName: string, enabled: boolean) {
        this.eventName = eventName;
        this.enabled = enabled;
        this.id = uniqueId();

        this.manager = null;
        //      this.options = merge(options || {}, this.defaults);

        // default is enable true
        //      this.options.enable = ifUndefined(this.options.enable, true);

        this.state = STATE_POSSIBLE;
    }
    set(options) {
        //      extend(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.updateTouchAction();
        return this;
    }

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @return {Recognizer} this
     */
    recognizeWith(otherRecognizer: IRecognizer): IRecognizer {
        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    }

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @return {Recognizer} this
     */
    dropRecognizeWith(otherRecognizer: IRecognizer) {
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    }

    /**
     * recognizer can only run when an other is failing
     */
    requireFailure(otherRecognizer: IRecognizer): IRecognizer {
        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    }

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @return {Recognizer} this
     */
    dropRequireFailure(otherRecognizer: IRecognizer) {
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    }

    /**
     * has require failures boolean
     * @return {boolean}
     */
    hasRequireFailures(): boolean {
        return this.requireFail.length > 0;
    }

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @return {Boolean}
     */
    canRecognizeWith(otherRecognizer: IRecognizer): boolean {
        return !!this.simultaneous[otherRecognizer.id];
    }

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit(): void {
        var self = this;
        var state = this.state;

        function emit(withState?: boolean) {
            var eventName = self.eventName + (withState ? stateStr(state) : '');
            self.manager.emit(eventName, undefined);
        }

        // FIXME: Not nice, meaning implicit in state numbering.
        // 'panstart' and 'panmove'
        if (state < STATE_RECOGNIZED) {
            emit(true);
        }

        emit(false); // simple 'eventName' events

        // panend and pancancel
        if (state >= STATE_RECOGNIZED) {
            emit(true);
        }
    }

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit() {
        if (this.canEmit()) {
            return this.emit();
        }
        else {
        }
        // it's failing anyway?
        this.state = STATE_FAILED;
    }

    /**
     * can we emit?
     * @return {boolean}
     */
    canEmit() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    }

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize(compEvent: IComputedEvent): void {

        if (!this.enabled) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(compEvent);

        // the recognizer has recognized a gesture so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_RECOGNIZED | STATE_CANCELLED)) {
            this.tryEmit();
        }
    }

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @return {Const} STATE
     */
    process(inputData: IComputedEvent): number {
        return STATE_UNDEFINED;
    }

    /**
     * return the preferred touch-action
     * @virtual
     * @return {Array}
     */
    getTouchAction(): string[] { return []; }

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset() { }
}

/**
 * TODO: Are the string values part of the API, or just for debugging?
 * get a usable string, used as event postfix
 * @param {Const} state
 * @return {String} state
 */
export function stateStr(state: number): string {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    }
    else if (state & STATE_RECOGNIZED) {
        return 'end';
    }
    else if (state & STATE_CHANGED) {
        return 'move';
    }
    else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * Provide a decode of the state.
 * The result is not normative and should not be considered API.
 * Sine the state is a bit field, show all bits even though they may/should be exclusive.
 */
export function stateDecode(state: number): string {
    var states: string[] = [];
    if (state & STATE_POSSIBLE) {
        states.push('STATE_POSSIBLE');
    }
    else if (state & STATE_CANCELLED) {
        states.push('STATE_CANCELLED');
    }
    else if (state & STATE_RECOGNIZED) {
        states.push('STATE_RECOGNIZED');
    }
    else if (state & STATE_CHANGED) {
        states.push('STATE_CHANGED');
    }
    else if (state & STATE_BEGAN) {
        states.push('STATE_BEGAN');
    }
    else if (state & STATE_UNDEFINED) {
        states.push('STATE_UNDEFINED');
    }
    else if (state & STATE_FAILED) {
        states.push('STATE_FAILED');
    }
    else {
        states.push('' + state);
    }
    return states.join(' ');
}

/**
 * TODO: This really belongs in the input service.
 * direction cons to string
 * @param {Const} direction
 * @return {String}
 */
export function directionStr(direction: number): string {
    var ds: string[] = [];
    if (direction & DIRECTION_DOWN) {
        ds.push('down');
    }
    if (direction & DIRECTION_UP) {
        ds.push('up');
    }
    if (direction & DIRECTION_LEFT) {
        ds.push('left');
    }
    if (direction & DIRECTION_RIGHT) {
        ds.push('right');
    }
    return ds.join(' ');
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @return {Recognizer}
 */
function getRecognizerByNameIfManager(recognizer: IRecognizer, manager: IRecognizerCallback): IRecognizer {
    if (manager) {
        return manager.get(recognizer.eventName);
    }
    return recognizer;
}

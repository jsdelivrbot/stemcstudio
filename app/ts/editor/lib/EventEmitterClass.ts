import EventBus from "../EventBus";

"use strict";

var stopPropagation = function() { this.propagationStopped = true; };
var preventDefault = function() { this.defaultPrevented = true; };

/**
 * Intended to be used as a Mixin.
 * N.B. The original implementation was an object, the TypeScript way is
 * designed to satisfy the compiler.
 *
 * @class EventEmitterClass
 */
export default class EventEmitterClass<E, T> implements EventBus<E, T> {

    /**
     * Each event name has multiple callbacks.
     */
    public _eventRegistry: { [name: string]: ((event: E, source: T) => any)[] };

    /**
     * There may be one default handler for an event too.
     */
    private _defaultHandlers: { [name: string]: (event: E, source: T) => any };

    private owner: T;

    /**
     * @class EventEmitterClass
     * @constructor
     * @param owner
     */
    constructor(owner: T) {
        this.owner = owner;
    }

    /**
     * @method _dispatchEvent
     * @param eventName {string}
     * @param event {any}
     * @return {any}
     * @private
     */
    private _dispatchEvent(eventName: string, event: E): any {

        this._eventRegistry || (this._eventRegistry = {});

        this._defaultHandlers || (this._defaultHandlers = {});

        var listeners = this._eventRegistry[eventName] || [];

        var defaultHandler = this._defaultHandlers[eventName];

        if (!listeners.length && !defaultHandler)
            return;

        if (typeof event !== "object" || !event) {
            event = <E>{};
        }

        // FIXME: This smells a bit.
        if (!event['type']) {
            event['type'] = eventName;
        }

        if (!event['stopPropagation']) {
            event['stopPropagation'] = stopPropagation;
        }

        if (!event['preventDefault']) {
            event['preventDefault'] = preventDefault;
        }

        // Make a copy in order to avoid race conditions.
        listeners = listeners.slice();
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](event, this.owner);
            if (event['propagationStopped']) {
                break;
            }
        }

        if (defaultHandler && !event['defaultPrevented']) {
            return defaultHandler(event, this.owner);
        }
    }

    /**
     * @method hasListeners
     * @param eventName {string}
     * @return {boolean}
     */
    hasListeners(eventName: string): boolean {
        var registry = this._eventRegistry;
        var listeners = registry && registry[eventName];
        return listeners && listeners.length > 0;
    }

    /**
     * @method _emit
     * @param eventName {string}
     * @param event {E}
     * @return {any}
     */
    _emit(eventName: string, event?: E): any {
        return this._dispatchEvent(eventName, event);
    }

    /**
     * @method _signal
     * @param eventName {string}
     * @param event {E}
     * @return {void}
     */
    _signal(eventName: string, event?: E) {

        var listeners = (this._eventRegistry || {})[eventName];

        if (!listeners) {
            return;
        }

        // slice just makes a copy so that we don't mess up on array bounds.
        // It's a bit expensive though?
        listeners = listeners.slice();
        for (var i = 0, iLength = listeners.length; i < iLength; i++) {
            // FIXME: When used standalone, EventEmitter is not the source.
            listeners[i](event, this.owner);
        }
    }

    once(eventName: string, callback: (event: E, source: T) => any) {
        const _self = this;
        callback && this.addEventListener(eventName, function newCallback() {
            _self.removeEventListener(eventName, newCallback);
            callback.apply(null, arguments);
        });
    }

    setDefaultHandler(eventName: string, callback: (event: E, source: T) => any) {
        // FIXME: All this casting is creepy.
        var handlers: any = this._defaultHandlers
        if (!handlers) {
            handlers = this._defaultHandlers = <any>{ _disabled_: {} };
        }

        if (handlers[eventName]) {
            let existingHandler = handlers[eventName];
            var disabled = handlers._disabled_[eventName];
            if (!disabled) {
                handlers._disabled_[eventName] = disabled = [];
            }
            disabled.push(existingHandler);
            var i = disabled.indexOf(callback);
            if (i != -1)
                disabled.splice(i, 1);
        }
        handlers[eventName] = callback;
    }

    removeDefaultHandler(eventName: string, callback: (event: E, source: T) => any) {
        // FIXME: All this casting is creepy.
        var handlers: any = this._defaultHandlers
        if (!handlers) {
            return;
        }
        var disabled = handlers._disabled_[eventName];

        if (handlers[eventName] === callback) {
            // FIXME: Something wrong here.
            var unused = handlers[eventName];
            if (disabled)
                this.setDefaultHandler(eventName, disabled.pop());
        }
        else if (disabled) {
            var i = disabled.indexOf(callback);
            if (i != -1)
                disabled.splice(i, 1);
        }
    }

    // Discourage usage.
    private addEventListener(eventName: string, callback: (event: E, source: T) => void, capturing?: boolean) {
        this._eventRegistry = this._eventRegistry || {};

        var listeners = this._eventRegistry[eventName];
        if (!listeners) {
            listeners = this._eventRegistry[eventName] = [];
        }

        if (listeners.indexOf(callback) === -1) {
            if (capturing) {
                listeners.unshift(callback);
            }
            else {
                listeners.push(callback);
            }
        }
        return () => {
            this.removeEventListener(eventName, callback, capturing);
        }
    }

    /**
     * @param eventName
     * @param callback
     * @param capturing
     */
    on(eventName: string, callback: (event: E, source: T) => any, capturing?: boolean): () => void {
        return this.addEventListener(eventName, callback, capturing);
    }

    // Discourage usage.
    private removeEventListener(eventName, callback: (event: E, source: T) => any, capturing?: boolean) {
        this._eventRegistry = this._eventRegistry || {};

        const listeners = this._eventRegistry[eventName];
        if (!listeners)
            return;

        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    // Discourage usage.
    private removeListener(eventName: string, callback: (event: E, source: T) => any, capturing?: boolean) {
        return this.removeEventListener(eventName, callback, capturing);
    }

    /**
     * @method off
     * @param eventName {string}
     * @param callback {(event: E, source: T) => any}
     * @param [capturing] {boolean}
     * @return {void}
     */
    public off(eventName: string, callback: (event: E, source: T) => any, capturing?: boolean): void {
        return this.removeEventListener(eventName, callback, capturing);
    }

    removeAllListeners(eventName: string) {
        if (this._eventRegistry) this._eventRegistry[eventName] = [];
    }
}

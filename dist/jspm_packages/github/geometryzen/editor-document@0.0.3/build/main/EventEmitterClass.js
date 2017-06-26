"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Observable } from 'rxjs/Observable';
// import { Observer } from 'rxjs/Observer';
// import { EventBus } from "../EventBus";
// import { Command } from '../../virtual/editor';
var stopPropagation = function () { this.propagationStopped = true; };
var preventDefault = function () { this.defaultPrevented = true; };
/*
export interface DefaultHandler<T> {
    (event: { command: Command<T>; target: T, args: any }, source: T): void;
}
*/
/**
 * Intended to be used as a Mixin.
 * N.B. The original implementation was an object, the TypeScript way is
 * designed to satisfy the compiler.
 */
var EventEmitterClass = (function () {
    /**
     *
     */
    function EventEmitterClass(owner) {
        this.owner = owner;
    }
    /**
     * Calls the listeners any any default handlers with an elaborate
     * mechanism for limiting both propagation and the default invocation.
     */
    EventEmitterClass.prototype._dispatchEvent = function (eventName, event) {
        if (!this._eventRegistry) {
            this._eventRegistry = {};
        }
        if (!this._defaultHandlers) {
            this._defaultHandlers = {};
        }
        var listeners = this._eventRegistry[eventName] || [];
        var defaultHandler = this._defaultHandlers[eventName];
        if (!listeners.length && !defaultHandler)
            return;
        if (typeof event !== "object" || !event) {
            event = {};
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
    };
    /**
     *
     */
    EventEmitterClass.prototype.hasListeners = function (eventName) {
        var registry = this._eventRegistry;
        var listeners = registry && registry[eventName];
        return listeners && listeners.length > 0;
    };
    /**
     * Emit uses the somewhat complex semantics of the dispatchEvent method.
     * Consider using `signal` for more elementary behaviour.
     */
    EventEmitterClass.prototype._emit = function (eventName, event) {
        return this._dispatchEvent(eventName, event);
    };
    /**
     * Calls each listener subscribed to the eventName passing the event and the source.
     */
    EventEmitterClass.prototype._signal = function (eventName, event) {
        /**
         * The listeners subscribed to the specified event name
         */
        var listeners = (this._eventRegistry || {})[eventName];
        if (!listeners) {
            return;
        }
        // slice just makes a copy so that we don't mess up on array bounds.
        // It's a bit expensive though?
        listeners = listeners.slice();
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var listener = listeners_1[_i];
            listener(event, this.owner);
        }
    };
    /*
        events(eventName: NAME): Observable<E> {
            return new Observable<E>((observer: Observer<E>) => {
                function changeListener(value: E, source: T) {
                    observer.next(value);
                }
                return this.on(eventName, changeListener, false);
            });
        }
    */
    EventEmitterClass.prototype.once = function (eventName, callback) {
        var _self = this;
        if (callback) {
            this.addEventListener(eventName, function newCallback() {
                _self.removeEventListener(eventName, newCallback);
                callback.apply(null, arguments);
            });
        }
    };
    /*
        setDefaultHandler(eventName: NAME, callback: DefaultHandler<T>) {
            // FIXME: All this casting is creepy.
            let handlers: any = this._defaultHandlers;
            if (!handlers) {
                handlers = this._defaultHandlers = <any>{ _disabled_: {} };
            }

            if (handlers[eventName]) {
                const existingHandler = handlers[eventName];
                let disabled = handlers._disabled_[eventName];
                if (!disabled) {
                    handlers._disabled_[eventName] = disabled = [];
                }
                disabled.push(existingHandler);
                const i = disabled.indexOf(callback);
                if (i !== -1)
                    disabled.splice(i, 1);
            }
            handlers[eventName] = callback;
        }
    */
    /*
        removeDefaultHandler(eventName: NAME, callback: (event: E, source: T) => any) {
            // FIXME: All this casting is creepy.
            const handlers: any = this._defaultHandlers;
            if (!handlers) {
                return;
            }
            const disabled = handlers._disabled_[eventName];

            if (handlers[eventName] === callback) {
                // FIXME: Something wrong here.
                // unused = handlers[eventName];
                if (disabled) {
                    this.setDefaultHandler(eventName, disabled.pop());
                }
            }
            else if (disabled) {
                const i = disabled.indexOf(callback);
                if (i !== -1) {
                    disabled.splice(i, 1);
                }
            }
        }
    */
    // Discourage usage.
    EventEmitterClass.prototype.addEventListener = function (eventName, callback, capturing) {
        var _this = this;
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
        return function () {
            _this.removeEventListener(eventName, callback, capturing);
        };
    };
    /**
     *
     */
    EventEmitterClass.prototype.on = function (eventName, callback, capturing) {
        return this.addEventListener(eventName, callback, capturing);
    };
    // Discourage usage.
    EventEmitterClass.prototype.removeEventListener = function (eventName, callback, capturing) {
        this._eventRegistry = this._eventRegistry || {};
        var listeners = this._eventRegistry[eventName];
        if (!listeners)
            return;
        var index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    };
    /**
     *
     */
    EventEmitterClass.prototype.off = function (eventName, callback, capturing) {
        return this.removeEventListener(eventName, callback, capturing);
    };
    /**
     *
     */
    EventEmitterClass.prototype.removeAllListeners = function (eventName) {
        if (this._eventRegistry)
            this._eventRegistry[eventName] = [];
    };
    return EventEmitterClass;
}());
exports.EventEmitterClass = EventEmitterClass;
//# sourceMappingURL=EventEmitterClass.js.map
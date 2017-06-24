System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var stopPropagation, preventDefault, EventEmitterClass;
    return {
        setters: [],
        execute: function () {
            stopPropagation = function () { this.propagationStopped = true; };
            preventDefault = function () { this.defaultPrevented = true; };
            EventEmitterClass = (function () {
                function EventEmitterClass() {
                }
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
                    if (!event.type) {
                        event.type = eventName;
                    }
                    if (!event.stopPropagation) {
                        event.stopPropagation = stopPropagation;
                    }
                    if (!event.preventDefault) {
                        event.preventDefault = preventDefault;
                    }
                    listeners = listeners.slice();
                    for (var i = 0; i < listeners.length; i++) {
                        listeners[i](event, this);
                        if (event['propagationStopped']) {
                            break;
                        }
                    }
                    if (defaultHandler && !event.defaultPrevented) {
                        return defaultHandler(event, this);
                    }
                };
                EventEmitterClass.prototype._emit = function (eventName, event) {
                    return this._dispatchEvent(eventName, event);
                };
                EventEmitterClass.prototype._signal = function (eventName, e) {
                    var listeners = (this._eventRegistry || {})[eventName];
                    if (!listeners) {
                        return;
                    }
                    listeners = listeners.slice();
                    for (var i = 0, iLength = listeners.length; i < iLength; i++) {
                        listeners[i](e, this);
                    }
                };
                EventEmitterClass.prototype.once = function (eventName, callback) {
                    var _self = this;
                    if (callback) {
                        this.addEventListener(eventName, function newCallback() {
                            _self.removeEventListener(eventName, newCallback);
                            callback.apply(null, arguments);
                        });
                    }
                };
                EventEmitterClass.prototype.setDefaultHandler = function (eventName, callback) {
                    var handlers = this._defaultHandlers;
                    if (!handlers) {
                        handlers = this._defaultHandlers = { _disabled_: {} };
                    }
                    if (handlers[eventName]) {
                        var old = handlers[eventName];
                        var disabled = handlers._disabled_[eventName];
                        if (!disabled)
                            handlers._disabled_[eventName] = disabled = [];
                        disabled.push(old);
                        var i = disabled.indexOf(callback);
                        if (i !== -1)
                            disabled.splice(i, 1);
                    }
                    handlers[eventName] = callback;
                };
                EventEmitterClass.prototype.removeDefaultHandler = function (eventName, callback) {
                    var handlers = this._defaultHandlers;
                    if (!handlers) {
                        return;
                    }
                    var disabled = handlers._disabled_[eventName];
                    if (handlers[eventName] === callback) {
                        if (disabled)
                            this.setDefaultHandler(eventName, disabled.pop());
                    }
                    else if (disabled) {
                        var i = disabled.indexOf(callback);
                        if (i !== -1)
                            disabled.splice(i, 1);
                    }
                };
                EventEmitterClass.prototype.addEventListener = function (eventName, callback, capturing) {
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
                    return callback;
                };
                EventEmitterClass.prototype.on = function (eventName, callback, capturing) {
                    return this.addEventListener(eventName, callback, capturing);
                };
                EventEmitterClass.prototype.removeEventListener = function (eventName, callback) {
                    this._eventRegistry = this._eventRegistry || {};
                    var listeners = this._eventRegistry[eventName];
                    if (!listeners)
                        return;
                    var index = listeners.indexOf(callback);
                    if (index !== -1) {
                        listeners.splice(index, 1);
                    }
                };
                EventEmitterClass.prototype.off = function (eventName, callback) {
                    return this.removeEventListener(eventName, callback);
                };
                EventEmitterClass.prototype.removeAllListeners = function (eventName) {
                    if (this._eventRegistry)
                        this._eventRegistry[eventName] = [];
                };
                return EventEmitterClass;
            }());
            exports_1("EventEmitterClass", EventEmitterClass);
        }
    };
});

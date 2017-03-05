"use strict";

var stopPropagation = function () { this.propagationStopped = true; };
var preventDefault = function () { this.defaultPrevented = true; };

/**
 * Intended to be used as a Mixin.
 * N.B. The original implementation was an object, the TypeScript way is
 * designed to satisfy the compiler.
 *
 * @class EventEmitterClass
 */
export default class EventEmitterClass {
    /**
     * Each event name has multiple callbacks.
     */
    public _eventRegistry: { [name: string]: ((event: any, ee: EventEmitterClass) => any)[] };
    /**
     * There may be one default handler for an event too.
     */
    private _defaultHandlers: { [name: string]: (event: any, ee: EventEmitterClass) => any };

    /**
     *
     */
    constructor() {
        // Do nothing.
    }

    /**
     * @method _dispatchEvent
     * @param eventName {string}
     * @param event {any}
     * @return {any}
     * @private
     */
    private _dispatchEvent(eventName: string, event: any): any {

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

        // Make a copy in order to avoid race conditions.
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
    }

    /**
     * @method _emit
     * @param eventName {string}
     * @param event {any}
     * @return {any}
     */
    _emit(eventName: string, event?: any): any {
        return this._dispatchEvent(eventName, event);
    }

    /**
     * @method _signal
     * @param eventName {string}
     * @param event {any}
     * @return {void}
     */
    _signal(eventName: string, e?: any) {

        var listeners = (this._eventRegistry || {})[eventName];

        if (!listeners) {
            return;
        }

        // slice just makes a copy so that we don't mess up on array bounds.
        // It's a bit expensive though?
        listeners = listeners.slice();
        for (var i = 0, iLength = listeners.length; i < iLength; i++) {
            listeners[i](e, this);
        }
    }

    once(eventName: string, callback: (event: any, ee: EventEmitterClass) => any) {
        var _self = this;
        if (callback) {
            this.addEventListener(eventName, function newCallback() {
                _self.removeEventListener(eventName, newCallback);
                callback.apply(null, arguments);
            });
        }
    }

    setDefaultHandler(eventName: string, callback: (event: any, ee: EventEmitterClass) => any) {
        // FIXME: All this casting is creepy.
        var handlers: any = this._defaultHandlers;
        if (!handlers) {
            handlers = this._defaultHandlers = <any>{ _disabled_: {} };
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
    }

    removeDefaultHandler(eventName: string, callback: (event: any, ee: EventEmitterClass) => any) {
        // FIXME: All this casting is creepy.
        var handlers: any = this._defaultHandlers;
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
    }

    // Discourage usage.
    private addEventListener(eventName: string, callback: (event: any, ee: EventEmitterClass) => void, capturing?: boolean) {
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
    }

    on(eventName: string, callback: (event: any, ee: EventEmitterClass) => any, capturing?: boolean) {
        return this.addEventListener(eventName, callback, capturing);
    }

    // Discourage usage.
    private removeEventListener(eventName: string, callback: (event: any, ee: EventEmitterClass) => any) {
        this._eventRegistry = this._eventRegistry || {};

        var listeners = this._eventRegistry[eventName];
        if (!listeners)
            return;

        var index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    public off(eventName: string, callback: (event: any, ee: EventEmitterClass) => any) {
        return this.removeEventListener(eventName, callback);
    }

    removeAllListeners(eventName: string) {
        if (this._eventRegistry) this._eventRegistry[eventName] = [];
    }
}
/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

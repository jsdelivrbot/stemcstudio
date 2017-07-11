import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { EventBus } from "../EventBus";
import { Command } from '../commands/Command';
const stopPropagation = function (this: { propagationStopped: boolean }) { this.propagationStopped = true; };
const preventDefault = function (this: { defaultPrevented: boolean }) { this.defaultPrevented = true; };

export interface DefaultHandler<T> {
    (event: { command: Command<T>; target: T, args: any }, source: T): void;
}

/**
 * Intended to be used as a Mixin.
 * N.B. The original implementation was an object, the TypeScript way is
 * designed to satisfy the compiler.
 */
export class EventEmitterClass<NAME extends string, E, T> implements EventBus<NAME, E, T> {

    /**
     * Each event name has multiple callbacks.
     */
    public _eventRegistry: { [name: string]: ((event: E | undefined, source: T) => void)[] };

    /**
     * There may be one default handler for an event too.
     */
    private _defaultHandlers: { [name: string]: (event: E, source: T) => void };

    private owner: T;

    /**
     *
     */
    constructor(owner: T) {
        this.owner = owner;
    }

    /**
     * Calls the listeners any any default handlers with an elaborate
     * mechanism for limiting both propagation and the default invocation. 
     */
    private _dispatchEvent(eventName: NAME, event?: E): any {

        if (!this._eventRegistry) {
            this._eventRegistry = {};
        }

        if (!this._defaultHandlers) {
            this._defaultHandlers = {};
        }

        let listeners = this._eventRegistry[eventName] || [];

        const defaultHandler = this._defaultHandlers[eventName];

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
        for (let i = 0; i < listeners.length; i++) {
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
     *
     */
    hasListeners(eventName: NAME): boolean {
        const registry = this._eventRegistry;
        const listeners = registry && registry[eventName];
        return listeners && listeners.length > 0;
    }

    /**
     * Emit uses the somewhat complex semantics of the dispatchEvent method.
     * Consider using `signal` for more elementary behaviour.
     */
    _emit(eventName: NAME, event?: E): any {
        return this._dispatchEvent(eventName, event);
    }

    /**
     * Calls each listener subscribed to the eventName passing the event and the source.
     */
    _signal(eventName: NAME, event?: E) {
        /**
         * The listeners subscribed to the specified event name
         */
        let listeners = (this._eventRegistry || {})[eventName];

        if (!listeners) {
            return;
        }

        // slice just makes a copy so that we don't mess up on array bounds.
        // It's a bit expensive though?
        listeners = listeners.slice();
        for (const listener of listeners) {
            listener(event, this.owner);
        }
    }

    events(eventName: NAME): Observable<E> {
        return new Observable<E>((observer: Observer<E>) => {
            function changeListener(value: E, source: T) {
                observer.next(value);
            }
            return this.on(eventName, changeListener, false);
        });
    }

    once(eventName: NAME, callback: (event: E, source: T) => any) {
        const _self = this;
        if (callback) {
            this.addEventListener(eventName, function newCallback() {
                _self.removeEventListener(eventName, newCallback);
                callback.apply(null, arguments);
            });
        }
    }

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

    // Discourage usage.
    private addEventListener(eventName: NAME, callback: (event: E, source: T) => void, capturing?: boolean) {
        this._eventRegistry = this._eventRegistry || {};

        let listeners = this._eventRegistry[eventName];
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
        };
    }

    /**
     *
     */
    on(eventName: NAME, callback: (event: E, source: T) => any, capturing?: boolean): () => void {
        return this.addEventListener(eventName, callback, capturing);
    }

    // Discourage usage.
    private removeEventListener(eventName: NAME, callback: (event: E, source: T) => any, capturing?: boolean) {
        this._eventRegistry = this._eventRegistry || {};

        const listeners = this._eventRegistry[eventName];
        if (!listeners)
            return;

        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    /**
     *
     */
    public off(eventName: NAME, callback: (event: E, source: T) => any, capturing?: boolean): void {
        return this.removeEventListener(eventName, callback, capturing);
    }

    /**
     *
     */
    removeAllListeners(eventName: NAME) {
        if (this._eventRegistry) this._eventRegistry[eventName] = [];
    }
}

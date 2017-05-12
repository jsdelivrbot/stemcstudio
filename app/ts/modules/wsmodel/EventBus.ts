import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

/**
 * 
 */
export class EventBus<NAME extends string, E, T> {

    /**
     * Each event name has multiple callbacks.
     */
    public _eventRegistry: { [name: string]: ((event: E | undefined, source: T) => any)[] };

    private owner: T;

    constructor(owner: T) {
        this.owner = owner;
        this._eventRegistry = {};
    }

    events(eventName: NAME): Observable<E> {
        return new Observable<E>((observer: Observer<E>) => {
            function callback(value: E, source: T) {
                observer.next(value);
            }
            return this.watch(eventName, callback);
        });
    }

    reset(): void {
        this._eventRegistry = {};
    }

    removeAllListeners(eventName: NAME) {
        this._eventRegistry[eventName] = [];
    }

    watch(eventName: NAME, callback: (event: E, source: T) => any): () => void {
        this._eventRegistry = this._eventRegistry || {};

        let listeners = this._eventRegistry[eventName];
        if (!listeners) {
            listeners = this._eventRegistry[eventName] = [];
        }

        if (listeners.indexOf(callback) === -1) {
            listeners.push(callback);
        }
        return () => {
            this.removeEventListener(eventName, callback);
        };
    }

    hasListeners(eventName: NAME): boolean {
        const registry = this._eventRegistry;
        const listeners = registry && registry[eventName];
        return listeners && listeners.length > 0;
    }

    emit(eventName: NAME, event?: E): any {
        let listeners = this._eventRegistry[eventName] || [];

        if (!listeners.length) {
            return;
        }

        // Make a copy in order to avoid race conditions?
        listeners = listeners.slice();
        for (let i = 0; i < listeners.length; i++) {
            listeners[i](event, this.owner);
        }
    }

    emitAsync(eventName: NAME, event?: E, timeout = 0): void {
        window.setTimeout(() => {
            this.emit(eventName, event);
        }, timeout);
    }

    private removeEventListener(eventName: NAME, callback: (event: E, source: T) => any) {
        const listeners = this._eventRegistry[eventName];
        if (!listeners)
            return;

        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }
}

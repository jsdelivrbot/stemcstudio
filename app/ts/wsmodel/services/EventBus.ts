export default class EventBus<E, T> {

    /**
     * Each event name has multiple callbacks.
     */
    public _eventRegistry: { [name: string]: ((event: E, source: T) => any)[] };

    private owner: T;

    constructor(owner: T) {
        this.owner = owner;
        this._eventRegistry = {};
    }

    reset(): void {
        this._eventRegistry = {};
    }

    removeAllListeners(eventName: string) {
        this._eventRegistry[eventName] = [];
    }

    watch(eventName: string, callback: (event: E, source: T) => any): () => void {
        this._eventRegistry = this._eventRegistry || {};

        var listeners = this._eventRegistry[eventName];
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

    hasListeners(eventName: string): boolean {
        const registry = this._eventRegistry;
        const listeners = registry && registry[eventName];
        return listeners && listeners.length > 0;
    }

    emit(eventName: string, event?: E): any {
        let listeners = this._eventRegistry[eventName] || [];

        if (!listeners.length) {
            return;
        }

        // Make a copy in order to avoid race conditions?
        listeners = listeners.slice();
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](event, this.owner);
        }
    }

    private removeEventListener(eventName, callback: (event: E, source: T) => any) {
        const listeners = this._eventRegistry[eventName];
        if (!listeners)
            return;

        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }
}

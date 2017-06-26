/**
 * Intended to be used as a Mixin.
 * N.B. The original implementation was an object, the TypeScript way is
 * designed to satisfy the compiler.
 */
export declare class EventEmitterClass<NAME extends string, E, T> {
    /**
     * Each event name has multiple callbacks.
     */
    _eventRegistry: {
        [name: string]: ((event: E | undefined, source: T) => void)[];
    };
    /**
     * There may be one default handler for an event too.
     */
    private _defaultHandlers;
    private owner;
    /**
     *
     */
    constructor(owner: T);
    /**
     * Calls the listeners any any default handlers with an elaborate
     * mechanism for limiting both propagation and the default invocation.
     */
    private _dispatchEvent(eventName, event?);
    /**
     *
     */
    hasListeners(eventName: NAME): boolean;
    /**
     * Emit uses the somewhat complex semantics of the dispatchEvent method.
     * Consider using `signal` for more elementary behaviour.
     */
    _emit(eventName: NAME, event?: E): any;
    /**
     * Calls each listener subscribed to the eventName passing the event and the source.
     */
    _signal(eventName: NAME, event?: E): void;
    once(eventName: NAME, callback: (event: E, source: T) => any): void;
    private addEventListener(eventName, callback, capturing?);
    /**
     *
     */
    on(eventName: NAME, callback: (event: E, source: T) => any, capturing?: boolean): () => void;
    private removeEventListener(eventName, callback, capturing?);
    /**
     *
     */
    off(eventName: NAME, callback: (event: E, source: T) => any, capturing?: boolean): void;
    /**
     *
     */
    removeAllListeners(eventName: NAME): void;
}

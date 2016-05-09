import EventEmitter from './EventEmitter';

/**
 * A concrete implementation of EventBus that may be reused by either
 * implementation inheritance (extends) or by containment (as a property).
 * Mixing in is also possible.
 */
export default class EventBus<T> implements EventEmitter<T> {
    constructor() {
        // TODO
    }
    on(eventName: string, cb: () => any): void {
        throw new Error(`EventBus.on(${eventName})`)
    }
    removeListener(eventName: string, cb: () => any): void {
        throw new Error(`EventBus.removeListener(${eventName})`)
    }
    emit(eventName: string, data, source: T): void {
        throw new Error(`EventBus.emit(${eventName})`)
    }
}

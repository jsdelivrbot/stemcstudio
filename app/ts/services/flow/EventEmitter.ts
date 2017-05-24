export interface EventEmitter<T> {
    on(eventName: string, cb: () => any): void;
    removeListener(eventName: string, cb: () => any): void;
    emit(eventName: string, data, source: T): void;
}

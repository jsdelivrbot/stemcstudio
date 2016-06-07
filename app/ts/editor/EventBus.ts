interface EventBus<E, T> {
    on(eventName: string, callback: (event: E, source: T) => any, capturing?: boolean): void;
    off(eventName: string, callback: (event: E, source: T) => any): void;
}

export default EventBus;

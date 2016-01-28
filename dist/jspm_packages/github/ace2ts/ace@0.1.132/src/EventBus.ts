interface EventBus<T> {
    on(eventName: string, callback: (event: any, source: T) => any, capturing?: boolean): void;
    off(eventName: string, callback: (event: any, source: T) => any): void;
}

export default EventBus;
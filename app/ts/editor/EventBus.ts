export interface EventBus<NAME, E, SOURCE> {
    on(eventName: NAME, callback: (event: E, source: SOURCE) => any, capturing?: boolean): void;
    off(eventName: NAME, callback: (event: E, source: SOURCE) => any): void;
}

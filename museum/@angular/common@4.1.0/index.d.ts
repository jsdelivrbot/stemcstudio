export interface LocationChangeEvent {
    type: string;
}

export interface LocationChangeListener {
    (e: LocationChangeEvent): any;
}

export declare abstract class LocationStrategy {
    abstract path(includeHash?: boolean): string;
    abstract prepareExternalUrl(internal: string): string;
    abstract pushState(state: any, title: string, url: string, queryParams: string): void;
    abstract replaceState(state: any, title: string, url: string, queryParams: string): void;
    abstract forward(): void;
    abstract back(): void;
    abstract onPopState(fn: LocationChangeListener): void;
    abstract getBaseHref(): string;
}

export declare class Location {
    constructor(platformStrategy: LocationStrategy);
    path(includeHash?: boolean): string;
    isCurrentPathEqualTo(path: string, query?: string): boolean;
    normalize(url: string): string;
    prepareExternalUrl(url: string): string;
    go(path: string, query?: string): void;
    replaceState(path: string, query?: string): void;
    forward(): void;
    back(): void;
    subscribe(onNext: (value: PopStateEvent) => void, onThrow?: ((exception: any) => void) | null, onReturn?: (() => void) | null): Object;
    static normalizeQueryParams(params: string): string;
    static joinWithSlash(start: string, end: string): string;
    static stripTrailingSlash(url: string): string;
}

// Type definitions for @angular/http 4.1.0
// Project: STEMCstudio
// Definitions by: David Geo Holmes <david.geo.holmes@gmail.com>

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Observable } from 'rxjs/Observable';

export declare class HttpModule {
}

export declare enum ReadyState {
    Unsent = 0,
    Open = 1,
    HeadersReceived = 2,
    Loading = 3,
    Done = 4,
    Cancelled = 5,
}

export declare abstract class Connection {
    readyState: ReadyState;
    request: Request;
    response: any;
}


export declare abstract class ConnectionBackend {
    abstract createConnection(request: any): Connection;
}

export declare enum RequestMethod {
    Get = 0,
    Post = 1,
    Put = 2,
    Delete = 3,
    Options = 4,
    Head = 5,
    Patch = 6,
}

export declare enum ResponseContentType {
    Text = 0,
    Json = 1,
    ArrayBuffer = 2,
    Blob = 3,
}

export interface RequestOptionsArgs {
    url?: string | null;
    method?: string | RequestMethod | null;
    /** @deprecated from 4.0.0. Use params instead. */
    search?: string | URLSearchParams | {
        [key: string]: any | any[];
    } | null;
    params?: string | URLSearchParams | {
        [key: string]: any | any[];
    } | null;
    headers?: Headers | null;
    body?: any;
    withCredentials?: boolean | null;
    responseType?: ResponseContentType | null;
}

export declare class RequestOptions {
    /**
     * Http method with which to execute a {@link Request}.
     * Acceptable methods are defined in the {@link RequestMethod} enum.
     */
    method: RequestMethod | string | null;
    /**
     * {@link Headers} to be attached to a {@link Request}.
     */
    headers: Headers | null;
    /**
     * Body to be used when creating a {@link Request}.
     */
    body: any;
    /**
     * Url with which to perform a {@link Request}.
     */
    url: string | null;
    /**
     * Search parameters to be included in a {@link Request}.
     */
    params: URLSearchParams;
    /**
     * @deprecated from 4.0.0. Use params instead.
     */
    /**
     * @deprecated from 4.0.0. Use params instead.
     */
    search: URLSearchParams;
    /**
     * Enable use credentials for a {@link Request}.
     */
    withCredentials: boolean | null;
    responseType: ResponseContentType | null;
    constructor({ method, headers, body, url, search, params, withCredentials, responseType }?: RequestOptionsArgs);
    /**
     * Creates a copy of the `RequestOptions` instance, using the optional input as values to override
     * existing values. This method will not change the values of the instance on which it is being
     * called.
     *
     * Note that `headers` and `search` will override existing values completely if present in
     * the `options` object. If these values should be merged, it should be done prior to calling
     * `merge` on the `RequestOptions` instance.
     *
     * ```typescript
     * import {RequestOptions, Request, RequestMethod} from '@angular/http';
     *
     * const options = new RequestOptions({
     *   method: RequestMethod.Post
     * });
     * const req = new Request(options.merge({
     *   url: 'https://google.com'
     * }));
     * console.log('req.method:', RequestMethod[req.method]); // Post
     * console.log('options.url:', options.url); // null
     * console.log('req.url:', req.url); // https://google.com
     * ```
     */
    merge(options?: RequestOptionsArgs): RequestOptions;
    private _mergeSearchParams(params?);
    private _parseParams(objParams?);
    private _appendParam(key, value, params);
}

export declare class Http {
    protected _backend: ConnectionBackend;
    protected _defaultOptions: RequestOptions;
    constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions);
    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {@link BaseRequestOptions} before performing the request.
     */
    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response>;
    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response>;
    /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;
    /**
     * Performs a request with `put` http method.
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;
    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response>;
    /**
     * Performs a request with `patch` http method.
     */
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;
    /**
     * Performs a request with `head` http method.
     */
    head(url: string, options?: RequestOptionsArgs): Observable<Response>;
    /**
     * Performs a request with `options` http method.
     */
    options(url: string, options?: RequestOptionsArgs): Observable<Response>;
}

export declare class Headers {
    constructor(headers?: Headers | {
        [name: string]: any;
    } | null);
    /**
     * Returns a new Headers instance from the given DOMString of Response Headers
     */
    static fromResponseHeaderString(headersString: string): Headers;
    /**
     * Appends a header to existing list of header values for a given header name.
     */
    append(name: string, value: string): void;
    /**
     * Deletes all header values for the given name.
     */
    delete(name: string): void;
    forEach(fn: (values: string[], name: string | undefined, headers: Map<string, string[]>) => void): void;
    /**
     * Returns first header that matches given name.
     */
    get(name: string): string | null;
    /**
     * Checks for existence of header by given name.
     */
    has(name: string): boolean;
    /**
     * Returns the names of the headers
     */
    keys(): string[];
    /**
     * Sets or overrides header value for given name.
     */
    set(name: string, value: string | string[]): void;
    /**
     * Returns values of all headers.
     */
    values(): string[][];
    /**
     * Returns string of all headers.
     */
    toJSON(): {
        [name: string]: any;
    };
    /**
     * Returns list of header values for a given name.
     */
    getAll(name: string): string[] | null;
    /**
     * This method is not implemented.
     */
    entries(): void;
    private mayBeSetNormalizedName(name);
}

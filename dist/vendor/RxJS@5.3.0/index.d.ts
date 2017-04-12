// Type definitions for RxJS 5.3.0
// Project: STEMCstudio
// Definitions by: David Geo Holmes
//
// This is a lightweight module definition designed to satisfy the common browser use cases.

/**
 * 
 */
export interface AnonymousSubscription {
    unsubscribe(): void;
}

/**
 * 
 */
export declare type TeardownLogic = AnonymousSubscription | Function | void;

/**
 * 
 */
export interface ISubscription extends AnonymousSubscription {
    unsubscribe(): void;
    closed: boolean;
}

/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 */
export class Subscription implements ISubscription {
    unsubscribe(): void;
    closed: boolean;
}

/**
 * 
 */
export interface Observer<T> {
    closed?: boolean;
    next: (value: T) => void;
    error: (err: any) => void;
    complete: () => void;
}

/**
 * 
 */
export class Subscriber<T> extends Subscription implements Observer<T> {
    next: (value: T) => void;
    error: (err: any) => void;
    complete: () => void;
}

/**
 * Represents a push-style collection.
 */
export interface IObservable<T> { }

/**
 * Type alias for observables and promises
 */
export type ObservableOrPromise<T> = IObservable<T> | Observable<T> | Promise<T>;

/**
 * 
 */
export type ArrayLike<T> = Array<T> | { length: number;[index: number]: T; };

/**
 *  Type alias for arrays and array like objects.
 */
export type ArrayOrIterable<T> = ArrayLike<T>;

export interface IDisposable {
    dispose(): void;
}

export interface IScheduler {
    /**
     * Gets the current time according to the local machine's system clock.
     */
    now(): number;

    /**
     * Schedules an action to be executed.
     */
    schedule<S>(state: S, action: (scheduler: IScheduler, state: S) => IDisposable): IDisposable;

    /**
     * Schedules an action to be executed after dueTime.
     */
    scheduleFuture<S>(state: S, dueTime: number | Date, action: (scheduler: IScheduler, state: S) => IDisposable): IDisposable;
}

export type _Selector<T, RESULT> = (value: T, index: number, observable: Observable<T>) => RESULT;
export type _Predicate<T> = _Selector<T, boolean>;
export type _Accumulator<T, TAcc> = (acc: TAcc, value: T) => TAcc;

/**
 * A representation of any set of values over any amount of time.
 * This the most basic building block of RxJS.
 */
export class Observable<T> {
    /**
     * subscribe is the function that is  called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    constructor(subscribe?: <R>(this: Observable<T>, subscriber: Subscriber<R>) => TeardownLogic);

    /**
    * Continues an observable sequence that is terminated by an exception with the next observable sequence.
    * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
    * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
    */
    catch(handler: (exception: any) => ObservableOrPromise<T>): Observable<T>;

    /**
     * Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
     */
    concat(...sources: ObservableOrPromise<T>[]): Observable<T>;

    /**
     * Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
     */
    filter(predicate: _Predicate<T>, thisArg?: any): Observable<T>;

    /**
     * Projects each element of an observable sequence into a new form by incorporating the element's index.
     */
    map<RESULT>(selector: _Selector<T, RESULT>, thisArg?: any): Observable<RESULT>;

    /**
     *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
     *  For aggregation behavior with no intermediate results, see Observable.aggregate.
     */
    scan<TAcc>(accumulator: _Accumulator<T, TAcc>, seed?: TAcc): Observable<TAcc>;

    /**
     * Registers handlers for handling emitted values, error and completions from the observable, and
     * executes the observable's subscriber function, which will take action to set up the underlying data stream.
     */
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription;

    /**
     * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
     */
    switch(): T;

    /**
     * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
     */
    switchLatest(): T;

    /**
     * Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
     */
    take(count: number, scheduler?: IScheduler): Observable<T>;

    /**
     * Creates a new Observable sequence from an array-like or iterable object.
     */
    static from<T>(array: ArrayOrIterable<T>): Observable<T>;

    /**
     * Creates an observable sequence by adding an event listener to the matching DOMElement.
     */
    static fromEvent<T>(element: EventTarget, eventName: string, selector?: (args: any[]) => T): Observable<T>;

    /**
     * Converts a Promise to an Observable sequence
     */
    static fromPromise<T>(promise: Promise<T>): Observable<T>;

    /**
     *  Returns an observable sequence that produces a value after each period.
     */
    static interval(period: number, scheduler?: IScheduler): Observable<number>;

    /**
     *  Creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
     */
    static of<T>(...values: T[]): Observable<T>;

    /**
     *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
     */
    static range(start: number, count: number, scheduler?: IScheduler): Observable<number>;

    /**
     *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
     */
    static timer(dueTime: number, period: number, scheduler?: IScheduler): Observable<number>;
}
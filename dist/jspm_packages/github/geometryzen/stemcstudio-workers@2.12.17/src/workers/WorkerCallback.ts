/**
 * Implementations may extend this interface.
 */
export interface WorkerEventHandlerData {
    callbackId?: number;
}

/**
 * This is implemented by the Sender class which is instantiated by the thread code.
 */
export interface WorkerCallback {

    /**
     * Registers a callback function to handle events.
     */
    on<T extends WorkerEventHandlerData>(eventName: string, callback: (e: { data: T }) => void): void;

    /**
     * Used by the Mirror (base class for language worker implementations).
     * TODO: Can this be replaced by the more robust resolve and reject methods?
     */
    callback(message: any, callbackId: number): void;

    /**
     * Used for unsolicited messages, such as annotations.
     */
    emit(eventName: string, message?: any): void;

    /**
     * Used to respond to a request as a Promise resolution.
     */
    resolve(eventName: string, value: any, callbackId: number): void;
    /**
     * Used to respond to a request as a Promise rejection.
     */
    reject(eventName: string, reason: any, callbackId: number): void;
}

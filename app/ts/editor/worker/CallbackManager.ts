const INITIAL_CALLBACK_ID = 1;

/**
 * Manage a cache of callback functions by trading for a generated numeric callback identifier.
 */
export class CallbackManager {
    private callbacks: { [id: number]: (data: any) => any } = {};
    private callbackId: number = INITIAL_CALLBACK_ID;

    constructor() {
        // Do nothing.
    }

    /**
     * Trades the incoming callback function for a number.
     */
    public captureCallback(callback: (err: any) => any): number {
        const callbackId = this.callbackId++;
        this.callbacks[callbackId] = callback;
        return callbackId;
    }

    /**
     * Trades the incomind number for a callback function.
     */
    public releaseCallback(callbackId: number): (err: any) => any {
        const callback = this.callbacks[callbackId];
        delete this.callbacks[callbackId];
        this.housekeeping();
        return callback;
    }

    /**
     * Keep the callback identifiers as low as possible.
     */
    private housekeeping(): void {
        const outstandingCallbacks = Object.keys(this.callbacks).length > 0;
        if (!outstandingCallbacks) {
            this.callbackId = INITIAL_CALLBACK_ID;
        }
    }
}

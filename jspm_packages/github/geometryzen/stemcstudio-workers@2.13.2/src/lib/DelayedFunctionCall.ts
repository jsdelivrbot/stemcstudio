/**
 * A means for ensuring that there is no more than one update
 * request scheduled at a given time.
 */
export interface DelayedFunctionCall {

    (timeout: number): void;

    delay(timeout: number): void;

    /**
     * Cancels a pending callback.
     */
    cancel(): void;

    /**
     * Determines whether there is a pending callback scheduled.
     */
    isPending(): boolean;

    /**
     * Schedules a callback after the default amount of time.
     * If a callback has already been scheduled, this has no effect.
     */
    schedule(timeout: number): void;
}

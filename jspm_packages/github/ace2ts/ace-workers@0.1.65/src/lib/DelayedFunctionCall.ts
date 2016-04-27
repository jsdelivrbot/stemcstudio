/**
 * A means for ensuring that there is no more than one update
 * request scheduled at a given time.
 *
 * @class DelayedFunctionCall
 */
interface DelayedFunctionCall {

    /**
     * @method anonymous
     * @param timeout {number}
     * @return {void}
     */
    (timeout: number): void;

    /**
     * A convenience for cancel followed by schedule.
     *
     * @method delay
     * @param timeout {number}
     * @return {void}
     */
    delay(timeout: number): void;

    /**
     * Cancels a pending callback.
     *
     * @method cancel
     * @return {void}
     */
    cancel(): void;

    /**
     * Determines whether there is a pending callback scheduled.
     */
    isPending(): boolean;

    /**
     * Schedules a callback after the default amount of time.
     * If a callback has already been scheduled, this has no effect.
     *
     * @method schedule
     * @param timeout {number}
     * @return {void}
     */
    schedule(timeout: number): void;
}

export default DelayedFunctionCall;
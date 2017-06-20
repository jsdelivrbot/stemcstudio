import { DelayedCall } from './DelayedCall';

/**
 *
 */
export function createDelayedCall(fcn: () => any, defaultTimeout?: number): DelayedCall {

    let timer: number | null = null;

    /**
     * Wrapper function for the external callback allows reuse.
     */
    const callback = function () {
        // Allow another function call to be scheduled using the same object.
        timer = null;
        fcn();
    };

    const that: DelayedCall = <DelayedCall>function (timeout: number) {
        if (timer == null) {
            timer = window.setTimeout(callback, timeout || defaultTimeout);
        }
    };

    that.delay = function (timeout: number) {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = window.setTimeout(callback, timeout || defaultTimeout);
    };

    that.schedule = that;

    that.call = () => {
        that.cancel();
        fcn();
    };

    that.cancel = function () {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = null;
    };

    that.isPending = function (): boolean {
        return !!timer;
    };

    return Object.freeze(that);
}

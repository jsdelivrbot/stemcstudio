import DelayedCall from './DelayedCall';

/**
 *
 */
export default function createDelayedCall(fcn: () => any, defaultTimeout?: number): DelayedCall {

    let timer: number = null;

    /**
     * Wrapper function for the external callback allows reuse.
     */
    const callback = function () {
        // Allow another function call to be scheduled using the same object.
        timer = null;
        fcn();
    };

    const _self: DelayedCall = <DelayedCall>function (timeout: number) {
        if (timer == null) {
            timer = window.setTimeout(callback, timeout || defaultTimeout);
        }
    };

    _self.delay = function (timeout: number) {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = window.setTimeout(callback, timeout || defaultTimeout);
    };

    _self.schedule = _self;

    _self.call = () => {
        _self.cancel();
        fcn();
    };

    _self.cancel = function () {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = null;
    };

    _self.isPending = function (): boolean {
        return !!timer;
    };

    return _self;
}

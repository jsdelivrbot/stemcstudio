define(["require", "exports"], function (require, exports) {
    function createDelayedCall(fcn, defaultTimeout) {
        var timer = null;
        var callback = function () {
            timer = null;
            fcn();
        };
        var _self = function (timeout) {
            if (timer == null) {
                timer = window.setTimeout(callback, timeout || defaultTimeout);
            }
        };
        _self.delay = function (timeout) {
            if (timer) {
                window.clearTimeout(timer);
            }
            timer = window.setTimeout(callback, timeout || defaultTimeout);
        };
        _self.schedule = _self;
        _self.call = function () {
            this.cancel();
            fcn();
        };
        _self.cancel = function () {
            if (timer) {
                window.clearTimeout(timer);
            }
            timer = null;
        };
        _self.isPending = function () {
            return !!timer;
        };
        return _self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createDelayedCall;
});

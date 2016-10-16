System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function delayedCall(fcn, defaultTimeout) {
        var timer = null;
        var callbackWrapper = function () {
            timer = null;
            fcn();
        };
        var _self = function (timeout) {
            if (timer === null) {
                timer = setTimeout(callbackWrapper, timeout || defaultTimeout);
            }
        };
        _self.delay = function (timeout) {
            timer && clearTimeout(timer);
            timer = setTimeout(callbackWrapper, timeout || defaultTimeout);
        };
        _self.schedule = _self;
        _self.call = function () {
            _self.cancel();
            fcn();
        };
        _self.cancel = function () {
            timer && clearTimeout(timer);
            timer = null;
        };
        _self.isPending = function () {
            return timer !== null;
        };
        return _self;
    }
    exports_1("default", delayedCall);
    return {
        setters:[],
        execute: function() {
        }
    }
});

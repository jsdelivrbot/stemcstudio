System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function clone(x) {
        var keys = Object.keys(x);
        var result = {};
        for (var i = 0, iLength = keys.length; i < iLength; i++) {
            var key = keys[i];
            var prop = x[key];
            result[key] = prop;
        }
        return result;
    }
    exports_1("default", clone);
    return {
        setters: [],
        execute: function () {
        }
    };
});

System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function clone(x) {
        var keys = Object.keys(x);
        var result = {};
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
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

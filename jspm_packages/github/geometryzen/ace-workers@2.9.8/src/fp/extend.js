System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function extend(obj, x) {
        var keys = Object.keys(x);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var prop = x[key];
            obj[key] = prop;
        }
        return obj;
    }
    exports_1("default", extend);
    return {
        setters: [],
        execute: function () {
        }
    };
});

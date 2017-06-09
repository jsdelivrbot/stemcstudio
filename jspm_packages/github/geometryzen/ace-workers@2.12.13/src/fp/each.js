System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function each(obj, callback) {
        if (!obj) {
            return;
        }
        var keys = Object.keys(obj);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var value = obj[key];
            callback(value, key);
        }
    }
    exports_1("each", each);
    return {
        setters: [],
        execute: function () {
        }
    };
});

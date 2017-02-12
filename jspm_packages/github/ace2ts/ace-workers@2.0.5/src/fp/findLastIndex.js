System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function findLastIndex(xs, callback) {
        for (var i = xs.length - 1; i >= 0; i--) {
            var x = xs[i];
            if (callback(x)) {
                return i;
            }
        }
        return -1;
    }
    exports_1("default", findLastIndex);
    return {
        setters: [],
        execute: function () {
        }
    };
});

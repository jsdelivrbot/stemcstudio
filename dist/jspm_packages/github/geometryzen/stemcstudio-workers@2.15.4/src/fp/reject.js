System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function reject(xs, predicate) {
        var result = [];
        for (var _i = 0, xs_1 = xs; _i < xs_1.length; _i++) {
            var x = xs_1[_i];
            if (!predicate(x)) {
                result.push(x);
            }
        }
        return result;
    }
    exports_1("reject", reject);
    return {
        setters: [],
        execute: function () {
        }
    };
});

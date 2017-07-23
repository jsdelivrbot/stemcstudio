System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function contains(xs, element) {
        for (var _i = 0, xs_1 = xs; _i < xs_1.length; _i++) {
            var x = xs_1[_i];
            if (x === element) {
                return true;
            }
        }
        return false;
    }
    exports_1("contains", contains);
    return {
        setters: [],
        execute: function () {
        }
    };
});

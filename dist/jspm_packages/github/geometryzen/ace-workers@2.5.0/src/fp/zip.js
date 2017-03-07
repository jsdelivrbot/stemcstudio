System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function zip(xs, ys) {
        var zs = [];
        var iLength = xs.length;
        for (var i = 0; i < iLength; i++) {
            var x = xs[i];
            var y = xs[i];
            var z = [x, y];
            zs.push(z);
        }
        return zs;
    }
    exports_1("default", zip);
    return {
        setters: [],
        execute: function () {
        }
    };
});

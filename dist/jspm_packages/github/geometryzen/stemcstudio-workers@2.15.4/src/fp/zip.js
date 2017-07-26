System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function zip(xs, ys) {
        var zs = [];
        var N = xs.length;
        for (var i = 0; i < N; i++) {
            var x = xs[i];
            var y = ys[i];
            var z = [x, y];
            zs.push(z);
        }
        return zs;
    }
    exports_1("zip", zip);
    return {
        setters: [],
        execute: function () {
        }
    };
});

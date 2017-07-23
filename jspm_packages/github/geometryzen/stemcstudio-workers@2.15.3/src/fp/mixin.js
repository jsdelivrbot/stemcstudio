System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function mixin(obj, base) {
        var wild = obj;
        for (var key in base) {
            if (base.hasOwnProperty(key)) {
                wild[key] = base[key];
            }
        }
        return wild;
    }
    exports_1("mixin", mixin);
    return {
        setters: [],
        execute: function () {
        }
    };
});

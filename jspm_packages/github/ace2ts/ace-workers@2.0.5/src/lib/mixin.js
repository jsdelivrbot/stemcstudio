System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function mixin(obj, base) {
        for (var key in base) {
            if (base.hasOwnProperty(key)) {
                obj[key] = base[key];
            }
        }
        return obj;
    }
    exports_1("default", mixin);
    return {
        setters: [],
        execute: function () {
        }
    };
});

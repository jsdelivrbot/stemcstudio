System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function has(obj, v) {
        if (typeof v === 'undefined') {
            return false;
        }
        if (typeof v !== 'string') {
            console.warn("has(obj, v): v must be a string, v => " + v);
        }
        if (obj && obj.hasOwnProperty) {
            return obj.hasOwnProperty(v);
        }
        else {
            return false;
        }
    }
    exports_1("has", has);
    return {
        setters: [],
        execute: function () {
        }
    };
});

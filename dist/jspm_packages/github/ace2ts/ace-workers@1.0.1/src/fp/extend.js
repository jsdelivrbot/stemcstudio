System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function extend(obj, x) {
        var keys = Object.keys(x);
        for (var i = 0, iLength = keys.length; i < iLength; i++) {
            var key = keys[i];
            var prop = x[key];
            obj[key] = prop;
        }
        return obj;
    }
    exports_1("default", extend);
    return {
        setters:[],
        execute: function() {
        }
    }
});

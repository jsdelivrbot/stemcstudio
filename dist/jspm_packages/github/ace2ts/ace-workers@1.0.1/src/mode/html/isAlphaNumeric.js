System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isAlphaNumeric(c) {
        return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    }
    exports_1("default", isAlphaNumeric);
    return {
        setters:[],
        execute: function() {
        }
    }
});

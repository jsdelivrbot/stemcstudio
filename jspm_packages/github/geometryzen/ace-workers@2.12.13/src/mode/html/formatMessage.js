System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function formatMessage(format, args) {
        return format.replace(new RegExp('{[0-9a-z-]+}', 'gi'), function (match) {
            return args[match.slice(1, -1)] || match;
        });
    }
    exports_1("formatMessage", formatMessage);
    return {
        setters: [],
        execute: function () {
        }
    };
});

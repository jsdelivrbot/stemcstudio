System.register([], function(exports_1) {
    function formatMessage(format, args) {
        return format.replace(new RegExp('{[0-9a-z-]+}', 'gi'), function (match) {
            return args[match.slice(1, -1)] || match;
        });
    }
    exports_1("default", formatMessage);
    return {
        setters:[],
        execute: function() {
        }
    }
});

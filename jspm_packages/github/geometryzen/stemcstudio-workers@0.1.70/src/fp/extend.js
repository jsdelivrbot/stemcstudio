System.register([], function(exports_1) {
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

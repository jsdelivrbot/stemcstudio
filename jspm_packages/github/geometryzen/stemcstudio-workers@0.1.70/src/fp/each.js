System.register([], function(exports_1) {
    function each(obj, callback) {
        if (!obj) {
            return;
        }
        var keys = Object.keys(obj);
        for (var i = 0, iLength = keys.length; i < iLength; i++) {
            var key = keys[i];
            var value = obj[key];
            callback(value, key);
        }
    }
    exports_1("default", each);
    return {
        setters:[],
        execute: function() {
        }
    }
});

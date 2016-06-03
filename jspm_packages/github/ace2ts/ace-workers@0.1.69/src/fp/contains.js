System.register([], function(exports_1) {
    function contains(xs, x) {
        for (var i = 0, iLength = xs.length; i < iLength; i++) {
            if (xs[i] === x) {
                return true;
            }
        }
        return false;
    }
    exports_1("default", contains);
    return {
        setters:[],
        execute: function() {
        }
    }
});

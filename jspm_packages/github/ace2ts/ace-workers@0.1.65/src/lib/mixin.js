System.register([], function(exports_1) {
    function mixin(obj, base) {
        for (var key in base) {
            obj[key] = base[key];
        }
        return obj;
    }
    exports_1("default", mixin);
    return {
        setters:[],
        execute: function() {
        }
    }
});

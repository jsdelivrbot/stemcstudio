System.register(['./tokenize'], function(exports_1) {
    var tokenize_1;
    function default_1(str) {
        var generator = tokenize_1.default();
        var tokens = [];
        tokens = tokens.concat(generator(str));
        tokens = tokens.concat(generator(null));
        return tokens;
    }
    exports_1("default", default_1);
    return {
        setters:[
            function (tokenize_1_1) {
                tokenize_1 = tokenize_1_1;
            }],
        execute: function() {
        }
    }
});

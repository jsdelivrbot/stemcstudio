System.register(["./tokenizeString", "./parser"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function parse(code) {
        var tokens = tokenizeString_1.default(code);
        var reader = parser_1.default();
        for (var i = 0; i < tokens.length; i++) {
            reader(tokens[i]);
        }
        var ast = reader(null);
        return ast;
    }
    exports_1("parse", parse);
    var tokenizeString_1, parser_1;
    return {
        setters: [
            function (tokenizeString_1_1) {
                tokenizeString_1 = tokenizeString_1_1;
            },
            function (parser_1_1) {
                parser_1 = parser_1_1;
            }
        ],
        execute: function () {
        }
    };
});

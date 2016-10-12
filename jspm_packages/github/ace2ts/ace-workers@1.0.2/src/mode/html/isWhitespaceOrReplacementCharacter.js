System.register(['./isWhitespace'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var isWhitespace_1;
    function isWhitespaceOrReplacementCharacter(ch) {
        return isWhitespace_1.default(ch) || ch === '\uFFFD';
    }
    exports_1("default", isWhitespaceOrReplacementCharacter);
    return {
        setters:[
            function (isWhitespace_1_1) {
                isWhitespace_1 = isWhitespace_1_1;
            }],
        execute: function() {
        }
    }
});

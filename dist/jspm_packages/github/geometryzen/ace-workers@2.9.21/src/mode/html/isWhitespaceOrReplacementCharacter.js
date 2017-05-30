System.register(["./isWhitespace"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isWhitespaceOrReplacementCharacter(ch) {
        return isWhitespace_1.isWhitespace(ch) || ch === '\uFFFD';
    }
    exports_1("isWhitespaceOrReplacementCharacter", isWhitespaceOrReplacementCharacter);
    var isWhitespace_1;
    return {
        setters: [
            function (isWhitespace_1_1) {
                isWhitespace_1 = isWhitespace_1_1;
            }
        ],
        execute: function () {
        }
    };
});

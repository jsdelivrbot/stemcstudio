System.register(["./isWhitespace"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isAllWhitespace(characters) {
        for (var _i = 0, characters_1 = characters; _i < characters_1.length; _i++) {
            var ch = characters_1[_i];
            if (!isWhitespace_1.isWhitespace(ch)) {
                return false;
            }
        }
        return true;
    }
    exports_1("isAllWhitespace", isAllWhitespace);
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

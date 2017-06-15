System.register(["./isWhitespaceOrReplacementCharacter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isAllWhitespaceOrReplacementCharacters(characters) {
        for (var _i = 0, characters_1 = characters; _i < characters_1.length; _i++) {
            var ch = characters_1[_i];
            if (!isWhitespaceOrReplacementCharacter_1.isWhitespaceOrReplacementCharacter(ch)) {
                return false;
            }
        }
        return true;
    }
    exports_1("isAllWhitespaceOrReplacementCharacters", isAllWhitespaceOrReplacementCharacters);
    var isWhitespaceOrReplacementCharacter_1;
    return {
        setters: [
            function (isWhitespaceOrReplacementCharacter_1_1) {
                isWhitespaceOrReplacementCharacter_1 = isWhitespaceOrReplacementCharacter_1_1;
            }
        ],
        execute: function () {
        }
    };
});

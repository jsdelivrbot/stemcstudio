System.register(['./isWhitespaceOrReplacementCharacter'], function(exports_1) {
    var isWhitespaceOrReplacementCharacter_1;
    function isAllWhitespaceOrReplacementCharacters(characters) {
        for (var i = 0; i < characters.length; i++) {
            var ch = characters[i];
            if (!isWhitespaceOrReplacementCharacter_1.default(ch))
                return false;
        }
        return true;
    }
    exports_1("default", isAllWhitespaceOrReplacementCharacters);
    return {
        setters:[
            function (isWhitespaceOrReplacementCharacter_1_1) {
                isWhitespaceOrReplacementCharacter_1 = isWhitespaceOrReplacementCharacter_1_1;
            }],
        execute: function() {
        }
    }
});

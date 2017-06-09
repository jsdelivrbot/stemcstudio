System.register(['./isWhitespace'], function(exports_1) {
    var isWhitespace_1;
    function isAllWhitespace(characters) {
        for (var i = 0; i < characters.length; i++) {
            var ch = characters[i];
            if (!isWhitespace_1.default(ch))
                return false;
        }
        return true;
    }
    exports_1("default", isAllWhitespace);
    return {
        setters:[
            function (isWhitespace_1_1) {
                isWhitespace_1 = isWhitespace_1_1;
            }],
        execute: function() {
        }
    }
});

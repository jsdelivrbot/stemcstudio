System.register([], function(exports_1) {
    var asciiIdentifierStartTable, i, asciiIdentifierPartTable;
    return {
        setters:[],
        execute: function() {
            exports_1("asciiIdentifierStartTable", asciiIdentifierStartTable = []);
            for (i = 0; i < 128; i++) {
                asciiIdentifierStartTable[i] =
                    i === 36 ||
                        i >= 65 && i <= 90 ||
                        i === 95 ||
                        i >= 97 && i <= 122;
            }
            exports_1("asciiIdentifierPartTable", asciiIdentifierPartTable = []);
            for (i = 0; i < 128; i++) {
                asciiIdentifierPartTable[i] =
                    asciiIdentifierStartTable[i] ||
                        i >= 48 && i <= 57;
            }
        }
    }
});

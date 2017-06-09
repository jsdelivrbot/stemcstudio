System.register([], function(exports_1) {
    var NodeType;
    return {
        setters:[],
        execute: function() {
            NodeType = {
                CDATA: 1,
                CHARACTERS: 2,
                COMMENT: 3,
                DOCUMENT: 4,
                DOCUMENT_FRAGMENT: 5,
                DTD: 6,
                ELEMENT: 7,
                ENTITY: 8,
                IGNORABLE_WHITESPACE: 9,
                PROCESSING_INSTRUCTION: 10,
                SKIPPED_ENTITY: 11
            };
            exports_1("default",NodeType);
        }
    }
});

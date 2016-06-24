System.register([], function(exports_1) {
    function getAttribute(node, name) {
        for (var i = 0; i < node.attributes.length; i++) {
            var attribute = node.attributes[i];
            if (attribute.nodeName === name) {
                return attribute;
            }
        }
        return null;
    }
    exports_1("default", getAttribute);
    return {
        setters:[],
        execute: function() {
        }
    }
});

System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getAttribute(node, name) {
        for (var i = 0; i < node.attributes.length; i++) {
            var attribute = node.attributes[i];
            if (attribute.nodeName === name) {
                return attribute;
            }
        }
        return null;
    }
    exports_1("getAttribute", getAttribute);
    return {
        setters: [],
        execute: function () {
        }
    };
});

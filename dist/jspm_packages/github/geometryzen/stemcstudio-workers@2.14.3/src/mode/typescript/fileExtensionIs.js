System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function endsWith(str, suffix) {
        var expectedPos = str.length - suffix.length;
        return expectedPos >= 0 && str.indexOf(suffix, expectedPos) === expectedPos;
    }
    function fileExtensionIs(path, extension) {
        return path.length > extension.length && endsWith(path, extension);
    }
    exports_1("fileExtensionIs", fileExtensionIs);
    return {
        setters: [],
        execute: function () {
        }
    };
});

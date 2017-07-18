System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function endsWith(path, suffix) {
        var expectedPos = path.length - suffix.length;
        return expectedPos >= 0 && path.indexOf(suffix, expectedPos) === expectedPos;
    }
    function fileExtensionIs(path, extension) {
        return path.length > extension.length && endsWith(path, extension);
    }
    exports_1("fileExtensionIs", fileExtensionIs);
    function removeExtension(path, extension) {
        var endPos = path.length - extension.length;
        return path.substring(0, endPos);
    }
    exports_1("removeExtension", removeExtension);
    return {
        setters: [],
        execute: function () {
        }
    };
});

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
    function transpileModule(program, sourceFile, customTransformers) {
        var outputText;
        var sourceMapText;
        function writeFile(fileName, text, writeByteOrderMark, onError, sourceFiles) {
            if (fileExtensionIs(fileName, ".map")) {
                sourceMapText = text;
            }
            else if (fileExtensionIs(fileName, ".d.ts")) {
            }
            else if (fileExtensionIs(fileName, ".js")) {
                outputText = text;
            }
            else {
                console.warn("fileName => " + fileName);
            }
        }
        ;
        program.emit(sourceFile, writeFile, void 0, false, customTransformers);
        return { outputText: outputText, sourceMapText: sourceMapText };
    }
    exports_1("default", transpileModule);
    return {
        setters: [],
        execute: function () {
        }
    };
});

System.register(["./fileExtensionIs"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function transpileModule(program, sourceFile, customTransformers) {
        var outputText;
        var sourceMapText;
        function writeFile(fileName, text, writeByteOrderMark, onError, sourceFiles) {
            if (fileExtensionIs_1.fileExtensionIs(fileName, ".map")) {
                sourceMapText = text;
            }
            else if (fileExtensionIs_1.fileExtensionIs(fileName, ".d.ts")) {
            }
            else if (fileExtensionIs_1.fileExtensionIs(fileName, ".js")) {
                outputText = text;
            }
            else {
                console.warn("fileName => " + fileName);
            }
        }
        program.emit(sourceFile, writeFile, void 0, false, customTransformers);
        return { outputText: outputText, sourceMapText: sourceMapText };
    }
    exports_1("transpileModule", transpileModule);
    var fileExtensionIs_1;
    return {
        setters: [
            function (fileExtensionIs_1_1) {
                fileExtensionIs_1 = fileExtensionIs_1_1;
            }
        ],
        execute: function () {
        }
    };
});

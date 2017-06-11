System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PythonLanguageService;
    return {
        setters: [],
        execute: function () {
            PythonLanguageService = (function () {
                function PythonLanguageService(host) {
                    this.sourceMaps = {};
                }
                PythonLanguageService.prototype.getSourceMap = function (fileName) {
                    return this.sourceMaps[fileName];
                };
                PythonLanguageService.prototype.setSourceMap = function (fileName, sourceMap) {
                    this.sourceMaps[fileName] = sourceMap;
                };
                return PythonLanguageService;
            }());
            exports_1("PythonLanguageService", PythonLanguageService);
        }
    };
});

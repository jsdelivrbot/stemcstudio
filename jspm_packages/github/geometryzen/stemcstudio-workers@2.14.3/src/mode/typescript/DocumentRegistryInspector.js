System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DocumentRegistryInspector;
    return {
        setters: [],
        execute: function () {
            DocumentRegistryInspector = (function () {
                function DocumentRegistryInspector(documentRegistry) {
                    this.documentRegistry = documentRegistry;
                    this.trace = false;
                }
                DocumentRegistryInspector.prototype.acquireDocument = function (fileName, compilationSettings, scriptSnapshot, version) {
                    if (this.trace) {
                        console.log("acquireDocument(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
                    }
                    return this.documentRegistry.acquireDocument(fileName, compilationSettings, scriptSnapshot, version);
                };
                DocumentRegistryInspector.prototype.acquireDocumentWithKey = function (fileName, path, compilationSettings, key, scriptSnapshot, version, scriptKind) {
                    if (this.trace) {
                        console.log("acquireDocumentWithKey(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
                    }
                    return this.documentRegistry.acquireDocumentWithKey(fileName, path, compilationSettings, key, scriptSnapshot, version);
                };
                DocumentRegistryInspector.prototype.getKeyForCompilationSettings = function (settings) {
                    return this.documentRegistry.getKeyForCompilationSettings(settings);
                };
                DocumentRegistryInspector.prototype.releaseDocument = function (fileName, compilationSettings) {
                    if (this.trace) {
                        console.log("releaseDocument(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
                    }
                    return this.documentRegistry.releaseDocument(fileName, compilationSettings);
                };
                DocumentRegistryInspector.prototype.releaseDocumentWithKey = function (path, key) {
                    return this.documentRegistry.releaseDocumentWithKey(path, key);
                };
                DocumentRegistryInspector.prototype.reportStats = function () {
                    if (this.trace) {
                        console.log("reportStats()");
                    }
                    return this.documentRegistry.reportStats();
                };
                DocumentRegistryInspector.prototype.updateDocument = function (fileName, compilationSettings, scriptSnapshot, version) {
                    if (this.trace) {
                        console.log("updateDocument(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
                    }
                    return this.documentRegistry.updateDocument(fileName, compilationSettings, scriptSnapshot, version);
                };
                DocumentRegistryInspector.prototype.updateDocumentWithKey = function (fileName, path, compilationSettings, key, scriptSnapshot, version, scriptKind) {
                    if (this.trace) {
                        console.log("updateDocumentWithKey(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
                    }
                    return this.documentRegistry.updateDocumentWithKey(fileName, path, compilationSettings, key, scriptSnapshot, version);
                };
                return DocumentRegistryInspector;
            }());
            exports_1("DocumentRegistryInspector", DocumentRegistryInspector);
        }
    };
});

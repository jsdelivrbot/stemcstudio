System.register(["./DocumentRegistryInspector", "./fileExtensionIs", "./LanguageServiceHelpers", "../python/PythonLanguageService", "./transpileModule", "typhon-lang", "../python/Linter", "../tslint/linter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isTypeScriptFileName(fileName) {
        return fileExtensionIs_1.fileExtensionIs(fileName, '.ts')
            || fileExtensionIs_1.fileExtensionIs(fileName, '.tsx')
            || fileExtensionIs_1.fileExtensionIs(fileName, '.d.ts')
            || isJavaScriptFileName(fileName);
    }
    function isJavaScriptFileName(fileName) {
        return fileExtensionIs_1.fileExtensionIs(fileName, '.js')
            || fileExtensionIs_1.fileExtensionIs(fileName, '.jsx');
    }
    function isPythonFileName(fileName) {
        return fileExtensionIs_1.fileExtensionIs(fileName, '.py')
            || fileExtensionIs_1.fileExtensionIs(fileName, '.pyx')
            || fileExtensionIs_1.fileExtensionIs(fileName, '.d.py');
    }
    function tsDiagnosticToEditorDiagnostic(diagnostic) {
        return {
            message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
            start: diagnostic.start,
            length: diagnostic.length,
            category: diagnostic.category,
            code: diagnostic.code
        };
    }
    function ruleFailureToEditorDiagnostic(ruleFailure) {
        var start = ruleFailure.getStartPosition().getPosition();
        var end = ruleFailure.getEndPosition().getPosition();
        var length = end - start;
        var ruleName = ruleFailure.getRuleName();
        return {
            message: ruleFailure.getFailure(),
            start: start,
            length: length,
            category: DiagnosticCategory.Warning,
            code: ruleName
        };
    }
    function systemModuleName(prefix, fileName, extension) {
        var lastPeriod = fileName.lastIndexOf('.');
        if (lastPeriod >= 0) {
            var name = fileName.substring(0, lastPeriod);
            if (typeof extension === 'string') {
                return [prefix, name, '.', extension].join('');
            }
            else {
                return [prefix, name].join('');
            }
        }
        else {
            if (typeof extension === 'string') {
                return [prefix, fileName, '.', extension].join('');
            }
            else {
                return [prefix, fileName].join('');
            }
        }
    }
    function getTargetFileName(fileName) {
        if (fileExtensionIs_1.fileExtensionIs(fileName, '.py')) {
            var end = fileName.lastIndexOf('.py');
            return fileName.substring(0, end) + ".ts";
        }
        else {
            throw new Error("getTargetFileName(" + fileName + ")");
        }
    }
    function targetNeedsUpdate(sourceVersion, targetVersion) {
        if (typeof targetVersion === 'number') {
            if (typeof sourceVersion === 'number') {
                return sourceVersion > targetVersion;
            }
            else {
                throw new Error("sourceVersion should not be undefined");
            }
        }
        else {
            return true;
        }
    }
    var DocumentRegistryInspector_1, fileExtensionIs_1, LanguageServiceHelpers_1, PythonLanguageService_1, transpileModule_1, typhon_lang_1, Linter_1, linter_1, useCaseSensitiveFileNames, LanguageServiceDispatcher, DiagnosticCategory;
    return {
        setters: [
            function (DocumentRegistryInspector_1_1) {
                DocumentRegistryInspector_1 = DocumentRegistryInspector_1_1;
            },
            function (fileExtensionIs_1_1) {
                fileExtensionIs_1 = fileExtensionIs_1_1;
            },
            function (LanguageServiceHelpers_1_1) {
                LanguageServiceHelpers_1 = LanguageServiceHelpers_1_1;
            },
            function (PythonLanguageService_1_1) {
                PythonLanguageService_1 = PythonLanguageService_1_1;
            },
            function (transpileModule_1_1) {
                transpileModule_1 = transpileModule_1_1;
            },
            function (typhon_lang_1_1) {
                typhon_lang_1 = typhon_lang_1_1;
            },
            function (Linter_1_1) {
                Linter_1 = Linter_1_1;
            },
            function (linter_1_1) {
                linter_1 = linter_1_1;
            }
        ],
        execute: function () {
            useCaseSensitiveFileNames = true;
            LanguageServiceDispatcher = (function () {
                function LanguageServiceDispatcher(pyLanguageServiceHost, tsLanguageServiceHost) {
                    this.pyLanguageServiceHost = pyLanguageServiceHost;
                    this.tsLanguageServiceHost = tsLanguageServiceHost;
                    this.tsDocumentRegistry = new DocumentRegistryInspector_1.DocumentRegistryInspector(ts.createDocumentRegistry(useCaseSensitiveFileNames));
                }
                LanguageServiceDispatcher.prototype.applyDelta = function (fileName, delta) {
                    if (isTypeScriptFileName(fileName)) {
                        this.tsLanguageServiceHost.applyDelta(fileName, delta);
                    }
                    else if (isPythonFileName(fileName)) {
                        this.pyLanguageServiceHost.applyDelta(fileName, delta);
                    }
                    else {
                        throw new Error("delta cannot be applied to file '" + fileName + "'.");
                    }
                };
                LanguageServiceDispatcher.prototype.getScriptContent = function (fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        return this.tsLanguageServiceHost.getScriptContent(fileName);
                    }
                    else if (isPythonFileName(fileName)) {
                        return this.pyLanguageServiceHost.getScriptContent(fileName);
                    }
                    else {
                        throw new Error("Cannot get script content for file '" + fileName + "'.");
                    }
                };
                LanguageServiceDispatcher.prototype.setScriptContent = function (fileName, content) {
                    if (isTypeScriptFileName(fileName)) {
                        return this.tsLanguageServiceHost.setScriptContent(fileName, content);
                    }
                    else if (isPythonFileName(fileName)) {
                        return this.pyLanguageServiceHost.setScriptContent(fileName, content);
                    }
                    else {
                        throw new Error("Cannot set script content for file '" + fileName + "'.");
                    }
                };
                LanguageServiceDispatcher.prototype.removeScript = function (fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        return this.tsLanguageServiceHost.removeScript(fileName);
                    }
                    else if (isPythonFileName(fileName)) {
                        return this.pyLanguageServiceHost.removeScript(fileName);
                    }
                    else {
                        throw new Error("Cannot set script content for file '" + fileName + "'.");
                    }
                };
                LanguageServiceDispatcher.prototype.ensureModuleMapping = function (moduleName, fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        return this.tsLanguageServiceHost.ensureModuleMapping(moduleName, fileName);
                    }
                    else {
                        throw new Error("Cannot map module '" + moduleName + "'to file '" + fileName + "'.");
                    }
                };
                LanguageServiceDispatcher.prototype.removeModuleMapping = function (moduleName) {
                    return this.tsLanguageServiceHost.removeModuleMapping(moduleName);
                };
                LanguageServiceDispatcher.prototype.getDefaultLibFileName = function (options) {
                    return this.tsLanguageServiceHost.getDefaultLibFileName(options);
                };
                LanguageServiceDispatcher.prototype.getCompilationSettings = function () {
                    return this.tsLanguageServiceHost.getCompilationSettings();
                };
                LanguageServiceDispatcher.prototype.setCompilationSettings = function (compilerOptions) {
                    var oldSettings = this.getCompilationSettings();
                    this.tsLanguageServiceHost.setCompilationSettings(compilerOptions);
                    var newSettings = this.getCompilationSettings();
                    if (LanguageServiceHelpers_1.changedCompilerSettings(oldSettings, newSettings)) {
                        if (this.tsLanguageService) {
                            this.tsLanguageService.cleanupSemanticCache();
                        }
                    }
                };
                LanguageServiceDispatcher.prototype.isOperatorOverloadingEnabled = function () {
                    return this.tsLanguageServiceHost.isOperatorOverloadingEnabled();
                };
                LanguageServiceDispatcher.prototype.setOperatorOverloading = function (operatorOverloading) {
                    var oldValue = this.isOperatorOverloadingEnabled();
                    if (oldValue !== operatorOverloading) {
                        if (this.tsLanguageService) {
                            this.tsLanguageService.cleanupSemanticCache();
                        }
                        return this.tsLanguageServiceHost.setOperatorOverloading(operatorOverloading);
                    }
                    else {
                        return oldValue;
                    }
                };
                LanguageServiceDispatcher.prototype.ensureTypeScriptLanguageService = function () {
                    if (!this.tsLanguageService) {
                        this.tsLanguageService = ts.createLanguageService(this.tsLanguageServiceHost, this.tsDocumentRegistry);
                    }
                    return this.tsLanguageService;
                };
                LanguageServiceDispatcher.prototype.ensurePythonLanguageService = function () {
                    if (!this.pyLanguageService) {
                        this.pyLanguageService = new PythonLanguageService_1.PythonLanguageService(this.pyLanguageServiceHost);
                    }
                    return this.pyLanguageService;
                };
                LanguageServiceDispatcher.prototype.mapTsDiagnosticsToPy = function (tsFileName, tsDiagnostics, pyFileName) {
                    var pyLS = this.ensurePythonLanguageService();
                    var tsHost = this.tsLanguageServiceHost;
                    var pyHost = this.pyLanguageServiceHost;
                    return tsDiagnostics.map(function (tsDiagnostic) {
                        var tsLineAndColumn = tsHost.getLineAndColumn(tsFileName, tsDiagnostic.start);
                        var sourceMap = pyLS.getSourceMap(pyFileName);
                        var pyLineAndColumn = sourceMap.getSourcePosition(tsLineAndColumn);
                        var pyStart = pyHost.lineAndColumnToIndex(pyFileName, pyLineAndColumn);
                        var category = tsDiagnostic.category;
                        var code = tsDiagnostic.code;
                        var length = tsDiagnostic.length;
                        var message = tsDiagnostic.message;
                        return { category: category, code: code, length: length, message: message, start: pyStart };
                    });
                };
                LanguageServiceDispatcher.prototype.getSyntaxErrors = function (fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        var tsLS = this.ensureTypeScriptLanguageService();
                        var diagnostics = tsLS.getSyntacticDiagnostics(fileName);
                        return diagnostics.map(tsDiagnosticToEditorDiagnostic);
                    }
                    else if (isPythonFileName(fileName)) {
                        var tsFileName = getTargetFileName(fileName);
                        return this.mapTsDiagnosticsToPy(tsFileName, this.getSyntaxErrors(tsFileName), fileName);
                    }
                    else {
                        return [];
                    }
                };
                LanguageServiceDispatcher.prototype.getSemanticErrors = function (fileName) {
                    if (isTypeScriptFileName(fileName)) {
                        var tsLS = this.ensureTypeScriptLanguageService();
                        var diagnostics = tsLS.getSemanticDiagnostics(fileName);
                        return diagnostics.map(tsDiagnosticToEditorDiagnostic);
                    }
                    else if (isPythonFileName(fileName)) {
                        var tsFileName = getTargetFileName(fileName);
                        return this.mapTsDiagnosticsToPy(tsFileName, this.getSemanticErrors(tsFileName), fileName);
                    }
                    else {
                        return [];
                    }
                };
                LanguageServiceDispatcher.prototype.getLintErrors = function (fileName, configuration) {
                    if (isTypeScriptFileName(fileName)) {
                        var linter = new linter_1.Linter({ fix: false }, this.ensureTypeScriptLanguageService());
                        linter.lint(fileName, configuration);
                        var ruleFailures = linter.getRuleFailures();
                        return ruleFailures.map(ruleFailureToEditorDiagnostic);
                    }
                    else if (isPythonFileName(fileName)) {
                        var linter = new Linter_1.Linter({ fix: false }, this.ensurePythonLanguageService());
                        linter.lint(fileName, configuration);
                        var ruleFailures = linter.getRuleFailures();
                        return ruleFailures.map(ruleFailureToEditorDiagnostic);
                    }
                    else {
                        return [];
                    }
                };
                LanguageServiceDispatcher.prototype.getCompletionsAtPosition = function (fileName, position) {
                    var tsLS = this.ensureTypeScriptLanguageService();
                    function callback(tsFileName, tsPosition) {
                        var completionInfo = tsLS.getCompletionsAtPosition(tsFileName, tsPosition);
                        if (completionInfo) {
                            return completionInfo.entries;
                        }
                        else {
                            return [];
                        }
                    }
                    return this.getAtPosition(fileName, position, 'getCompletionsAtPosition', callback);
                };
                LanguageServiceDispatcher.prototype.getDefinitionAtPosition = function (fileName, position) {
                    var tsLS = this.ensureTypeScriptLanguageService();
                    function callback(tsFileName, tsPosition) {
                        var definitionInfo = tsLS.getDefinitionAtPosition(tsFileName, tsPosition);
                        if (definitionInfo) {
                            return definitionInfo;
                        }
                        else {
                            return [];
                        }
                    }
                    return this.getAtPosition(fileName, position, 'getDefinitionAtPosition', callback);
                };
                LanguageServiceDispatcher.prototype.getFormattingEditsForDocument = function (fileName, settings) {
                    return this.ensureTypeScriptLanguageService().getFormattingEditsForDocument(fileName, settings);
                };
                LanguageServiceDispatcher.prototype.getOutputFiles = function (fileName) {
                    var t1 = Date.now();
                    this.synchronizeFiles();
                    var t2 = Date.now();
                    var outputFiles = this.outputFiles(fileName);
                    var t3 = Date.now();
                    console.log("synchronize  took " + (t2 - t1) + " ms");
                    console.log("output Files took " + (t3 - t2) + " ms");
                    return outputFiles;
                };
                LanguageServiceDispatcher.prototype.getQuickInfoAtPosition = function (fileName, position) {
                    var tsLS = this.ensureTypeScriptLanguageService();
                    function callback(tsFileName, tsPosition) {
                        return tsLS.getQuickInfoAtPosition(tsFileName, tsPosition);
                    }
                    return this.getAtPosition(fileName, position, 'getQuickInfoAtPosition', callback);
                };
                LanguageServiceDispatcher.prototype.getAtPosition = function (fileName, position, alias, callback) {
                    this.synchronizeFiles();
                    var pyLS = this.ensurePythonLanguageService();
                    var tsHost = this.tsLanguageServiceHost;
                    var pyHost = this.pyLanguageServiceHost;
                    if (isTypeScriptFileName(fileName)) {
                        return callback(fileName, position);
                    }
                    else if (isPythonFileName(fileName)) {
                        var pyLineAndColumn = pyHost.getLineAndColumn(fileName, position);
                        if (pyLineAndColumn) {
                            var sourceMap = pyLS.getSourceMap(fileName);
                            if (sourceMap) {
                                var tsLineAndColumn = sourceMap.getTargetPosition(pyLineAndColumn);
                                if (tsLineAndColumn) {
                                    var tsFileName = getTargetFileName(fileName);
                                    var tsIndex = tsHost.lineAndColumnToIndex(tsFileName, tsLineAndColumn);
                                    if (typeof tsIndex === 'number') {
                                        return callback(tsFileName, tsIndex);
                                    }
                                    else {
                                        throw new Error(alias + "('" + fileName + "') failed to compute tsIndex.");
                                    }
                                }
                                else {
                                    throw new Error(alias + "('" + fileName + "') failed to map from Python to TypeScript.");
                                }
                            }
                            else {
                                throw new Error(alias + "('" + fileName + "') unable to get source map.");
                            }
                        }
                        else {
                            throw new Error(alias + "('" + fileName + "') unable to compute line and column from position index.");
                        }
                    }
                    else {
                        throw new Error(alias + "('" + fileName + "') is not allowed.");
                    }
                };
                LanguageServiceDispatcher.prototype.synchronizeFiles = function () {
                    for (var _i = 0, _a = this.pyLanguageServiceHost.getScriptFileNames(); _i < _a.length; _i++) {
                        var pyFileName = _a[_i];
                        var sourceVersion = this.pyLanguageServiceHost.getScriptVersionNumber(pyFileName);
                        var tsFileName = getTargetFileName(pyFileName);
                        var targetVersion = this.tsLanguageServiceHost.getScriptVersionNumber(tsFileName);
                        if (targetNeedsUpdate(sourceVersion, targetVersion)) {
                            var sourceText = this.pyLanguageServiceHost.getScriptContent(pyFileName);
                            var _b = typhon_lang_1.transpileModule(sourceText), code = _b.code, sourceMap = _b.sourceMap;
                            this.tsLanguageServiceHost.setScriptContent(tsFileName, code);
                            this.pyLanguageService.setSourceMap(pyFileName, sourceMap);
                        }
                    }
                };
                LanguageServiceDispatcher.prototype.outputFiles = function (fileName) {
                    if (isTypeScriptFileName(fileName)) {
                    }
                    else if (isPythonFileName(fileName)) {
                        fileName = getTargetFileName(fileName);
                    }
                    else {
                        console.warn("getOutputFiles('" + fileName + "') is not allowed.");
                        return void 0;
                    }
                    var languageService = this.ensureTypeScriptLanguageService();
                    var program = languageService.getProgram();
                    var sourceFile = program.getSourceFile(fileName);
                    sourceFile.moduleName = systemModuleName('./', fileName, 'js');
                    var output = transpileModule_1.transpileModule(program, sourceFile, this.tsLanguageServiceHost.getCustomTransformers());
                    var outputFiles = [];
                    if (output.outputText) {
                        outputFiles.push({ name: systemModuleName(void 0, fileName, 'js'), text: output.outputText, writeByteOrderMark: void 0 });
                    }
                    if (output.sourceMapText) {
                        outputFiles.push({ name: systemModuleName(void 0, fileName, 'js.map'), text: output.sourceMapText, writeByteOrderMark: void 0 });
                    }
                    return outputFiles;
                };
                return LanguageServiceDispatcher;
            }());
            exports_1("LanguageServiceDispatcher", LanguageServiceDispatcher);
            (function (DiagnosticCategory) {
                DiagnosticCategory[DiagnosticCategory["Warning"] = 0] = "Warning";
                DiagnosticCategory[DiagnosticCategory["Error"] = 1] = "Error";
                DiagnosticCategory[DiagnosticCategory["Message"] = 2] = "Message";
            })(DiagnosticCategory || (DiagnosticCategory = {}));
            exports_1("DiagnosticCategory", DiagnosticCategory);
        }
    };
});

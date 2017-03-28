System.register(["./typescript/DefaultLanguageServiceHost", "./typescript/DocumentRegistryInspector", "./typescript/tslint/linter", "./transpileModule"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
    var DefaultLanguageServiceHost_1, DocumentRegistryInspector_1, linter_1, transpileModule_1, useCaseSensitiveFileNames, EVENT_APPLY_DELTA, EVENT_DEFAULT_LIB_CONTENT, EVENT_ENSURE_SCRIPT, EVENT_GET_COMPLETIONS_AT_POSITION, EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, EVENT_GET_OUTPUT_FILES, EVENT_GET_SEMANTIC_ERRORS, EVENT_GET_SYNTAX_ERRORS, EVENT_GET_LINT_ERRORS, EVENT_GET_QUICK_INFO_AT_POSITION, EVENT_REMOVE_SCRIPT, EVENT_SET_MODULE_KIND, EVENT_SET_SCRIPT_TARGET, EVENT_SET_TRACE, DiagnosticCategory, LanguageServiceWorker;
    return {
        setters: [
            function (DefaultLanguageServiceHost_1_1) {
                DefaultLanguageServiceHost_1 = DefaultLanguageServiceHost_1_1;
            },
            function (DocumentRegistryInspector_1_1) {
                DocumentRegistryInspector_1 = DocumentRegistryInspector_1_1;
            },
            function (linter_1_1) {
                linter_1 = linter_1_1;
            },
            function (transpileModule_1_1) {
                transpileModule_1 = transpileModule_1_1;
            }
        ],
        execute: function () {
            useCaseSensitiveFileNames = true;
            EVENT_APPLY_DELTA = 'applyDelta';
            EVENT_DEFAULT_LIB_CONTENT = 'defaultLibContent';
            EVENT_ENSURE_SCRIPT = 'ensureScript';
            EVENT_GET_COMPLETIONS_AT_POSITION = 'getCompletionsAtPosition';
            EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT = 'getFormattingEditsForDocument';
            EVENT_GET_OUTPUT_FILES = 'getOutputFiles';
            EVENT_GET_SEMANTIC_ERRORS = 'getSemanticErrors';
            EVENT_GET_SYNTAX_ERRORS = 'getSyntaxErrors';
            EVENT_GET_LINT_ERRORS = 'getLintErrors';
            EVENT_GET_QUICK_INFO_AT_POSITION = 'getQuickInfoAtPosition';
            EVENT_REMOVE_SCRIPT = 'removeScript';
            EVENT_SET_MODULE_KIND = 'setModuleKind';
            EVENT_SET_SCRIPT_TARGET = 'setScriptTarget';
            EVENT_SET_TRACE = 'setTrace';
            (function (DiagnosticCategory) {
                DiagnosticCategory[DiagnosticCategory["Warning"] = 0] = "Warning";
                DiagnosticCategory[DiagnosticCategory["Error"] = 1] = "Error";
                DiagnosticCategory[DiagnosticCategory["Message"] = 2] = "Message";
            })(DiagnosticCategory || (DiagnosticCategory = {}));
            LanguageServiceWorker = (function () {
                function LanguageServiceWorker(sender) {
                    var _this = this;
                    this.sender = sender;
                    this.trace = true;
                    this.host_ = new DefaultLanguageServiceHost_1.default();
                    this.documentRegistry_ = new DocumentRegistryInspector_1.default(ts.createDocumentRegistry(useCaseSensitiveFileNames));
                    sender.on(EVENT_SET_TRACE, function (message) {
                        var _a = message.data, trace = _a.trace, callbackId = _a.callbackId;
                        try {
                            _this.trace = trace;
                            _this.documentRegistry_.trace = trace;
                            if (_this.trace) {
                                console.log(EVENT_SET_TRACE + "(" + trace + ")");
                            }
                            _this.resolve(EVENT_SET_TRACE, void 0, callbackId);
                        }
                        catch (err) {
                            _this.reject(EVENT_SET_TRACE, err, callbackId);
                        }
                    });
                    sender.on(EVENT_DEFAULT_LIB_CONTENT, function (message) {
                        var _a = message.data, content = _a.content, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_DEFAULT_LIB_CONTENT + "(" + _this.host_.getDefaultLibFileName({}) + ")");
                            }
                            _this.host_.ensureScript(_this.host_.getDefaultLibFileName({}), content);
                            _this.resolve(EVENT_DEFAULT_LIB_CONTENT, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_DEFAULT_LIB_CONTENT, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_ENSURE_SCRIPT, function (message) {
                        var _a = message.data, fileName = _a.fileName, content = _a.content, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_ENSURE_SCRIPT + "(" + fileName + ")");
                            }
                            _this.host_.ensureScript(fileName, content);
                            _this.resolve(EVENT_ENSURE_SCRIPT, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_ENSURE_SCRIPT, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_APPLY_DELTA, function (message) {
                        var _a = message.data, fileName = _a.fileName, delta = _a.delta, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_APPLY_DELTA + "(" + fileName + ", " + JSON.stringify(delta, null, 2) + ")");
                            }
                            _this.host_.applyDelta(fileName, delta);
                            _this.resolve(EVENT_APPLY_DELTA, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_APPLY_DELTA, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_REMOVE_SCRIPT, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_REMOVE_SCRIPT + "(" + fileName + ")");
                            }
                            _this.host_.removeScript(fileName);
                            _this.resolve(EVENT_REMOVE_SCRIPT, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_REMOVE_SCRIPT, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_SET_MODULE_KIND, function (message) {
                        var _a = message.data, moduleKind = _a.moduleKind, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_SET_MODULE_KIND + "(" + moduleKind + ")");
                            }
                            _this.host_.moduleKind = moduleKind;
                            _this.resolve(EVENT_SET_MODULE_KIND, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_SET_MODULE_KIND, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_SET_SCRIPT_TARGET, function (message) {
                        var _a = message.data, scriptTarget = _a.scriptTarget, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_SET_SCRIPT_TARGET + "(" + scriptTarget + ")");
                            }
                            _this.host_.scriptTarget = scriptTarget;
                            _this.resolve(EVENT_SET_SCRIPT_TARGET, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_SET_SCRIPT_TARGET, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_GET_SYNTAX_ERRORS, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_GET_SYNTAX_ERRORS + "(" + fileName + ")");
                            }
                            var diagnostics = _this.ensureLS().getSyntacticDiagnostics(fileName);
                            var errors = diagnostics.map(tsDiagnosticToEditorDiagnostic);
                            _this.resolve(EVENT_GET_SYNTAX_ERRORS, errors, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_GET_SYNTAX_ERRORS, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_GET_SEMANTIC_ERRORS, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_GET_SEMANTIC_ERRORS + "(" + fileName + ")");
                            }
                            var diagnostics = _this.ensureLS().getSemanticDiagnostics(fileName);
                            var errors = diagnostics.map(tsDiagnosticToEditorDiagnostic);
                            _this.resolve(EVENT_GET_SEMANTIC_ERRORS, errors, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_GET_SEMANTIC_ERRORS, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_GET_COMPLETIONS_AT_POSITION, function (message) {
                        var _a = message.data, fileName = _a.fileName, position = _a.position, prefix = _a.prefix, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_GET_COMPLETIONS_AT_POSITION + "(" + fileName + ", " + position + ", " + prefix + ")");
                            }
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var completionInfo = _this.ensureLS().getCompletionsAtPosition(fileName, position);
                            if (completionInfo) {
                                var completions = completionInfo.entries;
                                _this.resolve(EVENT_GET_COMPLETIONS_AT_POSITION, completions, callbackId);
                            }
                            else {
                                _this.resolve(EVENT_GET_COMPLETIONS_AT_POSITION, [], callbackId);
                            }
                        }
                        catch (reason) {
                            _this.reject(EVENT_GET_COMPLETIONS_AT_POSITION, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_GET_QUICK_INFO_AT_POSITION, function (message) {
                        var _a = message.data, fileName = _a.fileName, position = _a.position, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_GET_QUICK_INFO_AT_POSITION + "(" + fileName + ", " + position + ")");
                            }
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var quickInfo = _this.ensureLS().getQuickInfoAtPosition(fileName, position);
                            _this.resolve(EVENT_GET_QUICK_INFO_AT_POSITION, quickInfo, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_GET_QUICK_INFO_AT_POSITION, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_GET_OUTPUT_FILES, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_GET_OUTPUT_FILES + "(" + fileName + ")");
                            }
                            var languageService = _this.ensureLS();
                            var program = languageService.getProgram();
                            var sourceFile = program.getSourceFile(fileName);
                            sourceFile.moduleName = systemModuleName('./', fileName, 'js');
                            var output = transpileModule_1.default(program, sourceFile, _this.host_.getCustomTransformers());
                            var outputFiles = [];
                            if (output.outputText) {
                                outputFiles.push({ name: systemModuleName(void 0, fileName, 'js'), text: output.outputText, writeByteOrderMark: void 0 });
                            }
                            if (output.sourceMapText) {
                                outputFiles.push({ name: systemModuleName(void 0, fileName, 'js.map'), text: output.sourceMapText, writeByteOrderMark: void 0 });
                            }
                            _this.resolve(EVENT_GET_OUTPUT_FILES, outputFiles, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_GET_OUTPUT_FILES, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, function (message) {
                        var _a = message.data, fileName = _a.fileName, settings = _a.settings, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT + "(" + fileName + ", " + settings + ")");
                            }
                            if (typeof settings !== 'object') {
                                throw new Error("settings must be an object and not NaN");
                            }
                            var textChanges = _this.ensureLS().getFormattingEditsForDocument(fileName, settings);
                            _this.resolve(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, textChanges, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, reason, callbackId);
                        }
                    });
                    sender.on(EVENT_GET_LINT_ERRORS, function (message) {
                        var _a = message.data, fileName = _a.fileName, configuration = _a.configuration, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(EVENT_GET_LINT_ERRORS + "(" + fileName + ")");
                                console.log(EVENT_GET_LINT_ERRORS + "(" + JSON.stringify(configuration, null, 2) + ")");
                            }
                            var linter = new linter_1.default({ fix: false }, _this.ensureLS());
                            linter.lint(fileName, configuration);
                            var ruleFailures = linter.getRuleFailures();
                            var diagnostics = ruleFailures.map(ruleFailureToEditorDiagnostic);
                            _this.resolve(EVENT_GET_LINT_ERRORS, diagnostics, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_GET_LINT_ERRORS, reason, callbackId);
                        }
                    });
                }
                LanguageServiceWorker.prototype.ensureLS = function () {
                    if (!this.languageService_) {
                        if (this.trace) {
                            console.log("LanguageServiceWorker.ensureLS()");
                            console.log("Calling createLanguageService()");
                        }
                        this.languageService_ = ts.createLanguageService(this.host_, this.documentRegistry_);
                    }
                    return this.languageService_;
                };
                LanguageServiceWorker.prototype.disposeLS = function () {
                    if (this.languageService_) {
                        if (this.trace) {
                            console.log("LanguageServiceWorker.disposeLS()");
                            console.log("Calling LanguageService.dispose");
                        }
                        this.languageService_.dispose();
                        this.languageService_ = void 0;
                    }
                };
                LanguageServiceWorker.prototype.resolve = function (eventName, value, callbackId) {
                    if (this.trace) {
                        console.log("resolve(" + eventName + ", " + JSON.stringify(value, null, 2) + ")");
                    }
                    this.sender.resolve(eventName, value, callbackId);
                };
                LanguageServiceWorker.prototype.reject = function (eventName, reason, callbackId) {
                    if (this.trace) {
                        console.warn("reject(" + eventName + ", " + reason + ")");
                    }
                    this.sender.reject(eventName, reason, callbackId);
                };
                return LanguageServiceWorker;
            }());
            exports_1("default", LanguageServiceWorker);
        }
    };
});

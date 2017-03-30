System.register(["./typescript/DefaultLanguageServiceHost", "./typescript/DocumentRegistryInspector", "./typescript/tslint/linter", "./transpileModule", "./LanguageServiceEvents"], function (exports_1, context_1) {
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
    var DefaultLanguageServiceHost_1, DocumentRegistryInspector_1, linter_1, transpileModule_1, LanguageServiceEvents_1, LanguageServiceEvents_2, LanguageServiceEvents_3, LanguageServiceEvents_4, LanguageServiceEvents_5, LanguageServiceEvents_6, LanguageServiceEvents_7, LanguageServiceEvents_8, LanguageServiceEvents_9, LanguageServiceEvents_10, LanguageServiceEvents_11, LanguageServiceEvents_12, LanguageServiceEvents_13, LanguageServiceEvents_14, LanguageServiceEvents_15, useCaseSensitiveFileNames, DiagnosticCategory, LanguageServiceWorker;
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
            },
            function (LanguageServiceEvents_1_1) {
                LanguageServiceEvents_1 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_2 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_3 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_4 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_5 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_6 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_7 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_8 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_9 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_10 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_11 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_12 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_13 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_14 = LanguageServiceEvents_1_1;
                LanguageServiceEvents_15 = LanguageServiceEvents_1_1;
            }
        ],
        execute: function () {
            useCaseSensitiveFileNames = true;
            (function (DiagnosticCategory) {
                DiagnosticCategory[DiagnosticCategory["Warning"] = 0] = "Warning";
                DiagnosticCategory[DiagnosticCategory["Error"] = 1] = "Error";
                DiagnosticCategory[DiagnosticCategory["Message"] = 2] = "Message";
            })(DiagnosticCategory || (DiagnosticCategory = {}));
            LanguageServiceWorker = (function () {
                function LanguageServiceWorker(sender) {
                    var _this = this;
                    this.sender = sender;
                    this.trace = false;
                    this.lsHost = new DefaultLanguageServiceHost_1.default();
                    this.documentRegistry_ = new DocumentRegistryInspector_1.default(ts.createDocumentRegistry(useCaseSensitiveFileNames));
                    sender.on(LanguageServiceEvents_15.EVENT_SET_TRACE, function (message) {
                        var _a = message.data, trace = _a.trace, callbackId = _a.callbackId;
                        try {
                            _this.trace = trace;
                            _this.documentRegistry_.trace = trace;
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_15.EVENT_SET_TRACE + "(" + trace + ")");
                            }
                            _this.resolve(LanguageServiceEvents_15.EVENT_SET_TRACE, void 0, callbackId);
                        }
                        catch (err) {
                            _this.reject(LanguageServiceEvents_15.EVENT_SET_TRACE, err, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT, function (message) {
                        var _a = message.data, content = _a.content, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT + "(" + _this.lsHost.getDefaultLibFileName({}) + ")");
                            }
                            _this.lsHost.ensureScript(_this.lsHost.getDefaultLibFileName({}), content);
                            _this.resolve(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_2.EVENT_DEFAULT_LIB_CONTENT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_3.EVENT_ENSURE_SCRIPT, function (message) {
                        var _a = message.data, fileName = _a.fileName, content = _a.content, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_3.EVENT_ENSURE_SCRIPT + "(" + fileName + ")");
                            }
                            _this.lsHost.ensureScript(fileName, content);
                            _this.resolve(LanguageServiceEvents_3.EVENT_ENSURE_SCRIPT, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_3.EVENT_ENSURE_SCRIPT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_1.EVENT_APPLY_DELTA, function (message) {
                        var _a = message.data, fileName = _a.fileName, delta = _a.delta, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_1.EVENT_APPLY_DELTA + "(" + fileName + ", " + JSON.stringify(delta, null, 2) + ")");
                            }
                            _this.lsHost.applyDelta(fileName, delta);
                            _this.resolve(LanguageServiceEvents_1.EVENT_APPLY_DELTA, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_1.EVENT_APPLY_DELTA, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_11.EVENT_REMOVE_SCRIPT, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_11.EVENT_REMOVE_SCRIPT + "(" + fileName + ")");
                            }
                            _this.lsHost.removeScript(fileName);
                            _this.resolve(LanguageServiceEvents_11.EVENT_REMOVE_SCRIPT, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_11.EVENT_REMOVE_SCRIPT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_12.EVENT_SET_MODULE_KIND, function (message) {
                        var _a = message.data, moduleKind = _a.moduleKind, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_12.EVENT_SET_MODULE_KIND + "(" + moduleKind + ")");
                            }
                            _this.lsHost.moduleKind = moduleKind;
                            _this.resolve(LanguageServiceEvents_12.EVENT_SET_MODULE_KIND, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_12.EVENT_SET_MODULE_KIND, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_13.EVENT_SET_OPERATOR_OVERLOADING, function (message) {
                        var _a = message.data, operatorOverloading = _a.operatorOverloading, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_13.EVENT_SET_OPERATOR_OVERLOADING + "(" + operatorOverloading + ")");
                            }
                            _this.operatorOverloading = operatorOverloading;
                            _this.resolve(LanguageServiceEvents_13.EVENT_SET_OPERATOR_OVERLOADING, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_13.EVENT_SET_OPERATOR_OVERLOADING, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_14.EVENT_SET_SCRIPT_TARGET, function (message) {
                        var _a = message.data, scriptTarget = _a.scriptTarget, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_14.EVENT_SET_SCRIPT_TARGET + "(" + scriptTarget + ")");
                            }
                            _this.lsHost.scriptTarget = scriptTarget;
                            _this.resolve(LanguageServiceEvents_14.EVENT_SET_SCRIPT_TARGET, void 0, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_14.EVENT_SET_SCRIPT_TARGET, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_10.EVENT_GET_SYNTAX_ERRORS, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_10.EVENT_GET_SYNTAX_ERRORS + "(" + fileName + ")");
                            }
                            var diagnostics = _this.ensureLS().getSyntacticDiagnostics(fileName);
                            var errors = diagnostics.map(tsDiagnosticToEditorDiagnostic);
                            _this.resolve(LanguageServiceEvents_10.EVENT_GET_SYNTAX_ERRORS, errors, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_10.EVENT_GET_SYNTAX_ERRORS, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_9.EVENT_GET_SEMANTIC_ERRORS, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_9.EVENT_GET_SEMANTIC_ERRORS + "(" + fileName + ")");
                            }
                            var diagnostics = _this.ensureLS().getSemanticDiagnostics(fileName);
                            var errors = diagnostics.map(tsDiagnosticToEditorDiagnostic);
                            _this.resolve(LanguageServiceEvents_9.EVENT_GET_SEMANTIC_ERRORS, errors, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_9.EVENT_GET_SEMANTIC_ERRORS, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION, function (message) {
                        var _a = message.data, fileName = _a.fileName, position = _a.position, prefix = _a.prefix, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION + "(" + fileName + ", " + position + ", " + prefix + ")");
                            }
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var completionInfo = _this.ensureLS().getCompletionsAtPosition(fileName, position);
                            if (completionInfo) {
                                var completions = completionInfo.entries;
                                _this.resolve(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION, completions, callbackId);
                            }
                            else {
                                _this.resolve(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION, [], callbackId);
                            }
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_4.EVENT_GET_COMPLETIONS_AT_POSITION, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_8.EVENT_GET_QUICK_INFO_AT_POSITION, function (message) {
                        var _a = message.data, fileName = _a.fileName, position = _a.position, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_8.EVENT_GET_QUICK_INFO_AT_POSITION + "(" + fileName + ", " + position + ")");
                            }
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var quickInfo = _this.ensureLS().getQuickInfoAtPosition(fileName, position);
                            _this.resolve(LanguageServiceEvents_8.EVENT_GET_QUICK_INFO_AT_POSITION, quickInfo, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_8.EVENT_GET_QUICK_INFO_AT_POSITION, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_7.EVENT_GET_OUTPUT_FILES, function (message) {
                        var _a = message.data, fileName = _a.fileName, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_7.EVENT_GET_OUTPUT_FILES + "(" + fileName + ")");
                            }
                            var languageService = _this.ensureLS();
                            var program = languageService.getProgram();
                            var sourceFile = program.getSourceFile(fileName);
                            sourceFile.moduleName = systemModuleName('./', fileName, 'js');
                            var output = transpileModule_1.default(program, sourceFile, _this.lsHost.getCustomTransformers());
                            var outputFiles = [];
                            if (output.outputText) {
                                outputFiles.push({ name: systemModuleName(void 0, fileName, 'js'), text: output.outputText, writeByteOrderMark: void 0 });
                            }
                            if (output.sourceMapText) {
                                outputFiles.push({ name: systemModuleName(void 0, fileName, 'js.map'), text: output.sourceMapText, writeByteOrderMark: void 0 });
                            }
                            _this.resolve(LanguageServiceEvents_7.EVENT_GET_OUTPUT_FILES, outputFiles, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_7.EVENT_GET_OUTPUT_FILES, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_5.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, function (message) {
                        var _a = message.data, fileName = _a.fileName, settings = _a.settings, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_5.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT + "(" + fileName + ", " + settings + ")");
                            }
                            if (typeof settings !== 'object') {
                                throw new Error("settings must be an object and not NaN");
                            }
                            var textChanges = _this.ensureLS().getFormattingEditsForDocument(fileName, settings);
                            _this.resolve(LanguageServiceEvents_5.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, textChanges, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_5.EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, reason, callbackId);
                        }
                    });
                    sender.on(LanguageServiceEvents_6.EVENT_GET_LINT_ERRORS, function (message) {
                        var _a = message.data, fileName = _a.fileName, configuration = _a.configuration, callbackId = _a.callbackId;
                        try {
                            if (_this.trace) {
                                console.log(LanguageServiceEvents_6.EVENT_GET_LINT_ERRORS + "(" + fileName + ")");
                                console.log(LanguageServiceEvents_6.EVENT_GET_LINT_ERRORS + "(" + JSON.stringify(configuration, null, 2) + ")");
                            }
                            var linter = new linter_1.default({ fix: false }, _this.ensureLS());
                            linter.lint(fileName, configuration);
                            var ruleFailures = linter.getRuleFailures();
                            var diagnostics = ruleFailures.map(ruleFailureToEditorDiagnostic);
                            _this.resolve(LanguageServiceEvents_6.EVENT_GET_LINT_ERRORS, diagnostics, callbackId);
                        }
                        catch (reason) {
                            _this.reject(LanguageServiceEvents_6.EVENT_GET_LINT_ERRORS, reason, callbackId);
                        }
                    });
                }
                Object.defineProperty(LanguageServiceWorker.prototype, "operatorOverloading", {
                    get: function () {
                        return this.lsHost.operatorOverloading;
                    },
                    set: function (operatorOverloading) {
                        if (this.lsHost.operatorOverloading !== operatorOverloading) {
                            if (this.languageService) {
                                this.languageService.cleanupSemanticCache();
                            }
                            this.lsHost.operatorOverloading = operatorOverloading;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                LanguageServiceWorker.prototype.ensureLS = function () {
                    if (!this.languageService) {
                        if (this.trace) {
                            console.log("LanguageServiceWorker.ensureLS()");
                            console.log("Calling createLanguageService()");
                        }
                        this.languageService = ts.createLanguageService(this.lsHost, this.documentRegistry_);
                    }
                    return this.languageService;
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

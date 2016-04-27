System.register(['./typescript/DefaultLanguageServiceHost', './typescript/DocumentRegistryInspector'], function(exports_1) {
    var DefaultLanguageServiceHost_1, DocumentRegistryInspector_1;
    var useCaseSensitiveFileNames, EVENT_APPLY_DELTA, EVENT_SET_TRACE, EVENT_DEFAULT_LIB_CONTENT, EVENT_ENSURE_SCRIPT, EVENT_REMOVE_SCRIPT, EVENT_SET_MODULE_KIND, EVENT_SET_SCRIPT_TARGET, EVENT_GET_SYNTAX_ERRORS, EVENT_GET_SEMANTIC_ERRORS, EVENT_GET_COMPLETIONS_AT_POSITION, EVENT_GET_QUICK_INFO_AT_POSITION, EVENT_GET_OUTPUT_FILES, LanguageServiceWorker;
    function systemModuleName(prefix, fileName, extension) {
        var lastPeriod = fileName.lastIndexOf('.');
        if (lastPeriod >= 0) {
            var name = fileName.substring(0, lastPeriod);
            var suffix = fileName.substring(lastPeriod + 1);
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
    return {
        setters:[
            function (DefaultLanguageServiceHost_1_1) {
                DefaultLanguageServiceHost_1 = DefaultLanguageServiceHost_1_1;
            },
            function (DocumentRegistryInspector_1_1) {
                DocumentRegistryInspector_1 = DocumentRegistryInspector_1_1;
            }],
        execute: function() {
            useCaseSensitiveFileNames = true;
            EVENT_APPLY_DELTA = 'applyDelta';
            EVENT_SET_TRACE = 'setTrace';
            EVENT_DEFAULT_LIB_CONTENT = 'defaultLibContent';
            EVENT_ENSURE_SCRIPT = 'ensureScript';
            EVENT_REMOVE_SCRIPT = 'removeScript';
            EVENT_SET_MODULE_KIND = 'setModuleKind';
            EVENT_SET_SCRIPT_TARGET = 'setScriptTarget';
            EVENT_GET_SYNTAX_ERRORS = 'getSyntaxErrors';
            EVENT_GET_SEMANTIC_ERRORS = 'getSemanticErrors';
            EVENT_GET_COMPLETIONS_AT_POSITION = 'getCompletionsAtPosition';
            EVENT_GET_QUICK_INFO_AT_POSITION = 'getQuickInfoAtPosition';
            EVENT_GET_OUTPUT_FILES = 'getOutputFiles';
            LanguageServiceWorker = (function () {
                function LanguageServiceWorker(sender) {
                    var _this = this;
                    this.sender = sender;
                    this.trace = false;
                    this.host = new DefaultLanguageServiceHost_1.default();
                    this.documentRegistry = new DocumentRegistryInspector_1.default(ts.createDocumentRegistry(useCaseSensitiveFileNames));
                    sender.on(EVENT_SET_TRACE, function (message) {
                        var _a = message.data, trace = _a.trace, callbackId = _a.callbackId;
                        try {
                            _this.trace = trace;
                            _this.documentRegistry.trace;
                            if (_this.trace) {
                                console.log(EVENT_SET_TRACE + "(" + trace + ")");
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
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
                                console.log(EVENT_DEFAULT_LIB_CONTENT + "(" + _this.host.getDefaultLibFileName({}) + ")");
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
                            }
                            _this.disposeLS();
                            _this.host.ensureScript(_this.host.getDefaultLibFileName({}), content);
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
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
                            }
                            _this.disposeLS();
                            _this.host.ensureScript(fileName, content);
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
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
                            }
                            _this.host.applyDelta(fileName, delta);
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
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
                            }
                            _this.disposeLS();
                            _this.host.removeScript(fileName);
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
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
                            }
                            _this.disposeLS();
                            _this.host.moduleKind = moduleKind;
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
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
                            }
                            _this.disposeLS();
                            _this.host.scriptTarget = scriptTarget;
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
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
                            }
                            var diagnostics = _this.ensureLS().getSyntacticDiagnostics(fileName);
                            var errors = diagnostics.map(function (diagnostic) {
                                return { message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"), start: diagnostic.start, length: diagnostic.length };
                            });
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
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
                            }
                            var diagnostics = _this.ensureLS().getSemanticDiagnostics(fileName);
                            var errors = diagnostics.map(function (diagnostic) {
                                return { message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"), start: diagnostic.start, length: diagnostic.length };
                            });
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
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
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
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
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
                                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
                            }
                            var sourceFile = _this.ensureLS().getSourceFile(fileName);
                            var input = sourceFile.text;
                            var transpileOptions = {};
                            transpileOptions.compilerOptions = _this.host.getCompilationSettings();
                            transpileOptions.fileName = fileName;
                            transpileOptions.moduleName = systemModuleName('./', fileName, 'js');
                            transpileOptions.reportDiagnostics = false;
                            var output = ts.transpileModule(input, transpileOptions);
                            var outputFiles = [];
                            outputFiles.push({ name: systemModuleName(void 0, fileName, 'js'), text: output.outputText, writeByteOrderMark: void 0 });
                            _this.resolve(EVENT_GET_OUTPUT_FILES, outputFiles, callbackId);
                        }
                        catch (reason) {
                            _this.reject(EVENT_GET_OUTPUT_FILES, reason, callbackId);
                        }
                    });
                }
                LanguageServiceWorker.prototype.ensureLS = function () {
                    if (!this.$service) {
                        if (this.trace) {
                            console.log("createLanguageService()");
                        }
                        this.$service = ts.createLanguageService(this.host, this.documentRegistry);
                    }
                    return this.$service;
                };
                LanguageServiceWorker.prototype.disposeLS = function () {
                    if (this.$service) {
                        if (this.trace) {
                            console.log("LanguageService.dispose()");
                        }
                        this.$service.dispose();
                        this.$service = void 0;
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
            })();
            exports_1("default", LanguageServiceWorker);
        }
    }
});

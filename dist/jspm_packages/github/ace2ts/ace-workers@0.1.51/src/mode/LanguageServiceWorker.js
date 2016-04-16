System.register(['./typescript/DefaultLanguageServiceHost'], function(exports_1) {
    var DefaultLanguageServiceHost_1;
    var LanguageServiceWorker;
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
            }],
        execute: function() {
            LanguageServiceWorker = (function () {
                function LanguageServiceWorker(sender) {
                    var _this = this;
                    this.host = new DefaultLanguageServiceHost_1.default();
                    this.service = ts.createLanguageService(this.host);
                    sender.on('defaultLibContent', function (message) {
                        _this.host.ensureScript(_this.host.getDefaultLibFileName({}), message.data.content);
                    });
                    sender.on('ensureScript', function (message) {
                        _this.ensureScript(message.data.fileName, message.data.content);
                    });
                    sender.on('applyDelta', function (message) {
                        _this.host.applyDelta(message.data.fileName, message.data.delta);
                    });
                    sender.on('removeScript', function (message) {
                        _this.host.removeScript(message.data.fileName);
                    });
                    sender.on('getModuleKind', function (request) {
                        var data = request.data;
                        var callbackId = data.callbackId;
                        try {
                            var moduleKind = _this.host.moduleKind;
                            var response = { moduleKind: moduleKind, callbackId: callbackId };
                            sender.emit("getModuleKind", response);
                        }
                        catch (err) {
                            var response = { err: "" + err, callbackId: callbackId };
                            sender.emit("getModuleKind", response);
                        }
                    });
                    sender.on('setModuleKind', function (request) {
                        var data = request.data;
                        var callbackId = data.callbackId;
                        try {
                            _this.host.moduleKind = data.moduleKind;
                            var response = { callbackId: callbackId };
                            sender.emit("setModuleKind", response);
                        }
                        catch (err) {
                            var response = { err: "" + err, callbackId: callbackId };
                            sender.emit("setModuleKind", response);
                        }
                    });
                    sender.on('getScriptTarget', function (request) {
                        var data = request.data;
                        var callbackId = data.callbackId;
                        try {
                            var scriptTarget = _this.host.scriptTarget;
                            var response = { scriptTarget: scriptTarget, callbackId: callbackId };
                            sender.emit("getScriptTarget", response);
                        }
                        catch (err) {
                            var response = { err: "" + err, callbackId: callbackId };
                            sender.emit("getScriptTarget", response);
                        }
                    });
                    sender.on('setScriptTarget', function (request) {
                        var data = request.data;
                        var callbackId = data.callbackId;
                        try {
                            _this.host.scriptTarget = data.scriptTarget;
                            var response = { callbackId: callbackId };
                            sender.emit("setScriptTarget", response);
                        }
                        catch (err) {
                            var response = { err: "" + err, callbackId: callbackId };
                            sender.emit("setScriptTarget", response);
                        }
                    });
                    sender.on('getSyntaxErrors', function (request) {
                        var data = request.data;
                        var fileName = data.fileName;
                        var callbackId = data.callbackId;
                        var diagnostics = _this.service.getSyntacticDiagnostics(fileName);
                        var errors = diagnostics.map(function (diagnostic) {
                            return { message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"), start: diagnostic.start, length: diagnostic.length };
                        });
                        var response = { errors: errors, callbackId: callbackId };
                        sender.emit("syntaxErrors", response);
                    });
                    sender.on('getSemanticErrors', function (request) {
                        var data = request.data;
                        var fileName = data.fileName;
                        var callbackId = data.callbackId;
                        var diagnostics = _this.service.getSemanticDiagnostics(fileName);
                        var errors = diagnostics.map(function (diagnostic) {
                            return { message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"), start: diagnostic.start, length: diagnostic.length };
                        });
                        var response = { errors: errors, callbackId: callbackId };
                        sender.emit("semanticErrors", response);
                    });
                    sender.on('getCompletionsAtPosition', function (request) {
                        try {
                            var data = request.data;
                            var fileName = data.fileName;
                            var position = data.position;
                            var prefix = data.prefix;
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var completionInfo = _this.service.getCompletionsAtPosition(fileName, position);
                            if (completionInfo) {
                                var completionEntries = completionInfo.entries;
                                sender.emit('completions', { completions: completionEntries, callbackId: request.data.callbackId });
                            }
                            else {
                                sender.emit('completions', { completions: [], callbackId: request.data.callbackId });
                            }
                        }
                        catch (e) {
                            sender.emit('completions', { err: e.toString(), callbackId: request.data.callbackId });
                        }
                    });
                    sender.on('getQuickInfoAtPosition', function (request) {
                        try {
                            var data = request.data;
                            var fileName = data.fileName;
                            var position = data.position;
                            var callbackId = data.callbackId;
                            if (typeof position !== 'number' || isNaN(position)) {
                                throw new Error("position must be a number and not NaN");
                            }
                            var quickInfo = _this.service.getQuickInfoAtPosition(fileName, position);
                            var name = ts.displayPartsToString(quickInfo.displayParts);
                            var comments = ts.displayPartsToString(quickInfo.documentation);
                            sender.emit('quickInfo', { quickInfo: quickInfo, name: name, comments: comments, callbackId: callbackId });
                        }
                        catch (e) {
                            sender.emit('quickInfo', { err: e.toString(), callbackId: callbackId });
                        }
                    });
                    sender.on('getOutputFiles', function (request) {
                        var data = request.data;
                        var fileName = data.fileName;
                        var callbackId = data.callbackId;
                        try {
                            var sourceFile = _this.service.getSourceFile(fileName);
                            var input = sourceFile.text;
                            var transpileOptions = {};
                            transpileOptions.compilerOptions = _this.host.getCompilationSettings();
                            transpileOptions.fileName = fileName;
                            transpileOptions.moduleName = systemModuleName('./', fileName, 'js');
                            transpileOptions.reportDiagnostics = false;
                            var output = ts.transpileModule(input, transpileOptions);
                            var outputFiles = [];
                            outputFiles.push({ name: systemModuleName(void 0, fileName, 'js'), text: output.outputText, writeByteOrderMark: void 0 });
                            sender.emit("outputFiles", { outputFiles: outputFiles, callbackId: callbackId });
                        }
                        catch (e) {
                            sender.emit("outputFiles", { err: e.toString(), callbackId: callbackId });
                        }
                    });
                }
                LanguageServiceWorker.prototype.ensureScript = function (fileName, content) {
                    this.host.ensureScript(fileName, content);
                };
                return LanguageServiceWorker;
            })();
            exports_1("default", LanguageServiceWorker);
        }
    }
});

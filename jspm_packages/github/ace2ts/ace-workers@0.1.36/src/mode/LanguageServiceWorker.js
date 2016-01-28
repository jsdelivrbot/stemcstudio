System.register(['./typescript/DefaultLanguageServiceHost'], function(exports_1) {
    var DefaultLanguageServiceHost_1;
    var LanguageServiceWorker;
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
                            var emitOutput = _this.service.getEmitOutput(fileName);
                            var outputFiles = emitOutput.outputFiles;
                            var response = { outputFiles: outputFiles, callbackId: callbackId };
                            sender.emit("outputFiles", response);
                        }
                        catch (e) {
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

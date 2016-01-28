System.register(["SnippetManager", '../autocomplete/AutoCompleteCommand', '../autocomplete/CompletionManager', "../config", "../autocomplete/util", "../Editor", '../editor_protocol'], function(exports_1) {
    var SnippetManager_1, AutoCompleteCommand_1, CompletionManager_1, config_1, util_1, Editor_1, editor_protocol_1, editor_protocol_2, editor_protocol_3;
    var snippetManager, completers, expandSnippet, onChangeMode, loadSnippetsForMode, loadSnippetFile, doLiveAutocomplete;
    function addCompleter(completer) {
        completers.push(completer);
    }
    exports_1("addCompleter", addCompleter);
    function getCompletionPrefix(editor) {
        var pos = editor.getCursorPosition();
        var line = editor.getSession().getLine(pos.row);
        var prefix = util_1.retrievePrecedingIdentifier(line, pos.column);
        editor.completers.forEach(function (completer) {
            if (completer['identifierRegexps']) {
                completer['identifierRegexps'].forEach(function (identifierRegex) {
                    if (!prefix && identifierRegex) {
                        prefix = util_1.retrievePrecedingIdentifier(line, pos.column, identifierRegex);
                    }
                });
            }
        });
        return prefix;
    }
    return {
        setters:[
            function (SnippetManager_1_1) {
                SnippetManager_1 = SnippetManager_1_1;
            },
            function (AutoCompleteCommand_1_1) {
                AutoCompleteCommand_1 = AutoCompleteCommand_1_1;
            },
            function (CompletionManager_1_1) {
                CompletionManager_1 = CompletionManager_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            },
            function (Editor_1_1) {
                Editor_1 = Editor_1_1;
            },
            function (editor_protocol_1_1) {
                editor_protocol_1 = editor_protocol_1_1;
                editor_protocol_2 = editor_protocol_1_1;
                editor_protocol_3 = editor_protocol_1_1;
            }],
        execute: function() {
            snippetManager = new SnippetManager_1.default();
            completers = [];
            ;
            expandSnippet = {
                name: 'expandSnippet',
                exec: function (editor) {
                    var success = snippetManager.expandWithTab(editor);
                    if (!success) {
                        var indentCommand = editor.commands.getCommandByName('indent');
                        editor.execCommand(indentCommand);
                    }
                },
                bindKey: 'Tab'
            };
            onChangeMode = function (e, editor) {
                loadSnippetsForMode(editor.getSession().$mode);
            };
            loadSnippetsForMode = function (mode) {
                var id = mode.$id;
                if (!snippetManager['files']) {
                    snippetManager['files'] = {};
                }
                loadSnippetFile(id);
                if (mode.modes) {
                    mode.modes.forEach(loadSnippetsForMode);
                }
            };
            loadSnippetFile = function (id) {
                if (!id || snippetManager['files'][id])
                    return;
                var snippetFilePath = id.replace("mode", "snippets");
                snippetManager['files'][id] = {};
                config_1.loadModule(snippetFilePath, function (m) {
                    if (m) {
                        snippetManager['files'][id] = m;
                        if (!m.snippets && m.snippetText)
                            m.snippets = snippetManager.parseSnippetFile(m.snippetText);
                        snippetManager.register(m.snippets || [], m.scope);
                    }
                });
            };
            doLiveAutocomplete = function (e) {
                var editor = e.editor;
                var text = e.args || "";
                var hasCompleter = editor.completeUI && editor.completeUI.activated;
                if (e.command.name === editor_protocol_2.COMMAND_NAME_BACKSPACE) {
                    if (hasCompleter && !getCompletionPrefix(editor))
                        editor.completeUI.detach();
                }
                else if (e.command.name === editor_protocol_3.COMMAND_NAME_INSERT_STRING) {
                    var prefix = getCompletionPrefix(editor);
                    if (prefix && !hasCompleter) {
                        if (!editor.completeUI) {
                            editor.completeUI = new CompletionManager_1.default(editor);
                        }
                        editor.completeUI.autoSelect = false;
                        editor.completeUI.autoInsert = false;
                        editor.completeUI.showPopup(editor);
                    }
                }
            };
            config_1.defineOptions(Editor_1.default.prototype, 'editor', {
                enableBasicAutocompletion: {
                    set: function (val) {
                        var editor = this;
                        if (val) {
                            if (!editor.completers) {
                                editor.completers = Array.isArray(val) ? val : completers;
                            }
                            editor.commands.addCommand(new AutoCompleteCommand_1.default(editor_protocol_1.COMMAND_NAME_AUTO_COMPLETE));
                        }
                        else {
                            editor.commands.removeCommand(editor_protocol_1.COMMAND_NAME_AUTO_COMPLETE);
                        }
                    },
                    value: false
                },
                enableLiveAutocompletion: {
                    set: function (val) {
                        var editor = this;
                        if (val) {
                            if (!editor.completers) {
                                editor.completers = Array.isArray(val) ? val : completers;
                            }
                            editor.commands.on('afterExec', doLiveAutocomplete);
                        }
                        else {
                            editor.commands.off('afterExec', doLiveAutocomplete);
                        }
                    },
                    value: false
                },
                enableSnippets: {
                    set: function (val) {
                        var editor = this;
                        if (val) {
                            editor.commands.addCommand(expandSnippet);
                            editor.on("changeMode", onChangeMode);
                            onChangeMode(null, editor);
                        }
                        else {
                            editor.commands.removeCommand(expandSnippet.name);
                            editor.off("changeMode", onChangeMode);
                        }
                    },
                    value: false
                }
            });
        }
    }
});
//# sourceMappingURL=language_tools.js.map
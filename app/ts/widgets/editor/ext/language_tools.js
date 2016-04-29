define(["require", "exports", "SnippetManager", '../autocomplete/AutoCompleteCommand', '../autocomplete/CompletionManager', "../config", "../autocomplete/retrievePrecedingIdentifier", "../Editor", '../editor_protocol', '../editor_protocol', '../editor_protocol'], function (require, exports, SnippetManager_1, AutoCompleteCommand_1, CompletionManager_1, config_1, retrievePrecedingIdentifier_1, Editor_1, editor_protocol_1, editor_protocol_2, editor_protocol_3) {
    var snippetManager = new SnippetManager_1.default();
    var completers = [];
    function addCompleter(completer) {
        completers.push(completer);
    }
    exports.addCompleter = addCompleter;
    ;
    var expandSnippet = {
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
    var onChangeMode = function (e, editor) {
        loadSnippetsForMode(editor.getSession().$mode);
    };
    var loadSnippetsForMode = function (mode) {
        var id = mode.$id;
        if (!snippetManager['files']) {
            snippetManager['files'] = {};
        }
        loadSnippetFile(id);
        if (mode.modes) {
            mode.modes.forEach(loadSnippetsForMode);
        }
    };
    var loadSnippetFile = function (id) {
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
    function getCompletionPrefix(editor) {
        var pos = editor.getCursorPosition();
        var line = editor.getSession().getLine(pos.row);
        var prefix = retrievePrecedingIdentifier_1.default(line, pos.column);
        editor.completers.forEach(function (completer) {
            if (completer['identifierRegexps']) {
                completer['identifierRegexps'].forEach(function (identifierRegex) {
                    if (!prefix && identifierRegex) {
                        prefix = retrievePrecedingIdentifier_1.default(line, pos.column, identifierRegex);
                    }
                });
            }
        });
        return prefix;
    }
    var doLiveAutocomplete = function (e) {
        var editor = e.editor;
        var text = e.args || "";
        var hasCompleter = editor.completionManager && editor.completionManager.activated;
        if (e.command.name === editor_protocol_2.COMMAND_NAME_BACKSPACE) {
            if (hasCompleter && !getCompletionPrefix(editor))
                editor.completionManager.detach();
        }
        else if (e.command.name === editor_protocol_3.COMMAND_NAME_INSERT_STRING) {
            var prefix = getCompletionPrefix(editor);
            if (prefix && !hasCompleter) {
                if (!editor.completionManager) {
                    editor.completionManager = new CompletionManager_1.default();
                }
                editor.completionManager.autoSelect = false;
                editor.completionManager.autoInsert = false;
                editor.completionManager.attach(editor);
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
});

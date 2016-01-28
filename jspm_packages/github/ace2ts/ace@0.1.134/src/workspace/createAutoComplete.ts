import Command from '../commands/Command';
import CompletionEntry from './CompletionEntry';
import CompletionService from './CompletionService';
import AutoCompleteView from './AutoCompleteView';
import Delta from '../Delta';
import Editor from '../Editor';
import EventEmitterClass from '../lib/EventEmitterClass';
import KeyboardHandler from '../keyboard/KeyboardHandler';
import Position from '../Position';
import {COMMAND_NAME_BACKSPACE} from '../editor_protocol';

/**
 * Makes a function that can be used to compare completion entries for sorting purposes.
 */
function makeCompareFn(text: string) {
    return function(a: CompletionEntry, b: CompletionEntry) {
        var matchFunc = function(entry: CompletionEntry): number {
            return entry.name.indexOf(text) === 0 ? 1 : 0;
        };
        var matchCompare = function(): number {
            return matchFunc(b) - matchFunc(a);
        };
        var textCompare = function(): number {
            if (a.name === b.name) {
                return 0;
            }
            else {
                return (a.name > b.name) ? 1 : -1;
            }
        };
        var ret = matchCompare();
        return (ret !== 0) ? ret : textCompare();
    };
}

/**
 * Using the functional constructor pattern here because 'this' is too error-prone.
 *
 * Accordingly, the function is camelCase and is not called using the 'new' operator.
 */
export default function createAutoComplete(editor: Editor, fileNameProvider: () => string, completionService: CompletionService) {
    /**
     * Declare the return object now because the AutoCompleteView needs a reference.
     * The any type declartion avoids the noImplicitAny error.
     * May be better to define a class here?
     */
    var AutoComplete: any = function() {
        // Do nothing.
    };
    var that: { activate: () => void; deactivate: () => void; isActive: () => boolean } = new AutoComplete();
    that.isActive = isActive;
    that.activate = activate;
    that.deactivate = deactivate;

    /**
     *
     */
    var _eventEmitter = new EventEmitterClass(that);

    /**
     *
     */
    var _active = false;

    /**
     *
     */
    var _handler: KeyboardHandler = new KeyboardHandler();

    /**
     *
     */
    var _view = new AutoCompleteView(editor);

    /**
     *
     */
    var _inputText = '';

    _handler.attach = function() {

        editor.on("change", onEditorChange);

        _eventEmitter._emit("attach", { 'sender': that });
        _active = true;
    };

    _handler.detach = function() {
        editor.off("change", onEditorChange);
        _view.hide();
        _eventEmitter._emit("detach", { 'sender': that });
        _active = false;
    };

    _handler.handleKeyboard = function(unused: any, hashId: number, key: string, keyCode: number) {

        if (hashId === -1) {
            if (" -=,[]_/()!';:<>".indexOf(key) !== -1) {
                deactivate();
            }
            return null;
        }

        var command: Command = _handler.findKeyCommand(hashId, key);

        if (!command) {

            var defaultCommand: Command = editor.commands.findKeyCommand(hashId, key);
            if (defaultCommand) {
                if (defaultCommand.name === COMMAND_NAME_BACKSPACE) {
                    return null;
                }
                deactivate();
            }
            return null;
        }

        return { 'command': command, 'args': void 0 };
    };

    _handler.bindKey("Up|Ctrl-p", function(editor: Editor) {
        _view.focusPrev();
    });

    _handler.bindKey("Down|Ctrl-n", function(editor: Editor) {
        _view.focusNext();
    });

    _handler.bindKey("esc|Ctrl-g", function(editor: Editor) {
        deactivate();
    });

    _handler.bindKey("Return|Tab", function(editor: Editor) {

        editor.off("change", onEditorChange);

        for (var i = 0; i < _inputText.length; i++) {
            editor.remove("left");
        }

        var curr: HTMLElement = _view.current();
        if (curr) {
            var text = curr.getAttribute('data-name');
            editor.insert(text, false);
        }
        deactivate();
    });

    function isActive(): boolean {
        return _active;
    }

    /**
     * Returns the number of completions asynchronously in the callback with the side effect of showing the completions.
     */
    function activateUsingCursor(position: Position) {

        completionService.getCompletionsAtCursor(fileNameProvider(), position)
            .then(function(completions: CompletionEntry[]) {

                var text = completionService.matchText;

                function showCompletions(infos: CompletionEntry[]) {

                    if (infos && infos.length > 0) {
                        editor.container.appendChild(_view.wrap);
                        var html = '';
                        for (let n = 0, nLength = infos.length; n < nLength; n++) {
                            const info: CompletionEntry = infos[n];
                            const name = '<span class="label-name">' + info.name + '</span>';
                            const kind = '<span class="label-kind label-kind-' + info.kind + '">' + info.kind.charAt(0) + '</span>';
                            html += '<li data-name="' + info.name + '">' + kind + name + '</li>';
                        }

                        var pos = editor.renderer.getPixelPosition(position, true);
                        var lineHeight = editor.renderer.layerConfig.lineHeight;

                        var rect: ClientRect = editor.container.getBoundingClientRect();
                        pos.top += rect.top - editor.renderer.layerConfig.offset;
                        pos.left += rect.left - editor.renderer.scrollLeft;
                        pos.left += editor.renderer.$gutterLayer.gutterWidth;

                        _view.listElement.innerHTML = html;
                        _view.show(pos, lineHeight, false);
                        _view.ensureFocus();
                    }
                    else {
                        _view.hide();
                    }
                }

                _inputText = text;

                // Filter the completions based upon text that the user enters.
                if (completions && _inputText.length > 0) {
                    completions = completions.filter(function(completion) {
                        return completion.name.toLowerCase().indexOf(_inputText.toLowerCase()) === 0;
                    });
                }

                completions = completions ? completions.sort(makeCompareFn(_inputText)) : completions;

                showCompletions(completions);

                var count = completions ? completions.length : 0;
                if (count > 0) {
                    editor.keyBinding.addKeyboardHandler(_handler);
                }

            })
            .catch(function(err) {
                console.warn(`err => ${err}`);
            });
    }

    /**
     * Listens for changes in the editor and maybe shows the completions.
     */
    function onEditorChange(delta: Delta): void {

        var position: Position = editor.getCursorPosition();

        if (delta.action === "insert") {
            activateUsingCursor({ row: position.row, column: position.column + 1 });
        }
        else if (delta.action === "remove") {
            if (delta.lines.length === 1 && delta.lines[0] === '\n') {
                deactivate();
            }
            else {
                activateUsingCursor(position);
            }
        }
        else {
            activateUsingCursor(position);
        }
    }

    function activate(): void {
        activateUsingCursor(editor.getCursorPosition());
    }

    function deactivate() {
        editor.keyBinding.removeKeyboardHandler(_handler);
    }

    return that;
}

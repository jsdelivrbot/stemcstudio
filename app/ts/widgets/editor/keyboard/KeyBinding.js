define(["require", "exports", "../lib/keys", "../lib/event", "../editor_protocol"], function (require, exports, keys_1, event_1, editor_protocol_1) {
    "use strict";
    var KeyBinding = (function () {
        function KeyBinding(editor) {
            this.editor = editor;
            this.$data = { editor: editor };
            this.$handlers = [];
            this.setDefaultHandler(editor.commands.hashHandler);
        }
        KeyBinding.prototype.setDefaultHandler = function (kb) {
            this.removeKeyboardHandler(this.$defaultHandler);
            this.$defaultHandler = kb;
            this.addKeyboardHandler(kb, 0);
        };
        KeyBinding.prototype.setKeyboardHandler = function (kb) {
            var h = this.$handlers;
            if (h[h.length - 1] === kb)
                return;
            while (h[h.length - 1] && h[h.length - 1] !== this.$defaultHandler)
                this.removeKeyboardHandler(h[h.length - 1]);
            this.addKeyboardHandler(kb, 1);
        };
        KeyBinding.prototype.addKeyboardHandler = function (kb, pos) {
            if (!kb) {
                return;
            }
            var i = this.$handlers.indexOf(kb);
            if (i !== -1) {
                this.$handlers.splice(i, 1);
            }
            if (pos === void 0) {
                this.$handlers.push(kb);
            }
            else {
                this.$handlers.splice(pos, 0, kb);
            }
            if (i === -1 && kb.attach) {
                kb.attach(this.editor);
            }
        };
        KeyBinding.prototype.removeKeyboardHandler = function (kb) {
            var i = this.$handlers.indexOf(kb);
            if (i === -1) {
                return false;
            }
            this.$handlers.splice(i, 1);
            if (kb.detach) {
                kb.detach(this.editor);
            }
            return true;
        };
        KeyBinding.prototype.getKeyboardHandler = function () {
            return this.$handlers[this.$handlers.length - 1];
        };
        KeyBinding.prototype.$callKeyboardHandlers = function (hashId, keyString, keyCode, e) {
            var toExecute;
            var success = false;
            var commands = this.editor.commands;
            for (var i = this.$handlers.length; i--;) {
                toExecute = this.$handlers[i].handleKeyboard(this.$data, hashId, keyString, keyCode, e);
                if (!toExecute || !toExecute.command)
                    continue;
                if (toExecute.command === null) {
                    success = true;
                }
                else {
                    success = commands.exec(toExecute.command, this.editor, toExecute.args);
                }
                if (success && e && hashId !== -1 && toExecute.passEvent !== true && toExecute.command.passEvent !== true) {
                    event_1.stopEvent(e);
                }
                if (success)
                    break;
            }
            return success;
        };
        KeyBinding.prototype.onCommandKey = function (e, hashId, keyCode) {
            var keyString = keys_1.keyCodeToString(keyCode);
            this.$callKeyboardHandlers(hashId, keyString, keyCode, e);
        };
        KeyBinding.prototype.onTextInput = function (text) {
            var success = this.$callKeyboardHandlers(-1, text);
            if (!success) {
                var command = this.editor.commands.getCommandByName(editor_protocol_1.COMMAND_NAME_INSERT_STRING);
                this.editor.commands.exec(command, this.editor, text);
            }
        };
        return KeyBinding;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KeyBinding;
});

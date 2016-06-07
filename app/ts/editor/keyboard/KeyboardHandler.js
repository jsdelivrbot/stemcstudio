define(["require", "exports", "../lib/keys", "../lib/keys", "../lib/useragent"], function (require, exports, keys_1, keys_2, useragent_1) {
    "use strict";
    var KeyboardHandler = (function () {
        function KeyboardHandler(commands, platform) {
            this.platform = platform || (useragent_1.isMac ? "mac" : "win");
            this.commands = {};
            this.commandKeyBinding = {};
            if (commands) {
                this.addCommands(commands);
            }
        }
        KeyboardHandler.prototype.addCommand = function (command) {
            if (this.commands[command.name]) {
                this.removeCommand(command);
            }
            this.commands[command.name] = command;
            if (command.bindKey) {
                this._buildKeyHash(command);
            }
        };
        KeyboardHandler.prototype.removeCommand = function (command) {
            var name = (typeof command === 'string' ? command : command.name);
            command = this.commands[name];
            delete this.commands[name];
            var ckb = this.commandKeyBinding;
            for (var hashId in ckb) {
                if (ckb.hasOwnProperty(hashId)) {
                    for (var key in ckb[hashId]) {
                        if (ckb[hashId][key] === command) {
                            delete ckb[hashId][key];
                        }
                    }
                }
            }
        };
        KeyboardHandler.prototype.bindKey = function (key, action) {
            if (!key) {
                throw new TypeError("key must be a string.");
            }
            this.addCommand({ exec: action, bindKey: key, name: key });
        };
        KeyboardHandler.prototype.bindCommand = function (key, command) {
            var self = this;
            if (!key) {
                return;
            }
            var ckb = this.commandKeyBinding;
            key.split("|").forEach(function (keyPart) {
                var binding = self.parseKeys(keyPart);
                var hashId = binding.hashId;
                (ckb[hashId] || (ckb[hashId] = {}))[binding.key] = command;
            }, self);
        };
        KeyboardHandler.prototype.addCommands = function (commands) {
            for (var i = 0, iLength = commands.length; i < iLength; i++) {
                this.addCommand(commands[i]);
            }
        };
        KeyboardHandler.prototype.removeCommands = function (commands) {
            var _this = this;
            Object.keys(commands).forEach(function (name) {
                _this.removeCommand(commands[name]);
            });
        };
        KeyboardHandler.prototype.bindKeys = function (keyList) {
            var self = this;
            Object.keys(keyList).forEach(function (key) {
                self.bindKey(key, keyList[key]);
            }, self);
        };
        KeyboardHandler.prototype._buildKeyHash = function (command) {
            var binding = command.bindKey;
            if (!binding)
                return;
            var key = typeof binding === "string" ? binding : binding[this.platform];
            this.bindCommand(key, command);
        };
        KeyboardHandler.prototype.parseKeys = function (keys) {
            if (keys.indexOf(" ") !== -1)
                keys = keys.split(/\s+/).pop();
            var parts = keys.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function (x) { return x; });
            var key = parts.pop();
            var keyCode = keys_2.default[key];
            if (keys_1.FUNCTION_KEYS[keyCode])
                key = keys_1.FUNCTION_KEYS[keyCode].toLowerCase();
            else if (!parts.length)
                return { key: key, hashId: -1 };
            else if (parts.length === 1 && parts[0] === "shift")
                return { key: key.toUpperCase(), hashId: -1 };
            var hashId = 0;
            for (var i = parts.length; i--;) {
                var modifier = keys_1.KEY_MODS[parts[i]];
                if (modifier === null) {
                    throw new Error("invalid modifier " + parts[i] + " in " + keys);
                }
                hashId |= modifier;
            }
            return { key: key, hashId: hashId };
        };
        KeyboardHandler.prototype.findKeyCommand = function (hashId, keyString) {
            var ckbr = this.commandKeyBinding;
            return ckbr[hashId] && ckbr[hashId][keyString];
        };
        KeyboardHandler.prototype.handleKeyboard = function (data, hashId, keyString, keyCode, e) {
            var response = {
                command: this.findKeyCommand(hashId, keyString)
            };
            return response;
        };
        KeyboardHandler.prototype.attach = function (editor) {
        };
        KeyboardHandler.prototype.detach = function (editor) {
        };
        return KeyboardHandler;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KeyboardHandler;
});

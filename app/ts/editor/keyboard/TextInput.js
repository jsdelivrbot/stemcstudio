define(["require", "exports", "../lib/event", "../lib/useragent", "../lib/dom", "../lib/lang/createDelayedCall", '../editor_protocol', '../editor_protocol'], function (require, exports, event_1, useragent_1, dom_1, createDelayedCall_1, editor_protocol_1, editor_protocol_2) {
    "use strict";
    var BROKEN_SETDATA = useragent_1.isChrome < 18;
    var USE_IE_MIME_TYPE = useragent_1.isIE;
    var PLACEHOLDER = "\x01\x01";
    var TextInput = (function () {
        function TextInput(container, editor) {
            var _this = this;
            this.editor = editor;
            this.tempStyle = '';
            this.afterContextMenu = false;
            this.inComposition = false;
            this.text = dom_1.createElement("textarea");
            this.text.className = "ace_text-input";
            if (useragent_1.isTouchPad) {
                this.text.setAttribute("x-palm-disable-auto-cap", 'true');
            }
            this.text.wrap = "off";
            this.text['autocorrect'] = "off";
            this.text['autocapitalize'] = "off";
            this.text.spellcheck = false;
            this.text.style.opacity = "0";
            container.insertBefore(this.text, container.firstChild);
            var copied = false;
            this.pasted = false;
            var isSelectionEmpty = true;
            try {
                this._isFocused = document.activeElement === this.text;
            }
            catch (e) { }
            event_1.addListener(this.text, "blur", function () {
                editor.onBlur();
                _this._isFocused = false;
            });
            event_1.addListener(this.text, "focus", function () {
                _this._isFocused = true;
                editor.onFocus();
                _this.resetSelection();
            });
            var syncSelection = createDelayedCall_1.default(function () {
                _this._isFocused && _this.resetSelection(isSelectionEmpty);
            });
            this.syncValue = createDelayedCall_1.default(function () {
                if (!_this.inComposition) {
                    _this.text.value = PLACEHOLDER;
                    _this._isFocused && _this.resetSelection();
                }
            });
            useragent_1.isWebKit || editor.on('changeSelection', function (event, editor) {
                if (editor.selection.isEmpty() !== isSelectionEmpty) {
                    isSelectionEmpty = !isSelectionEmpty;
                    syncSelection.schedule();
                }
            });
            this.resetValue();
            if (this._isFocused) {
                editor.onFocus();
            }
            var isAllSelected = function (text) {
                return text.selectionStart === 0 && text.selectionEnd === text.value.length;
            };
            if (!this.text.setSelectionRange && this.text.createTextRange) {
                this.text.setSelectionRange = function (selectionStart, selectionEnd) {
                    var range = this.createTextRange();
                    range.collapse(true);
                    range.moveStart('character', selectionStart);
                    range.moveEnd('character', selectionEnd);
                    range.select();
                };
                isAllSelected = function (text) {
                    try {
                        var range = text.ownerDocument['selection'].createRange();
                    }
                    catch (e) {
                    }
                    if (!range || range.parentElement() !== text)
                        return false;
                    return range.text === text.value;
                };
            }
            if (useragent_1.isOldIE) {
                var inPropertyChange = false;
                var onPropertyChange = function (e) {
                    if (inPropertyChange)
                        return;
                    var data = _this.text.value;
                    if (_this.inComposition || !data || data === PLACEHOLDER)
                        return;
                    if (e && data === PLACEHOLDER[0])
                        return syncProperty.schedule();
                    _this.sendText(data);
                    inPropertyChange = true;
                    _this.resetValue();
                    inPropertyChange = false;
                };
                var syncProperty = createDelayedCall_1.default(onPropertyChange);
                event_1.addListener(this.text, "propertychange", onPropertyChange);
                var keytable = { 13: 1, 27: 1 };
                event_1.addListener(this.text, "keyup", function (e) {
                    if (_this.inComposition && (!_this.text.value || keytable[e.keyCode]))
                        setTimeout(onCompositionEnd, 0);
                    if ((_this.text.value.charCodeAt(0) || 0) < 129) {
                        return syncProperty.call();
                    }
                    _this.inComposition ? onCompositionUpdate() : onCompositionStart();
                });
                event_1.addListener(this.text, "keydown", function (e) {
                    syncProperty.schedule(50);
                });
            }
            var onSelect = function (e) {
                if (copied) {
                    copied = false;
                }
                else if (isAllSelected(_this.text)) {
                    editor.selectAll();
                    _this.resetSelection();
                }
                else if (_this.inputHandler) {
                    _this.resetSelection(editor.selection.isEmpty());
                }
            };
            var onInput = function (e) {
                if (_this.inComposition) {
                    return;
                }
                var data = _this.text.value;
                _this.sendText(data);
                _this.resetValue();
            };
            var handleClipboardData = function (e, data) {
                var clipboardData = e.clipboardData || window['clipboardData'];
                if (!clipboardData || BROKEN_SETDATA)
                    return;
                var mime = USE_IE_MIME_TYPE ? "Text" : "text/plain";
                if (data) {
                    return clipboardData.setData(mime, data) !== false;
                }
                else {
                    return clipboardData.getData(mime);
                }
            };
            var doCopy = function (e, isCut) {
                var data = editor.getSelectedText();
                if (!data)
                    return event_1.preventDefault(e);
                if (handleClipboardData(e, data)) {
                    isCut ? editor.onCut() : editor.onCopy();
                    event_1.preventDefault(e);
                }
                else {
                    copied = true;
                    _this.text.value = data;
                    _this.text.select();
                    setTimeout(function () {
                        copied = false;
                        _this.resetValue();
                        _this.resetSelection();
                        isCut ? editor.onCut() : editor.onCopy();
                    });
                }
            };
            var onCut = function (e) {
                doCopy(e, true);
            };
            var onCopy = function (e) {
                doCopy(e, false);
            };
            var onPaste = function (e) {
                var data = handleClipboardData(e);
                if (typeof data === "string") {
                    if (data)
                        editor.onPaste(data);
                    if (useragent_1.isIE)
                        setTimeout(function () { _this.resetSelection(); });
                    event_1.preventDefault(e);
                }
                else {
                    _this.text.value = "";
                    _this.pasted = true;
                }
            };
            event_1.addCommandKeyListener(this.text, editor.onCommandKey.bind(editor));
            event_1.addListener(this.text, "select", onSelect);
            event_1.addListener(this.text, "input", onInput);
            event_1.addListener(this.text, "cut", onCut);
            event_1.addListener(this.text, "copy", onCopy);
            event_1.addListener(this.text, "paste", onPaste);
            if (!('oncut' in this.text) || !('oncopy' in this.text) || !('onpaste' in this.text)) {
                event_1.addListener(container, "keydown", function (e) {
                    if ((useragent_1.isMac && !e.metaKey) || !e.ctrlKey)
                        return;
                    switch (e.keyCode) {
                        case 67:
                            onCopy(e);
                            break;
                        case 86:
                            onPaste(e);
                            break;
                        case 88:
                            onCut(e);
                            break;
                        default: {
                        }
                    }
                });
            }
            var onCompositionStart = function () {
                if (_this.inComposition || !editor.onCompositionStart || editor.$readOnly)
                    return;
                _this.inComposition = {};
                editor.onCompositionStart();
                setTimeout(onCompositionUpdate, 0);
                editor.on("mousedown", onCompositionEnd);
                if (!editor.selection.isEmpty()) {
                    editor.insert("", false);
                    editor.getSession().markUndoGroup();
                    editor.selection.clearSelection();
                }
                editor.getSession().markUndoGroup();
            };
            var onCompositionUpdate = function () {
                if (!_this.inComposition || !editor.onCompositionUpdate || editor.$readOnly)
                    return;
                var val = _this.text.value.replace(/\x01/g, "");
                if (_this.inComposition.lastValue === val)
                    return;
                editor.onCompositionUpdate(val);
                if (_this.inComposition.lastValue)
                    editor.undo();
                _this.inComposition.lastValue = val;
                if (_this.inComposition.lastValue) {
                    var r = editor.selection.getRange();
                    editor.insert(_this.inComposition.lastValue, false);
                    editor.getSession().markUndoGroup();
                    _this.inComposition.range = editor.selection.getRange();
                    editor.selection.setRange(r);
                    editor.selection.clearSelection();
                }
            };
            var onCompositionEnd = function (e, editor) {
                if (!editor.onCompositionEnd || editor.$readOnly)
                    return;
                var c = _this.inComposition;
                _this.inComposition = false;
                var timer = setTimeout(function () {
                    timer = null;
                    var str = _this.text.value.replace(/\x01/g, "");
                    if (_this.inComposition)
                        return;
                    else if (str === c.lastValue)
                        _this.resetValue();
                    else if (!c.lastValue && str) {
                        _this.resetValue();
                        _this.sendText(str);
                    }
                });
                _this.inputHandler = function compositionInputHandler(str) {
                    if (timer)
                        clearTimeout(timer);
                    str = str.replace(/\x01/g, "");
                    if (str === c.lastValue)
                        return "";
                    if (c.lastValue && timer)
                        editor.undo();
                    return str;
                };
                editor.onCompositionEnd();
                editor.off("mousedown", onCompositionEnd);
                if (e.type === "compositionend" && c.range) {
                    editor.selection.setRange(c.range);
                }
            };
            var syncComposition = createDelayedCall_1.default(onCompositionUpdate, 50);
            event_1.addListener(this.text, "compositionstart", onCompositionStart);
            if (useragent_1.isGecko) {
                event_1.addListener(this.text, "text", function () { syncComposition.schedule(); });
            }
            else {
                event_1.addListener(this.text, "keyup", function () { syncComposition.schedule(); });
                event_1.addListener(this.text, "keydown", function () { syncComposition.schedule(); });
            }
            event_1.addListener(this.text, "compositionend", onCompositionEnd);
            var onContextMenu = function (e) {
                editor.textInput.onContextMenu(e);
                _this.onContextMenuClose();
            };
            event_1.addListener(editor.renderer.scroller, "contextmenu", onContextMenu);
            event_1.addListener(this.text, "contextmenu", onContextMenu);
        }
        TextInput.prototype.getElement = function () {
            return this.text;
        };
        TextInput.prototype.isFocused = function () {
            return this._isFocused;
        };
        TextInput.prototype.moveToMouse = function (e, bringToFront) {
            var _this = this;
            if (!this.tempStyle) {
                this.tempStyle = this.text.style.cssText;
            }
            this.text.style.cssText = (bringToFront ? "z-index:100000;" : "")
                + "height:" + this.text.style.height + ";"
                + (useragent_1.isIE ? "opacity:0.1;" : "");
            var rect = this.editor.container.getBoundingClientRect();
            var style = window.getComputedStyle(this.editor.container);
            var top = rect.top + (parseInt(style.borderTopWidth) || 0);
            var left = rect.left + (parseInt(style.borderLeftWidth) || 0);
            var maxTop = rect.bottom - top - this.text.clientHeight - 2;
            var move = function (e) {
                _this.text.style.left = e.clientX - left - 2 + "px";
                _this.text.style.top = Math.min(e.clientY - top - 2, maxTop) + "px";
            };
            move(e);
            if (e.type !== "mousedown")
                return;
            if (this.editor.renderer.$keepTextAreaAtCursor) {
                this.editor.renderer.$keepTextAreaAtCursor = null;
            }
            if (useragent_1.isWin) {
                event_1.capture(this.editor.container, move, function () { _this.onContextMenuClose(); });
            }
        };
        TextInput.prototype.setReadOnly = function (readOnly) {
            this.text.readOnly = readOnly;
        };
        TextInput.prototype.focus = function () {
            return this.text.focus();
        };
        TextInput.prototype.blur = function () {
            return this.text.blur();
        };
        TextInput.prototype.onContextMenuClose = function () {
            var _this = this;
            setTimeout(function () {
                if (_this.tempStyle) {
                    _this.text.style.cssText = _this.tempStyle;
                    _this.tempStyle = '';
                }
                if (_this.editor.renderer.$keepTextAreaAtCursor == null) {
                    _this.editor.renderer.$keepTextAreaAtCursor = true;
                    _this.editor.renderer.$moveTextAreaToCursor();
                }
            }, 0);
        };
        TextInput.prototype.onContextMenu = function (e) {
            this.afterContextMenu = true;
            this.resetSelection(this.editor.selection.isEmpty());
            this.editor._emit("nativecontextmenu", { target: this.editor, domEvent: e });
            this.moveToMouse(e, true);
        };
        TextInput.prototype.sendText = function (data) {
            if (this.inputHandler) {
                data = this.inputHandler(data);
                this.inputHandler = null;
            }
            if (this.pasted) {
                this.resetSelection();
                if (data) {
                    this.editor.onPaste(data);
                }
                this.pasted = false;
            }
            else if (data === PLACEHOLDER.charAt(0)) {
                if (this.afterContextMenu) {
                    var delCommand = this.editor.commands.getCommandByName(editor_protocol_2.COMMAND_NAME_DEL);
                    this.editor.execCommand(delCommand, { source: "ace" });
                }
                else {
                    var backCommand = this.editor.commands.getCommandByName(editor_protocol_1.COMMAND_NAME_BACKSPACE);
                    this.editor.execCommand(backCommand, { source: "ace" });
                }
            }
            else {
                if (data.substring(0, 2) === PLACEHOLDER)
                    data = data.substr(2);
                else if (data.charAt(0) === PLACEHOLDER.charAt(0))
                    data = data.substr(1);
                else if (data.charAt(data.length - 1) === PLACEHOLDER.charAt(0))
                    data = data.slice(0, -1);
                if (data.charAt(data.length - 1) === PLACEHOLDER.charAt(0))
                    data = data.slice(0, -1);
                if (data) {
                    this.editor.onTextInput(data);
                }
            }
            if (this.afterContextMenu) {
                this.afterContextMenu = false;
            }
        };
        TextInput.prototype.resetSelection = function (isEmpty) {
            if (this.inComposition) {
                return;
            }
            if (this.inputHandler) {
                this.selectionStart = 0;
                this.selectionEnd = isEmpty ? 0 : this.text.value.length - 1;
            }
            else {
                this.selectionStart = isEmpty ? 2 : 1;
                this.selectionEnd = 2;
            }
            try {
                this.text.setSelectionRange(this.selectionStart, this.selectionEnd);
            }
            catch (e) {
            }
        };
        TextInput.prototype.setInputHandler = function (inputHandler) {
            this.inputHandler = inputHandler;
        };
        TextInput.prototype.getInputHandler = function () {
            return this.inputHandler;
        };
        TextInput.prototype.resetValue = function () {
            if (this.inComposition) {
                return;
            }
            this.text.value = PLACEHOLDER;
            if (useragent_1.isWebKit)
                this.syncValue.schedule();
        };
        return TextInput;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextInput;
});

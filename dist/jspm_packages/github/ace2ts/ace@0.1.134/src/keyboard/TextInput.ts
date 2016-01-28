/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */
"use strict";

import { addCommandKeyListener, addListener, capture, preventDefault } from "../lib/event";
import { isChrome, isGecko, isIE, isMac, isOldIE, isTouchPad, isWebKit, isWin } from "../lib/useragent";
import { createElement } from "../lib/dom";
import createDelayedCall from "../lib/lang/createDelayedCall";
import Editor from "../Editor";
import {COMMAND_NAME_BACKSPACE} from '../editor_protocol';
import {COMMAND_NAME_DEL} from '../editor_protocol';
import Range from '../Range';

const BROKEN_SETDATA = isChrome < 18;
const USE_IE_MIME_TYPE = isIE;
const PLACEHOLDER = "\x01\x01";

/**
 * @class TextInput
 */
export default class TextInput {

    /**
     * @property text
     * @type HTMLTextAreaElement
     * @private
     */
    private text: HTMLTextAreaElement;

    /**
     * @property editor
     * @type Editor
     * @private
     */
    private editor: Editor;

    /**
     * @property _isFocused
     * @type boolean
     * @private
     */
    public _isFocused: boolean;

    private tempStyle: string;

    private afterContextMenu: boolean;

    private inComposition: { range?: Range; lastValue?: string };

    private inputHandler: (data: string) => string;

    private selectionStart: number;
    private selectionEnd: number;

    private pasted: boolean;

    private syncValue: any;

    /**
     * @class TextInput
     * @constructor
     * @param container {Element}
     * @param editor {Editor}
     */
    constructor(container: Element, editor: Editor) {

        this.editor = editor;
        this.tempStyle = '';
        this.afterContextMenu = false;
        this.inComposition = false;

        this.text = <HTMLTextAreaElement>createElement("textarea");
        this.text.className = "ace_text-input";

        if (isTouchPad) {
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

        // FOCUS
        // ie9 throws error if document.activeElement is accessed too soon
        try { this._isFocused = document.activeElement === this.text; } catch (e) {/* Do nothing. */ }

        addListener(this.text, "blur", () => {
            editor.onBlur();
            this._isFocused = false;
        });
        addListener(this.text, "focus", () => {
            this._isFocused = true;
            editor.onFocus();
            this.resetSelection();
        });

        // modifying selection of blured textarea can focus it (chrome mac/linux)
        const syncSelection = createDelayedCall(() => {
            this._isFocused && this.resetSelection(isSelectionEmpty);
        });

        this.syncValue = createDelayedCall(() => {
            if (!this.inComposition) {
                this.text.value = PLACEHOLDER;
                this._isFocused && this.resetSelection();
            }
        });

        isWebKit || editor.on('changeSelection', function(event, editor: Editor) {
            if (editor.selection.isEmpty() !== isSelectionEmpty) {
                isSelectionEmpty = !isSelectionEmpty;
                syncSelection.schedule();
            }
        });

        this.resetValue();

        if (this._isFocused) {
            editor.onFocus();
        }


        var isAllSelected = function(text: HTMLTextAreaElement) {
            return text.selectionStart === 0 && text.selectionEnd === text.value.length;
        };
        // IE8 does not support setSelectionRange
        if (!this.text.setSelectionRange && this.text.createTextRange) {
            this.text.setSelectionRange = function(selectionStart: number, selectionEnd: number) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveStart('character', selectionStart);
                range.moveEnd('character', selectionEnd);
                range.select();
            };
            isAllSelected = function(text: HTMLTextAreaElement) {
                try {
                    var range = text.ownerDocument['selection'].createRange();
                }
                catch (e) {
                    // Do nothing.
                }
                if (!range || range.parentElement() !== text) return false;
                return range.text === text.value;
            };
        }
        if (isOldIE) {
            var inPropertyChange = false;
            var onPropertyChange = (e?) => {
                if (inPropertyChange)
                    return;
                var data = this.text.value;
                if (this.inComposition || !data || data === PLACEHOLDER)
                    return;
                // can happen either after delete or during insert operation
                if (e && data === PLACEHOLDER[0])
                    return syncProperty.schedule();

                this.sendText(data);
                // ie8 calls propertychange handlers synchronously!
                inPropertyChange = true;
                this.resetValue();
                inPropertyChange = false;
            };
            var syncProperty = createDelayedCall(onPropertyChange);
            addListener(this.text, "propertychange", onPropertyChange);

            var keytable = { 13: 1, 27: 1 };
            addListener(this.text, "keyup", (e) => {
                if (this.inComposition && (!this.text.value || keytable[e.keyCode]))
                    setTimeout(onCompositionEnd, 0);
                if ((this.text.value.charCodeAt(0) || 0) < 129) {
                    return syncProperty.call();
                }
                this.inComposition ? onCompositionUpdate() : onCompositionStart();
            });
            // when user presses backspace after focusing the editor 
            // propertychange isn't called for the next character
            addListener(this.text, "keydown", function(e) {
                syncProperty.schedule(50);
            });
        }

        var onSelect = (e) => {
            if (copied) {
                copied = false;
            }
            else if (isAllSelected(this.text)) {
                editor.selectAll();
                this.resetSelection();
            }
            else if (this.inputHandler) {
                this.resetSelection(editor.selection.isEmpty());
            }
        };

        /**
         * The event handler for the 'input' event of the text area.
         */
        const onInput = (e) => {
            if (this.inComposition) {
                return;
            }
            const data = this.text.value;
            // The data is essentially the last character typed because of the reset.
            this.sendText(data);
            this.resetValue();
        };

        var handleClipboardData = function(e, data?) {
            var clipboardData = e.clipboardData || window['clipboardData'];
            if (!clipboardData || BROKEN_SETDATA)
                return;
            // using "Text" doesn't work on legacy webkit but ie needs it
            // TODO are there other browsers that require "Text"?
            var mime = USE_IE_MIME_TYPE ? "Text" : "text/plain";
            if (data) {
                // Safari 5 has clipboardData object, but does not handle setData()
                return clipboardData.setData(mime, data) !== false;
            }
            else {
                return clipboardData.getData(mime);
            }
        };

        var doCopy = (e: KeyboardEvent, isCut: boolean) => {
            var data: string = editor.getSelectedText();
            if (!data)
                return preventDefault(e);

            if (handleClipboardData(e, data)) {
                isCut ? editor.onCut() : editor.onCopy();
                preventDefault(e);
            }
            else {
                copied = true;
                this.text.value = data;
                this.text.select();
                setTimeout(() => {
                    copied = false;
                    this.resetValue();
                    this.resetSelection();
                    isCut ? editor.onCut() : editor.onCopy();
                });
            }
        };

        var onCut = function(e: KeyboardEvent) {
            doCopy(e, true);
        };

        var onCopy = function(e: KeyboardEvent) {
            doCopy(e, false);
        };

        var onPaste = (e: KeyboardEvent) => {
            var data = handleClipboardData(e);
            if (typeof data === "string") {
                if (data)
                    editor.onPaste(data);
                if (isIE)
                    setTimeout(() => { this.resetSelection(); });
                preventDefault(e);
            }
            else {
                this.text.value = "";
                this.pasted = true;
            }
        };

        addCommandKeyListener(this.text, editor.onCommandKey.bind(editor));

        addListener(this.text, "select", onSelect);

        addListener(this.text, "input", onInput);

        addListener(this.text, "cut", onCut);
        addListener(this.text, "copy", onCopy);
        addListener(this.text, "paste", onPaste);

        // Opera has no clipboard events
        if (!('oncut' in this.text) || !('oncopy' in this.text) || !('onpaste' in this.text)) {
            addListener(container, "keydown", function(e: KeyboardEvent) {
                if ((isMac && !e.metaKey) || !e.ctrlKey)
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
                        // Do nothing.
                    }
                }
            });
        }


        // COMPOSITION
        var onCompositionStart = () => {
            if (this.inComposition || !editor.onCompositionStart || editor.$readOnly)
                return;

            this.inComposition = {};
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

        var onCompositionUpdate = () => {

            if (!this.inComposition || !editor.onCompositionUpdate || editor.$readOnly)
                return;
            var val = this.text.value.replace(/\x01/g, "");
            if (this.inComposition.lastValue === val) return;

            editor.onCompositionUpdate(val);
            if (this.inComposition.lastValue)
                editor.undo();
            this.inComposition.lastValue = val;
            if (this.inComposition.lastValue) {
                var r = editor.selection.getRange();
                editor.insert(this.inComposition.lastValue, false);
                editor.getSession().markUndoGroup();
                this.inComposition.range = editor.selection.getRange();
                editor.selection.setRange(r);
                editor.selection.clearSelection();
            }
        };

        var onCompositionEnd = (e, editor: Editor) => {
            if (!editor.onCompositionEnd || editor.$readOnly) return;

            var c = this.inComposition;
            this.inComposition = false;
            var timer = setTimeout(() => {
                timer = null;
                var str = this.text.value.replace(/\x01/g, "");

                if (this.inComposition)
                    return;
                else if (str === c.lastValue)
                    this.resetValue();
                else if (!c.lastValue && str) {
                    this.resetValue();
                    this.sendText(str);
                }
            });

            this.inputHandler = function compositionInputHandler(str: string) {

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



        var syncComposition = createDelayedCall(onCompositionUpdate, 50);

        addListener(this.text, "compositionstart", onCompositionStart);
        if (isGecko) {
            addListener(this.text, "text", function() { syncComposition.schedule(); });
        }
        else {
            addListener(this.text, "keyup", function() { syncComposition.schedule(); });
            addListener(this.text, "keydown", function() { syncComposition.schedule(); });
        }
        addListener(this.text, "compositionend", onCompositionEnd);

        var onContextMenu = (e: MouseEvent) => {
            editor.textInput.onContextMenu(e);
            this.onContextMenuClose();
        };

        addListener(editor.renderer.scroller, "contextmenu", onContextMenu);
        addListener(this.text, "contextmenu", onContextMenu);
    }

    /**
     * @method getElement
     * @return {HTMLTextAreaElement}
     */
    getElement(): HTMLTextAreaElement {
        return this.text;
    }

    /**
     * @method isFocused
     * @return {boolean}
     */
    isFocused(): boolean {
        return this._isFocused;
    }

    /**
     * @method moveToMouse
     * @param e {MouseEvent}
     * @param [bringToFront] {boolean}
     * @return {void}
     */
    moveToMouse(e: MouseEvent, bringToFront?: boolean): void {

        if (!this.tempStyle) {
            this.tempStyle = this.text.style.cssText;
        }

        this.text.style.cssText = (bringToFront ? "z-index:100000;" : "")
            + "height:" + this.text.style.height + ";"
            + (isIE ? "opacity:0.1;" : "");

        var rect = this.editor.container.getBoundingClientRect();
        var style = window.getComputedStyle(this.editor.container);
        var top = rect.top + (parseInt(style.borderTopWidth) || 0);
        var left = rect.left + (parseInt(style.borderLeftWidth) || 0);
        var maxTop = rect.bottom - top - this.text.clientHeight - 2;

        var move = (e: MouseEvent) => {
            this.text.style.left = e.clientX - left - 2 + "px";
            this.text.style.top = Math.min(e.clientY - top - 2, maxTop) + "px";
        };

        move(e);

        if (e.type !== "mousedown")
            return;

        if (this.editor.renderer.$keepTextAreaAtCursor) {
            this.editor.renderer.$keepTextAreaAtCursor = null;
        }

        // on windows context menu is opened after mouseup
        if (isWin) {
            capture(this.editor.container, move, () => { this.onContextMenuClose(); });
        }
    }

    /**
     * @method setReadOnly
     * @param readOnly {boolean}
     * @return {void}
     */
    setReadOnly(readOnly: boolean): void {
        this.text.readOnly = readOnly;
    }

    /**
     * @method focus
     * @return {void}
     */
    focus(): void {
        return this.text.focus();
    }

    /**
     * @method blur
     * @return {void}
     */
    blur() {
        return this.text.blur();
    }

    /**
     * @method onContextMenuClose
     * @return {void}
     */
    onContextMenuClose(): void {
        setTimeout(() => {
            if (this.tempStyle) {
                this.text.style.cssText = this.tempStyle;
                this.tempStyle = '';
            }
            if (this.editor.renderer.$keepTextAreaAtCursor == null) {
                this.editor.renderer.$keepTextAreaAtCursor = true;
                this.editor.renderer.$moveTextAreaToCursor();
            }
        }, 0);
    }

    /**
     * @method onContextMenu
     * @param e {MouseEvent}
     * @return {void}
     */
    onContextMenu(e: MouseEvent): void {
        this.afterContextMenu = true;
        this.resetSelection(this.editor.selection.isEmpty());
        this.editor._emit("nativecontextmenu", { target: this.editor, domEvent: e });
        this.moveToMouse(e, true);
    }

    /**
     * @method sendText
     * @param data {string}
     * @return {void}
     */
    sendText(data: string): void {
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
                const delCommand = this.editor.commands.getCommandByName(COMMAND_NAME_DEL);
                this.editor.execCommand(delCommand, { source: "ace" });
            }
            else {
                // Some versions of Android do not fire keydown when pressing backspace.
                const backCommand = this.editor.commands.getCommandByName(COMMAND_NAME_BACKSPACE);
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
            // can happen if undo in textarea isn't stopped
            if (data.charAt(data.length - 1) === PLACEHOLDER.charAt(0))
                data = data.slice(0, -1);

            if (data) {
                this.editor.onTextInput(data);
            }
        }
        if (this.afterContextMenu) {
            this.afterContextMenu = false;
        }
    }

    /**
     * @method resetSelection
     * @param [isEmpty] {boolean}
     * @return {void}
     */
    resetSelection(isEmpty?: boolean): void {
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
        // on firefox this throws if textarea is hidden
        try {
            this.text.setSelectionRange(this.selectionStart, this.selectionEnd);
        }
        catch (e) {
            // Do nothing.
        }
    }

    /**
     * @method setInputHandler
     * @param inputHandler {(data: string)=>string}
     * @return {void}
     */
    setInputHandler(inputHandler: (data: string) => string): void {
        this.inputHandler = inputHandler;
    }

    /**
     * @method getInputHandler
     * @return {(data: string)=>string}
     */
    getInputHandler(): (data: string) => string {
        return this.inputHandler;
    }

    /**
     * @method resetValue
     * @return {void}
     */
    resetValue(): void {
        if (this.inComposition) {
            return;
        }
        this.text.value = PLACEHOLDER;
        // http://code.google.com/p/chromium/issues/detail?id=76516
        if (isWebKit)
            this.syncValue.schedule();
    }

}

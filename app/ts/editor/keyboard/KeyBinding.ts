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

import { keyCodeToString } from "../lib/keys";
import { stopEvent } from "../lib/event";
import Editor from "../Editor";
import KeyboardHandler from "./KeyboardHandler";
import { COMMAND_NAME_INSERT_STRING } from "../editor_protocol";
import KeyboardResponse from './KeyboardResponse';

/**
 *
 */
export default class KeyBinding {
    /**
     *
     */
    private readonly editor: Editor;
    private readonly $data: { editor: Editor };
    /**
     * Used by getEditorKeyboardShortcuts
     */
    public readonly $handlers: KeyboardHandler[] = [];
    /**
     * 
     */
    private $defaultHandler: KeyboardHandler;

    /**
     * @param editor
     */
    constructor(editor: Editor) {
        this.editor = editor;
        this.$data = { editor: editor };
        this.setDefaultHandler(editor.commands.hashHandler);
    }

    /**
     * @param kb
     */
    setDefaultHandler(kb: KeyboardHandler): void {
        this.removeKeyboardHandler(this.$defaultHandler);
        this.$defaultHandler = kb;
        this.addKeyboardHandler(kb, 0);
    }

    /**
     * @param kb
     */
    setKeyboardHandler(kb: KeyboardHandler): void {
        const h = this.$handlers;
        if (h[h.length - 1] === kb)
            return;

        while (h[h.length - 1] && h[h.length - 1] !== this.$defaultHandler)
            this.removeKeyboardHandler(h[h.length - 1]);

        this.addKeyboardHandler(kb, 1);
    }

    /**
     * @param kb
     * @param pos
     */
    addKeyboardHandler(kb: KeyboardHandler, pos?: number): void {
        if (!kb) {
            return;
        }
        /*
        if (typeof kb === "function" && !kb.handleKeyboard) {
            kb.handleKeyboard = kb;
        }
        */
        const i = this.$handlers.indexOf(kb);
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
    }

    /**
     * @param kb
     */
    removeKeyboardHandler(kb: KeyboardHandler): boolean {
        const i = this.$handlers.indexOf(kb);
        if (i === -1) {
            return false;
        }
        this.$handlers.splice(i, 1);
        if (kb.detach) {
            kb.detach(this.editor);
        }
        return true;
    }

    /**
     *
     */
    getKeyboardHandler(): KeyboardHandler {
        return this.$handlers[this.$handlers.length - 1];
    }

    /**
     * @param hashId
     * @param keyString
     * @param keyCode
     * @param e
     */
    private $callKeyboardHandlers(hashId: number, keyString: string, keyCode?: number, e?): boolean {

        let toExecute: KeyboardResponse;
        let success = false;
        const commands = this.editor.commands;

        for (let i = this.$handlers.length; i--;) {
            toExecute = this.$handlers[i].handleKeyboard(this.$data, hashId, keyString, keyCode, e);
            if (!toExecute || !toExecute.command)
                continue;

            // allow keyboardHandler to consume keys
            if (toExecute.command === null) {
                success = true;
            }
            else {
                success = commands.exec(toExecute.command, this.editor, toExecute.args);
            }
            // do not stop input events to not break repeating
            if (success && e && hashId !== -1 && toExecute.passEvent !== true && toExecute.command.passEvent !== true) {
                stopEvent(e);
            }
            if (success)
                break;
        }
        return success;
    }

    /**
     * @param e
     * @param hashId
     * @param keyCode
     */
    onCommandKey(e: KeyboardEvent, hashId: number, keyCode: number): void {
        const keyString = keyCodeToString(keyCode);
        this.$callKeyboardHandlers(hashId, keyString, keyCode, e);
    }

    /**
     * @param text
     */
    onTextInput(text: string): void {
        const success = this.$callKeyboardHandlers(-1, text);
        if (!success) {
            let command = this.editor.commands.getCommandByName(COMMAND_NAME_INSERT_STRING);
            this.editor.commands.exec(command, this.editor, text);
        }
    }
}

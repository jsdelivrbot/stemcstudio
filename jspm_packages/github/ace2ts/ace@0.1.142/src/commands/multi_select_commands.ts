/* ***** BEGIN LICENSE BLOCK *****
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 David Geo Holmes <david.geo.holmes@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ***** END LICENSE BLOCK ***** */
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
"use strict";

import {stringRepeat, stringTrimLeft, stringTrimRight} from "../lib/lang";
import {loadModule} from "../config";
import Range from "../Range";
import Command from './Command';
import Editor from '../Editor';
import {COMMAND_NAME_BACKSPACE} from '../editor_protocol';
import {COMMAND_NAME_DEL} from '../editor_protocol';
import {COMMAND_NAME_INSERT_STRING} from "../editor_protocol";

function bindKey(win: string, mac: string) {
    return { win: win, mac: mac };
}

// commands to enter multiselect mode
var commands: Command[] = [{
    name: "addCursorAbove",
    exec: function(editor: Editor) { editor.selectMoreLines(-1); },
    bindKey: { win: "Ctrl-Alt-Up", mac: "Ctrl-Alt-Up" },
    readOnly: true
}, {
        name: "addCursorBelow",
        exec: function(editor: Editor) { editor.selectMoreLines(1); },
        bindKey: { win: "Ctrl-Alt-Down", mac: "Ctrl-Alt-Down" },
        readOnly: true
    }, {
        name: "addCursorAboveSkipCurrent",
        exec: function(editor: Editor) { editor.selectMoreLines(-1, true); },
        bindKey: { win: "Ctrl-Alt-Shift-Up", mac: "Ctrl-Alt-Shift-Up" },
        readOnly: true
    }, {
        name: "addCursorBelowSkipCurrent",
        exec: function(editor: Editor) { editor.selectMoreLines(1, true); },
        bindKey: { win: "Ctrl-Alt-Shift-Down", mac: "Ctrl-Alt-Shift-Down" },
        readOnly: true
    }, {
        name: "selectMoreBefore",
        exec: function(editor: Editor) { editor.selectMore(-1); },
        bindKey: { win: "Ctrl-Alt-Left", mac: "Ctrl-Alt-Left" },
        readOnly: true
    }, {
        name: "selectMoreAfter",
        exec: function(editor: Editor) { editor.selectMore(1); },
        bindKey: { win: "Ctrl-Alt-Right", mac: "Ctrl-Alt-Right" },
        readOnly: true
    }, {
        name: "selectNextBefore",
        exec: function(editor: Editor) { editor.selectMore(-1, true); },
        bindKey: { win: "Ctrl-Alt-Shift-Left", mac: "Ctrl-Alt-Shift-Left" },
        readOnly: true
    }, {
        name: "selectNextAfter",
        exec: function(editor: Editor) { editor.selectMore(1, true); },
        bindKey: { win: "Ctrl-Alt-Shift-Right", mac: "Ctrl-Alt-Shift-Right" },
        readOnly: true
    }, {
        name: "splitIntoLines",
        exec: function(editor: Editor) { editor.multiSelect.splitIntoLines(); },
        bindKey: { win: "Ctrl-Alt-L", mac: "Ctrl-Alt-L" },
        readOnly: true
    }, {
        name: "alignCursors",
        exec: function(editor: Editor) { editor.alignCursors(); },
        bindKey: { win: "Ctrl-Alt-A", mac: "Ctrl-Alt-A" }
    }, {
        name: "findAll",
        exec: function(editor: Editor) { editor.findAll(); },
        bindKey: { win: "Ctrl-Alt-K", mac: "Ctrl-Alt-G" },
        readOnly: true
    }];

export default commands;

/*
// commands active only in multiselect mode
exports.multiSelectCommands = [{
    name: "singleSelection",
    bindKey: "esc",
    exec: function(editor) { editor.exitMultiSelectMode(); },
    readonly: true,
    isAvailable: function(editor) {return editor && editor.inMultiSelectMode}
}];

var HashHandler = require("../keyboard/hash_handler").HashHandler;
exports.keyboardHandler = new HashHandler(exports.multiSelectCommands);
*/

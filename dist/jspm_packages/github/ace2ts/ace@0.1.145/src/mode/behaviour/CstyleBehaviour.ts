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

import Behaviour from "../Behaviour";
import TokenIterator from "../../TokenIterator";
import {stringRepeat} from "../../lib/lang";
import Editor from "../../Editor";
import EditSession from "../../EditSession";
import Position from "../../Position";
import Range from "../../Range";
import Token from "../../Token";

var SAFE_INSERT_IN_TOKENS =
    ["text", "paren.rparen", "punctuation.operator"];
var SAFE_INSERT_BEFORE_TOKENS =
    ["text", "paren.rparen", "punctuation.operator", "comment"];

interface BehaviourContext {
    autoInsertedBrackets: number;
    autoInsertedRow: number;
    autoInsertedLineEnd: string;
    maybeInsertedBrackets: number;
    maybeInsertedRow: number;
    maybeInsertedLineStart: string;
    maybeInsertedLineEnd: string;
}

var context: BehaviourContext;
var contextCache: { rangeCount?: number } = {}
var initContext = function(editor: Editor): void {
    var id = -1;
    // FIXME: multiSelect looks like a kind of Selection.
    // rangeCount is a property of Selection.
    if (editor.multiSelect) {
        id = editor.selection['id'];
        if (contextCache.rangeCount != editor.multiSelect.rangeCount) {
            contextCache = { rangeCount: editor.multiSelect.rangeCount };
        }
    }
    if (contextCache[id]) {
        return context = contextCache[id];
    }
    context = contextCache[id] = {
        autoInsertedBrackets: 0,
        autoInsertedRow: -1,
        autoInsertedLineEnd: "",
        maybeInsertedBrackets: 0,
        maybeInsertedRow: -1,
        maybeInsertedLineStart: "",
        maybeInsertedLineEnd: ""
    };
};

/**
 * @class CstyleBehaviour
 * @extends Behaviour
 */
export default class CstyleBehaviour extends Behaviour {

    /**
     * @class CstyleBehaviour
     * @constructor
     */
    constructor() {
        super();
        this.add("braces", "insertion", function(state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] } {
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            if (text === '{') {
                initContext(editor);
                var selection = editor.getSelectionRange();
                var selected = session.doc.getTextRange(selection);
                if (selected !== "" && selected !== "{" && editor.getWrapBehavioursEnabled()) {
                    return {
                        text: '{' + selected + '}',
                        selection: void 0
                    };
                } else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                    if (/[\]\}\)]/.test(line[cursor.column]) || editor.inMultiSelectMode) {
                        CstyleBehaviour.recordAutoInsert(editor, session, "}");
                        return {
                            text: '{}',
                            selection: [1, 1]
                        };
                    } else {
                        CstyleBehaviour.recordMaybeInsert(editor, session, "{");
                        return {
                            text: '{',
                            selection: [1, 1]
                        };
                    }
                }
            }
            else if (text === '}') {
                initContext(editor);
                var rightChar = line.substring(cursor.column, cursor.column + 1);
                if (rightChar === '}') {
                    var matching = session.findOpeningBracket('}', { column: cursor.column + 1, row: cursor.row });
                    if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                        CstyleBehaviour.popAutoInsertedClosing();
                        return { text: '', selection: [1, 1] };
                    }
                }
            }
            else if (text === "\n" || text === "\r\n") {
                initContext(editor);
                var closing = "";
                if (CstyleBehaviour.isMaybeInsertedClosing(cursor, line)) {
                    closing = stringRepeat("}", context.maybeInsertedBrackets);
                    CstyleBehaviour.clearMaybeInsertedClosing();
                }
                var rightChar = line.substring(cursor.column, cursor.column + 1);
                if (rightChar === '}') {
                    var openBracePos = session.findMatchingBracket({ row: cursor.row, column: cursor.column + 1 }, '}');
                    if (!openBracePos)
                        return null;
                    var next_indent = this.$getIndent(session.getLine(openBracePos.row));
                }
                else if (closing) {
                    var next_indent = this.$getIndent(line);
                }
                else {
                    CstyleBehaviour.clearMaybeInsertedClosing();
                    return;
                }
                var indent = next_indent + session.getTabString();

                return {
                    text: '\n' + indent + '\n' + next_indent + closing,
                    selection: [1, indent.length, 1, indent.length]
                };
            } else {
                CstyleBehaviour.clearMaybeInsertedClosing();
            }
        });

        this.add("braces", "deletion", function(state: string, action: string, editor: Editor, session: EditSession, range: Range) {
            var selected: string = session.doc.getTextRange(range);
            if (!range.isMultiLine() && selected === '{') {
                initContext(editor);
                var line = session.doc.getLine(range.start.row);
                var rightChar = line.substring(range.end.column, range.end.column + 1);
                if (rightChar === '}') {
                    range.end.column++;
                    return range;
                }
                else {
                    context.maybeInsertedBrackets--;
                }
            }
        });

        this.add("parens", "insertion", function(state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] } {
            if (text === '(') {
                initContext(editor);
                var selectionRange = editor.getSelectionRange();
                var selected: string = session.doc.getTextRange(selectionRange);
                if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                    return { text: '(' + selected + ')', selection: void 0 };
                }
                else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                    CstyleBehaviour.recordAutoInsert(editor, session, ")");
                    return { text: '()', selection: [1, 1] };
                }
            }
            else if (text === ')') {
                initContext(editor);
                var cursor = editor.getCursorPosition();
                var line = session.doc.getLine(cursor.row);
                var rightChar = line.substring(cursor.column, cursor.column + 1);
                if (rightChar === ')') {
                    var matching = session.findOpeningBracket(')', { column: cursor.column + 1, row: cursor.row });
                    if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                        CstyleBehaviour.popAutoInsertedClosing();
                        return { text: '', selection: [1, 1] };
                    }
                }
            }
        });

        this.add("parens", "deletion", function(state: string, action: string, editor: Editor, session: EditSession, range: Range) {
            var selected: string = session.doc.getTextRange(range);
            if (!range.isMultiLine() && selected === '(') {
                initContext(editor);
                var line = session.doc.getLine(range.start.row);
                var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                if (rightChar === ')') {
                    range.end.column++;
                    return range;
                }
            }
        });

        this.add("brackets", "insertion", function(state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] } {
            if (text === '[') {
                initContext(editor);
                var selectionRange: Range = editor.getSelectionRange();
                var selected: string = session.doc.getTextRange(selectionRange);
                if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                    return { text: '[' + selected + ']', selection: void 0 };
                }
                else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                    CstyleBehaviour.recordAutoInsert(editor, session, "]");
                    return { text: '[]', selection: [1, 1] };
                }
            }
            else if (text === ']') {
                initContext(editor);
                var cursor = editor.getCursorPosition();
                var line = session.doc.getLine(cursor.row);
                var rightChar = line.substring(cursor.column, cursor.column + 1);
                if (rightChar == ']') {
                    var matching = session.findOpeningBracket(']', { column: cursor.column + 1, row: cursor.row });
                    if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                        CstyleBehaviour.popAutoInsertedClosing();
                        return { text: '', selection: [1, 1] };
                    }
                }
            }
        });

        this.add("brackets", "deletion", function(state: string, action: string, editor: Editor, session: EditSession, range: Range): Range {
            var selected: string = session.doc.getTextRange(range);
            if (!range.isMultiLine() && selected === '[') {
                initContext(editor);
                var line = session.doc.getLine(range.start.row);
                var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                if (rightChar === ']') {
                    range.end.column++;
                    return range;
                }
            }
        });

        this.add("string_dquotes", "insertion", function(state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] } {
            if (text === '"' || text === "'") {
                initContext(editor);
                var quote = text;
                var selection = editor.getSelectionRange();
                var selected = session.doc.getTextRange(selection);
                if (selected !== "" && selected !== "'" && selected !== '"' && editor.getWrapBehavioursEnabled()) {
                    return { text: quote + selected + quote, selection: void 0 };
                }
                else {
                    var cursor = editor.getCursorPosition();
                    var line = session.doc.getLine(cursor.row);
                    var leftChar = line.substring(cursor.column - 1, cursor.column);

                    // We're escaped.
                    if (leftChar === '\\') {
                        return null;
                    }

                    // Find what token we're inside.
                    var tokens: Token[] = session.getTokens(selection.start.row);
                    var col = 0;
                    var token: Token;
                    var quotepos = -1; // Track whether we're inside an open quote.

                    for (var x = 0; x < tokens.length; x++) {
                        token = tokens[x];
                        if (token.type === "string") {
                            quotepos = -1;
                        }
                        else if (quotepos < 0) {
                            quotepos = token.value.indexOf(quote);
                        }
                        if ((token.value.length + col) > selection.start.column) {
                            break;
                        }
                        col += tokens[x].value.length;
                    }

                    // Try and be smart about when we auto insert.
                    if (!token || (quotepos < 0 && token.type !== "comment" && (token.type !== "string" || ((selection.start.column !== token.value.length + col - 1) && token.value.lastIndexOf(quote) === token.value.length - 1)))) {
                        if (!CstyleBehaviour.isSaneInsertion(editor, session))
                            return;
                        return { text: quote + quote, selection: [1, 1] };
                    }
                    else if (token && token.type === "string") {
                        // Ignore input and move right one if we're typing over the closing quote.
                        var rightChar = line.substring(cursor.column, cursor.column + 1);
                        if (rightChar == quote) {
                            return { text: '', selection: [1, 1] };
                        }
                    }
                }
            }
        });

        this.add("string_dquotes", "deletion", function(state: string, action: string, editor: Editor, session: EditSession, range: Range) {
            var selected: string = session.doc.getTextRange(range);
            if (!range.isMultiLine() && (selected === '"' || selected === "'")) {
                initContext(editor);
                var line = session.doc.getLine(range.start.row);
                var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                if (rightChar == selected) {
                    range.end.column++;
                    return range;
                }
            }
        });
    }
    static isSaneInsertion(editor: Editor, session: EditSession): boolean {
        var cursor = editor.getCursorPosition();
        var iterator = new TokenIterator(session, cursor.row, cursor.column);
    
        // Don't insert in the middle of a keyword/identifier/lexical.
        if (!this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) {
            // Look ahead in case we're at the end of a token.
            var iterator2 = new TokenIterator(session, cursor.row, cursor.column + 1);
            if (!this.$matchTokenType(iterator2.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) {
                return false;
            }
        }
    
        // Only insert in front of whitespace/comments.
        iterator.stepForward();
        return iterator.getCurrentTokenRow() !== cursor.row ||
            this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_BEFORE_TOKENS);
    }

    static $matchTokenType(token: Token | string, types: string[]): boolean {
        if (typeof token === 'string') {
            return types.indexOf(token) > -1;
        }
        else {
            return types.indexOf(token.type) > -1;
        }
    }

    static recordAutoInsert(editor: Editor, session: EditSession, bracket: string): void {
        var cursor = editor.getCursorPosition();
        var line = session.doc.getLine(cursor.row);
        // Reset previous state if text or context changed too much.
        if (!this.isAutoInsertedClosing(cursor, line, context.autoInsertedLineEnd[0])) {
            context.autoInsertedBrackets = 0;
        }
        context.autoInsertedRow = cursor.row;
        context.autoInsertedLineEnd = bracket + line.substr(cursor.column);
        context.autoInsertedBrackets++;
    }

    static recordMaybeInsert(editor: Editor, session: EditSession, bracket: string): void {
        var cursor = editor.getCursorPosition();
        var line = session.doc.getLine(cursor.row);
        if (!this.isMaybeInsertedClosing(cursor, line)) {
            context.maybeInsertedBrackets = 0;
        }
        context.maybeInsertedRow = cursor.row;
        context.maybeInsertedLineStart = line.substr(0, cursor.column) + bracket;
        context.maybeInsertedLineEnd = line.substr(cursor.column);
        context.maybeInsertedBrackets++;
    }

    static isAutoInsertedClosing(cursor: Position, line: string, bracket: string): boolean {
        return context.autoInsertedBrackets > 0 &&
            cursor.row === context.autoInsertedRow &&
            bracket === context.autoInsertedLineEnd[0] &&
            line.substr(cursor.column) === context.autoInsertedLineEnd;
    }

    static isMaybeInsertedClosing(cursor: Position, line: string): boolean {
        return context.maybeInsertedBrackets > 0 &&
            cursor.row === context.maybeInsertedRow &&
            line.substr(cursor.column) === context.maybeInsertedLineEnd &&
            line.substr(0, cursor.column) == context.maybeInsertedLineStart;
    }

    static popAutoInsertedClosing(): void {
        context.autoInsertedLineEnd = context.autoInsertedLineEnd.substr(1);
        context.autoInsertedBrackets--;
    }

    static clearMaybeInsertedClosing(): void {
        if (context) {
            context.maybeInsertedBrackets = 0;
            context.maybeInsertedRow = -1;
        }
    }
}


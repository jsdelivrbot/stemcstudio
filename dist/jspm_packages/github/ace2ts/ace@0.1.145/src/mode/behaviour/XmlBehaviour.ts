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
import Editor from "../../Editor";
import EditSession from "../../EditSession";
import Range from "../../Range";
import Token from "../../Token";

function is(token: Token, type: string): boolean {
    return token.type.lastIndexOf(type + ".xml") > -1;
}

/**
 * @class XmlBehaviour
 * @extends Behaviour
 */
export default class XmlBehaviour extends Behaviour {

    /**
     * @class XmlBehaviour
     * @constructor
     */
    constructor() {
        super();

        this.add("string_dquotes", "insertion", function(state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] } {
            if (text === '"' || text === "'") {
                var quote = text;
                var selected = session.doc.getTextRange(editor.getSelectionRange());
                if (selected !== "" && selected !== "'" && selected !== '"' && editor.getWrapBehavioursEnabled()) {
                    return {
                        text: quote + selected + quote,
                        selection: void 0
                    };
                }

                var cursor = editor.getCursorPosition();
                var line = session.doc.getLine(cursor.row);
                var rightChar = line.substring(cursor.column, cursor.column + 1);
                var iterator = new TokenIterator(session, cursor.row, cursor.column);
                var token = iterator.getCurrentToken();

                if (rightChar === quote && (is(token, "attribute-value") || is(token, "string"))) {
                    // Ignore input and move right one if we're typing over the closing quote.
                    return {
                        text: "",
                        selection: [1, 1]
                    };
                }

                if (!token)
                    token = iterator.stepBackward();

                if (!token)
                    return;

                while (is(token, "tag-whitespace") || is(token, "whitespace")) {
                    token = iterator.stepBackward();
                }
                var rightSpace = !rightChar || rightChar.match(/\s/);
                if (is(token, "attribute-equals") && (rightSpace || rightChar === '>') || (is(token, "decl-attribute-equals") && (rightSpace || rightChar == '?'))) {
                    return {
                        text: quote + quote,
                        selection: [1, 1]
                    };
                }
            }
        });

        this.add("string_dquotes", "deletion", function(state: string, action: string, editor: Editor, session: EditSession, range: Range): Range {
            var selected: string = session.doc.getTextRange(range);
            if (!range.isMultiLine() && (selected === '"' || selected === "'")) {
                var line = session.doc.getLine(range.start.row);
                var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                if (rightChar == selected) {
                    range.end.column++;
                    return range;
                }
            }
        });

        this.add("autoclosing", "insertion", function(state: string, action: string, editor: Editor, session: EditSession, text: string) {
            if (text === '>') {
                var position = editor.getCursorPosition();
                var iterator = new TokenIterator(session, position.row, position.column);
                var token = iterator.getCurrentToken() || iterator.stepBackward();

                // exit if we're not in a tag
                if (!token || !(is(token, "tag-name") || is(token, "tag-whitespace") || is(token, "attribute-name") || is(token, "attribute-equals") || is(token, "attribute-value")))
                    return;

                // exit if we're inside of a quoted attribute value
                if (is(token, "reference.attribute-value"))
                    return;
                if (is(token, "attribute-value")) {
                    var firstChar = token.value.charAt(0);
                    if (firstChar == '"' || firstChar == "'") {
                        var lastChar = token.value.charAt(token.value.length - 1);
                        var tokenEnd = iterator.getCurrentTokenColumn() + token.value.length;
                        if (tokenEnd > position.column || tokenEnd == position.column && firstChar != lastChar)
                            return;
                    }
                }

                // find tag name
                while (!is(token, "tag-name")) {
                    token = iterator.stepBackward();
                }

                var tokenRow = iterator.getCurrentTokenRow();
                var tokenColumn = iterator.getCurrentTokenColumn();

                // exit if the tag is ending
                if (is(iterator.stepBackward(), "end-tag-open"))
                    return;

                var element = token.value;
                if (tokenRow == position.row)
                    element = element.substring(0, position.column - tokenColumn);

                if (this.voidElements.hasOwnProperty(element.toLowerCase()))
                    return;

                return {
                    text: '>' + '</' + element + '>',
                    selection: [1, 1]
                };
            }
        });

        this.add('autoindent', 'insertion', function(state, action, editor: Editor, session: EditSession, text: string) {
            if (text === "\n") {
                var cursor = editor.getCursorPosition();
                var line = session.getLine(cursor.row);
                var rightChars = line.substring(cursor.column, cursor.column + 2);
                if (rightChars == '</') {
                    var next_indent = this.$getIndent(line);
                    var indent = next_indent + session.getTabString();
                    return {
                        text: '\n' + indent + '\n' + next_indent,
                        selection: [1, indent.length, 1, indent.length]
                    };
                }
            }
        });
    }
}

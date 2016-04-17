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

import Behaviour from '../Behaviour';
import CstyleBehaviour from './CstyleBehaviour';
import XmlBehaviour from "../behaviour/XmlBehaviour";
import TokenIterator from "../../TokenIterator";
import Editor from "../../Editor";
import EditSession from "../../EditSession";

function hasType(token: { type: string }, type: string) {
    var hasType = true;
    var typeList = token.type.split('.');
    var needleList = type.split('.');
    needleList.forEach(function(needle) {
        if (typeList.indexOf(needle) === -1) {
            hasType = false;
            return false;
        }
    });
    return hasType;
}

export default class XQueryBehaviour extends Behaviour {
    constructor() {
        super();
        this.inherit(new CstyleBehaviour(), ["braces", "parens", "string_dquotes"]);
        this.inherit(new XmlBehaviour());

        this.add("autoclosing", "insertion", function(state, action, editor: Editor, session: EditSession, text: string) {
            if (text === '>') {
                var position = editor.getCursorPosition();
                var iterator = new TokenIterator(session, position.row, position.column);
                var token = iterator.getCurrentToken();
                var atCursor = false;
                var state = JSON.parse(state).pop();
                if ((token && token.value === '>') || state !== "StartTag") return;
                if (!token || !hasType(token, 'meta.tag') && !(hasType(token, 'text') && token.value.match('/'))) {
                    do {
                        token = iterator.stepBackward();
                    } while (token && (hasType(token, 'string') || hasType(token, 'keyword.operator') || hasType(token, 'entity.attribute-name') || hasType(token, 'text')));
                } else {
                    atCursor = true;
                }
                var previous = iterator.stepBackward();
                if (!token || !hasType(token, 'meta.tag') || (previous !== null && previous.value.match('/'))) {
                    return
                }
                var tag = token.value.substring(1);
                if (atCursor) {
                    var tag = tag.substring(0, position.column - token.start);
                }

                return {
                    text: '>' + '</' + tag + '>',
                    selection: [1, 1]
                }
            }
        });
    }
}

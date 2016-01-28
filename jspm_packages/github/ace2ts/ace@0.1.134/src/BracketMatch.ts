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

import TokenIterator from "./TokenIterator";
import EditSession from "./EditSession";
import Position from "./Position";
import Range from "./Range";

/**
 * Maps an opening(closing) bracket string to the corresponding closing(opening) bracket.
 */
var $brackets: { [bracket: string]: string } = {
    ")": "(",
    "(": ")",
    "]": "[",
    "[": "]",
    "{": "}",
    "}": "{"
};

/**
 * @class BracketMatch
 */
export default class BracketMatch {

    /**
     * @property editSession
     * @type EditSession
     * @private
     */
    private editSession: EditSession;

    /**
     * @class BracketMatch
     * @constructor
     * @param editSession {EditSession}
     */
    constructor(editSession: EditSession) {
        this.editSession = editSession;
    }

    findMatchingBracket(position: Position, chr: string): Position {
        if (position.column === 0) return null;

        var charBeforeCursor: string = chr || this.editSession.getLine(position.row).charAt(position.column - 1);
        if (charBeforeCursor === "") return null;

        var match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
        if (!match)
            return null;

        if (match[1])
            return this.findClosingBracket(match[1], position);
        else
            return this.findOpeningBracket(match[2], position);
    }

    getBracketRange(pos: Position): Range {
        var line = this.editSession.getLine(pos.row);
        var before = true;
        var range: Range;

        var chr = line.charAt(pos.column - 1);
        var match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
        if (!match) {
            chr = line.charAt(pos.column);
            pos = { row: pos.row, column: pos.column + 1 };
            match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
            before = false;
        }
        if (!match)
            return null;

        if (match[1]) {
            var closingPos = this.findClosingBracket(match[1], pos);
            if (!closingPos)
                return null;
            range = Range.fromPoints(pos, closingPos);
            if (!before) {
                range.end.column++;
                range.start.column--;
            }
            range.cursor = range.end;
        }
        else {
            var openingPos = this.findOpeningBracket(match[2], pos);
            if (!openingPos)
                return null;
            range = Range.fromPoints(openingPos, pos);
            if (!before) {
                range.start.column++;
                range.end.column--;
            }
            range.cursor = range.start;
        }

        return range;
    }

    findOpeningBracket(bracket: string, position: Position, typeRe?: RegExp): Position {
        var openBracket = $brackets[bracket];
        var depth = 1;

        var iterator = new TokenIterator(this.editSession, position.row, position.column);
        var token = iterator.getCurrentToken();
        if (!token)
            token = iterator.stepForward();
        if (!token)
            return;

        if (!typeRe) {
            typeRe = new RegExp("(\\.?" + token.type.replace(".", "\\.").replace("rparen", ".paren").replace(/\b(?:end|start|begin)\b/, "") + ")+");
        }

        // Start searching in token, just before the character at position.column
        var valueIndex = position.column - iterator.getCurrentTokenColumn() - 2;
        var value = token.value;

        while (true) {
            while (valueIndex >= 0) {
                var chr = value.charAt(valueIndex);
                if (chr === openBracket) {
                    depth -= 1;
                    if (depth === 0) {
                        return {
                            row: iterator.getCurrentTokenRow(),
                            column: valueIndex + iterator.getCurrentTokenColumn()
                        };
                    }
                }
                else if (chr === bracket) {
                    depth += 1;
                }
                valueIndex -= 1;
            }

            // Scan backward through the document, looking for the next token
            // whose type matches typeRe
            do {
                token = iterator.stepBackward();
            } while (token && !typeRe.test(token.type));

            if (token === null)
                break;

            value = token.value;
            valueIndex = value.length - 1;
        }

        return null;
    }

    findClosingBracket(bracket: string, position: Position, typeRe?: RegExp): Position {
        var closingBracket = $brackets[bracket];
        var depth = 1;

        var iterator = new TokenIterator(this.editSession, position.row, position.column);
        var token = iterator.getCurrentToken();
        if (!token)
            token = iterator.stepForward();

        if (!token)
            return;

        if (!typeRe) {
            typeRe = new RegExp("(\\.?" + token.type.replace(".", "\\.").replace("lparen", ".paren").replace(/\b(?:end|start|begin)\b/, "") + ")+");
        }

        // Start searching in token, after the character at position.column
        var valueIndex = position.column - iterator.getCurrentTokenColumn();

        while (true) {

            var value = token.value;
            var valueLength = value.length;
            while (valueIndex < valueLength) {
                var chr = value.charAt(valueIndex);
                if (chr === closingBracket) {
                    depth -= 1;
                    if (depth === 0) {
                        return {
                            row: iterator.getCurrentTokenRow(),
                            column: valueIndex + iterator.getCurrentTokenColumn()
                        };
                    }
                }
                else if (chr === bracket) {
                    depth += 1;
                }
                valueIndex += 1;
            }

            // Scan forward through the document, looking for the next token
            // whose type matches typeRe
            do {
                token = iterator.stepForward();
            } while (token && !typeRe.test(token.type));

            if (token === null)
                break;

            valueIndex = 0;
        }

        return null;
    }
}

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
 * Copyright (c) 2012, Ajax.org B.V.
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

import Completer from './Completer';
import Completion from '../Completion';
import EditSession from '../EditSession';
import Editor from '../Editor';
import Position from "../Position";
import Range from "../Range";

/**
 * A map from the word (string) to score (number).
 */
interface WordScores {
    [word: string]: number;
}

/**
 * Does a distance analysis of the word at the specified position.
 */
function wordDistance(position: Position, session: EditSession): WordScores {
    const splitRegex: RegExp = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;

    function getWordIndex(): number {
        const textBefore = session.getTextRange(Range.fromPoints({ row: 0, column: 0 }, position));
        return textBefore.split(splitRegex).length - 1;
    }

    const prefixPos: number = getWordIndex();
    const words: string[] = session.getValue().split(splitRegex);
    const wordScores: WordScores = Object.create(null);

    const currentWord: string = words[prefixPos];

    words.forEach(function (word: string, index: number) {
        if (!word || word === currentWord) return;

        const distance = Math.abs(prefixPos - index);
        const score = words.length - distance;
        if (wordScores[word]) {
            wordScores[word] = Math.max(score, wordScores[word]);
        }
        else {
            wordScores[word] = score;
        }
    });
    return wordScores;
}

/**
 * Provides completions based upon nearby words.
 */
export default class TextCompleter implements Completer {

    getCompletionsAtPosition(editor: Editor, position: Position, prefix: string): Promise<Completion[]> {

        const session = editor.getSession();

        return new Promise<Completion[]>(function (resolve, reject) {

            const wordScore: WordScores = wordDistance(position, session);

            const wordList: string[] = Object.keys(wordScore);

            resolve(wordList.map(function (word: string) {
                return {
                    caption: word,
                    value: word,
                    score: wordScore[word],
                    meta: "local"
                };
            }));

        });
    }

    getCompletions(editor: Editor, position: Position, prefix: string, callback: (err: any, completions?: Completion[]) => void): void {
        this.getCompletionsAtPosition(editor, position, prefix)
            .then(function (completions) {
                callback(void 0, completions);
            })
            .catch(function (err) {
                callback(err);
            });
    }
}


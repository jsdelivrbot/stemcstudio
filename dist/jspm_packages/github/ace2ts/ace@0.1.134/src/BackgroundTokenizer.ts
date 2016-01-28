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

import Delta from './Delta';
import EditSession from './EditSession';
import EventBus from './EventBus';
import Document from './Document';
import EventEmitterClass from "./lib/EventEmitterClass";
import FirstAndLast from "./FirstAndLast";
import Tokenizer from './Tokenizer';
import Token from './Token';

/**
 * Tokenizes an Document in the background, and caches the tokenized rows for future use. 
 * 
 * If a certain row is changed, everything below that row is re-tokenized.
 *
 * @class BackgroundTokenizer
 */
export default class BackgroundTokenizer implements EventBus<BackgroundTokenizer> {
    /**
     * This is the value returned by setTimeout, so it's really a timer handle.
     * There are some conditionals looking for a falsey value, so we use zero where needed.
     * @property running
     * @type number
     * @private
     */
    private running: number = 0;
    private lines: Token[][] = [];
    private states: string[] = [];
    private currentLine: number = 0;
    private tokenizer: Tokenizer;
    private doc: Document;
    private $worker: () => void;
    private eventBus: EventEmitterClass<BackgroundTokenizer>;

    /**
     * Creates a new `BackgroundTokenizer` object.
     *
     * @class BackgroundTokenizer
     * @constructor
     * @param tokenizer {Tokenizer} The tokenizer to use.
     * @param session {EditSession}
     */
    constructor(tokenizer: Tokenizer, session: EditSession) {
        this.eventBus = new EventEmitterClass<BackgroundTokenizer>(this);
        this.tokenizer = tokenizer;

        var self = this;

        this.$worker = function() {
            if (!self.running) { return; }

            var workerStart = new Date();
            var currentLine = self.currentLine;
            var endLine = -1;
            var doc = self.doc;

            while (self.lines[currentLine]) {
                currentLine++;
            }

            var startLine = currentLine;

            var len = doc.getLength();
            var processedLines = 0;
            self.running = 0;
            while (currentLine < len) {
                self.tokenizeRow(currentLine);
                endLine = currentLine;
                do {
                    currentLine++;
                } while (self.lines[currentLine]);

                // Only check every 5 lines.
                processedLines++;
                if ((processedLines % 5 === 0) && (new Date().getTime() - workerStart.getTime()) > 20) {
                    self.running = setTimeout(self.$worker, 20);
                    break;
                }
            }
            self.currentLine = currentLine;

            if (startLine <= endLine) {
                self.fireUpdateEvent(startLine, endLine);
            }
        };
    }

    /**
     * Emits the `'update'` event.
     * `firstRow` and `lastRow` are used to define the boundaries of the region to be updated.
     *
     * @method fireUpdateEvent
     * @param firstRow {number} The starting row region.
     * @param lastRow {number} The final row region.
     * @return {void}
     */
    public fireUpdateEvent(firstRow: number, lastRow: number): void {
        var data: FirstAndLast = { first: firstRow, last: lastRow };
        /**
         * Fires whenever the background tokeniziers between a range of rows are going to be updated.
         *
         * @event update
         * @param {data: FirstAndLast}
         */
        // TODO: FirstAndlastEvent interface.
        this.eventBus._signal("update", { data: data });
    }

    /**
     * @method on
     * @param eventName {string}
     * @param callback {(event, source: BackgroundTokenizer) => any}
     * @return {void}
     */
    on(eventName: string, callback: (event: any, source: BackgroundTokenizer) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    /**
     * @method off
     * @param eventName {string}
     * @param callback {(event, source: BackgroundTokenizer) => any}
     * @return {void}
     */
    off(eventName: string, callback: (event: any, source: BackgroundTokenizer) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * Returns the state of tokenization at the end of a row.
     *
     * @method getState
     * @param row {number} The row to get state at.
     * @return {string}
     */
    getState(row: number): string {
        if (this.currentLine === row) {
            this.tokenizeRow(row);
        }
        return this.states[row] || "start";
    }

    /**
     * Gives list of tokens of the row. (tokens are cached).
     *
     * @method getTokens
     * @param row {number} The row to get tokens at.
     * @return {Token[]}
     */
    getTokens(row: number): Token[] {
        return this.lines[row] || this.tokenizeRow(row);
    }

    /**
     * Sets a new document to associate with this object.
     *
     * @method setDocument
     * @param doc {Document} The new document to associate with.
     * @return {void}
     */
    setDocument(doc: Document): void {
        this.doc = doc;
        this.lines = [];
        this.states = [];

        // TODO: Why do we stop? What is the lifecycle? Documentation!
        this.stop();
    }

    /**
     * Sets a new tokenizer for this object.
     *
     * @method setTokenizer
     * @param tokenizer {Tokenizer} The new tokenizer to use.
     * @return {void}
     */
    setTokenizer(tokenizer: Tokenizer): void {
        // TODO: Why don't we stop first?
        this.tokenizer = tokenizer;
        this.lines = [];
        this.states = [];

        // Start at row zero.
        this.start(0);
    }

    /**
     * Starts tokenizing at the row indicated.
     *
     * @method start
     * @param startRow {number} The row to start at.
     * @return {void}
     */
    start(startRow: number): void {
        this.currentLine = Math.min(startRow || 0, this.currentLine, this.doc.getLength());

        // Remove all cached items below this line.
        this.lines.splice(this.currentLine, this.lines.length);
        this.states.splice(this.currentLine, this.states.length);

        this.stop();
        // Pretty long delay to prevent the tokenizer from interfering with the user.
        this.running = setTimeout(this.$worker, 700);
    }

    /**
     * Stops tokenizing.
     *
     * @method stop
     * @return {void}
     */
    stop(): void {
        if (this.running) {
            clearTimeout(this.running);
        }
        this.running = 0;
    }

    /**
     * @method scheduleStart
     * @return {void}
     */
    public scheduleStart(): void {
        if (!this.running) {
            this.running = setTimeout(this.$worker, 700);
        }
    }

    /**
     * @method updateOnChange
     * @param delta {Delta}
     * @return {void}
     */
    public updateOnChange(delta: Delta): void {
        var startRow = delta.start.row;
        var len = delta.end.row - startRow;

        if (len === 0) {
            this.lines[startRow] = null;
        }
        else if (delta.action === "remove") {
            this.lines.splice(startRow, len + 1, null);
            this.states.splice(startRow, len + 1, null);
        }
        else {
            var args = Array(len + 1);
            args.unshift(startRow, 1);
            this.lines.splice.apply(this.lines, args);
            this.states.splice.apply(this.states, args);
        }

        this.currentLine = Math.min(startRow, this.currentLine, this.doc.getLength());

        this.stop();
    }

    /**
     * @method tokenizeRow
     * @param row {number}
     * @return {Token[]}
     */
    public tokenizeRow(row: number): Token[] {
        var line: string = this.doc.getLine(row);
        var state = this.states[row - 1];

        var data: { state: any; tokens: Token[] } = this.tokenizer.getLineTokens(line, state);

        if (this.states[row] + "" !== data.state + "") {
            this.states[row] = data.state;
            this.lines[row + 1] = null;
            if (this.currentLine > row + 1) {
                this.currentLine = row + 1;
            }
        }
        else if (this.currentLine === row) {
            this.currentLine = row + 1;
        }

        return this.lines[row] = data.tokens;
    }
}

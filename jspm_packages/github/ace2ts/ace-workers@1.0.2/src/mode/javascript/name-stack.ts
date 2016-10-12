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
"use strict";

export default class NameStack {
    _stack: any[];
    constructor() {
        this._stack = [];
    }

    get length() {
        return this._stack.length;
    }

    /**
     * Create a new entry in the stack. Useful for tracking names across
     * expressions.
     */
    push() {
        this._stack.push(null);
    }

    /**
     * Discard the most recently-created name on the stack.
     */
    pop = function() {
        this._stack.pop();
    }

    /**
     * Update the most recent name on the top of the stack.
     *
     * @param {object} token The token to consider as the source for the most
     *                       recent name.
     */
    set(token) {
        this._stack[this.length - 1] = token;
    }

    /**
     * Generate a string representation of the most recent name.
     *
     * @returns {string}
     */
    infer(): string {
        var nameToken = this._stack[this.length - 1];
        var prefix = "";
        var type;

        // During expected operation, the topmost entry on the stack will only
        // reflect the current function's name when the function is declared without
        // the `function` keyword (i.e. for in-line accessor methods). In other
        // cases, the `function` expression itself will introduce an empty entry on
        // the top of the stack, and this should be ignored.
        if (!nameToken || nameToken.type === "class") {
            nameToken = this._stack[this.length - 2];
        }

        if (!nameToken) {
            return "(empty)";
        }

        type = nameToken.type;

        if (type !== "(string)" && type !== "(number)" && type !== "(identifier)" && type !== "default") {
            return "(expression)";
        }

        if (nameToken.accessorType) {
            prefix = nameToken.accessorType + " ";
        }

        return prefix + nameToken.value;
    }
}

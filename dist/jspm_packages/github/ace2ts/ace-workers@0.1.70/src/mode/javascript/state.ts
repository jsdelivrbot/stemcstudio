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
import NameStack from "./name-stack";
import JSHintOptions from "./JSHintOptions";

export var state: {
    option: JSHintOptions;
    cache: {};
    condition: boolean;
    directive: {};
    funct;
    ignored: { [line: string]: boolean };
    tab: string;
    lines: string[];
    syntax: { [name: string]: any };
    forinifcheckneeded: boolean;
    forinifchecks: any[];
    isStrict: () => boolean;
    inMoz: () => boolean;
    inES6: (strict?: boolean) => boolean;
    inES5: (strict?: boolean) => boolean;
    inClassBody: boolean;
    ignoredLines: { [line: string]: boolean },
    jsonMode: boolean;
    nameStack: NameStack;
    reset: () => void;
    tokens: { prev; next; curr };
} = {
        option: {},
        cache: {},
        condition: void 0,
        directive: {},
        forinifcheckneeded: false,
        forinifchecks: void 0,
        funct: null,
        ignored: {},
        tab: "",
        lines: [],
        syntax: {},
        jsonMode: false,
        nameStack: new NameStack(),
        tokens: { prev: null, next: null, curr: null },
        inClassBody: false,
        ignoredLines: {},

        /**
         * Determine if the code currently being linted is strict mode code.
         */
        isStrict: function(): boolean {
            return this.directive["use strict"] || this.inClassBody ||
                this.option.module || this.option.strict === "implied";
        },

        // Assumption: chronologically ES3 < ES5 < ES6 < Moz

        inMoz: function() {
            return this.option.moz;
        },

        /**
         * @param {boolean} strict - When `true`, only consider ES6 when in
         *                           "esversion: 6" code.
         */
        inES6: function(strict?: boolean) {
            if (strict) {
                return this.option.esversion === 6;
            }
            return this.option.moz || this.option.esversion >= 6;
        },

        /**
         * @param {boolean} strict - When `true`, return `true` only when
         *                           esversion is exactly 5
         */
        inES5: function(strict?: boolean) {
            if (strict) {
                return (!this.option.esversion || this.option.esversion === 5) && !this.option.moz;
            }
            return !this.option.esversion || this.option.esversion >= 5 || this.option.moz;
        },


        reset: function() {
            this.tokens = {
                prev: null,
                next: null,
                curr: null
            };

            this.option = {};
            this.funct = null;
            this.ignored = {};
            this.directive = {};
            this.jsonMode = false;
            this.jsonWarnings = [];
            this.lines = [];
            this.tab = "";
            this.cache = {}; // Node.JS doesn't have Map. Sniff.
            this.ignoredLines = {};
            this.forinifcheckneeded = false;
            this.nameStack = new NameStack();
            this.inClassBody = false;
        }
    };

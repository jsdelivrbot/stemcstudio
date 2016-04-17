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

import Rule from "./Rule";
import TokenizedLine from './TokenizedLine';
import Token from './Token';

// tokenizing lines longer than this makes editor very slow
var MAX_TOKEN_COUNT = 1000;

/**
 * This class takes a set of highlighting rules, and creates a tokenizer out of them. For more information, see [the wiki on extending highlighters](https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#wiki-extendingTheHighlighter).
 * @class Tokenizer
 */
export default class Tokenizer {
    // Mode wants access to the states (rules)
    public states: { [name: string]: Rule[] };
    private regExps: { [state: string]: RegExp };
    private matchMappings: { [name: string]: { defaultToken: string } };
    private tokenArray;
    private splitRegex: RegExp;
    private token;

    /**
     * Constructs a new tokenizer based on the given rules and flags.
     *
     * @class Tokenizer
     * @constructor
     * @param {Object} rules The highlighting rules
     */
    constructor(rules: { [name: string]: Rule[] }) {
        this.states = rules;

        this.regExps = {};
        this.matchMappings = {};
        // const keys: string[] = Object.keys(this.states)
        for (var key in this.states) {
            var state = this.states[key];
            var ruleRegExps = [];
            var matchTotal = 0;
            var mapping = this.matchMappings[key] = { defaultToken: "text" };
            var flag = "g";

            var splitterRules: Rule[] = [];
            for (var i = 0; i < state.length; i++) {

                var rule = state[i];

                if (rule.defaultToken)
                    mapping.defaultToken = rule.defaultToken;

                if (rule.caseInsensitive)
                    flag = "gi";

                if (rule.regex == null)
                    continue;

                if (rule.regex instanceof RegExp)
                    rule.regex = rule.regex.toString().slice(1, -1);

                // Count number of matching groups. 2 extra groups from the full match
                // And the catch-all on the end (used to force a match);
                var adjustedregex = rule.regex;
                var matchcount = new RegExp("(?:(" + adjustedregex + ")|(.))").exec("a").length - 2;
                if (Array.isArray(rule.token)) {
                    if (rule.token.length == 1 || matchcount == 1) {
                        rule.token = rule.token[0];
                    }
                    else if (matchcount - 1 != rule.token.length) {
                        throw new Error("number of classes and regexp groups in '" +
                            rule.token + "'\n'" + rule.regex + "' doesn't match\n"
                            + (matchcount - 1) + "!=" + rule.token.length);
                    }
                    else {
                        rule.tokenArray = rule.token;
                        rule.token = null;
                        rule.onMatch = this.$arrayTokens;
                    }
                }
                else if (typeof rule.token === "function" && !rule.onMatch) {
                    if (matchcount > 1) {
                        rule.onMatch = this.$applyToken;
                    }
                    else {
                        // FIXME: Need to define Rule.token to be string or function.
                        rule.onMatch = <any>rule.token;
                    }
                }

                if (matchcount > 1) {
                    if (/\\\d/.test(rule.regex)) {
                        // Replace any backreferences and offset appropriately.
                        adjustedregex = rule.regex.replace(/\\([0-9]+)/g, function(match, digit) {
                            return "\\" + (parseInt(digit, 10) + matchTotal + 1);
                        });
                    }
                    else {
                        matchcount = 1;
                        adjustedregex = this.removeCapturingGroups(rule.regex);
                    }
                    if (!rule.splitRegex && typeof rule.token != "string")
                        splitterRules.push(rule); // flag will be known only at the very end
                }

                mapping[matchTotal] = i;
                matchTotal += matchcount;

                ruleRegExps.push(adjustedregex);

                // makes property access faster
                if (!rule.onMatch)
                    rule.onMatch = null;
            }

            if (!ruleRegExps.length) {
                mapping[0] = 0;
                ruleRegExps.push("$");
            }

            splitterRules.forEach((rule: Rule) => {
                rule.splitRegex = this.createSplitterRegexp(rule.regex, flag);
            });

            this.regExps[key] = new RegExp("(" + ruleRegExps.join(")|(") + ")|($)", flag);
        }
    }

    private $setMaxTokenCount(m) {
        MAX_TOKEN_COUNT = m | 0;
    }

    private $applyToken(str: string): Token[] {
        var values: string[] = this.splitRegex.exec(str).slice(1);
        var types: string | string[] = this.token.apply(this, values);

        // required for compatibility with legacy? modes
        if (typeof types === "string") {
            return [{ type: types, value: str }];
        }

        var tokens: Token[] = [];
        for (var i = 0, l = types.length; i < l; i++) {
            if (values[i])
                tokens[tokens.length] = {
                    type: types[i],
                    value: values[i]
                };
        }
        return tokens;
    }

    private $arrayTokens(str: string): string | Token[] {
        if (!str) {
            return [];
        }
        var values = this.splitRegex.exec(str);
        if (!values)
            return "text";
        var tokens: Token[] = [];
        var types = this.tokenArray;
        for (var i = 0, l = types.length; i < l; i++) {
            if (values[i + 1])
                tokens[tokens.length] = {
                    type: types[i],
                    value: values[i + 1]
                };
        }
        return tokens;
    }

    private removeCapturingGroups(src: string): string {
        var r = src.replace(
            /\[(?:\\.|[^\]])*?\]|\\.|\(\?[:=!]|(\()/g,
            function(x, y) { return y ? "(?:" : x; }
        );
        return r;
    }

    private createSplitterRegexp(src: string, flag?: string): RegExp {
        if (src.indexOf("(?=") != -1) {
            var stack = 0;
            var inChClass = false;
            var lastCapture: any = {};
            src.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function(
                m, esc, parenOpen, parenClose, square, index
            ) {
                if (inChClass) {
                    inChClass = square != "]";
                } else if (square) {
                    inChClass = true;
                } else if (parenClose) {
                    if (stack == lastCapture.stack) {
                        lastCapture.end = index + 1;
                        lastCapture.stack = -1;
                    }
                    stack--;
                } else if (parenOpen) {
                    stack++;
                    if (parenOpen.length != 1) {
                        lastCapture.stack = stack
                        lastCapture.start = index;
                    }
                }
                return m;
            });

            if (lastCapture.end != null && /^\)*$/.test(src.substr(lastCapture.end)))
                src = src.substring(0, lastCapture.start) + src.substr(lastCapture.end);
        }
        return new RegExp(src, (flag || "").replace("g", ""));
    }

    /**
     * Returns an object containing two properties:
     * `tokens: Token[]`, which contains all the tokens; and `state: string`, the current state.
     *
     * @method getLineTokens
     * @return {TokenizedLine}
     */
    public getLineTokens(line: string, startState: string): TokenizedLine {
        var stack: any[];
        if (startState && typeof startState !== 'string') {
            stack = <any>startState.slice(0);
            startState = stack[0];
            if (startState === '#tmp') {
                stack.shift()
                startState = stack.shift()
            }
        }
        else {
            stack = [];
        }

        var currentState: string = startState || "start";
        var state = this.states[currentState];
        if (!state) {
            currentState = "start";
            state = this.states[currentState];
        }
        var mapping = this.matchMappings[currentState];
        var re = this.regExps[currentState];
        re.lastIndex = 0;

        var match: RegExpExecArray;
        var tokens: Token[] = [];
        var lastIndex = 0;

        var token: Token = { type: null, value: "" };

        while (match = re.exec(line)) {
            var type: any = mapping.defaultToken;
            var rule: Rule = null;
            var value = match[0];
            var index = re.lastIndex;

            if (index - value.length > lastIndex) {
                var skipped = line.substring(lastIndex, index - value.length);
                if (token.type == type) {
                    token.value += skipped;
                } else {
                    if (token.type)
                        tokens.push(token);
                    token = { type: type, value: skipped };
                }
            }

            for (var i = 0; i < match.length - 2; i++) {
                if (match[i + 1] === undefined)
                    continue;

                rule = state[mapping[i]];

                if (rule.onMatch)
                    type = rule.onMatch(value, currentState, stack);
                else
                    type = rule.token;

                if (rule.next) {
                    if (typeof rule.next === 'string') {
                        currentState = rule.next;
                    }
                    else {
                        currentState = (<any>rule.next)(currentState, stack);
                    }

                    state = this.states[currentState];
                    if (!state) {
                        currentState = "start";
                        state = this.states[currentState];
                    }
                    mapping = this.matchMappings[currentState];
                    lastIndex = index;
                    re = this.regExps[currentState];
                    re.lastIndex = index;
                }
                break;
            }

            if (value) {
                if (typeof type == "string") {
                    if ((!rule || rule.merge !== false) && token.type === type) {
                        token.value += value;
                    }
                    else {
                        if (token.type)
                            tokens.push(token);
                        token = { type: type, value: value };
                    }
                }
                else if (type) {
                    if (token.type)
                        tokens.push(token);
                    token = { type: null, value: "" };
                    for (var i = 0; i < type.length; i++)
                        tokens.push(type[i]);
                }
            }

            if (lastIndex == line.length)
                break;

            lastIndex = index;

            if (tokens.length > MAX_TOKEN_COUNT) {
                // chrome doens't show contents of text nodes with very long text
                while (lastIndex < line.length) {
                    if (token.type)
                        tokens.push(token);
                    token = {
                        value: line.substring(lastIndex, lastIndex += 2000),
                        type: "overflow"
                    };
                }
                currentState = "start";
                stack = [];
                break;
            }
        }

        if (token.type)
            tokens.push(token);

        if (stack.length > 1) {
            if (stack[0] !== currentState) {
                stack.unshift('#tmp', currentState);
            }
        }

        return {
            tokens: tokens,
            // FIXME: Should the TokenizedLine accept an array?
            state: stack.length ? <any>stack : currentState
        };
    }
}

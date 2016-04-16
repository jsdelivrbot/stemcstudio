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
 *
 * Contributor(s):
 *
 * Garen J. Torikian <gjtorikian AT gmail DOT com>
 * 
 *
 *
 * ***** END LICENSE BLOCK ***** */
"use strict";

import JavaScriptHighlightRules from "./JavaScriptHighlightRules";

export default class TypeScriptHighlightRiles extends JavaScriptHighlightRules {

    constructor(options?: {}) {
        super(options);
        var tsRules = [
            // Match stuff like: module name {...}
            {
                token: ["keyword.operator.ts", "text", "variable.parameter.function.ts", "text"],
                regex: "\\b(module)(\\s*)([a-zA-Z0-9_?.$][\\w?.$]*)(\\s*\\{)"
            }, 
            // Match stuff like: super(argument, list)
            {
                token: ["storage.type.variable.ts", "text", "keyword.other.ts", "text"],
                regex: "(super)(\\s*\\()([a-zA-Z0-9,_?.$\\s]+\\s*)(\\))"
            },
            // Match stuff like: function() {...}
            {
                token: ["entity.name.function.ts", "paren.lparen", "paren.rparen"],
                regex: "([a-zA-Z_?.$][\\w?.$]*)(\\()(\\))"
            },
            // Match stuff like: (function: return type)
            {
                token: ["variable.parameter.function.ts", "text", "variable.parameter.function.ts"],
                regex: "([a-zA-Z0-9_?.$][\\w?.$]*)(\\s*:\\s*)([a-zA-Z0-9_?.$][\\w?.$]*)"
            },
            {
                token: ["keyword.operator.ts"],
                regex: "(?:\\b(constructor|declare|interface|as|AS|public|private|class|extends|export|super)\\b)"
            },
            {
                token: ["storage.type.variable.ts"],
                regex: "(?:\\b(this\\.|string\\b|bool\\b|number)\\b)"
            },
            {
                token: ["keyword.operator.ts", "storage.type.variable.ts", "keyword.operator.ts", "storage.type.variable.ts"],
                regex: "(class)(\\s+[a-zA-Z0-9_?.$][\\w?.$]*\\s+)(extends)(\\s+[a-zA-Z0-9_?.$][\\w?.$]*\\s+)?"
            },
            {
                token: "keyword",
                regex: "(?:super|export|class|extends|import)\\b"
            }
        ];

        var JSRules = new JavaScriptHighlightRules().getRules();

        JSRules.start = tsRules.concat(JSRules.start);
        this.$rules = JSRules;
    }
}

/*! **** BEGIN LICENSE BLOCK ****************************************************
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
System.register(["../lib/mixin", "../worker/Mirror", "./javascript/jshint"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var mixin_1, Mirror_1, jshint_1;
    var disabledWarningsRe, errorsRe, infoRe, JavaScriptWorker;
    function isValidJS(str) {
        try {
            eval("throw 0;" + str);
        }
        catch (e) {
            if (e === 0)
                return true;
        }
        return false;
    }
    function startRegex(arr) {
        return RegExp("^(" + arr.join("|") + ")");
    }
    return {
        setters:[
            function (mixin_1_1) {
                mixin_1 = mixin_1_1;
            },
            function (Mirror_1_1) {
                Mirror_1 = Mirror_1_1;
            },
            function (jshint_1_1) {
                jshint_1 = jshint_1_1;
            }],
        execute: function() {
            disabledWarningsRe = startRegex([
                "Bad for in variable '(.+)'.",
                'Missing "use strict"'
            ]);
            errorsRe = startRegex([
                "Unexpected",
                "Expected ",
                "Confusing (plus|minus)",
                "\\{a\\} unterminated regular expression",
                "Unclosed ",
                "Unmatched ",
                "Unbegun comment",
                "Bad invocation",
                "Missing space after",
                "Missing operator at"
            ]);
            infoRe = startRegex([
                "Expected an assignment",
                "Bad escapement of EOL",
                "Unexpected comma",
                "Unexpected space",
                "Missing radix parameter.",
                "A leading decimal point can",
                "\\['{a}'\\] is better written in dot notation.",
                "'{a}' used out of scope"
            ]);
            JavaScriptWorker = (function (_super) {
                __extends(JavaScriptWorker, _super);
                function JavaScriptWorker(host) {
                    _super.call(this, host, 500);
                    this.setOptions();
                }
                JavaScriptWorker.prototype.setOptions = function (options) {
                    this.options = options || {
                        esnext: true,
                        moz: true,
                        devel: true,
                        browser: true,
                        node: true,
                        laxcomma: true,
                        laxbreak: true,
                        lastsemic: true,
                        onevar: false,
                        passfail: false,
                        maxerr: 100,
                        expr: true,
                        multistr: true,
                        globalstrict: true
                    };
                    this.doc.getValue() && this.deferredUpdate.schedule(100);
                };
                JavaScriptWorker.prototype.changeOptions = function (options) {
                    mixin_1.default(this.options, options);
                    this.doc.getValue() && this.deferredUpdate.schedule(100);
                };
                JavaScriptWorker.prototype.onUpdate = function () {
                    var value = this.doc.getValue();
                    value = value.replace(/^#!.*\n/, "\n");
                    if (!value) {
                        this.emitAnnotations([]);
                        return;
                    }
                    var annotations = [];
                    var maxErrorLevel = isValidJS(value) ? "warning" : "error";
                    jshint_1.JSHINT(value, this.options);
                    var results = jshint_1.JSHINT.errors;
                    var errorAdded = false;
                    for (var i = 0; i < results.length; i++) {
                        var error = results[i];
                        if (!error)
                            continue;
                        var raw = error.raw;
                        var type = "warning";
                        if (raw == "Missing semicolon.") {
                            var str = error.evidence.substr(error.character);
                            str = str.charAt(str.search(/\S/));
                            if (maxErrorLevel == "error" && str && /[\w\d{(['"]/.test(str)) {
                                error.reason = 'Missing ";" before statement';
                                type = "error";
                            }
                            else {
                                type = "info";
                            }
                        }
                        else if (disabledWarningsRe.test(raw)) {
                            continue;
                        }
                        else if (infoRe.test(raw)) {
                            type = "info";
                        }
                        else if (errorsRe.test(raw)) {
                            errorAdded = true;
                            type = maxErrorLevel;
                        }
                        else if (raw === "'{a}' is not defined.") {
                            type = "warning";
                        }
                        else if (raw === "'{a}' is defined but never used.") {
                            type = "info";
                        }
                        annotations.push({
                            row: error.line - 1,
                            column: error.character - 1,
                            text: error.reason,
                            type: type
                        });
                        if (errorAdded) {
                        }
                    }
                    this.emitAnnotations(annotations);
                };
                return JavaScriptWorker;
            })(Mirror_1.default);
            exports_1("default", JavaScriptWorker);
        }
    }
});
/*! **** BEGIN LICENSE BLOCK ****************************************************
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

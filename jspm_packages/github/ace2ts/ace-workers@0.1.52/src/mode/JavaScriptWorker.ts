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

import mixin from "../lib/mixin";
import Annotation from "../Annotation";
import Mirror from "../worker/Mirror";
import WorkerCallback from "../WorkerCallback";

//import jshint from 'jshint';
import {JSHINT} from "./javascript/jshint";
import JSHintOptions from "./javascript/JSHintOptions";
import JSHintError from "./javascript/JSHintError";

function isValidJS(str: string): boolean {
    try {
        // evaluated code can only create variables in this function
        eval("throw 0;" + str);
    }
    catch (e) {
        if (e === 0)
            return true;
    }
    return false
}

function startRegex(arr: string[]): RegExp {
    return RegExp("^(" + arr.join("|") + ")");
}

var disabledWarningsRe = startRegex([
    "Bad for in variable '(.+)'.",
    'Missing "use strict"'
]);

var errorsRe = startRegex([
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
var infoRe = startRegex([
    "Expected an assignment",
    "Bad escapement of EOL",
    "Unexpected comma",
    "Unexpected space",
    "Missing radix parameter.",
    "A leading decimal point can",
    "\\['{a}'\\] is better written in dot notation.",
    "'{a}' used out of scope"
]);

/**
 * @class JavaScriptWorker
 * @extends Mirror
 */
export default class JavaScriptWorker extends Mirror {
    options: JSHintOptions;

    /**
     * @class JavaScriptWorker
     * @constructor
     * @param host {WorkerCallback}
     */
    constructor(host: WorkerCallback) {
        super(host, 500);
        this.setOptions();
    }

    /**
     * @method setOptions
     * @param options {JSHintOptions}
     * @return {void}
     */
    setOptions(options?: JSHintOptions): void {
        this.options = options || {
            // undef: true,
            // unused: true,
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
    }

    /**
     * @method changeOptions
     * @param options {JSHintOptions}
     * @return {void}
     */
    changeOptions(options: JSHintOptions) {
        mixin(this.options, options);
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    }

    /**
     * @method onUpdate
     * @return {void}
     * @protected
     */
    protected onUpdate(): void {
        var value = this.doc.getValue();
        value = value.replace(/^#!.*\n/, "\n");
        if (!value) {
            this.emitAnnotations([]);
            return;
        }
        var annotations: Annotation[] = [];

        // jshint reports many false errors
        // report them as error only if code is actually invalid
        var maxErrorLevel = isValidJS(value) ? "warning" : "error";

        JSHINT(value, this.options);
        var results: JSHintError[] = JSHINT.errors;

        var errorAdded = false
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
                type = "info"
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
                // break;
            }
        }

        this.emitAnnotations(annotations);
    }
}

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

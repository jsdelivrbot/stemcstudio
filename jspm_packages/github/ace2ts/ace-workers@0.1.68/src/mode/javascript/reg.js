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
/*
 * Regular expressions. Some of these are stupidly long.
 */
"use strict";
System.register([], function(exports_1) {
    var unsafeString, unsafeChars, needEsc, needEscGlobal, starSlash, identifierRegExp, javascriptURL, fallsThrough, maxlenException;
    return {
        setters:[],
        execute: function() {
            exports_1("unsafeString", unsafeString = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i);
            exports_1("unsafeChars", unsafeChars = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/);
            exports_1("needEsc", needEsc = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/);
            exports_1("needEscGlobal", needEscGlobal = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g);
            exports_1("starSlash", starSlash = /\*\//);
            exports_1("identifierRegExp", identifierRegExp = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
            exports_1("javascriptURL", javascriptURL = /^(?:javascript|jscript|ecmascript|vbscript|livescript)\s*:/i);
            exports_1("fallsThrough", fallsThrough = /^\s*falls?\sthrough\s*$/);
            exports_1("maxlenException", maxlenException = /^(?:(?:\/\/|\/\*|\*) ?)?[^ ]+$/);
        }
    }
});

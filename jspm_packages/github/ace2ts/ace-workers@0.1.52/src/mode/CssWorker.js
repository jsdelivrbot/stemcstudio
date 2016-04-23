/*! ***** BEGIN LICENSE BLOCK ***************************************************
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
 * ***** END LICENSE BLOCK *************************************************** */
"use strict";
System.register(["../worker/Mirror"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Mirror_1;
    var CssWorker;
    return {
        setters:[
            function (Mirror_1_1) {
                Mirror_1 = Mirror_1_1;
            }],
        execute: function() {
            CssWorker = (function (_super) {
                __extends(CssWorker, _super);
                function CssWorker(host) {
                    _super.call(this, host, 500);
                    this.setOptions();
                }
                CssWorker.prototype.setOptions = function (options) {
                    this.doc.getValue() && this.deferredUpdate.schedule(100);
                };
                CssWorker.prototype.onUpdate = function () {
                    var value = this.doc.getValue();
                    var annotations = [];
                    this.emitAnnotations(annotations);
                };
                return CssWorker;
            })(Mirror_1.default);
            exports_1("default", CssWorker);
        }
    }
});

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

import { createElement } from "../lib/dom";
import { stringRepeat } from "../lib/lang";
import { isIE } from "../lib/useragent";
import EventBus from "../EventBus";
import EventEmitterClass from "../lib/EventEmitterClass";

var CHAR_COUNT = 0;

/**
 * @class FontMetrics
 */
export default class FontMetrics implements EventBus<FontMetrics> {
    private el: HTMLDivElement;
    private $main: HTMLDivElement;
    private $measureNode: HTMLDivElement;
    public $characterSize = { width: 0, height: 0 };
    private charSizes: { [ch: string]: number };
    private allowBoldFonts: boolean;
    private $pollSizeChangesTimer: number;
    private eventBus: EventEmitterClass<FontMetrics>;

    /**
     * @class FontMetrics
     * @constructor
     * @param parent {HTMLElement}
     * @param pollingInterval {number}
     */
    // FIXME: The interval should be being used to configure the polling interval (normally 500ms)
    constructor(parent: HTMLElement, pollingInterval: number) {
        this.eventBus = new EventEmitterClass<FontMetrics>(this);
        this.el = <HTMLDivElement>createElement("div");
        this.$setMeasureNodeStyles(this.el.style, true);

        this.$main = <HTMLDivElement>createElement("div");
        this.$setMeasureNodeStyles(this.$main.style);

        this.$measureNode = <HTMLDivElement>createElement("div");
        this.$setMeasureNodeStyles(this.$measureNode.style);

        this.el.appendChild(this.$main);
        this.el.appendChild(this.$measureNode);
        parent.appendChild(this.el);

        if (!CHAR_COUNT) {
            this.$testFractionalRect();
        }
        this.$measureNode.innerHTML = stringRepeat("X", CHAR_COUNT);

        this.$characterSize = { width: 0, height: 0 };
        this.checkForSizeChanges();
    }

    /**
     * @method on
     * @param eventName {string}
     * @param callback {(event, source: FontMetrics) => any}
     * @return {void}
     */
    on(eventName: string, callback: (event: any, source: FontMetrics) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    /**
     * @method off
     * @param eventName {string}
     * @param callback {(event, source: FontMetrics) => any}
     * @return {void}
     */
    off(eventName: string, callback: (event: any, source: FontMetrics) => any): void {
        this.eventBus.off(eventName, callback);
    }

    private $testFractionalRect(): void {
        var el = <HTMLDivElement>createElement("div");
        this.$setMeasureNodeStyles(el.style);
        el.style.width = "0.2px";
        document.documentElement.appendChild(el);
        var w = el.getBoundingClientRect().width;
        // TODO; Use a ternary conditional...
        if (w > 0 && w < 1) {
            CHAR_COUNT = 1;
        }
        else {
            CHAR_COUNT = 100;
        }
        el.parentNode.removeChild(el);
    }

    private $setMeasureNodeStyles(style: CSSStyleDeclaration, isRoot?: boolean): void {
        style.width = style.height = "auto";
        style.left = style.top = "-100px";
        style.visibility = "hidden";
        style.position = "fixed";
        style.whiteSpace = "pre";

        if (isIE < 8) {
            style["font-family"] = "inherit";
        }
        else {
            style.font = "inherit";
        }
        style.overflow = isRoot ? "hidden" : "visible";
    }

    public checkForSizeChanges(): void {
        var size = this.$measureSizes();
        if (size && (this.$characterSize.width !== size.width || this.$characterSize.height !== size.height)) {
            this.$measureNode.style.fontWeight = "bold";
            var boldSize = this.$measureSizes();
            this.$measureNode.style.fontWeight = "";
            this.$characterSize = size;
            this.charSizes = Object.create(null);
            this.allowBoldFonts = boldSize && boldSize.width === size.width && boldSize.height === size.height;
            /**
             * @event changeCharacterSize
             */
            this.eventBus._emit("changeCharacterSize", { data: size });
        }
    }

    public $pollSizeChanges(): number {
        if (this.$pollSizeChangesTimer) {
            return this.$pollSizeChangesTimer;
        }
        var self = this;
        return this.$pollSizeChangesTimer = setInterval(function() {
            self.checkForSizeChanges();
        }, 500);
    }

    private setPolling(val: boolean): void {
        if (val) {
            this.$pollSizeChanges();
        }
        else {
            if (this.$pollSizeChangesTimer) {
                this.$pollSizeChangesTimer;
            }
        }
    }

    private $measureSizes(): { width: number; height: number } {
        if (CHAR_COUNT === 1) {
            var rect: ClientRect = null;
            try {
                rect = this.$measureNode.getBoundingClientRect();
            }
            catch (e) {
                rect = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 };
            }
            var size = { height: rect.height, width: rect.width };
        }
        else {
            var size = { height: this.$measureNode.clientHeight, width: this.$measureNode.clientWidth / CHAR_COUNT };
        }
        // Size and width can be null if the editor is not visible or
        // detached from the document
        if (size.width === 0 || size.height === 0) {
            return null;
        }
        return size;
    }

    private $measureCharWidth(ch: string): number {
        this.$main.innerHTML = stringRepeat(ch, CHAR_COUNT);
        var rect = this.$main.getBoundingClientRect();
        return rect.width / CHAR_COUNT;
    }

    private getCharacterWidth(ch: string): number {
        var w = this.charSizes[ch];
        if (w === undefined) {
            this.charSizes[ch] = this.$measureCharWidth(ch) / this.$characterSize.width;
        }
        return w;
    }

    private destroy(): void {
        clearInterval(this.$pollSizeChangesTimer);
        if (this.el && this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
    }
}

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

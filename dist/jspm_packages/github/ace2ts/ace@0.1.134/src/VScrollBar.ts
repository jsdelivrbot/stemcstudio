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

import { addListener } from "./lib/event";
import ScrollBar from './ScrollBar';
import { scrollbarWidth } from "./lib/dom";
import Renderer from "./Renderer";

/**
 * A vertical scroll bar.
 *
 * @class VScrollBar
 * @extends ScrollBar
 */
export default class VScrollBar extends ScrollBar {

    private _scrollTop = 0;
    private _width: number;
    /**
     * Creates a new `VScrollBar`. `parent` is the owner of the scroll bar.
     * @param {DOMElement} parent A DOM element
     * @param {Object} renderer An editor renderer
     *
     * @constructor
     */
    constructor(parent: HTMLElement, renderer: Renderer) {
        super(parent, '-v');
        // in OSX lion the scrollbars appear to have no width. In this case resize the
        // element to show the scrollbar but still pretend that the scrollbar has a width
        // of 0px
        // in Firefox 6+ scrollbar is hidden if element has the same width as scrollbar
        // make element a little bit wider to retain scrollbar when page is zoomed 
        renderer.$scrollbarWidth = this._width = scrollbarWidth(parent.ownerDocument);
        this.inner.style.width = this.element.style.width = (this._width || 15) + 5 + "px";
        addListener(this.element, "scroll", this.onScroll.bind(this));
    }

    /**
     * Emitted when the scroll bar, well, scrolls.
     * @event scroll
     * @param {Object} e Contains one property, `"data"`, which indicates the current scroll top position
     **/
    onScroll() {
        if (!this.skipEvent) {
            this._scrollTop = this.element.scrollTop;
            /**
             * @event scroll
             * @param TODO
             */
            this.eventBus._emit("scroll", { data: this._scrollTop });
        }
        this.skipEvent = false;
    }

    /**
     * Returns the width of the scroll bar.
     * @return {Number}
     **/
    get width(): number {
        return this.isVisible ? this._width : 0;
    }

    /**
     * Sets the height of the scroll bar, in pixels.
     * @param {Number} height The new height
     **/
    setHeight(height: number) {
        this.element.style.height = height + "px";
    }

    /**
     * Sets the inner height of the scroll bar, in pixels.
     * @param {Number} height The new inner height
     * @deprecated Use setScrollHeight instead
     **/
    setInnerHeight(height: number) {
        this.inner.style.height = height + "px";
    }

    /**
     * Sets the scroll height of the scroll bar, in pixels.
     * @param {Number} height The new scroll height
     **/
    setScrollHeight(height: number) {
        this.inner.style.height = height + "px";
    }

    /**
     * Sets the scroll top of the scroll bar.
     * @param {Number} scrollTop The new scroll top
     **/
    // on chrome 17+ for small zoom levels after calling this function
    // this.element.scrollTop != scrollTop which makes page to scroll up.
    setScrollTop(scrollTop: number) {
        if (this._scrollTop != scrollTop) {
            this.skipEvent = true;
            this._scrollTop = this.element.scrollTop = scrollTop;
        }
    }

    get scrollTop(): number {
        return this._scrollTop;
    }
}

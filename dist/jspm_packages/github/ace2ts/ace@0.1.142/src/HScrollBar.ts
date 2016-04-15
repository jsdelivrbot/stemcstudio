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
import Renderer from "./Renderer";

/**
 * A horizontal scroll bar.
 *
 * @class HScrollBar
 * @extends ScrollBar
 */
export default class HScrollBar extends ScrollBar {

    private _scrollLeft = 0;
    private _height: number;
    /**
     * Creates a new `HScrollBar`. `parent` is the owner of the scroll bar.
     *
     * @class HScrollBar
     * @constructor
     * @param parent {HTMLElement} A DOM element.
     * @param renderer {Renderer} An editor renderer.
     */
    constructor(parent: HTMLElement, renderer: Renderer) {
        super(parent, '-h');

        // in OSX lion the scrollbars appear to have no width. In this case resize the
        // element to show the scrollbar but still pretend that the scrollbar has a width
        // of 0px
        // in Firefox 6+ scrollbar is hidden if element has the same width as scrollbar
        // make element a little bit wider to retain scrollbar when page is zoomed 
        this._height = renderer.$scrollbarWidth;
        this.inner.style.height = this.element.style.height = (this._height || 15) + 5 + "px";
        addListener(this.element, "scroll", this.onScroll.bind(this));
    }

    /**
     * Emitted when the scroll bar, well, scrolls.
     * @event scroll
     * @param {Object} e Contains one property, `"data"`, which indicates the current scroll left position
     */
    onScroll(): void {
        if (!this.skipEvent) {
            this._scrollLeft = this.element.scrollLeft;
            /**
             * @event scroll
             * @param TODO
             */
            this.eventBus._emit("scroll", { data: this._scrollLeft });
        }
        this.skipEvent = false;
    }

    /**
     * Returns the height of the scroll bar.
     * @return {Number}
     **/
    get height(): number {
        return this.isVisible ? this._height : 0;
    }

    /**
     * Sets the width of the scroll bar, in pixels.
     * @param {Number} width The new width
     **/
    setWidth(width: number): void {
        this.element.style.width = width + "px";
    }

    /**
     * Sets the inner width of the scroll bar, in pixels.
     * @param {Number} width The new inner width
     * @deprecated Use setScrollWidth instead
     **/
    setInnerWidth(width: number) {
        this.inner.style.width = width + "px";
    }

    /**
     * Sets the scroll width of the scroll bar, in pixels.
     * @param {Number} width The new scroll width
     **/
    setScrollWidth(width: number) {
        this.inner.style.width = width + "px";
    }

    /**
     * Sets the scroll left of the scroll bar.
     * @param {Number} scrollTop The new scroll left
     **/
    // on chrome 17+ for small zoom levels after calling this function
    // this.element.scrollTop != scrollTop which makes page to scroll up.
    setScrollLeft(scrollLeft: number) {
        if (this._scrollLeft != scrollLeft) {
            this.skipEvent = true;
            this._scrollLeft = this.element.scrollLeft = scrollLeft;
        }
    }
}

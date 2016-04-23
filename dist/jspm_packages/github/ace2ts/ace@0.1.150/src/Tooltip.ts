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

import { addCssClass, createElement, setInnerText } from "./lib/dom";

/**
 * @class Tooltip
 */
export default class Tooltip {

    /**
     * @property isOpen
     * @type {boolean}
     * @defualt false
     * @private
     */
    private isOpen: boolean;
    private $element: HTMLElement;
    private $parentElement: HTMLElement;

    /**
     * @class Tooltip
     * @constructor
     * @param parentElement {HTMLElement}
     */
    constructor(parentElement: HTMLElement) {
        this.isOpen = false;
        this.$element = null;
        this.$parentElement = parentElement;
    }

    /**
     * This internal method is called (lazily) once through the `getElement` method.
     * It creates the $element member.
     * @method $init
     * @return {HTMLElement}
     * @private
     */
    private $init(): HTMLElement {
        this.$element = <HTMLElement>createElement('div');
        this.$element.className = "ace_tooltip";
        this.$element.style.display = "none";
        this.$parentElement.appendChild(this.$element);
        return this.$element;
    }

    /**
     * Provides the HTML div element.
     * @method getElement
     * @return {HTMLElement}
     */
    getElement(): HTMLElement {
        return this.$element || this.$init();
    }

    /**
     * Use the dom method `setInnerText`
     * @method setText
     * @param {string} text
     * @return {void}
     */
    setText(text: string): void {
        setInnerText(this.getElement(), text);
    }

    /**
     * Sets the `innerHTML` property on the div element.
     * @method setHtml
     * @param {string} html
     * @return {void}
     */
    setHtml(html: string): void {
        this.getElement().innerHTML = html;
    }

    /**
     * Sets the `left` and `top` CSS style properties.
     * This action can also happen during the `show` method.
     *
     * @method setPosition
     * @param left {number} The style 'left' value in pixels.
     * @param top {number} The style 'top' value in pixels.
     * @return {void}
     */
    setPosition(left: number, top: number): void {
        var style = this.getElement().style;
        style.left = left + "px";
        style.top = top + "px";
    }

    /**
     * Adds a CSS class to the underlying tooltip div element using the dom method `addCssClass`.
     *
     * @method setClassName
     * @param className {string}
     * @return {void}
     */
    setClassName(className: string): void {
        addCssClass(this.getElement(), className);
    }

    /**
     * Shows the tool by setting the CSS display property to 'block'.
     *
     * @method show
     * @return {void}
     */
    show(): void {
        if (!this.isOpen) {
            this.getElement().style.display = 'block';
            this.isOpen = true;
        }
    }

    /**
     * Hides the tool by setting the CSS display property to 'none'.
     *
     * @method hide
     * @return {void}
     */
    hide(): void {
        if (this.isOpen) {
            this.getElement().style.display = 'none';
            this.isOpen = false;
        }
    }

    /**
     * Returns the `offsetHeight` property of the element.
     *
     * @method getHeight
     * @return {number}
     */
    getHeight(): number {
        return this.getElement().offsetHeight;
    }

    /**
     * Returns the `offsetWidth` property of the element.
     *
     * @method getWidth
     * @return {number}
     */
    getWidth(): number {
        return this.getElement().offsetWidth;
    }
}

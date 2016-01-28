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

import {createElement, setCssClass} from "../lib/dom";

/**
 * Work In Progress
 *
 * @class AbstractLayer
 */
export default class AbstractLayer {

    /**
     * @property element
     * @type HTMLDivElement
     */
    public element: HTMLDivElement;

    /**
     * @class AbstractLayer
     * @constructor
     * @param parent {HTMLElement}
     * @param className {string} The className property assigned to the wrapped element.
     */
    constructor(parent: HTMLElement, className: string) {
        // TODO: createHTMLDivElement would be nice convenience to avoid casting?
        // We should probably pay more attention to the owner document too.
        this.element = <HTMLDivElement>createElement('div');
        this.element.className = className;
        parent.appendChild(this.element);
    }

    /**
     * @method setCssClass
     * @param className {string}
     * @param include {boolean}
     * @return {void}
     */
    setCssClass(className: string, include: boolean): void {
        setCssClass(this.element, className, include);
    }
}

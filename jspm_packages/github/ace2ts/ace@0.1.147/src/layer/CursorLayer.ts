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

import {addCssClass, createElement, removeCssClass, setCssClass} from "../lib/dom";
import AbstractLayer from './AbstractLayer';
import EditSession from '../EditSession';
import Position from '../Position';
import PixelPosition from '../PixelPosition';
import CursorConfig from './CursorConfig';

var IE8;

/**
 * This class is the HTML representation of the CursorLayer.
 *
 * @class CursorLayer
 * @extends AbstractLayer
 */
export default class CursorLayer extends AbstractLayer {
    private session: EditSession;
    private isVisible = false;
    public isBlinking = true;
    private blinkInterval = 1000;
    private smoothBlinking = false;
    private intervalId: number;
    private timeoutId: number;
    private cursors: HTMLDivElement[] = [];
    private cursor: HTMLDivElement;
    private $padding: number = 0;
    private overwrite: boolean;
    private $updateCursors: (doIt: boolean) => void;
    public config: CursorConfig;
    public $pixelPos: PixelPosition;

    /**
     * @class CursorLayer
     * @constructor
     * @param parent {HTMLElement}
     */
    constructor(parent: HTMLElement) {
        super(parent, "ace_layer ace_cursor-layer");

        if (IE8 === void 0) {
            IE8 = "opacity" in this.element;
        }

        this.cursor = this.addCursor();
        addCssClass(this.element, "ace_hidden-cursors");
        this.$updateCursors = this.$updateVisibility.bind(this);
    }

    private $updateVisibility(visible: boolean): void {
        var cursors = this.cursors;
        for (var i = cursors.length; i--;) {
            cursors[i].style.visibility = visible ? "" : "hidden";
        }
    }

    private $updateOpacity(opaque: boolean): void {
        var cursors = this.cursors;
        for (var i = cursors.length; i--;) {
            cursors[i].style.opacity = opaque ? "" : "0";
        }
    }

    /**
     * @method setPadding
     * @param padding {number}
     * @return {void}
     */
    public setPadding(padding: number): void {
        if (typeof padding === 'number') {
            this.$padding = padding;
        }
        else {
            throw new TypeError("padding must be a number");
        }
    }

    /**
     * @method setSession
     * @param session {EditSession}
     * @return {void}
     */
    public setSession(session: EditSession): void {
        this.session = session;
    }

    public setBlinking(blinking: boolean) {
        if (blinking !== this.isBlinking) {
            this.isBlinking = blinking;
            this.restartTimer();
        }
    }

    public setBlinkInterval(blinkInterval: number): void {
        if (blinkInterval !== this.blinkInterval) {
            this.blinkInterval = blinkInterval;
            this.restartTimer();
        }
    }

    /**
     * @method setSmoothBlinking
     * @param smoothBlinking {boolean}
     * @return {void}
     */
    public setSmoothBlinking(smoothBlinking: boolean): void {
        if (smoothBlinking !== this.smoothBlinking && !IE8) {
            this.smoothBlinking = smoothBlinking;
            setCssClass(this.element, "ace_smooth-blinking", smoothBlinking);
            this.$updateCursors(true);
            this.$updateCursors = (smoothBlinking
                ? this.$updateOpacity
                : this.$updateVisibility).bind(this);
            this.restartTimer();
        }
    }

    private addCursor(): HTMLDivElement {
        var cursor: HTMLDivElement = <HTMLDivElement>createElement("div");
        cursor.className = "ace_cursor";
        this.element.appendChild(cursor);
        this.cursors.push(cursor);
        return cursor;
    }

    private removeCursor(): HTMLDivElement {
        if (this.cursors.length > 1) {
            var cursor = this.cursors.pop();
            cursor.parentNode.removeChild(cursor);
            return cursor;
        }
    }

    /**
     * @method hideCursor
     * @return {void}
     */
    public hideCursor(): void {
        this.isVisible = false;
        addCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    }

    /**
     * @method showCursor
     * @return {void}
     */
    public showCursor(): void {
        this.isVisible = true;
        removeCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    }

    /**
     * @method restartTimer
     * @return {void}
     */
    public restartTimer(): void {
        var update = this.$updateCursors;
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
        if (this.smoothBlinking) {
            removeCssClass(this.element, "ace_smooth-blinking");
        }

        update(true);

        if (!this.isBlinking || !this.blinkInterval || !this.isVisible)
            return;

        if (this.smoothBlinking) {
            setTimeout(function() {
                addCssClass(this.element, "ace_smooth-blinking");
            }.bind(this));
        }

        var blink = function() {
            this.timeoutId = setTimeout(function() {
                update(false);
            }, 0.6 * this.blinkInterval);
        }.bind(this);

        this.intervalId = setInterval(function() {
            update(true);
            blink();
        }, this.blinkInterval);

        blink();
    }

    /**
     * Computes the pixel position relative to the top-left corner of the cursor layer.
     * The number of rows is multiplied by the line height.
     * The number of columns is multiplied by the character width.
     * The padding is added to the left property only.
     *
     * @method getPixelPosition
     * @param [position] {Position}
     * @param [onScreen] {boolean}
     * @return {PixelPosition}
     */
    public getPixelPosition(position?: Position, onScreen?: boolean): PixelPosition {

        if (!this.config || !this.session) {
            return { left: 0, top: 0 };
        }

        if (!position) {
            position = this.session.getSelection().getCursor();
        }

        var pos: Position = this.session.documentToScreenPosition(position.row, position.column);

        var cursorLeft = this.$padding + pos.column * this.config.characterWidth;
        var cursorTop = (pos.row - (onScreen ? this.config.firstRowScreen : 0)) * this.config.lineHeight;

        return { left: cursorLeft, top: cursorTop };
    }

    /**
     * @method update
     * @param config {CursorConfig}
     * @return {void}
     */
    public update(config: CursorConfig): void {

        this.config = config;

        // Selection markers is a concept from multi selection.
        // FIXME: Why can't we type the selections as Range[]?
        var selections: any[] = this.session.$selectionMarkers;
        var i = 0, cursorIndex = 0;

        if (selections === undefined || selections.length === 0) {
            selections = [{ cursor: null }];
        }

        for (var i = 0, n = selections.length; i < n; i++) {

            var pixelPos = this.getPixelPosition(selections[i].cursor, true);

            if ((pixelPos.top > config.height + config.offset ||
                pixelPos.top < 0) && i > 1) {
                continue;
            }

            var style = (this.cursors[cursorIndex++] || this.addCursor()).style;

            style.left = pixelPos.left + "px";
            style.top = pixelPos.top + "px";
            style.width = config.characterWidth + "px";
            style.height = config.lineHeight + "px";
        }

        while (this.cursors.length > cursorIndex) {
            this.removeCursor();
        }

        var overwrite = this.session.getOverwrite();
        this.$setOverwrite(overwrite);

        // cache for textarea and gutter highlight
        this.$pixelPos = pixelPos;
        this.restartTimer();
    }

    private $setOverwrite(overwrite: boolean) {
        if (overwrite !== this.overwrite) {
            this.overwrite = overwrite;
            if (overwrite)
                addCssClass(this.element, "ace_overwrite-cursors");
            else
                removeCssClass(this.element, "ace_overwrite-cursors");
        }
    }

    /**
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
    }
}

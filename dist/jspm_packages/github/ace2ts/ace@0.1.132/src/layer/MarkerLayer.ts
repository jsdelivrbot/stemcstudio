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

import {createElement} from "../lib/dom";
import AbstractLayer from './AbstractLayer';
import Marker from '../Marker';
import EditSession from '../EditSession';
import LayerConfig from "./LayerConfig";
import MarkerConfig from "./MarkerConfig";
import Range from "../Range";

/**
 * @class MarkerLayer
 * @extends AbstractLayer
 */
export default class MarkerLayer extends AbstractLayer {

    private session: EditSession;
    private markers: { [id: number]: Marker };
    private config: MarkerConfig;
    private $padding: number = 0;

    /**
     * @class MarkerLayer
     * @constructor
     * @param parent {HTMLDivElement}
     */
    constructor(parent: HTMLDivElement) {
        super(parent, "ace_layer ace_marker-layer")
    }

    public setPadding(padding: number) {
        this.$padding = padding;
    }

    public setSession(session: EditSession) {
        this.session = session;
    }

    public setMarkers(markers: { [id: number]: Marker }) {
        this.markers = markers;
    }

    public update(config: MarkerConfig) {
        var config = config || this.config;
        if (!config) {
            return;
        }

        this.config = config;

        var html: (number | string)[] = [];

        for (var id in this.markers) {

            var marker: Marker = this.markers[id];

            if (!marker.range) {
                marker.update(html, this, this.session, config);
                continue;
            }

            if (typeof marker.range.start.row !== 'number') {
                throw new TypeError();
            }
            if (typeof marker.range.start.column !== 'number') {
                throw new TypeError();
            }
            if (typeof marker.range.end.row !== 'number') {
                throw new TypeError();
            }
            if (typeof marker.range.end.row !== 'number') {
                throw new TypeError();
            }
            let range: Range = marker.range.clipRows(config.firstRow, config.lastRow);
            if (range.isEmpty()) continue;

            range = this.session.documentToScreenRange(range);
            if (marker.renderer) {
                var top = this.$getTop(range.start.row, config);
                var left = this.$padding + range.start.column * config.characterWidth;
                marker.renderer(html, range, left, top, config);
            }
            else if (marker.type === "fullLine") {
                this.drawFullLineMarker(html, range, marker.clazz, config);
            }
            else if (marker.type === "screenLine") {
                this.drawScreenLineMarker(html, range, marker.clazz, config);
            }
            else if (range.isMultiLine()) {
                if (marker.type === "text")
                    this.drawTextMarker(html, range, marker.clazz, config);
                else
                    this.drawMultiLineMarker(html, range, marker.clazz, config);
            }
            else {
                this.drawSingleLineMarker(html, range, marker.clazz + " ace_start ace_br15", config);
            }
        }
        this.element.innerHTML = html.join("");
    }

    private $getTop(row: number, layerConfig: LayerConfig): number {
        return (row - layerConfig.firstRowScreen) * layerConfig.lineHeight;
    }

    // Draws a marker, which spans a range of text on multiple lines 
    private drawTextMarker(stringBuilder: (number | string)[], range: Range, clazz: string, layerConfig: MarkerConfig, extraStyle?) {

        function getBorderClass(tl: boolean, tr: boolean, br: boolean, bl: boolean): number {
            return (tl ? 1 : 0) | (tr ? 2 : 0) | (br ? 4 : 0) | (bl ? 8 : 0);
        }

        var session = this.session;
        var start = range.start.row;
        var end = range.end.row;
        var row = start;
        var prev = 0;
        var curr = 0;
        var next = session.getScreenLastRowColumn(row);
        var lineRange = new Range(row, range.start.column, row, curr);
        for (; row <= end; row++) {
            lineRange.start.row = lineRange.end.row = row;
            lineRange.start.column = row === start ? range.start.column : session.getRowWrapIndent(row);
            lineRange.end.column = next;
            prev = curr;
            curr = next;
            next = row + 1 < end ? session.getScreenLastRowColumn(row + 1) : row === end ? 0 : range.end.column;
            this.drawSingleLineMarker(
                stringBuilder,
                lineRange,
                clazz + (row === start ? " ace_start" : "") + " ace_br" + getBorderClass(row === start || row === start + 1 && range.start.column !== 0, prev < curr, curr > next, row === end),
                layerConfig,
                row == end ? 0 : 1,
                extraStyle);
        }
    }

    // Draws a multi line marker, where lines span the full width
    private drawMultiLineMarker(stringBuilder: (number | string)[], range: Range, clazz, config: MarkerConfig, extraStyle?: string) {
        // from selection start to the end of the line
        var padding = this.$padding;
        var height = config.lineHeight;
        var top = this.$getTop(range.start.row, config);
        var left = padding + range.start.column * config.characterWidth;

        extraStyle = extraStyle || "";

        stringBuilder.push(
            "<div class='", clazz, " ace_br1 ace_start' style='",
            "height:", height, "px;",
            "right:0;",
            "top:", top, "px;",
            "left:", left, "px;", extraStyle, "'></div>"
        );

        // from start of the last line to the selection end
        top = this.$getTop(range.end.row, config);
        var width = range.end.column * config.characterWidth;

        stringBuilder.push(
            "<div class='", clazz, " ace_br12' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", padding, "px;", extraStyle, "'></div>"
        );

        // all the complete lines
        height = (range.end.row - range.start.row - 1) * config.lineHeight;
        if (height < 0) {
            return;
        }
        top = this.$getTop(range.start.row + 1, config);

        var radiusClass = (range.start.column ? 1 : 0) | (range.end.column ? 0 : 8);

        stringBuilder.push(
            "<div class='", clazz, (radiusClass ? " ace_br" + radiusClass : ""), "' style='",
            "height:", height, "px;",
            "right:0;",
            "top:", top, "px;",
            "left:", padding, "px;", extraStyle, "'></div>"
        );
    }

    /**
     * Draws a marker which covers part or whole width of a single screen line.
     */
    public drawSingleLineMarker(stringBuilder: (number | string)[], range: Range, clazz: string, config: MarkerConfig, extraLength?: number, extraStyle?: string): void {
        var height = config.lineHeight;
        var width = (range.end.column + (extraLength || 0) - range.start.column) * config.characterWidth;

        var top = this.$getTop(range.start.row, config);
        var left = this.$padding + range.start.column * config.characterWidth;

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", left, "px;", extraStyle || "", "'></div>"
        );
    }

    private drawFullLineMarker(stringBuilder: (number | string)[], range: Range, clazz: string, config: MarkerConfig, extraStyle?: string): void {
        var top = this.$getTop(range.start.row, config);
        var height = config.lineHeight;
        if (range.start.row !== range.end.row) {
            height += this.$getTop(range.end.row, config) - top;
        }

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "top:", top, "px;",
            "left:0;right:0;", extraStyle || "", "'></div>"
        );
    }

    private drawScreenLineMarker(stringBuilder: (number | string)[], range: Range, clazz: string, config: MarkerConfig, extraStyle?: string): void {
        var top = this.$getTop(range.start.row, config);
        var height = config.lineHeight;

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "top:", top, "px;",
            "left:0;right:0;", extraStyle || "", "'></div>"
        );
    }
}

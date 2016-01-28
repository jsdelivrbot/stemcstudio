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

import {addCssClass, createElement} from "./lib/dom";
import Delta from "./Delta";
import Position from "./Position";
import Range from "./Range";
import Editor from "./Editor";
import EditSession from "./EditSession";
import Renderer from "./Renderer";
import LineWidget from "./LineWidget";
import Change from './Change';

/**
 * @class LineWidgetManager
 */
export default class LineWidgetManager {
    session: EditSession;
    editor: Editor;
    firstRow: number;
    lastRow: number;
    lineWidgets: LineWidget[];
    // TODO: This is also on the EditSession.
    $wrapData: number[][];
    // FIXME: I think this should be coming from the session.
    $useWrapMode: boolean;

    /**
     * @class LineWidgetManager
     * @constructor
     * @param session {EditSession}
     */
    constructor(session: EditSession) {
        this.session = session;
        this.session.widgetManager = this;
        this.session.getRowLength = this.getRowLength;
        this.session.$getWidgetScreenLength = this.$getWidgetScreenLength;
        this.updateOnChange = this.updateOnChange.bind(this);
        this.renderWidgets = this.renderWidgets.bind(this);
        this.measureWidgets = this.measureWidgets.bind(this);
        this.session._changedWidgets = [];
        this.$onChangeEditor = this.$onChangeEditor.bind(this);

        this.session.on("change", this.updateOnChange);
        this.session.on("changeFold", this.updateOnFold);
        this.session.on("changeEditor", this.$onChangeEditor);
    }

    /**
     * @method getRowLength
     * @param row {number}
     * @return {number}
     */
    getRowLength(row: number): number {
        var h: number;

        if (this.lineWidgets)
            h = this.lineWidgets[row] && this.lineWidgets[row].rowCount || 0;
        else
            h = 0;

        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1 + h;
        }
        else {
            return this.$wrapData[row].length + 1 + h;
        }
    }

    private $getWidgetScreenLength(): number {
        var screenRows = 0;
        this.lineWidgets.forEach(function(w) {
            if (w && w.rowCount && !w.hidden)
                screenRows += w.rowCount;
        });
        return screenRows;
    }

    private $onChangeEditor(e, session: EditSession) {
        this.attach(e.editor);
    }

    /**
     * @method attach
     * @param editor {Editor}
     * @return {void}
     */
    attach(editor: Editor): void {
        if (editor && editor.widgetManager && editor.widgetManager != this)
            editor.widgetManager.detach();

        if (this.editor == editor)
            return;

        this.detach();
        this.editor = editor;

        if (editor) {
            editor.widgetManager = this;
            editor.renderer.on("beforeRender", this.measureWidgets);
            editor.renderer.on("afterRender", this.renderWidgets);
        }
    }

    /**
     * @method detach
     * @return {void}
     */
    detach(unused?: any): void {
        var editor = this.editor;
        if (!editor) {
            return;
        }

        this.editor = null;
        editor.widgetManager = null;

        editor.renderer.off("beforeRender", this.measureWidgets);
        editor.renderer.off("afterRender", this.renderWidgets);
        var lineWidgets = this.session.lineWidgets;
        lineWidgets && lineWidgets.forEach(function(w: LineWidget) {
            if (w && w.el && w.el.parentNode) {
                w._inDocument = false;
                w.el.parentNode.removeChild(w.el);
            }
        });
    }

    /**
     * @method updateOnFold
     * @param e {Change}
     * @param session {EditSession}
     * @return {void}
     */
    updateOnFold(e: Change, session: EditSession): void {
        var lineWidgets = session.lineWidgets;
        if (!lineWidgets || !e.action)
            return;
        var fold = e.data;
        var start = fold.start.row;
        var end = fold.end.row;
        var hide = e.action == "add";
        for (var i = start + 1; i < end; i++) {
            if (lineWidgets[i])
                lineWidgets[i].hidden = hide;
        }
        if (lineWidgets[end]) {
            if (hide) {
                if (!lineWidgets[start])
                    lineWidgets[start] = lineWidgets[end];
                else
                    lineWidgets[end].hidden = hide;
            } else {
                if (lineWidgets[start] == lineWidgets[end])
                    lineWidgets[start] = undefined;
                lineWidgets[end].hidden = hide;
            }
        }
    }

    /**
     * @method updateOnChange
     * @param delta {Delta}
     * @param session {EditSession}
     * @return {void}
     */
    updateOnChange(delta: Delta, session: EditSession): void {
        var lineWidgets = this.session.lineWidgets;
        if (!lineWidgets) return;

        var startRow = delta.start.row;
        var len = delta.end.row - startRow;

        if (len === 0) {
            // return
        }
        else if (delta.action === 'remove') {
            var removed = lineWidgets.splice(startRow + 1, len);
            removed.forEach(function(w) {
                w && this.removeLineWidget(w);
            }, this);
            this.$updateRows();
        }
        else {
            var args = new Array(len);
            args.unshift(startRow, 0);
            lineWidgets.splice.apply(lineWidgets, args);
            this.$updateRows();
        }
    }

    private $updateRows() {
        var lineWidgets = this.session.lineWidgets;
        if (!lineWidgets) return;
        var noWidgets = true;
        lineWidgets.forEach(function(w: LineWidget, i: number) {
            if (w) {
                noWidgets = false;
                w.row = i;
                while (w.$oldWidget) {
                    w.$oldWidget.row = i;
                    w = w.$oldWidget;
                }
            }
        });
        if (noWidgets)
            this.session.lineWidgets = null;
    }

    /**
     * @method addLineWidget
     * @param w {LineWidget}
     * @return {LineWidget}
     */
    addLineWidget(w: LineWidget): LineWidget {
        if (!this.session.lineWidgets) {
            this.session.lineWidgets = new Array<LineWidget>(this.session.getLength());
        }

        const rowWidget: LineWidget = this.session.lineWidgets[w.row];
        if (rowWidget) {
            w.$oldWidget = rowWidget;
            if (rowWidget.el && rowWidget.el.parentNode) {
                rowWidget.el.parentNode.removeChild(rowWidget.el);
                rowWidget._inDocument = false;
            }
        }

        this.session.lineWidgets[w.row] = w;

        w.session = this.session;

        var renderer = this.editor.renderer;
        if (w.html && !w.el) {
            w.el = <HTMLDivElement>createElement("div");
            w.el.innerHTML = w.html;
        }
        if (w.el) {
            addCssClass(w.el, "ace_lineWidgetContainer");
            w.el.style.position = "absolute";
            w.el.style.zIndex = '5';
            renderer.container.appendChild(w.el);
            w._inDocument = true;
        }

        if (!w.coverGutter) {
            w.el.style.zIndex = '3';
        }
        if (!w.pixelHeight) {
            w.pixelHeight = w.el.offsetHeight;
        }
        if (w.rowCount == null) {
            w.rowCount = w.pixelHeight / renderer.layerConfig.lineHeight;
        }

        var fold = this.session.getFoldAt(w.row, 0);
        w.$fold = fold;
        if (fold) {
            var lineWidgets = this.session.lineWidgets;
            if (w.row == fold.end.row && !lineWidgets[fold.start.row])
                lineWidgets[fold.start.row] = w;
            else
                w.hidden = true;
        }

        this.session._emit("changeFold", { data: { start: { row: w.row } } });

        this.$updateRows();
        this.renderWidgets(null, renderer);
        this.onWidgetChanged(w);
        return w;
    }

    /**
     * @method removeLineWidget
     * @param w {LineWidget}
     * @return {void}
     */
    removeLineWidget(w: LineWidget): void {
        w._inDocument = false;
        w.session = null;
        if (w.el && w.el.parentNode)
            w.el.parentNode.removeChild(w.el);
        if (w.editor && w.editor.destroy) try {
            w.editor.destroy();
        } catch (e) { }
        if (this.session.lineWidgets) {
            var w1 = this.session.lineWidgets[w.row]
            if (w1 == w) {
                this.session.lineWidgets[w.row] = w.$oldWidget;
                if (w.$oldWidget)
                    this.onWidgetChanged(w.$oldWidget);
            } else {
                while (w1) {
                    if (w1.$oldWidget == w) {
                        w1.$oldWidget = w.$oldWidget;
                        break;
                    }
                    w1 = w1.$oldWidget;
                }
            }
        }
        this.session._emit("changeFold", { data: { start: { row: w.row } } });
        this.$updateRows();
    }

    /**
     * @method getWidgetsAtRow
     * @param row {number}
     * @return {LineWidget[]}
     */
    getWidgetsAtRow(row: number): LineWidget[] {
        var lineWidgets = this.session.lineWidgets;
        var w = lineWidgets && lineWidgets[row];
        var list: LineWidget[] = [];
        while (w) {
            list.push(w);
            w = w.$oldWidget;
        }
        return list;
    }

    /**
     * @method onWidgetChanged
     * @param w {LineWidget}
     * @return {void}
     */
    private onWidgetChanged(w: LineWidget): void {
        this.session._changedWidgets.push(w);
        this.editor && this.editor.renderer.updateFull();
    }

    /**
     * This method is used as an event handler connected to the <code>Renderer</code>.
     * It is called in response to the 'beforeRender' event.
     *
     * @method measureWidgets
     * @param event {any}
     * @param renderer {Renderer}
     * @return {void}
     */
    measureWidgets(event: any, renderer: Renderer): void {
        var changedWidgets = this.session._changedWidgets;
        var config = renderer.layerConfig;

        if (!changedWidgets || !changedWidgets.length) return;
        var min = Infinity;
        for (var i = 0; i < changedWidgets.length; i++) {
            var w = changedWidgets[i];
            if (!w || !w.el) continue;
            if (w.session != this.session) continue;
            if (!w._inDocument) {
                if (this.session.lineWidgets[w.row] != w)
                    continue;
                w._inDocument = true;
                renderer.container.appendChild(w.el);
            }

            w.h = w.el.offsetHeight;

            if (!w.fixedWidth) {
                w.w = w.el.offsetWidth;
                w.screenWidth = Math.ceil(w.w / config.characterWidth);
            }

            var rowCount = w.h / config.lineHeight;
            if (w.coverLine) {
                rowCount -= this.session.getRowLineCount(w.row);
                if (rowCount < 0)
                    rowCount = 0;
            }
            if (w.rowCount != rowCount) {
                w.rowCount = rowCount;
                if (w.row < min)
                    min = w.row;
            }
        }
        if (min != Infinity) {
            this.session._emit("changeFold", { data: { start: { row: min } } });
            this.session.lineWidgetWidth = null;
        }
        this.session._changedWidgets = [];
    }

    /**
     * This method is used as an event handler connected to the <code>Renderer</code>.
     * It is called in response to the 'afterRender' event.
     *
     * @method renderWidgets
     * @param event {any}
     * @param renderer {Renderer}
     * @return {void}
     */
    renderWidgets(event: any, renderer: Renderer): void {
        var config = renderer.layerConfig;
        var lineWidgets = this.session.lineWidgets;
        if (!lineWidgets) {
            return;
        }
        var first = Math.min(this.firstRow, config.firstRow);
        var last = Math.max(this.lastRow, config.lastRow, lineWidgets.length);

        while (first > 0 && !lineWidgets[first]) {
            first--;
        }

        this.firstRow = config.firstRow;
        this.lastRow = config.lastRow;

        renderer.$cursorLayer.config = config;
        for (var i = first; i <= last; i++) {
            var w = lineWidgets[i];
            if (!w || !w.el) continue;
            if (w.hidden) {
                w.el.style.top = -100 - (w.pixelHeight || 0) + "px";
                continue;
            }
            if (!w._inDocument) {
                w._inDocument = true;
                renderer.container.appendChild(w.el);
            }
            var top: number = renderer.getPixelPosition({ row: i, column: 0 }, true).top;
            if (!w.coverLine) {
                top += config.lineHeight * this.session.getRowLineCount(w.row);
            }
            w.el.style.top = top - config.offset + "px";

            var left = w.coverGutter ? 0 : renderer.gutterWidth;
            if (!w.fixedWidth) {
                left -= renderer.scrollLeft;
            }
            w.el.style.left = left + "px";

            if (w.fullWidth && w.screenWidth) {
                w.el.style.minWidth = config.width + 2 * config.padding + "px";
            }

            if (w.fixedWidth) {
                w.el.style.right = renderer.scrollBarV.width + "px";
            }
            else {
                w.el.style.right = "";
            }
        }
    }
}

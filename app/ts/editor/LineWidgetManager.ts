import { addCssClass, createHTMLDivElement } from "./lib/dom";
import { Delta } from "editor-document";
import { Editor } from "./Editor";
import { EditSession } from "./EditSession";
import { Renderer } from "./Renderer";
import { LineWidget } from "./LineWidget";
import { Change } from './Change';

/**
 *
 */
export class LineWidgetManager {
    session: EditSession;
    editor: Editor | null;
    firstRow: number;
    lastRow: number;
    lineWidgets: LineWidget[];
    // TODO: This is also on the EditSession.
    $wrapData: number[][];
    // FIXME: I think this should be coming from the session.
    $useWrapMode: boolean;

    /**
     *
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

    getRowLength(row: number): number {
        let h: number;

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
        let screenRows = 0;
        this.lineWidgets.forEach(function (w) {
            if (w && w.rowCount && !w.hidden)
                screenRows += w.rowCount;
        });
        return screenRows;
    }

    private $onChangeEditor(e: { editor: Editor }, session: EditSession) {
        this.attach(e.editor);
    }

    /**
     * @param editor
     */
    attach(editor: Editor): void {
        if (editor && editor.widgetManager && editor.widgetManager !== this)
            editor.widgetManager.detach();

        if (this.editor === editor)
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
     *
     */
    detach(unused?: any): void {
        const editor = this.editor;
        if (!editor) {
            return;
        }

        this.editor = null;
        editor.widgetManager = null;

        editor.renderer.off("beforeRender", this.measureWidgets);
        editor.renderer.off("afterRender", this.renderWidgets);
        const lineWidgets = this.session.lineWidgets;
        if (lineWidgets) {
            lineWidgets.forEach(function (w: LineWidget) {
                if (w && w.el && w.el.parentNode) {
                    w._inDocument = false;
                    w.el.parentNode.removeChild(w.el);
                }
            });
        }
    }

    /**
     * @param e
     * @param session
     */
    updateOnFold(e: Change, session: EditSession): void {
        const lineWidgets = session.lineWidgets;
        if (!lineWidgets || !e.action) {
            return;
        }
        const fold = e.data;
        const start = fold.start.row;
        const end = fold.end.row;
        const hide = e.action === "add";
        for (let i = start + 1; i < end; i++) {
            const lineWidget = lineWidgets[i];
            if (lineWidget) {
                lineWidget.hidden = hide;
            }
        }
        if (lineWidgets[end]) {
            if (hide) {
                if (!lineWidgets[start]) {
                    lineWidgets[start] = lineWidgets[end];
                }
                else {
                    const lineWidget = lineWidgets[end];
                    if (lineWidget) {
                        lineWidget.hidden = hide;
                    }
                }
            }
            else {
                if (lineWidgets[start] === lineWidgets[end]) {
                    lineWidgets[start] = undefined;
                }
                const lineWidget = lineWidgets[end];
                if (lineWidget) {
                    lineWidget.hidden = hide;
                }
            }
        }
    }

    /**
     * @param delta
     * @param session
     */
    updateOnChange(delta: Delta, session: EditSession): void {
        const lineWidgets = this.session.lineWidgets;
        if (!lineWidgets) return;

        const startRow = delta.start.row;
        const len = delta.end.row - startRow;

        if (len === 0) {
            // return
        }
        else if (delta.action === 'remove') {
            const removed = lineWidgets.splice(startRow + 1, len);
            removed.forEach((w) => {
                if (w) {
                    this.removeLineWidget(w);
                }
            });
            this.$updateRows();
        }
        else {
            const args = new Array(len);
            args.unshift(startRow, 0);
            lineWidgets.splice.apply(lineWidgets, args);
            this.$updateRows();
        }
    }

    private $updateRows() {
        const lineWidgets = this.session.lineWidgets;
        if (!lineWidgets) return;
        let noWidgets = true;
        lineWidgets.forEach(function (w: LineWidget, i: number) {
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

    addLineWidget(w: LineWidget): LineWidget {
        if (!this.session.lineWidgets) {
            this.session.lineWidgets = new Array<LineWidget>(this.session.getLength());
        }

        const rowWidget = this.session.lineWidgets[w.row];
        if (rowWidget) {
            w.$oldWidget = rowWidget;
            if (rowWidget.el && rowWidget.el.parentNode) {
                rowWidget.el.parentNode.removeChild(rowWidget.el);
                rowWidget._inDocument = false;
            }
        }

        this.session.lineWidgets[w.row] = w;

        w.session = this.session;

        const editor = this.editor as Editor;
        const renderer = editor.renderer;
        if (w.html && !w.el) {
            w.el = createHTMLDivElement();
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
        if (w.pixelHeight === null) {
            w.pixelHeight = w.el.offsetHeight;
        }
        if (w.rowCount == null) {
            w.rowCount = w.pixelHeight as number / renderer.layerConfig.lineHeight;
        }

        const fold = this.session.getFoldAt(w.row, 0);
        w.$fold = fold;
        if (fold) {
            const lineWidgets = this.session.lineWidgets;
            if (w.row === fold.end.row && !lineWidgets[fold.start.row])
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

    removeLineWidget(w: LineWidget): void {
        w._inDocument = false;
        w.session = null;
        if (w.el && w.el.parentNode)
            w.el.parentNode.removeChild(w.el);
        if (w.editor) {
            try {
                w.editor.dispose();
            } catch (e) {
                // Ignore.
            }
        }
        if (this.session.lineWidgets) {
            let w1 = this.session.lineWidgets[w.row];
            if (w1 === w) {
                this.session.lineWidgets[w.row] = w.$oldWidget;
                if (w.$oldWidget)
                    this.onWidgetChanged(w.$oldWidget);
            } else {
                while (w1) {
                    if (w1.$oldWidget === w) {
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

    getWidgetsAtRow(row: number): LineWidget[] {
        const lineWidgets = this.session.lineWidgets;
        let w = lineWidgets && lineWidgets[row];
        const list: LineWidget[] = [];
        while (w) {
            list.push(w);
            w = w.$oldWidget;
        }
        return list;
    }

    private onWidgetChanged(w: LineWidget): void {
        this.session._changedWidgets.push(w);
        if (this.editor) {
            this.editor.renderer.updateFull();
        }
    }

    /**
     * This method is used as an event handler connected to the <code>Renderer</code>.
     * It is called in response to the 'beforeRender' event.
     */
    measureWidgets(event: any, renderer: Renderer): void {
        const changedWidgets = this.session._changedWidgets;
        const config = renderer.layerConfig;

        if (!changedWidgets || !changedWidgets.length) return;
        let min = Infinity;
        for (let i = 0; i < changedWidgets.length; i++) {
            const w = changedWidgets[i];
            if (!w || !w.el) continue;
            if (w.session !== this.session) continue;
            if (!w._inDocument) {
                if (this.session.lineWidgets && this.session.lineWidgets[w.row] !== w) {
                    continue;
                }
                w._inDocument = true;
                renderer.container.appendChild(w.el);
            }

            w.h = w.el.offsetHeight;

            if (!w.fixedWidth) {
                w.w = w.el.offsetWidth;
                w.screenWidth = Math.ceil(w.w / config.characterWidth);
            }

            let rowCount = w.h / config.lineHeight;
            if (w.coverLine) {
                rowCount -= this.session.getRowLineCount(w.row);
                if (rowCount < 0)
                    rowCount = 0;
            }
            if (w.rowCount !== rowCount) {
                w.rowCount = rowCount;
                if (w.row < min)
                    min = w.row;
            }
        }
        if (min !== Infinity) {
            this.session._emit("changeFold", { data: { start: { row: min } } });
            this.session.lineWidgetWidth = null;
        }
        this.session._changedWidgets = [];
    }

    /**
     * This method is used as an event handler connected to the <code>Renderer</code>.
     * It is called in response to the 'afterRender' event.
     */
    renderWidgets(event: any, renderer: Renderer): void {
        const config = renderer.layerConfig;
        const lineWidgets = this.session.lineWidgets;
        if (!lineWidgets) {
            return;
        }
        let first = Math.min(this.firstRow, config.firstRow);
        const last = Math.max(this.lastRow, config.lastRow, lineWidgets.length);

        while (first > 0 && !lineWidgets[first]) {
            first--;
        }

        this.firstRow = config.firstRow;
        this.lastRow = config.lastRow;

        renderer.cursorLayer.config = config;
        for (let i = first; i <= last; i++) {
            const w = lineWidgets[i];
            if (!w || !w.el) continue;
            if (w.hidden) {
                w.el.style.top = -100 - (w.pixelHeight || 0) + "px";
                continue;
            }
            if (!w._inDocument) {
                w._inDocument = true;
                renderer.container.appendChild(w.el);
            }
            let top: number = renderer.getPixelPosition({ row: i, column: 0 }, true).top;
            if (!w.coverLine) {
                top += config.lineHeight * this.session.getRowLineCount(w.row);
            }
            w.el.style.top = top - config.offset + "px";

            let left = w.coverGutter ? 0 : renderer.gutterWidth;
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

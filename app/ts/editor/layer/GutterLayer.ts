import {addCssClass, createElement, removeCssClass} from "../lib/dom";

import AbstractLayer from './AbstractLayer';
import escapeHTML from "../lib/escapeHTML";
import EventEmitterClass from "../lib/EventEmitterClass";
import Delta from "../Delta";
import EditSession from "../EditSession";
import EventBus from "../EventBus";
import Annotation from "../Annotation";
import GutterConfig from "./GutterConfig";
import Padding from './Padding';
import GutterRenderer from './GutterRenderer';
import GutterCell from './GutterCell';

/**
 *
 */
export default class GutterLayer extends AbstractLayer implements EventBus<number, GutterLayer> {

    /**
     *
     */
    public gutterWidth = 0;

    /**
     * GutterLayer annotations are different from the Annotation type.
     */
    public $annotations: { className: string; text: string[] }[] = [];
    public $cells: GutterCell[] = [];
    private $fixedWidth = false;
    private $showLineNumbers = true;
    private $renderer: GutterRenderer;// = "";
    private session: EditSession;
    private $showFoldWidgets = true;
    public $padding: Padding;
    private eventBus: EventEmitterClass<any, GutterLayer>;

    /**
     *
     */
    constructor(parent: HTMLElement) {
        super(parent, "ace_layer ace_gutter-layer");
        this.eventBus = new EventEmitterClass<any, GutterLayer>(this);
        this.setShowFoldWidgets(this.$showFoldWidgets);
        this.$updateAnnotations = this.$updateAnnotations.bind(this);
    }

    /**
     * @param eventName
     * @param callback
     * @returns A function for removing the callback.
     */
    on(eventName: string, callback: (event: any, source: GutterLayer) => any): () => void {
        this.eventBus.on(eventName, callback, false);
        return () => {
            this.eventBus.off(eventName, callback);
        };
    }

    /**
     * @method off
     * @param eventName {string}
     * @param callback {(event, source: GutterLayer) => any}
     * @return {void}
     */
    off(eventName: string, callback: (event: any, source: GutterLayer) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     *
     */
    setSession(session: EditSession): void {
        if (this.session) {
            this.session.off("change", this.$updateAnnotations);
        }
        this.session = session;
        if (session) {
            session.on("change", this.$updateAnnotations);
        }
    }

    /**
     *
     */
    setAnnotations(annotations: Annotation[]): void {
        // iterate over sparse array
        this.$annotations = [];
        for (let i = 0; i < annotations.length; i++) {
            const annotation = annotations[i];
            const row = annotation.row;
            var rowInfo: any = this.$annotations[row];
            if (!rowInfo) {
                rowInfo = this.$annotations[row] = { className: void 0, text: [] };
            }

            const annoText = annotation.text ? escapeHTML(annotation.text) : annotation.html || "";

            if (rowInfo.text.indexOf(annoText) === -1) {
                rowInfo.text.push(annoText);
            }

            const type = annotation.type;
            if (type === "error") {
                rowInfo.className = " ace_error";
            }
            else if (type === "warning" && rowInfo.className !== " ace_error") {
                rowInfo.className = " ace_warning";
            }
            else if (type === "info" && (!rowInfo.className)) {
                rowInfo.className = " ace_info";
            }
        }
    }

    private $updateAnnotations(delta: Delta, session: EditSession) {
        if (!this.$annotations.length) {
            return;
        }
        const firstRow = delta.start.row;
        const len = delta.end.row - firstRow;
        if (len === 0) {
            // do nothing
        }
        else if (delta.action === "remove") {
            this.$annotations.splice(firstRow, len + 1, null);
        }
        else {
            const args = new Array<number>(len + 1);
            args.unshift(firstRow, 1);
            this.$annotations.splice.apply(this.$annotations, args);
        }
    }

    /**
     *
     */
    update(config: GutterConfig): void {
        const session = this.session;
        const firstRow = config.firstRow;
        // Compensate for horizontal scollbar.
        const lastRow = Math.min(config.lastRow + config.gutterOffset, session.getLength() - 1);
        let fold = session.getNextFoldLine(firstRow);
        let foldStart = fold ? fold.start.row : Infinity;
        const foldWidgets = this.$showFoldWidgets && session.foldWidgets;
        const breakpoints = session.$breakpoints;
        const decorations = session.$decorations;
        const firstLineNumber = session.$firstLineNumber;
        var lastLineNumber = 0;

        const gutterRenderer: GutterRenderer = session.gutterRenderer || this.$renderer;

        let cell: GutterCell = null;
        let index = -1;
        let row = firstRow;
        while (true) {
            if (row > foldStart) {
                row = fold.end.row + 1;
                fold = session.getNextFoldLine(row, fold);
                foldStart = fold ? fold.start.row : Infinity;
            }
            if (row > lastRow) {
                while (this.$cells.length > index + 1) {
                    cell = this.$cells.pop();
                    this.element.removeChild(cell.element);
                }
                break;
            }

            cell = this.$cells[++index];
            if (!cell) {
                cell = { element: null, textNode: null, foldWidget: null };
                cell.element = <HTMLDivElement>createElement("div");
                cell.textNode = document.createTextNode('');
                cell.element.appendChild(cell.textNode);
                this.element.appendChild(cell.element);
                this.$cells[index] = cell;
            }

            let className = "ace_gutter-cell ";
            if (breakpoints[row])
                className += breakpoints[row];
            if (decorations[row])
                className += decorations[row];
            if (this.$annotations[row])
                className += this.$annotations[row].className;
            if (cell.element.className !== className)
                cell.element.className = className;

            const height = session.getRowLength(row) * config.lineHeight + "px";
            if (height !== cell.element.style.height)
                cell.element.style.height = height;

            if (foldWidgets) {
                var c = foldWidgets[row];
                // check if cached value is invalidated and we need to recompute
                if (c == null)
                    c = foldWidgets[row] = session.getFoldWidget(row);
            }

            if (c) {
                if (!cell.foldWidget) {
                    cell.foldWidget = <HTMLSpanElement>createElement("span");
                    cell.element.appendChild(cell.foldWidget);
                }
                let className = "ace_fold-widget ace_" + c;
                if (c === "start" && row === foldStart && row < fold.end.row)
                    className += " ace_closed";
                else
                    className += " ace_open";
                if (cell.foldWidget.className !== className)
                    cell.foldWidget.className = className;

                const height = config.lineHeight + "px";
                if (cell.foldWidget.style.height !== height)
                    cell.foldWidget.style.height = height;
            } else {
                if (cell.foldWidget) {
                    cell.element.removeChild(cell.foldWidget);
                    cell.foldWidget = null;
                }
            }

            lastLineNumber = row + firstLineNumber;
            const text: string = gutterRenderer ? gutterRenderer.getText(session, row) : lastLineNumber.toString();
            if (text !== cell.textNode.data) {
                cell.textNode.data = text;
            }

            row++;
        }

        this.element.style.height = config.minHeight + "px";

        if (this.$fixedWidth || session.$useWrapMode)
            lastLineNumber = session.getLength() + firstLineNumber;

        let gutterWidth = gutterRenderer
            ? gutterRenderer.getWidth(session, lastLineNumber, config)
            : lastLineNumber.toString().length * config.characterWidth;

        const padding: Padding = this.$padding || this.$computePadding();
        gutterWidth += padding.left + padding.right;
        if (gutterWidth !== this.gutterWidth && !isNaN(gutterWidth)) {
            this.gutterWidth = gutterWidth;
            this.element.style.width = Math.ceil(this.gutterWidth) + "px";
            /**
             * @event changeGutterWidth
             */
            this.eventBus._emit("changeGutterWidth", gutterWidth);
        }
    }

    /**
     * @method setShowLineNumbers
     * @param show {boolean}
     * @return {void}
     */
    setShowLineNumbers(show: boolean): void {
        this.$renderer = !show && {
            getWidth: function (session: EditSession, row: number, config: GutterConfig) { return 0; },
            getText: function (session: EditSession, row: number) { return ""; }
        };
    }

    /**
     * @method getShowLineNumbers
     * @return {boolean}
     */
    getShowLineNumbers(): boolean {
        return this.$showLineNumbers;
    }

    /**
     * @method setShowFoldWidgets
     * @param show {boolean}
     * @return {void}
     */
    setShowFoldWidgets(show: boolean): void {
        if (show) {
            addCssClass(this.element, "ace_folding-enabled");
        }
        else {
            removeCssClass(this.element, "ace_folding-enabled");
        }

        this.$showFoldWidgets = show;
        this.$padding = null;
    }

    /**
     * @method getShowFoldWidgets
     * @return {boolean}
     */
    getShowFoldWidgets(): boolean {
        return this.$showFoldWidgets;
    }

    $computePadding(): Padding {
        if (!this.element.firstChild) {
            return { left: 0, right: 0 };
        }
        // FIXME: The firstChild may not be an HTMLElement.
        const style = window.getComputedStyle(<Element>this.element.firstChild);
        this.$padding = {};
        this.$padding.left = parseInt(style.paddingLeft, 10) + 1 || 0;
        this.$padding.right = parseInt(style.paddingRight, 10) || 0;
        return this.$padding;
    }

    /**
     * Returns either "markers", "foldWidgets", or undefined.
     */
    getRegion(point: { clientX: number; clientY: number }): 'markers' | 'foldWidgets' {
        const padding: Padding = this.$padding || this.$computePadding();
        const rect = this.element.getBoundingClientRect();
        if (point.clientX < padding.left + rect.left) {
            return "markers";
        }
        if (this.$showFoldWidgets && point.clientX > rect.right - padding.right) {
            return "foldWidgets";
        }
    }
}

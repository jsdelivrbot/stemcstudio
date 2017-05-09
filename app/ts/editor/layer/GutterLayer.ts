import { addCssClass, createElement, removeCssClass } from "../lib/dom";

import AbstractLayer from './AbstractLayer';
import escapeHTML from "../lib/escapeHTML";
import { EventEmitterClass } from "../lib/EventEmitterClass";
import Delta from "../Delta";
import { EditSession } from "../EditSession";
import EventBus from "../EventBus";
import FoldWidget from "../FoldWidget";
import Annotation from "../Annotation";
import GutterConfig from "./GutterConfig";
import Padding from './Padding';
import GutterRenderer from './GutterRenderer';
import GutterCell from './GutterCell';
import refChange from '../../utils/refChange';

export const changeGutterWidth = 'changeGutterWidth';
export type GutterLayerEventName = 'changeGutterWidth';

/**
 *
 */
export default class GutterLayer extends AbstractLayer implements EventBus<GutterLayerEventName, number, GutterLayer> {

    /**
     *
     */
    public gutterWidth = 0;

    /**
     * GutterLayer annotations are different from the Annotation type.
     * 
     */
    public $annotations: ({ className: string | undefined; text: string[] } | null)[] = [];
    /**
     * Gutter cells indexed by screen row.
     */
    public $cells: GutterCell[] = [];
    private $fixedWidth = false;
    private $showLineNumbers = true;
    /**
     * 
     */
    private $renderer: GutterRenderer | boolean;
    private session: EditSession;
    private $showFoldWidgets: boolean;
    public $padding: Padding | null;
    private readonly eventBus = new EventEmitterClass<GutterLayerEventName, any, GutterLayer>(this);

    /**
     *
     */
    constructor(parent: HTMLElement) {
        super(parent, "ace_layer ace_gutter-layer");
        refChange(this.uuid, 'GutterLayer', +1);
        this.setShowFoldWidgets(true);
    }

    dispose(): void {
        refChange(this.uuid, 'GutterLayer', -1);
        super.dispose();
    }

    /**
     * Returns a function for removing the callback, or you can call the `off` method.
     */
    on(eventName: GutterLayerEventName, callback: (event: any, source: GutterLayer) => any): () => void {
        this.eventBus.on(eventName, callback, false);
        return () => {
            this.eventBus.off(eventName, callback);
        };
    }

    /**
     *
     */
    off(eventName: GutterLayerEventName, callback: (event: any, source: GutterLayer) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     *
     */
    setSession(session: EditSession): void {
        if (this.session) {
            this.session.off("change", this.sessionChangeHandler);
        }
        this.session = session;
        if (session) {
            session.on("change", this.sessionChangeHandler);
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
            let rowInfo = this.$annotations[row];
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

    /**
     * The fat-arrow definition allows us to use the in a 
     */
    private sessionChangeHandler = (delta: Delta): void => {
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
        const firstLineNumber = session.getFirstLineNumber();
        let lastLineNumber = 0;

        const gutterRenderer = session.gutterRenderer || this.$renderer;

        let cell: GutterCell | null | undefined = null;
        let index = -1;
        let row = firstRow;
        while (true) {
            if (row > foldStart) {
                if (fold) {
                    row = fold.end.row + 1;
                    fold = session.getNextFoldLine(row, fold);
                    foldStart = fold ? fold.start.row : Infinity;
                }
            }
            if (row > lastRow) {
                while (this.$cells.length > index + 1) {
                    cell = this.$cells.pop();
                    if (cell) {
                        this.element.removeChild(cell.element);
                    }
                }
                break;
            }

            cell = this.$cells[++index];
            if (!cell) {
                cell = { element: <HTMLDivElement>createElement("div"), textNode: document.createTextNode(''), foldWidget: null };
                cell.element.appendChild(cell.textNode);
                this.element.appendChild(cell.element);
                this.$cells[index] = cell;
            }

            let className = "ace_gutter-cell ";
            if (breakpoints[row])
                className += breakpoints[row];
            if (decorations[row])
                className += decorations[row];
            const annotation = this.$annotations[row];
            if (annotation) {
                className += annotation.className;
            }
            if (cell.element.className !== className)
                cell.element.className = className;

            const height = session.getRowLength(row) * config.lineHeight + "px";
            if (height !== cell.element.style.height)
                cell.element.style.height = height;

            let c: FoldWidget | null | undefined;
            if (foldWidgets) {
                c = foldWidgets[row];
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
                if (c === "start" && row === foldStart && fold && row < fold.end.row)
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
            const text: string = (gutterRenderer && typeof gutterRenderer !== 'boolean')
                ? gutterRenderer.getText(session, row)
                : lastLineNumber.toString();
            if (text !== cell.textNode.data) {
                cell.textNode.data = text;
            }

            row++;
        }

        this.element.style.height = config.minHeight + "px";

        if (this.$fixedWidth || session.$useWrapMode)
            lastLineNumber = session.getLength() + firstLineNumber;

        let gutterWidth = (gutterRenderer && typeof gutterRenderer !== 'boolean')
            ? gutterRenderer.getWidth(session, lastLineNumber, config)
            : lastLineNumber.toString().length * config.characterWidth;

        const padding = this.$padding || this.$computePadding();
        gutterWidth += padding.left + padding.right;
        if (gutterWidth !== this.gutterWidth && !isNaN(gutterWidth)) {
            this.gutterWidth = gutterWidth;
            this.element.style.width = Math.ceil(this.gutterWidth) + "px";
            this.eventBus._emit(changeGutterWidth, gutterWidth);
        }
    }

    /**
     *
     */
    setShowLineNumbers(showLineNumbers: boolean): void {
        this.$renderer = !showLineNumbers && {
            getWidth: function () { return 0; },
            getText: function () { return ""; }
        };
    }

    /**
     *
     */
    getShowLineNumbers(): boolean {
        return this.$showLineNumbers;
    }

    /**
     * Setting this property changes the CSS class of the `element` property.
     * It also clears the padding.
     */
    setShowFoldWidgets(showFoldWidgets: boolean): void {
        if (showFoldWidgets) {
            addCssClass(this.element, "ace_folding-enabled");
        }
        else {
            removeCssClass(this.element, "ace_folding-enabled");
        }
        this.$showFoldWidgets = showFoldWidgets;
        this.$padding = null;
    }

    /**
     *
     */
    getShowFoldWidgets(): boolean {
        return this.$showFoldWidgets;
    }

    /**
     * Updates and returns a reference to the cached padding property.
     * Always returns a Padding, but the left and right values may be zero.
     */
    private $computePadding(): Padding {
        if (!this.element.firstChild) {
            return { left: 0, right: 0 };
        }
        // FIXME: The firstChild may not be an HTMLElement.
        const style = window.getComputedStyle(<Element>this.element.firstChild);
        this.$padding = { left: 0, right: 0 };
        if (style.paddingLeft) {
            this.$padding.left = parseInt(style.paddingLeft, 10) + 1 || 0;
        }
        else {
            this.$padding.left = 0;
        }
        if (style.paddingRight) {
            this.$padding.right = parseInt(style.paddingRight, 10) || 0;
        }
        else {
            this.$padding.right = 0;
        }
        return this.$padding;
    }

    /**
     * Determines the region of the gutter corresponding to the supplied point.
     * Returns either "markers", "foldWidgets", or undefined (if in neither region).
     */
    getRegion(point: { clientX: number; clientY: number }): 'markers' | 'foldWidgets' | undefined {
        const padding: Padding = this.$padding || this.$computePadding();
        const rect = this.element.getBoundingClientRect();
        if (point.clientX < padding.left + rect.left) {
            return "markers";
        }
        if (this.$showFoldWidgets && point.clientX > rect.right - padding.right) {
            return "foldWidgets";
        }
        return void 0;
    }
}

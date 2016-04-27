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
 * @class GutterLayer
 * @extends AbstractLayer
 */
export default class GutterLayer extends AbstractLayer implements EventBus<number, GutterLayer> {

    /**
     * @property gutterWidth
     * @type number
     * @default 0
     */
    public gutterWidth = 0;

    /**
     * FIXME: Issue with the text being string or string[].
     * GutterLayer annotation seem to be subtly different from Annotation,
     * but maybe Annotation text S/B a string[].
     *
     * @property $annotations
     */
    public $annotations: any[] = [];
    public $cells: GutterCell[] = [];
    private $fixedWidth = false;
    private $showLineNumbers = true;
    private $renderer: any = "";
    private session: EditSession;
    private $showFoldWidgets = true;
    public $padding: Padding;
    private eventBus: EventEmitterClass<any, GutterLayer>;

    /**
     * @class GutterLayer
     * @constructor
     * @param parent {HTMLElement}
     */
    constructor(parent: HTMLElement) {
        super(parent, "ace_layer ace_gutter-layer");
        this.eventBus = new EventEmitterClass<any, GutterLayer>(this);
        this.setShowFoldWidgets(this.$showFoldWidgets);
        this.$updateAnnotations = this.$updateAnnotations.bind(this);
    }

    /**
     * @method on
     * @param eventName {string}
     * @param callback {(event, source: GutterLayer) => any}
     * @return {void}
     */
    on(eventName: string, callback: (event: any, source: GutterLayer) => any): void {
        this.eventBus.on(eventName, callback, false);
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
     * @method setSession
     * @param session {EditSession}
     * @return {void}
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
     * @method setAnnotations
     * @param annotations {Annotation[]}
     * @return {void}
     */
    setAnnotations(annotations: Annotation[]): void {
        // iterate over sparse array
        this.$annotations = [];
        for (var i = 0; i < annotations.length; i++) {
            var annotation = annotations[i];
            var row = annotation.row;
            var rowInfo: any = this.$annotations[row];
            if (!rowInfo) {
                rowInfo = this.$annotations[row] = { text: [] };
            }

            var annoText = annotation.text;
            annoText = annoText ? escapeHTML(annoText) : annotation.html || "";

            if (rowInfo.text.indexOf(annoText) === -1)
                rowInfo.text.push(annoText);

            var type = annotation.type;
            if (type === "error")
                rowInfo.className = " ace_error";
            else if (type === "warning" && rowInfo.className !== " ace_error")
                rowInfo.className = " ace_warning";
            else if (type === "info" && (!rowInfo.className))
                rowInfo.className = " ace_info";
        }
    }

    private $updateAnnotations(delta: Delta, session: EditSession) {
        if (!this.$annotations.length) {
            return;
        }
        var firstRow = delta.start.row;
        var len = delta.end.row - firstRow;
        if (len === 0) {
            // do nothing
        }
        else if (delta.action === "remove") {
            this.$annotations.splice(firstRow, len + 1, null);
        }
        else {
            var args = new Array(len + 1);
            args.unshift(firstRow, 1);
            this.$annotations.splice.apply(this.$annotations, args);
        }
    }

    /**
     * @method update
     * @param config {GutterConfig}
     * @return {void}
     */
    update(config: GutterConfig): void {
        var session = this.session;
        var firstRow = config.firstRow;
        var lastRow = Math.min(config.lastRow + config.gutterOffset,  // needed to compensate for hor scollbar
            session.getLength() - 1);
        var fold = session.getNextFoldLine(firstRow);
        var foldStart = fold ? fold.start.row : Infinity;
        var foldWidgets = this.$showFoldWidgets && session.foldWidgets;
        var breakpoints = session.$breakpoints;
        var decorations = session.$decorations;
        var firstLineNumber = session['$firstLineNumber'];
        var lastLineNumber = 0;

        const gutterRenderer: GutterRenderer = session['gutterRenderer'] || this.$renderer;

        let cell: GutterCell = null;
        var index = -1;
        var row: number = firstRow;
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

            var className = "ace_gutter-cell ";
            if (breakpoints[row])
                className += breakpoints[row];
            if (decorations[row])
                className += decorations[row];
            if (this.$annotations[row])
                className += this.$annotations[row].className;
            if (cell.element.className !== className)
                cell.element.className = className;

            var height = session.getRowLength(row) * config.lineHeight + "px";
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
                var className = "ace_fold-widget ace_" + c;
                if (c === "start" && row === foldStart && row < fold.end.row)
                    className += " ace_closed";
                else
                    className += " ace_open";
                if (cell.foldWidget.className !== className)
                    cell.foldWidget.className = className;

                var height = config.lineHeight + "px";
                if (cell.foldWidget.style.height !== height)
                    cell.foldWidget.style.height = height;
            } else {
                if (cell.foldWidget) {
                    cell.element.removeChild(cell.foldWidget);
                    cell.foldWidget = null;
                }
            }

            var text = lastLineNumber = gutterRenderer
                ? gutterRenderer.getText(session, row)
                : row + firstLineNumber;
            if (text !== cell.textNode.data)
                cell.textNode.data = text;

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
            getWidth: function() { return ""; },
            getText: function() { return ""; }
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
        if (show)
            addCssClass(this.element, "ace_folding-enabled");
        else
            removeCssClass(this.element, "ace_folding-enabled");

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
        var style = window.getComputedStyle(<Element>this.element.firstChild);
        this.$padding = {};
        this.$padding.left = parseInt(style.paddingLeft, 10) + 1 || 0;
        this.$padding.right = parseInt(style.paddingRight, 10) || 0;
        return this.$padding;
    }

    /**
     * Returns either "markers", "foldWidgets", or undefined.
     *
     * @method getRegion
     * @param point {TODO}
     * @return {string}
     */
    getRegion(point: { clientX: number; clientY: number }): string {
        var padding: Padding = this.$padding || this.$computePadding();
        var rect = this.element.getBoundingClientRect();
        if (point.clientX < padding.left + rect.left) {
            return "markers";
        }
        if (this.$showFoldWidgets && point.clientX > rect.right - padding.right) {
            return "foldWidgets";
        }
    }
}

import BackgroundTokenizer from "../BackgroundTokenizer";
import Completion from "../Completion";
import EditSession from '../EditSession';
import Document from "../Document";
import Renderer from "../Renderer";
import Editor from "../Editor";
import PixelPosition from "../PixelPosition";
import Range from "../Range";
import Token from "../Token";
import {addListener} from "../lib/event";
import {stringRepeat} from "../lib/lang";
import {addCssClass, createElement, removeCssClass} from "../lib/dom";
import ListView from "./ListView";

const noop = function () { /* Do nothing. */ };

//
// The ListViewPopup makes use of an Editor to do its rendering.
//
// The Document component of the Editor is overridden in order to create a virtual list.
// The completions are not actually added the document. Instead, a newline is added for
// for each completion and the getLength and getLine methods are overriden. This approach
// may be problematic when combined with the Delta management in the Document.
//

/**
 * A ListView synthesized from an Editor.
 * The items in the list are converted into tokens by overriding the background tokenizer.
 * This implementation is strongly coupled to <code>Completion</code> as the list item.
 * With an appropriate type parameter and a conversio function, this could be generalized.
 * Generalizing by simply allowing strings is not recommended.
 *
 * @class ListViewPopup
 */
export default class ListViewPopup implements ListView {

    /**
     * @property editor
     * @type Editor
     * @private
     */
    private editor: Editor;

    /**
     * The border size is currently fixed at 1 pixel.
     *
     * @property borderSize
     * @type number
     * @private
     */
    private $borderSize = 1;

    /**
     * The image size is currently fixed at 0 pixel.
     *
     * @property imageSize
     * @type number
     * @private
     */
    private imageSize = 0;

    private hoverMarker = new Range(-1, 0, -1, Infinity);
    private hoverMarkerId: number;
    private selectionMarker = new Range(-1, 0, -1, Infinity);
    private selectionMarkerId: number;
    public isOpen = false;
    private isTopdown = false;
    // FIXME: Type.
    private lastMouseEvent: any;
    private lastMouseEventScrollTop;

    /**
     * @property data
     * @type Completion[]
     */
    public data: Completion[] = [];

    private screenWidth: number;

    /**
     * @class ListViewPopup
     * @constructor
     * @param container {HTMLElement}
     */
    constructor(container: HTMLElement) {

        function createEditor(el: HTMLDivElement) {
            const renderer = new Renderer(el);

            renderer.content.style.cursor = "default";
            renderer.setStyle("ace_autocomplete");
            renderer.cursorLayer.restartTimer = noop;
            renderer.cursorLayer.element.style.opacity = "0";
            renderer.maxLines = 8;
            renderer.$keepTextAreaAtCursor = false;

            const doc = new Document("");
            const editSession = new EditSession(doc);
            const editor = new Editor(renderer, editSession);

            editor.setHighlightActiveLine(false);
            editor.setShowPrintMargin(false);
            editor.renderer.setShowGutter(false);
            editor.renderer.setHighlightGutterLine(false);

            editor.setDisplayIndentGuides(false);
            editor.setDragDelay(150);

            editor.focus = noop;
            editor.$isFocused = true;

            editor.setHighlightActiveLine(false);
            // FIXME: This must be a RegExp.
            // editor.session.highlight("");
            editor.getSession().$searchHighlight.clazz = "ace_highlight-marker";

            return editor;
        }

        var el: HTMLDivElement = <HTMLDivElement>createElement("div");
        this.editor = createEditor(el);

        if (container) {
            container.appendChild(el);
        }
        el.style.display = "none";

        // FIXME: The event must be exposed.
        this.editor.on("mousedown", (e) => {
            var pos = e.getDocumentPosition();
            this.editor.selection.moveToPosition(pos);
            this.selectionMarker.start.row = this.selectionMarker.end.row = pos.row;
            e.stop();
        });

        this.selectionMarkerId = this.editor.getSession().addMarker(this.selectionMarker, "ace_active-line", "fullLine");

        this.setSelectOnHover(false);

        this.editor.on("mousemove", (e: MouseEvent) => {
            if (!this.lastMouseEvent) {
                this.lastMouseEvent = e;
                return;
            }
            if (this.lastMouseEvent.x === e.x && this.lastMouseEvent.y === e.y) {
                return;
            }
            this.lastMouseEvent = e;
            this.lastMouseEventScrollTop = this.editor.renderer.scrollTop;
            var row = this.lastMouseEvent.getDocumentPosition().row;
            if (this.hoverMarker.start.row !== row) {
                if (!this.hoverMarkerId) {
                    this.setRow(row);
                }
                this.setHoverMarker(row);
            }
        });
        this.editor.renderer.on("beforeRender", () => {
            if (this.lastMouseEvent && this.hoverMarker.start.row !== -1) {
                this.lastMouseEvent.$pos = null;
                var row = this.lastMouseEvent.getDocumentPosition().row;
                if (!this.hoverMarkerId) {
                    this.setRow(row);
                }
                this.setHoverMarker(row, true);
            }
        });
        this.editor.renderer.on("afterRender", () => {
            const row = this.getRow();
            const t = this.editor.renderer.textLayer;
            const selected = <HTMLElement>t.element.childNodes[row - t.config.firstRow];
            if (selected === t.selectedNode)
                return;
            if (t.selectedNode)
                removeCssClass(t.selectedNode, "ace_selected");
            t.selectedNode = selected;
            if (selected)
                addCssClass(selected, "ace_selected");
        });

        var hideHoverMarker = () => { this.setHoverMarker(-1); };

        addListener(this.editor.container, "mouseout", hideHoverMarker);
        this.editor.on("hide", hideHoverMarker);
        this.editor.on("changeSelection", hideHoverMarker);

        // Override methods on the Document to simulate a virtual list.
        this.editor.getSession().doc.getLength = () => {
            return this.data.length;
        };
        this.editor.getSession().doc.getLine = (i: number) => {
            var data = this.data[i];
            return (data && data.value) || "";
        };

        var bgTokenizer: BackgroundTokenizer = this.editor.getSession().bgTokenizer;
        bgTokenizer.tokenizeRow = (row: number) => {
            var data: Completion = this.data[row];
            var tokens: Token[] = [];
            if (!data)
                return tokens;
            if (!data.caption) {
                data.caption = data.value || data.name;
            }

            var last = -1;
            var flag: number;
            var c: string;
            for (var cIndex = 0, length = data.caption.length; cIndex < length; cIndex++) {
                c = data.caption[cIndex];
                flag = data.matchMask & (1 << cIndex) ? 1 : 0;
                if (last !== flag) {
                    tokens.push({ type: data.className || "" + (flag ? "completion-highlight" : ""), value: c });
                    last = flag;
                }
                else {
                    tokens[tokens.length - 1].value += c;
                }
            }

            if (data.meta) {
                var maxW = this.editor.renderer.$size.scrollerWidth / this.editor.renderer.layerConfig.characterWidth;
                if (data.meta.length + data.caption.length < maxW - 2) {
                    tokens.push({ type: "rightAlignedText", value: data.meta });
                }
            }
            return tokens;
        };
        bgTokenizer.updateOnChange = noop;
        bgTokenizer.start = noop;

        this.editor.getSession().$computeWidth = () => {
            return this.screenWidth = 0;
        };

        this.editor.on("changeSelection", function () {
            if (this.isOpen) {
                this.setRow(this.popup.selection.lead.row);
            }
        });
    }

    /**
     * @method show
     * @param pos {PixelPosition}
     * @param lineHeight {number}
     * @param [topdownOnly] {boolean}
     * @return {void}
     */
    show(pos: PixelPosition, lineHeight: number, topdownOnly?: boolean): void {
        var el = this.editor.container;
        var screenHeight = window.innerHeight;
        var screenWidth = window.innerWidth;
        var renderer = this.editor.renderer;
        // var maxLines = Math.min(renderer.$maxLines, this.session.getLength());
        var maxH = renderer.maxLines * lineHeight * 1.4;
        var top = pos.top + this.$borderSize;
        if (top + maxH > screenHeight - lineHeight && !topdownOnly) {
            el.style.top = "";
            el.style.bottom = screenHeight - top + "px";
            this.isTopdown = false;
        }
        else {
            top += lineHeight;
            el.style.top = top + "px";
            el.style.bottom = "";
            this.isTopdown = true;
        }

        el.style.display = "";
        renderer.textLayer.checkForSizeChanges();

        var left = pos.left;
        if (left + el.offsetWidth > screenWidth) {
            left = screenWidth - el.offsetWidth;
        }

        el.style.left = left + "px";

        this.editor._signal("show");
        this.lastMouseEvent = null;
        this.isOpen = true;
    }

    /**
     * @method hide
     * @return {void}
     */
    hide(): void {
        this.editor.container.style.display = "none";
        this.editor._signal("hide");
        this.isOpen = false;
    }

    /**
     * @method setData
     * @param items {Completion[]}
     * @return {void}
     */
    setData(items: Completion[]): void {
        this.editor.setValue(stringRepeat("\n", items.length), -1);
        this.data = items || [];
        this.setRow(0);
    }

    /**
     * @method getData
     * @param row {number}
     * @return {Completion}
     */
    getData(row: number): Completion {
        return this.data[row];
    }

    on(eventName: string, callback: (event, ee: Editor) => any, capturing?: boolean): () => void {
        return this.editor.on(eventName, callback, capturing);
    }

    off(eventName: string, callback: (event, ee: Editor) => any): void {
        return this.editor.off(eventName, callback);
    }

    /**
     * @method getTextLeftOffset
     * @return {number}
     */
    getTextLeftOffset(): number {
        // The imageSize is currently always zero.
        return this.$borderSize + this.editor.renderer.getPadding() + this.imageSize;
    }

    /**
     * @method setSelectOnHover
     * @param selectOnHover {boolean}
     * @return {void}
     */
    setSelectOnHover(selectOnHover: boolean): void {
        if (!selectOnHover) {
            this.hoverMarkerId = this.editor.getSession().addMarker(this.hoverMarker, "ace_line-hover", "fullLine");
        }
        else if (this.hoverMarkerId) {
            this.editor.getSession().removeMarker(this.hoverMarkerId);
            this.hoverMarkerId = null;
        }
    }

    setHoverMarker(row: number, suppressRedraw?: boolean) {
        if (row !== this.hoverMarker.start.row) {
            this.hoverMarker.start.row = this.hoverMarker.end.row = row;
            if (!suppressRedraw) {
                this.editor.getSession()._emit("changeBackMarker");
            }
            this.editor._emit("changeHoverMarker");
        }
    }

    getHoveredRow(): number {
        return this.hoverMarker.start.row;
    }

    getRow(): number {
        return this.selectionMarker.start.row;
    }

    setRow(row: number): void {
        row = Math.max(-1, Math.min(this.data.length, row));
        if (this.selectionMarker.start.row !== row) {
            this.editor.selection.clearSelection();
            this.selectionMarker.start.row = this.selectionMarker.end.row = row || 0;
            this.editor.getSession()._emit("changeBackMarker");
            this.editor.moveCursorTo(row || 0, 0);
            if (this.isOpen) {
                this.editor._signal("select");
            }
        }
    }

    setThemeCss(themeId: string, href?: string): void {
        this.editor.renderer.setThemeCss(themeId, href);
    }

    setThemeDark(isDark: boolean): void {
        this.editor.renderer.setThemeDark(isDark);
    }

    setFontSize(fontSize: string): void {
        this.editor.setFontSize(fontSize);
    }

    focus(): void {
        this.editor.focus();
    }

    getLength(): number {
        return this.editor.getSession().getLength();
    }

    get container(): HTMLElement {
        return this.editor.container;
    }
}

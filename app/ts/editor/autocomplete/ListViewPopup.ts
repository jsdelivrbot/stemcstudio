import { BackgroundTokenizer } from "../BackgroundTokenizer";
import { Completion } from "../Completion";
import { EditSession } from '../EditSession';
import { Document } from "editor-document";
import { Renderer } from "../Renderer";
import { Editor } from "../Editor";
import { EditorEventName } from "../Editor";
import { PixelPosition } from "../PixelPosition";
import { Range } from "../Range";
import { Token } from "../Token";
import { addListener } from "../lib/event";
import { stringRepeat } from "../lib/lang";
import { addCssClass, createElement, removeCssClass } from "../lib/dom";
import { ListView } from "./ListView";

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
 */
export class ListViewPopup implements ListView {

    /**
     *
     */
    private editor: Editor;

    /**
     * The border size is currently fixed at 1 pixel.
     */
    private $borderSize = 1;

    /**
     * The image size is currently fixed at 0 pixel.
     */
    private imageSize = 0;

    private hoverMarker = new Range(-1, 0, -1, Infinity);
    private hoverMarkerId: number | null;
    private selectionMarker = new Range(-1, 0, -1, Infinity);
    public isOpen = false;
    // FIXME: Type needs to be more than just MouseEvent.
    private lastMouseEvent: any;

    /**
     *
     */
    private data: Completion[] = [];

    private screenWidth: number;

    /**
     * @param container
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
            const session = new EditSession(doc);
            const editor = new Editor(renderer, session);

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
            session.$searchHighlight.clazz = "ace_highlight-marker";

            return editor;
        }

        const el: HTMLDivElement = <HTMLDivElement>createElement("div");
        this.editor = createEditor(el);

        if (container) {
            container.appendChild(el);
        }
        el.style.display = "none";

        // FIXME: The event must be exposed.
        this.editor.on("mousedown", (e) => {
            const pos = e.getDocumentPosition();
            this.editor.selectionOrThrow().moveToPosition(pos);
            this.selectionMarker.start.row = this.selectionMarker.end.row = pos.row;
            e.stop();
        });

        this.editor.sessionOrThrow().addMarker(this.selectionMarker, "ace_active-line", "fullLine");

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
            const row = this.lastMouseEvent.getDocumentPosition().row;
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
                const row = this.lastMouseEvent.getDocumentPosition().row;
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

        const hideHoverMarker = () => { this.setHoverMarker(-1); };

        addListener(this.editor.container, "mouseout", hideHoverMarker);
        this.editor.on("hide", hideHoverMarker);
        this.editor.on("changeSelection", hideHoverMarker);

        // Override methods on the Document to simulate a virtual list.
        const session = this.editor.sessionOrThrow();
        const doc = session.docOrThrow();
        doc.getLength = () => {
            return this.data.length;
        };
        doc.getLine = (i: number) => {
            const data = this.data[i];
            return (data && data.value) || "";
        };

        const bgTokenizer: BackgroundTokenizer = session.bgTokenizer;
        bgTokenizer.tokenizeRow = (row: number) => {
            const data = this.data[row];
            const tokens: Token[] = [];
            if (!data)
                return tokens;
            if (!data.caption) {
                data.caption = data.value || data.name || "";
            }

            let last = -1;
            let flag: number;
            let c: string;
            for (let cIndex = 0, length = data.caption.length; cIndex < length; cIndex++) {
                c = data.caption[cIndex];
                flag = (data.matchMask as number) & (1 << cIndex) ? 1 : 0;
                if (last !== flag) {
                    tokens.push({ type: data.className || "" + (flag ? "completion-highlight" : ""), value: c });
                    last = flag;
                }
                else {
                    tokens[tokens.length - 1].value += c;
                }
            }

            if (data.meta) {
                const maxW = this.editor.renderer.$size.scrollerWidth / this.editor.renderer.layerConfig.characterWidth;
                if (data.meta.length + data.caption.length < maxW - 2) {
                    tokens.push({ type: "rightAlignedText", value: data.meta });
                }
            }
            return tokens;
        };
        bgTokenizer.updateOnChange = noop;
        bgTokenizer.start = noop;

        session.$computeWidth = () => {
            return this.screenWidth = 0;
        };

        this.editor.on("changeSelection", () => {
            if (this.isOpen) {
                if (this.editor.selection) {
                    this.setRow(this.editor.selection.lead.row);
                }
            }
            this.editor.renderer.scrollCursorIntoView();
        });
    }

    /**
     * @param pos
     * @param lineHeight
     * @param topdownOnly
     */
    show(pos: PixelPosition, lineHeight: number, topdownOnly?: boolean): void {
        const el = this.editor.container;
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        const renderer = this.editor.renderer;
        // maxLines = Math.min(renderer.$maxLines, this.session.getLength());
        const maxH = renderer.maxLines * lineHeight * 1.4;
        let top = pos.top + this.$borderSize;
        if (top + maxH > screenHeight - lineHeight && !topdownOnly) {
            el.style.top = "";
            el.style.bottom = screenHeight - top + "px";
        }
        else {
            top += lineHeight;
            el.style.top = top + "px";
            el.style.bottom = "";
        }

        el.style.display = "";
        renderer.textLayer.checkForSizeChanges();

        let left = pos.left;
        if (left + el.offsetWidth > screenWidth) {
            left = screenWidth - el.offsetWidth;
        }

        el.style.left = left + "px";

        this.editor._signal("show");
        this.lastMouseEvent = null;
        this.isOpen = true;
    }

    /**
     *
     */
    hide(): void {
        this.editor.container.style.display = "none";
        this.editor._signal("hide");
        this.isOpen = false;
    }

    getCompletions(): Completion[] {
        return this.data;
    }

    /**
     *
     */
    setCompletions(completions: Completion[]): void {
        this.editor.setValue(stringRepeat("\n", completions.length), -1);
        this.data = completions || [];
        this.setRow(0);
    }

    /**
     * Returns the Completion at the specified zero-based row.
     */
    getCompletionAtRow(row: number): Completion {
        return this.data[row];
    }

    on(eventName: EditorEventName, callback: (event: any, ee: Editor) => any, capturing?: boolean): () => void {
        return this.editor.on(eventName, callback, capturing);
    }

    off(eventName: EditorEventName, callback: (event: any, ee: Editor) => any, capturing?: boolean): void {
        return this.editor.off(eventName, callback, capturing);
    }

    /**
     *
     */
    getTextLeftOffset(): number {
        // The imageSize is currently always zero.
        return this.$borderSize + this.editor.renderer.getPadding() + this.imageSize;
    }

    /**
     * @param selectOnHover
     */
    setSelectOnHover(selectOnHover: boolean): void {
        const session = this.editor.sessionOrThrow();
        if (!selectOnHover) {
            this.hoverMarkerId = session.addMarker(this.hoverMarker, "ace_line-hover", "fullLine");
        }
        else if (this.hoverMarkerId) {
            session.removeMarker(this.hoverMarkerId);
            this.hoverMarkerId = null;
        }
    }

    setHoverMarker(row: number, suppressRedraw?: boolean) {
        if (row !== this.hoverMarker.start.row) {
            this.hoverMarker.start.row = this.hoverMarker.end.row = row;
            if (!suppressRedraw) {
                this.editor.sessionOrThrow()._emit("changeBackMarker");
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
            this.editor.selectionOrThrow().clearSelection();
            this.selectionMarker.start.row = this.selectionMarker.end.row = row || 0;
            this.editor.sessionOrThrow()._emit("changeBackMarker");
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

    setFontSize(fontSize: string | null): void {
        this.editor.setFontSize(fontSize);
    }

    focus(): void {
        this.editor.focus();
    }

    getLength(): number {
        return this.editor.sessionOrThrow().getLength();
    }

    get container(): HTMLElement {
        return this.editor.container;
    }
}

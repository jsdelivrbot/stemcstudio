import { addCssClass, createElement, createHTMLDivElement, removeCssClass, setCssClass } from "./lib/dom";
import { isIE } from './lib/useragent';
import { appendHTMLLinkElement } from './dom/appendHTMLLinkElement';
import { removeHTMLLinkElement } from './dom/removeHTMLLinkElement';
import { Disposable } from './Disposable';
import { ensureHTMLStyleElement } from './dom/ensureHTMLStyleElement';
import { hasHTMLLinkElement } from './dom/hasHTMLLinkElement';
import { Annotation } from './Annotation';

import { CursorLayer } from "./layer/CursorLayer";
import { FontMetrics } from "./layer/FontMetrics";
import { changeCharacterSize } from './layer/FontMetrics';
import { GutterLayer } from "./layer/GutterLayer";
import { MarkerLayer } from "./layer/MarkerLayer";
import { TextLayer } from "./layer/TextLayer";

import { VScrollBar } from "./VScrollBar";
import { HScrollBar } from "./HScrollBar";

import { RenderLoop } from "./RenderLoop";
import { EventEmitterClass } from "./lib/EventEmitterClass";
import { EditSession } from './EditSession';
import { EventBus } from './EventBus';
import { OptionsProvider } from "./OptionsProvider";
import { PixelPosition } from './PixelPosition';
import { Position } from 'editor-document';
import { ScreenCoordinates } from './ScreenCoordinates';
import { ScrollBarEvent } from './events/ScrollBarEvent';
import { EditorRenderer } from './EditorRenderer';
import { refChange } from './refChange';

// FIXME: The editor.css is crucial to the operation of the renderer.
// import editorCss = require("./requirejs/text!./css/editor.css");
// ensureHTMLStyleElement(editorCss, "ace_editor");

const CHANGE_CURSOR = 1;
const CHANGE_MARKER = 2;
const CHANGE_GUTTER = 4;
const CHANGE_SCROLL = 8;
const CHANGE_LINES = 16;
const CHANGE_TEXT = 32;
const CHANGE_SIZE = 64;
const CHANGE_MARKER_BACK = 128;
const CHANGE_MARKER_FRONT = 256;
const CHANGE_FULL = 512;
const CHANGE_H_SCROLL = 1024;

// Useful for debugging...
/*
function changesToString(changes: number): string {
    let a = "";
    if (changes & CHANGE_CURSOR) a += " cursor";
    if (changes & CHANGE_MARKER) a += " marker";
    if (changes & CHANGE_GUTTER) a += " gutter";
    if (changes & CHANGE_SCROLL) a += " scroll";
    if (changes & CHANGE_LINES) a += " lines";
    if (changes & CHANGE_TEXT) a += " text";
    if (changes & CHANGE_SIZE) a += " size";
    if (changes & CHANGE_MARKER_BACK) a += " marker_back";
    if (changes & CHANGE_MARKER_FRONT) a += " marker_front";
    if (changes & CHANGE_FULL) a += " full";
    if (changes & CHANGE_H_SCROLL) a += " h_scroll";
    return a.trim();
}
*/

export type TextDirection = 'ltr' | 'rtl' | 'auto';

/**
 * Computes steps for animation purposes.
 * The number of steps is hard-coded to 8.
 */
function calcSteps(fromValue: number, toValue: number): number[] {
    const Δ = toValue - fromValue;
    const N = 8;
    const steps: number[] = [];

    /**
     * The interpolation function.
     */
    const func = function (t: number, x_min: number, dx: number): number {
        return dx * (Math.pow(t - 1, 3) + 1) + x_min;
    };

    for (let i = 0; i < N; ++i) {
        steps.push(func(i / N, fromValue, Δ));
    }

    return steps;
}

export type RendererEventName = 'afterRender'
    | 'beforeRender'
    | 'changeCharacterSize'
    | 'resize'
    | 'scrollbarVisibilityChanged'
    | 'themeLoaded';

/**
 * The class that is responsible for drawing everything you see on the screen!
 */
export class Renderer implements Disposable, EventBus<RendererEventName, any, Renderer>, EditorRenderer, OptionsProvider {
    /**
     * 
     */
    private readonly uuid = `${Math.random()}`;

    public textarea: HTMLTextAreaElement;
    public container: HTMLElement;
    public scrollLeft = 0;
    public scrollTop = 0;
    public layerConfig = {
        width: 1,
        padding: 0,
        firstRow: 0,
        firstRowScreen: 0,
        lastRow: 0,
        lineHeight: 0,
        characterWidth: 0,
        minHeight: 1,
        maxHeight: 1,
        offset: 0,
        height: 1,
        gutterOffset: 1
    };

    /**
     *
     */
    private $maxLines: number;
    private $minLines: number;

    /**
     * FIXME: Leaky. ListViewPopup and showErrorMarker use this property.
     */
    public readonly cursorLayer: CursorLayer;

    /**
     *
     */
    public readonly $gutterLayer: GutterLayer;

    /**
     *
     */
    private readonly $markerFront: MarkerLayer;

    /**
     *
     */
    private readonly $markerBack: MarkerLayer;

    /**
     * FIXME: Leaky. ListViewPopup uses this property.
     */
    public readonly textLayer: TextLayer;

    /**
     * Used by TokenTooltip...
     */
    public $padding = 0;

    private $frozen = false;

    /**
     * The identifier of the theme and the class e.g. 'ace-themename'
     */
    private themeId: string;

    /**
     * The loaded theme object. This allows us to remove a theme.
     */
    private theme: { cssClass: string };

    /**
     * $timer is used for animated scrolling.
     */
    private $timer: number | undefined;

    public $keepTextAreaAtCursor: boolean | null = true;
    public $gutter: HTMLDivElement;
    public scroller: HTMLDivElement;
    public content: HTMLDivElement;

    /**
     * This is the element that is created by the text layer.
     * I don't think it is being used, and it's private.
     */
    // private canvas: HTMLDivElement;

    private $horizScroll: boolean;
    private $vScroll: boolean;
    public scrollBarH: HScrollBar;
    public scrollBarV: VScrollBar;
    private scrollBarHscrollUnhook: () => void;
    private scrollBarVscrollUnhook: () => void;

    /**
     *
     */
    public $scrollAnimation: { from: number; to: number; steps: number[] } | null;
    /**
     * ScrollBar width in pixels.
     */
    public $scrollbarWidth: number;
    private session: EditSession | undefined;
    private eventBus: EventEmitterClass<RendererEventName, any, Renderer>;

    private scrollMargin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        v: 0,
        h: 0
    };

    /**
     * 
     */
    private fontMetrics: FontMetrics | undefined;

    /**
     * A function that removes the changeCharacterSize handler.
     */
    private removeChangeCharacterSizeHandler: (() => void) | undefined;

    private $allowBoldFonts: boolean;
    // private cursorPos: Position;

    /**
     * A cache of various sizes TBA.
     */
    public $size: { height: number; width: number; scrollerHeight: number; scrollerWidth: number; $dirty: boolean };

    private $loop: RenderLoop;
    private $changedLines: { firstRow: number; lastRow: number; } | null;
    /**
     * 
     */
    private $changes = 0;
    private resizing: number;
    private $gutterLineHighlight: HTMLDivElement;
    // FIXME: Why do we have two?
    public gutterWidth: number;
    private $gutterWidth: number;

    /**
     * TODO: Create a PrintMarginLayer class in the layer folder.
     */
    private $printMarginEl: HTMLDivElement;
    private $printMarginColumn = 80;
    private $showPrintMargin: boolean;

    /**
     * The character width, in pixels.
     */
    public characterWidth: number;

    /**
     *
     */
    public lineHeight: number;

    private $extraHeight: number;
    private $composition: { keepTextAreaAtCursor: boolean | null; cssText: string } | null;
    private $hScrollBarAlwaysVisible = false;
    private $vScrollBarAlwaysVisible = false;
    private $showGutter = true;
    private showInvisibles = false;
    private animatedScroll = false;
    private fadeFoldWidgets = false;
    private $scrollPastEnd: number;
    private $highlightGutterLine: boolean;
    private desiredHeight: number;

    /**
     * Constructs a new `Renderer` within the `container` specified.
     */
    constructor(container: HTMLElement) {
        refChange('start');
        refChange(this.uuid, 'Renderer', +1);
        this.eventBus = new EventEmitterClass<RendererEventName, any, Renderer>(this);

        this.container = container || <HTMLDivElement>createElement("div");
        this.container.dir = 'ltr';

        // TODO: this breaks rendering in Cloud9 with multiple ace instances
        // // Imports CSS once per DOM document ('ace_editor' serves as an identifier).
        // ensureHTMLStyleElement(editorCss, "ace_editor", container.ownerDocument);

        addCssClass(this.container, "ace_editor");

        this.$gutter = createElement("div") as HTMLDivElement;
        this.$gutter.className = "ace_gutter";
        this.container.appendChild(this.$gutter);
        // Hide gutter from screen-readers. 
        this.$gutter.setAttribute("aria-hidden", "true");

        this.scroller = createElement("div") as HTMLDivElement;
        this.scroller.className = "ace_scroller";
        this.container.appendChild(this.scroller);

        this.content = createElement("div") as HTMLDivElement;
        this.content.className = "ace_content";
        this.scroller.appendChild(this.content);

        this.$gutterLayer = new GutterLayer(this.$gutter);
        this.$gutterLayer.on("changeGutterWidth", this.onGutterResize.bind(this));

        this.$markerBack = new MarkerLayer(this.content);

        this.textLayer = new TextLayer(this.content);
        // this.canvas = this.textLayer.element;

        this.$markerFront = new MarkerLayer(this.content);

        this.cursorLayer = new CursorLayer(this.content);

        // Indicates whether the horizontal scrollbar is visible
        this.$horizScroll = false;
        this.$vScroll = false;

        this.scrollBarV = new VScrollBar(this.container, this);
        this.scrollBarVscrollUnhook = this.scrollBarV.on("scroll", (event: ScrollBarEvent, scrollBar: VScrollBar) => {
            if (!this.$scrollAnimation && this.session) {
                this.session.setScrollTop(event.data - this.scrollMargin.top);
            }
        });

        this.scrollBarH = new HScrollBar(this.container, this);
        this.scrollBarHscrollUnhook = this.scrollBarH.on("scroll", (event: ScrollBarEvent, scrollBar: HScrollBar) => {
            if (!this.$scrollAnimation && this.session) {
                this.session.setScrollLeft(event.data - this.scrollMargin.left);
            }
        });

        this.fontMetrics = new FontMetrics(this.container, 500);

        this.textLayer.setFontMetrics(this.fontMetrics);

        this.removeChangeCharacterSizeHandler = this.textLayer.on(changeCharacterSize, (event, text: TextLayer) => {
            this.updateCharacterSize();
            this.onResize(true, this.gutterWidth, this.$size.width, this.$size.height);
            this.eventBus._signal(changeCharacterSize, event);
        });

        this.$size = {
            width: 0,
            height: 0,
            scrollerHeight: 0,
            scrollerWidth: 0,
            $dirty: true
        };

        this.$loop = new RenderLoop(this.$renderChanges.bind(this), this.container.ownerDocument.defaultView);
        this.$loop.schedule(CHANGE_FULL);

        this.setPadding(4);
        this.setFontSize("16px");
        this.setShowFoldWidgets(true);
        this.updateCharacterSize();
    }

    /**
     * Destroys the font metrics, text, and cursor layers for this renderer.
     */
    dispose(): void {
        if (this.removeChangeCharacterSizeHandler) {
            this.removeChangeCharacterSizeHandler();
            this.removeChangeCharacterSizeHandler = void 0;
        }

        // TODO: Do we need to have the textLayer release the fontMetrics?

        if (this.fontMetrics) {
            this.fontMetrics.release();
            this.fontMetrics = void 0;
        }

        this.scrollBarHscrollUnhook();
        this.scrollBarH.dispose();

        this.scrollBarVscrollUnhook();
        this.scrollBarV.dispose();

        this.cursorLayer.dispose();

        this.$markerFront.dispose();

        this.textLayer.dispose();

        this.$markerBack.dispose();

        this.$gutterLayer.dispose();

        this.scroller.removeChild(this.content);
        this.container.removeChild(this.scroller);
        this.container.removeChild(this.$gutter);

        refChange(this.uuid, 'Renderer', -1);
        refChange('stop');
    }

    /**
     * Returns a function that may be used to remove the callback.
     */
    on(eventName: RendererEventName, callback: (event: any, source: Renderer) => any): () => void {
        this.eventBus.on(eventName, callback, false);
        return () => {
            this.eventBus.off(eventName, callback);
        };
    }

    off(eventName: RendererEventName, callback: (event: any, source: Renderer) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * 
     */
    get maxLines(): number {
        return this.$maxLines;
    }

    /**
     *
     */
    set maxLines(maxLines: number) {
        this.$maxLines = maxLines;
    }

    /**
     * 
     */
    get minLines(): number {
        return this.$minLines;
    }

    /**
     *
     */
    set minLines(minLines: number) {
        this.$minLines = minLines;
    }

    /**
     *
     */
    set keepTextAreaAtCursor(keepTextAreaAtCursor: boolean) {
        this.$keepTextAreaAtCursor = keepTextAreaAtCursor;
    }

    /**
     * Sets the <code>style</code> property of the content to "default".
     */
    setDefaultCursorStyle(): void {
        this.content.style.cursor = "default";
    }

    /**
     * Sets the <code>opacity</code> of the cursor layer to "0".
     */
    setCursorLayerOff(): void {
        const noop = function () {/* Do nothing.*/ };
        this.cursorLayer.restartTimer = noop;
        this.cursorLayer.element.style.opacity = "0";
    }

    /**
     *
     */
    updateCharacterSize(): void {
        // FIXME: DGH allowBoldFonts does not exist on TextLayer
        if (this.textLayer.allowBoldFonts !== this.$allowBoldFonts) {
            this.$allowBoldFonts = this.textLayer.allowBoldFonts;
            this.setStyle("ace_nobold", !this.$allowBoldFonts);
        }

        this.layerConfig.characterWidth = this.characterWidth = this.textLayer.getCharacterWidth();
        this.layerConfig.lineHeight = this.lineHeight = this.textLayer.getLineHeight();
        this.$updatePrintMargin();
    }

    /**
     * Associates the renderer with a different EditSession.
     */
    setSession(session: EditSession | undefined): void {
        if (this.session) {
            if (this.session.doc) {
                this.session.doc.removeChangeNewLineModeListener(this.onChangeNewLineMode);
            }
            // TODO: Why aren't we cleaning up the layers too?
        }

        this.session = session;
        if (session) {
            const scrollTop = session.getScrollTop();
            if (typeof scrollTop === 'number') {
                if (this.scrollMargin.top && scrollTop <= 0) {
                    session.setScrollTop(-this.scrollMargin.top);
                }
            }

            this.cursorLayer.setSession(session);
            this.$markerBack.setSession(session);
            this.$markerFront.setSession(session);
            this.$gutterLayer.setSession(session);
            this.textLayer.setSession(session);
            if (!session) {
                return;
            }

            this.$loop.schedule(CHANGE_FULL);
            // this.session.$setFontMetrics(this.fontMetrics);
            // this.scrollBarH.scrollLeft = this.scrollBarV.scrollTop = null;

            this.onChangeNewLineMode();
            if (session.doc) {
                session.doc.addChangeNewLineModeListener(this.onChangeNewLineMode);
            }
        }
    }

    /**
     * Triggers a partial update of the text, from the range given by the two parameters.
     *
     * @param firstRow The first row to update.
     * @param lastRow The last row to update.
     * @param force
     */
    updateLines(firstRow: number, lastRow: number, force?: boolean): void {
        if (lastRow === undefined) {
            lastRow = Infinity;
        }

        if (!this.$changedLines) {
            this.$changedLines = { firstRow: firstRow, lastRow: lastRow };
        }
        else {
            if (this.$changedLines.firstRow > firstRow) {
                this.$changedLines.firstRow = firstRow;
            }

            if (this.$changedLines.lastRow < lastRow) {
                this.$changedLines.lastRow = lastRow;
            }
        }

        // If the change happened offscreen above us then it's possible
        // that a new line wrap will affect the position of the lines on our
        // screen so they need redrawn.
        // TODO: better solution is to not change scroll position when text is changed outside of visible area
        if (this.$changedLines.lastRow < this.layerConfig.firstRow) {
            if (force) {
                this.$changedLines.lastRow = this.layerConfig.lastRow;
            }
            else {
                return;
            }
        }

        if (this.$changedLines.firstRow > this.layerConfig.lastRow) {
            return;
        }
        this.$loop.schedule(CHANGE_LINES);
    }

    /**
     * We use this as a callback, so we use a fat-arrow to bind this.
     * In other words, you don't have to worry about binding it anymore.
     */
    private onChangeNewLineMode = (): void => {
        this.$loop.schedule(CHANGE_TEXT);
        this.textLayer.updateEolChar();
    }

    /**
     *
     */
    public onChangeTabSize(): void {
        if (this.$loop) {
            if (this.$loop.schedule) {
                this.$loop.schedule(CHANGE_TEXT | CHANGE_MARKER);
            }
        }
        if (this.textLayer) {
            if (this.textLayer.onChangeTabSize) {
                this.textLayer.onChangeTabSize();
            }
        }
    }

    /**
     * Triggers a full update of the text, for all the rows.
     */
    updateText(): void {
        this.$loop.schedule(CHANGE_TEXT);
    }

    /**
     * Triggers a full update of all the layers, for all the rows.
     *
     * @param force If `true`, forces the changes through.
     */
    updateFull(force?: boolean): void {
        if (force)
            this.$renderChanges(CHANGE_FULL, true);
        else
            this.$loop.schedule(CHANGE_FULL);
    }

    /**
     * Updates the font size.
     */
    updateFontSize(): void {
        this.textLayer.checkForSizeChanges();
    }

    /**
     *
     */
    private $updateSizeAsync(): void {
        if (this.$loop.pending) {
            this.$size.$dirty = true;
        }
        else {
            this.onResize();
        }
    }

    /**
     * Triggers a resize of the renderer.
     *
     * @param force If `true`, recomputes the size, even if the height and width haven't changed
     * @param gutterWidth The width of the gutter in pixels
     * @param width The width of the editor in pixels
     * @param height The hiehgt of the editor, in pixels
     */
    public onResize(force?: boolean, gutterWidth?: number, width?: number, height?: number): number | undefined {
        if (this.resizing > 2)
            return void 0;
        else if (this.resizing > 0)
            this.resizing++;
        else
            this.resizing = force ? 1 : 0;
        // `|| el.scrollHeight` is required for outosizing editors on ie
        // where elements with clientHeight = 0 alsoe have clientWidth = 0
        const el = this.container;
        if (!height)
            height = el.clientHeight || el.scrollHeight;
        if (!width)
            width = el.clientWidth || el.scrollWidth;
        const changes = this.$updateCachedSize(force, gutterWidth, width, height);


        if (!this.$size.scrollerHeight || (!width && !height))
            return this.resizing = 0;

        if (force)
            this.$gutterLayer.$padding = null;

        if (force)
            this.$renderChanges(changes | this.$changes, true);
        else
            this.$loop.schedule(changes | this.$changes);

        if (this.resizing) {
            this.resizing = 0;
        }
        return void 0;
    }

    /**
     * 
     */
    private $updateCachedSize(force: boolean | undefined, gutterWidthPixels: number | undefined, width: number, height: number): number {
        height -= (this.$extraHeight || 0);
        let changes = 0;
        const size = this.$size;
        const oldSize = {
            width: size.width,
            height: size.height,
            scrollerHeight: size.scrollerHeight,
            scrollerWidth: size.scrollerWidth
        };
        if (height && (force || size.height !== height)) {
            size.height = height;
            changes |= CHANGE_SIZE;

            size.scrollerHeight = size.height;
            if (this.$horizScroll) {
                size.scrollerHeight -= this.scrollBarH.height;
            }

            this.scrollBarV.element.style.bottom = pixelStyle(this.scrollBarH.height);

            changes = changes | CHANGE_SCROLL;
        }

        if (width && (force || size.width !== width)) {
            changes |= CHANGE_SIZE;
            size.width = width;

            if (typeof gutterWidthPixels !== 'number') {
                gutterWidthPixels = this.$showGutter ? this.$gutter.offsetWidth : 0;
            }

            this.gutterWidth = gutterWidthPixels;

            this.scrollBarH.element.style.left = this.scroller.style.left = pixelStyle(gutterWidthPixels);
            size.scrollerWidth = Math.max(0, width - gutterWidthPixels - this.scrollBarV.width);

            this.scrollBarH.element.style.right = this.scroller.style.right = pixelStyle(this.scrollBarV.width);
            this.scroller.style.bottom = pixelStyle(this.scrollBarH.height);

            if (this.session && this.session.getUseWrapMode() && this.adjustWrapLimit() || force) {
                changes |= CHANGE_FULL;
            }
        }

        size.$dirty = !width || !height;

        if (changes) {
            /**
             * @event resize
             */
            this.eventBus._signal("resize", oldSize);
        }

        return changes;
    }

    private onGutterResize() {
        const gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0;
        if (gutterWidth !== this.gutterWidth) {
            this.$changes |= this.$updateCachedSize(true, gutterWidth, this.$size.width, this.$size.height);
        }

        if (this.session && this.session.getUseWrapMode() && this.adjustWrapLimit()) {
            this.$loop.schedule(CHANGE_FULL);
        }
        else if (this.$size.$dirty) {
            this.$loop.schedule(CHANGE_FULL);
        }
        else {
            this.$computeLayerConfig();
            this.$loop.schedule(CHANGE_MARKER);
        }
    }

    private sessionOrThrow(): EditSession {
        if (this.session) {
            return this.session;
        }
        else {
            throw new Error("session must be available");
        }
    }

    /**
     * Adjusts the wrap limit, which is the number of characters that can fit within the width of the edit area on screen.
     */
    public adjustWrapLimit(): boolean {
        const availableWidth = this.$size.scrollerWidth - this.$padding * 2;
        const limit = Math.floor(availableWidth / this.characterWidth);
        if (this.$showPrintMargin) {
            return this.sessionOrThrow().adjustWrapLimit(limit, this.$printMarginColumn);
        }
        else {
            return this.sessionOrThrow().adjustWrapLimit(limit, 0);
        }
    }

    /**
     * Identifies whether you want to have an animated scroll or not.
     *
     * @param animatedScroll Set to `true` to show animated scrolls.
     */
    setAnimatedScroll(animatedScroll: boolean): void {
        this.animatedScroll = animatedScroll;
    }

    /**
     * Returns whether an animated scroll happens or not.
     */
    getAnimatedScroll() {
        return this.animatedScroll;
    }

    setTextDirection(value: TextDirection): void {
        if (value === 'ltr' || value === 'rtl') {
            this.container.dir = value;
        }
        else if (value === 'auto' && !isIE) {
            this.container.dir = value;
        }
    }

    getTextDirection(): TextDirection {
        const dir = this.container.dir;
        switch (dir) {
            case 'ltr': return dir;
            case 'rtl': return dir;
            case 'auto': return dir;
            default: {
                throw new Error(`dir must be a TextDirection`);
            }
        }
    }

    /**
     * Identifies whether you want to show invisible characters or not.
     * This method requires the session to be in effect.
     *
     * @param showInvisibles Set to `true` to show invisibles
     */
    setShowInvisibles(showInvisibles: boolean): void {
        if (this.textLayer.setShowInvisibles(showInvisibles)) {
            this.$loop.schedule(CHANGE_TEXT);
        }
    }

    /**
     * Returns whether invisible characters are being shown or not.
     */
    getShowInvisibles(): boolean {
        return this.textLayer.getShowInvisibles();
    }

    getDisplayIndentGuides(): boolean {
        return this.textLayer.getDisplayIndentGuides();
    }

    /**
     * This method requires the session to be in effect.
     */
    setDisplayIndentGuides(displayIndentGuides: boolean): void {
        if (this.textLayer.setDisplayIndentGuides(displayIndentGuides)) {
            this.$loop.schedule(CHANGE_TEXT);
        }
    }

    /**
     * Identifies whether you want to show the print margin or not.
     *
     * @param showPrintMargin Set to `true` to show the print margin.
     */
    setShowPrintMargin(showPrintMargin: boolean): void {
        this.$showPrintMargin = showPrintMargin;
        this.$updatePrintMargin();
    }

    /**
     * Returns whether the print margin is being shown or not.
     */
    getShowPrintMargin(): boolean {
        return this.$showPrintMargin;
    }

    /**
     * Sets the column defining where the print margin should be.
     *
     * @param printMarginColumn Specifies the new print margin.
     */
    setPrintMarginColumn(printMarginColumn: number): void {
        this.$printMarginColumn = printMarginColumn;
        this.$updatePrintMargin();
    }

    /**
     * Returns the column number of where the print margin is.
     */
    getPrintMarginColumn(): number {
        return this.$printMarginColumn;
    }

    /**
     * Returns `true` if the gutter is being shown.
     */
    getShowGutter(): boolean {
        return this.$showGutter;
    }

    /**
     * Identifies whether you want to show the gutter or not.
     *
     * @param showGutter Set to `true` to show the gutter.
     */
    setShowGutter(showGutter: boolean): void {
        this.$showGutter = showGutter;
        this.$gutter.style.display = showGutter ? "block" : "none";
        this.$loop.schedule(CHANGE_FULL);
        this.onGutterResize();
    }

    /**
     *
     */
    getFadeFoldWidgets(): boolean {
        return this.fadeFoldWidgets;
    }

    /**
     *
     */
    setFadeFoldWidgets(fadeFoldWidgets: boolean): void {
        setCssClass(this.$gutter, "ace_fade-fold-widgets", fadeFoldWidgets);
    }

    getFontSize(): string | null {
        return this.container.style.fontSize;
    }

    setFontSize(fontSize: string | null): void {
        this.container.style.fontSize = fontSize;
        this.updateFontSize();
    }

    setHighlightGutterLine(highlightGutterLine: boolean): void {
        this.$highlightGutterLine = highlightGutterLine;
        if (!this.$gutterLineHighlight) {
            this.$gutterLineHighlight = createHTMLDivElement();
            this.$gutterLineHighlight.className = "ace_gutter-active-line";
            this.$gutter.appendChild(this.$gutterLineHighlight);
            return;
        }

        this.$gutterLineHighlight.style.display = highlightGutterLine ? "" : "none";
        // if cursorlayer have never been updated there's nothing on screen to update
        if (this.cursorLayer.$pixelPos) {
            this.$updateGutterLineHighlight();
        }
    }

    getHighlightGutterLine() {
        return this.$highlightGutterLine;
    }

    /**
     *
     */
    getPixelPosition(position?: Position | null, onScreen?: boolean): PixelPosition {
        return this.cursorLayer.getPixelPosition(position, onScreen);
    }

    $updateGutterLineHighlight() {
        const session = this.sessionOrThrow();
        let pos = this.cursorLayer.$pixelPos;
        let height = this.layerConfig.lineHeight;
        if (session.getUseWrapMode()) {
            const selection = session.selection;
            if (selection) {
                const cursor = selection.getCursor();
                cursor.column = 0;
                pos = this.getPixelPosition(cursor, true);
                height *= session.getRowLength(cursor.row);
            }
        }
        this.$gutterLineHighlight.style.top = pixelStyle(pos.top - this.layerConfig.offset);
        this.$gutterLineHighlight.style.height = pixelStyle(height);
    }

    $updatePrintMargin() {
        if (!this.$showPrintMargin && !this.$printMarginEl)
            return;

        if (!this.$printMarginEl) {
            const containerEl: HTMLDivElement = <HTMLDivElement>createElement("div");
            containerEl.className = "ace_layer ace_print-margin-layer";
            this.$printMarginEl = <HTMLDivElement>createElement("div");
            this.$printMarginEl.className = "ace_print-margin";
            containerEl.appendChild(this.$printMarginEl);
            this.content.insertBefore(containerEl, this.content.firstChild);
        }

        const style = this.$printMarginEl.style;
        style.left = pixelStyle((this.characterWidth * this.$printMarginColumn) + this.$padding);
        style.visibility = this.$showPrintMargin ? "visible" : "hidden";

        // FIXME: Should this be $useWrapMode?
        if (this.session && this.session['$wrap'] === -1)
            this.adjustWrapLimit();
    }

    /**
     * Returns the root element containing this renderer.
     */
    getContainerElement(): HTMLElement {
        return this.container;
    }

    /**
     * Returns the element that the mouse events are attached to.
     */
    getMouseEventTarget(): HTMLDivElement {
        return this.content;
    }

    /**
     * Returns the element to which the hidden text area is added.
     */
    getTextAreaContainer(): HTMLElement {
        return this.container;
    }

    /**
     * Move text input over the cursor.
     * Required for iOS and IME.
     *
     * @private
     */
    public $moveTextAreaToCursor(): void {

        if (!this.$keepTextAreaAtCursor) {
            return;
        }
        const config = this.layerConfig;

        if (!this.cursorLayer.$pixelPos) {
            console.warn("moveTextAreaToCursor bypassed because cursor layer is not working.");
            return;
        }

        const session = this.sessionOrThrow();

        let posTop = this.cursorLayer.$pixelPos.top;
        let posLeft = this.cursorLayer.$pixelPos.left;
        posTop -= config.offset;

        let h = this.lineHeight;
        if (posTop < 0 || posTop > config.height - h)
            return;

        let w = this.characterWidth;
        if (this.$composition) {
            const val = this.textarea.value.replace(/^\x01+/, "");
            w *= (session.$getStringScreenWidth(val)[0] + 2);
            h += 2;
            posTop -= 1;
        }
        posLeft -= this.scrollLeft;
        if (posLeft > this.$size.scrollerWidth - w)
            posLeft = this.$size.scrollerWidth - w;

        posLeft -= this.scrollBarV.width;

        this.textarea.style.height = pixelStyle(h);
        this.textarea.style.width = pixelStyle(w);
        this.textarea.style.right = pixelStyle(Math.max(0, this.$size.scrollerWidth - posLeft - w));
        this.textarea.style.bottom = pixelStyle(Math.max(0, this.$size.height - posTop - h));
    }

    /**
     * Returns the index of the first visible row.
     */
    getFirstVisibleRow(): number {
        return this.layerConfig.firstRow;
    }

    /**
     * Returns the index of the first fully visible row.
     * "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
     */
    getFirstFullyVisibleRow(): number {
        return this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1);
    }

    /**
     * Returns the index of the last fully visible row.
     * "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
     */
    getLastFullyVisibleRow(): number {
        const flint = Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.layerConfig.lineHeight);
        return this.layerConfig.firstRow - 1 + flint;
    }

    /**
     * Returns the index of the last visible row.
     */
    getLastVisibleRow(): number {
        return this.layerConfig.lastRow;
    }

    /**
     * Gets the padding.
     */
    getPadding(): number {
        return this.$padding;
    }

    /**
     * Sets the padding for all the layers.
     *
     * @param padding A new padding value (in pixels).
     */
    setPadding(padding: number): void {
        if (typeof padding !== 'number') {
            throw new TypeError("padding must be a number");
        }
        this.$padding = padding;
        this.textLayer.setPadding(padding);
        this.cursorLayer.setPadding(padding);
        this.$markerFront.setPadding(padding);
        this.$markerBack.setPadding(padding);
        this.$loop.schedule(CHANGE_FULL);
        this.$updatePrintMargin();
    }

    setScrollMargin(top: number, bottom: number, left: number, right: number): void {
        const sm = this.scrollMargin;
        sm.top = top | 0;
        sm.bottom = bottom | 0;
        sm.right = right | 0;
        sm.left = left | 0;
        sm.v = sm.top + sm.bottom;
        sm.h = sm.left + sm.right;
        if (sm.top && this.scrollTop <= 0 && this.session)
            this.session.setScrollTop(-sm.top);
        this.updateFull();
    }

    /**
     * Returns whether the horizontal scrollbar is set to be always visible.
     */
    getHScrollBarAlwaysVisible(): boolean {
        return this.$hScrollBarAlwaysVisible;
    }

    /**
     * Identifies whether you want to show the horizontal scrollbar or not.
     *
     * @param hScrollBarAlwaysVisible Set to `true` to make the horizontal scroll bar visible.
     */
    setHScrollBarAlwaysVisible(hScrollBarAlwaysVisible: boolean) {
        this.$hScrollBarAlwaysVisible = hScrollBarAlwaysVisible;
        if (!this.$hScrollBarAlwaysVisible || !this.$horizScroll) {
            this.$loop.schedule(CHANGE_SCROLL);
        }
    }

    /**
     * Returns whether the vertical scrollbar is set to be always visible.
     */
    getVScrollBarAlwaysVisible(): boolean {
        return this.$vScrollBarAlwaysVisible;
    }

    /**
     * Identifies whether you want to show the vertical scrollbar or not.
     * @param alwaysVisible Set to `true` to make the vertical scroll bar visible
     */
    setVScrollBarAlwaysVisible(alwaysVisible: boolean): void {
        this.$vScrollBarAlwaysVisible = alwaysVisible;
        if (!this.$vScrollBarAlwaysVisible || !this.$vScroll) {
            this.$loop.schedule(CHANGE_SCROLL);
        }
    }

    getShowLineNumbers(): boolean {
        return this.$gutterLayer.getShowLineNumbers();
    }

    setShowLineNumbers(showLineNumbers: boolean): void {
        this.$gutterLayer.setShowLineNumbers(showLineNumbers);
        this.$loop.schedule(CHANGE_GUTTER);
    }


    private $updateScrollBarV(): void {
        let scrollHeight = this.layerConfig.maxHeight;
        const scrollerHeight = this.$size.scrollerHeight;
        if (!this.$maxLines && this.$scrollPastEnd) {
            scrollHeight -= (scrollerHeight - this.lineHeight) * this.$scrollPastEnd;
            if (this.scrollTop > scrollHeight - scrollerHeight) {
                scrollHeight = this.scrollTop + scrollerHeight;
                // FIXME: This is hacky.
                // The idea seems to be to force the scrollbar to change.
                this.scrollBarV.scrollTop = null;
            }
        }
        this.scrollBarV
            .setScrollHeight(scrollHeight + this.scrollMargin.v)
            .setScrollTop(this.scrollTop + this.scrollMargin.top);
    }

    private $updateScrollBarH(): void {
        this.scrollBarH
            .setScrollWidth(this.layerConfig.width + 2 * this.$padding + this.scrollMargin.h)
            .setScrollLeft(this.scrollLeft + this.scrollMargin.left);
    }

    freeze(): void {
        this.$frozen = true;
    }

    unfreeze(): void {
        this.$frozen = false;
    }

    /**
     *
     */
    private $renderChanges(changes: number, forceChanges: boolean): number | undefined {

        if (this.$changes) {
            changes |= this.$changes;
            this.$changes = 0;
        }
        if ((!this.session || !this.container.offsetWidth || this.$frozen) || (!changes && !forceChanges)) {
            this.$changes |= changes;
            return void 0;
        }
        if (this.$size.$dirty) {
            this.$changes |= changes;
            return this.onResize(true);
        }
        if (!this.lineHeight) {
            this.textLayer.checkForSizeChanges();
        }

        /**
         * @event beforeRender
         */
        this.eventBus._signal("beforeRender");

        let config = this.layerConfig;
        // text, scrolling and resize changes can cause the view port size to change
        if (changes & CHANGE_FULL ||
            changes & CHANGE_SIZE ||
            changes & CHANGE_TEXT ||
            changes & CHANGE_LINES ||
            changes & CHANGE_SCROLL ||
            changes & CHANGE_H_SCROLL
        ) {
            changes |= this.$computeLayerConfig();
            // If a change is made offscreen and wrapMode is on, then the onscreen
            // lines may have been pushed down. If so, the first screen row will not
            // have changed, but the first actual row will. In that case, adjust 
            // scrollTop so that the cursor and onscreen content stays in the same place.
            if (config.firstRow !== this.layerConfig.firstRow && config.firstRowScreen === this.layerConfig.firstRowScreen) {
                this.scrollTop = this.scrollTop + (config.firstRow - this.layerConfig.firstRow) * this.lineHeight;
                changes = changes | CHANGE_SCROLL;
                changes |= this.$computeLayerConfig();
            }
            config = this.layerConfig;
            // update scrollbar first to not lose scroll position when gutter calls resize
            this.$updateScrollBarV();
            if (changes & CHANGE_H_SCROLL) {
                this.$updateScrollBarH();
            }
            this.$gutterLayer.element.style.marginTop = pixelStyle(-config.offset);
            this.content.style.marginTop = pixelStyle(-config.offset);
            this.content.style.width = pixelStyle(config.width + 2 * this.$padding);
            this.content.style.height = pixelStyle(config.minHeight);
        }

        // horizontal scrolling
        if (changes & CHANGE_H_SCROLL) {
            this.content.style.marginLeft = pixelStyle(-this.scrollLeft);
            this.scroller.className = this.scrollLeft <= 0 ? "ace_scroller" : "ace_scroller ace_scroll-left";
        }


        // full
        if (changes & CHANGE_FULL) {
            this.textLayer.update(config);
            if (this.$showGutter) {
                this.$gutterLayer.update(config);
            }
            this.$markerBack.update(config);
            this.$markerFront.update(config);
            this.cursorLayer.update(config);
            this.$moveTextAreaToCursor();
            if (this.$highlightGutterLine) {
                this.$updateGutterLineHighlight();
            }

            /**
             * @event afterRender
             */
            this.eventBus._signal("afterRender");

            return void 0;
        }

        // scrolling
        if (changes & CHANGE_SCROLL) {
            if (changes & CHANGE_TEXT || changes & CHANGE_LINES)
                this.textLayer.update(config);
            else
                this.textLayer.scrollLines(config);

            if (this.$showGutter)
                this.$gutterLayer.update(config);
            this.$markerBack.update(config);
            this.$markerFront.update(config);
            this.cursorLayer.update(config);
            if (this.$highlightGutterLine) {
                this.$updateGutterLineHighlight();
            }
            this.$moveTextAreaToCursor();
            /**
             * @event afterRender
             */
            this.eventBus._signal("afterRender");
            return void 0;
        }

        if (changes & CHANGE_TEXT) {
            this.textLayer.update(config);
            if (this.$showGutter)
                this.$gutterLayer.update(config);
        }
        else if (changes & CHANGE_LINES) {
            if (this.$updateLines() || (changes & CHANGE_GUTTER) && this.$showGutter)
                this.$gutterLayer.update(config);
        }
        else if (changes & CHANGE_TEXT || changes & CHANGE_GUTTER) {
            if (this.$showGutter)
                this.$gutterLayer.update(config);
        }

        if (changes & CHANGE_CURSOR) {
            this.cursorLayer.update(config);
            this.$moveTextAreaToCursor();
            if (this.$highlightGutterLine) {
                this.$updateGutterLineHighlight();
            }
        }

        if (changes & (CHANGE_MARKER | CHANGE_MARKER_FRONT)) {
            this.$markerFront.update(config);
        }

        if (changes & (CHANGE_MARKER | CHANGE_MARKER_BACK)) {
            this.$markerBack.update(config);
        }

        /**
         * @event afterRender
         */
        this.eventBus._signal("afterRender");
        return void 0;
    }

    private $autosize(): void {
        const session = this.sessionOrThrow();
        const height = session.getScreenLength() * this.lineHeight;
        const maxHeight = this.$maxLines * this.lineHeight;
        const desiredHeight = Math.max(
            (this.$minLines || 1) * this.lineHeight,
            Math.min(maxHeight, height)
        ) + this.scrollMargin.v + (this.$extraHeight || 0);
        const vScroll = height > maxHeight;

        if (desiredHeight !== this.desiredHeight ||
            this.$size.height !== this.desiredHeight || vScroll !== this.$vScroll) {
            if (vScroll !== this.$vScroll) {
                this.$vScroll = vScroll;
                this.scrollBarV.setVisible(vScroll);
            }

            const w = this.container.clientWidth;
            this.container.style.height = pixelStyle(desiredHeight);
            this.$updateCachedSize(true, this.$gutterWidth, w, desiredHeight);
            // this.$loop.changes = 0;
            this.desiredHeight = desiredHeight;
        }
    }

    private $computeLayerConfig(): number {

        if (this.$maxLines && this.lineHeight > 1) {
            this.$autosize();
        }

        const session = this.sessionOrThrow();
        const size = this.$size;

        const hideScrollbars = size.height <= 2 * this.lineHeight;
        const screenLines = session.getScreenLength();
        let maxHeight = screenLines * this.lineHeight;

        let offset = this.scrollTop % this.lineHeight;
        let minHeight = size.scrollerHeight + this.lineHeight;

        let longestLine = this.$getLongestLine();

        const horizScroll = !hideScrollbars && (this.$hScrollBarAlwaysVisible || size.scrollerWidth - longestLine - 2 * this.$padding < 0);

        const hScrollChanged = this.$horizScroll !== horizScroll;
        if (hScrollChanged) {
            this.$horizScroll = horizScroll;
            this.scrollBarH.setVisible(horizScroll);
        }

        if (!this.$maxLines && this.$scrollPastEnd) {
            maxHeight += (size.scrollerHeight - this.lineHeight) * this.$scrollPastEnd;
        }

        const vScroll = !hideScrollbars && (this.$vScrollBarAlwaysVisible || size.scrollerHeight - maxHeight < 0);
        const vScrollChanged = this.$vScroll !== vScroll;
        if (vScrollChanged) {
            this.$vScroll = vScroll;
            this.scrollBarV.setVisible(vScroll);
        }

        session.setScrollTop(Math.max(-this.scrollMargin.top, Math.min(this.scrollTop, maxHeight - size.scrollerHeight + this.scrollMargin.bottom)));

        session.setScrollLeft(Math.max(-this.scrollMargin.left, Math.min(this.scrollLeft, longestLine + 2 * this.$padding - size.scrollerWidth + this.scrollMargin.right)));

        const lineCount = Math.ceil(minHeight / this.lineHeight) - 1;
        let firstRow = Math.max(0, Math.round((this.scrollTop - offset) / this.lineHeight));
        let lastRow = firstRow + lineCount;

        // Map lines on the screen to lines in the document.
        const lineHeight = this.lineHeight;
        firstRow = session.screenToDocumentRow(firstRow, 0);

        // Check if firstRow is inside of a foldLine. If true, then use the first
        // row of the foldLine.
        const foldLine = session.getFoldLine(firstRow);
        if (foldLine) {
            firstRow = foldLine.start.row;
        }

        const firstRowScreen = session.documentToScreenRow(firstRow, 0);
        const firstRowHeight = session.getRowLength(firstRow) * lineHeight;

        lastRow = Math.min(session.screenToDocumentRow(lastRow, 0), session.getLength() - 1);
        minHeight = size.scrollerHeight + session.getRowLength(lastRow) * lineHeight + firstRowHeight;

        offset = this.scrollTop - firstRowScreen * lineHeight;

        let changes = 0;
        if (this.layerConfig.width !== longestLine)
            changes = CHANGE_H_SCROLL;
        // Horizontal scrollbar visibility may have changed, which changes
        // the client height of the scroller
        if (hScrollChanged || vScrollChanged) {
            changes = this.$updateCachedSize(true, this.gutterWidth, size.width, size.height);
            /**
             * @event scrollbarVisibilityChanged
             */
            this.eventBus._signal("scrollbarVisibilityChanged");
            if (vScrollChanged)
                longestLine = this.$getLongestLine();
        }

        this.layerConfig = {
            width: longestLine,
            padding: this.$padding,
            firstRow: firstRow,
            firstRowScreen: firstRowScreen,
            lastRow: lastRow,
            lineHeight: lineHeight,
            characterWidth: this.characterWidth,
            minHeight: minHeight,
            maxHeight: maxHeight,
            offset: offset,
            gutterOffset: Math.max(0, Math.ceil((offset + size.height - size.scrollerHeight) / lineHeight)),
            height: this.$size.scrollerHeight
        };

        return changes;
    }

    private $updateLines(): boolean | undefined {
        if (this.$changedLines) {
            const firstRow = this.$changedLines.firstRow;
            const lastRow = this.$changedLines.lastRow;
            this.$changedLines = null;
            const layerConfig = this.layerConfig;

            if (firstRow > layerConfig.lastRow + 1) { return void 0; }
            if (lastRow < layerConfig.firstRow) { return void 0; }

            // if the last row is unknown -> redraw everything
            if (lastRow === Infinity) {
                if (this.$showGutter)
                    this.$gutterLayer.update(layerConfig);
                this.textLayer.update(layerConfig);
                return void 0;
            }

            // else update only the changed rows
            this.textLayer.updateLines(layerConfig, firstRow, lastRow);
            return true;
        }
        return false;
    }

    private $getLongestLine(): number {
        const session = this.sessionOrThrow();
        const charCount = session.getScreenWidth() + ((this.showInvisibles && !session.$useWrapMode) ? 1 : 0);
        return Math.max(this.$size.scrollerWidth - 2 * this.$padding, Math.round(charCount * this.characterWidth));
    }

    /**
     * Schedules an update to all the front markers in the document.
     * TODO: Could this return a promise?
     */
    updateFrontMarkers(): void {
        const session = this.sessionOrThrow();
        this.$markerFront.setMarkers(session.getMarkers(true));
        this.$loop.schedule(CHANGE_MARKER_FRONT);
    }

    /**
     * Schedules an update to all the back markers in the document.
     */
    updateBackMarkers(): void {
        const session = this.sessionOrThrow();
        this.$markerBack.setMarkers(session.getMarkers(false));
        this.$loop.schedule(CHANGE_MARKER_BACK);
    }

    /**
     * Redraw breakpoints.
     */
    updateBreakpoints(): void {
        this.$loop.schedule(CHANGE_GUTTER);
    }

    /**
     * Sets annotations for the gutter.
     *
     * @param annotations An array containing annotations.
     */
    setAnnotations(annotations: Annotation[]): void {
        this.$gutterLayer.setAnnotations(annotations);
        this.$loop.schedule(CHANGE_GUTTER);
    }

    /**
     * Updates the cursor icon.
     */
    updateCursor(): void {
        this.$loop.schedule(CHANGE_CURSOR);
    }

    /**
     * Hides the cursor icon.
     */
    hideCursor(): void {
        this.cursorLayer.hideCursor();
    }

    /**
     * Shows the cursor icon.
     */
    showCursor() {
        this.cursorLayer.showCursor();
    }

    /**
     *
     */
    scrollSelectionIntoView(anchor: Position, lead: Position, offset?: number): void {
        // first scroll anchor into view then scroll lead into view
        this.scrollCursorIntoView(anchor, offset);
        this.scrollCursorIntoView(lead, offset);
    }

    /**
     * Scrolls the cursor into the first visible area of the editor.
     */
    scrollCursorIntoView(cursor?: Position | null, offset?: number, viewMargin?: { top?: number; bottom?: number }): void {
        // the editor is not visible
        if (this.$size.scrollerHeight === 0) {
            return;
        }

        const session = this.sessionOrThrow();

        const pos = this.getPixelPosition(cursor, false);

        let left = pos.left;
        let top = pos.top;

        const topMargin = viewMargin && viewMargin.top || 0;
        const bottomMargin = viewMargin && viewMargin.bottom || 0;

        const scrollTop = this.$scrollAnimation ? session.getScrollTop() : this.scrollTop;

        if (scrollTop + topMargin > top) {
            if (offset)
                top -= offset * this.$size.scrollerHeight;
            if (top === 0)
                top = -this.scrollMargin.top;
            session.setScrollTop(top);
        }
        else if (scrollTop + this.$size.scrollerHeight - bottomMargin < top + this.lineHeight) {
            if (offset)
                top += offset * this.$size.scrollerHeight;
            session.setScrollTop(top + this.lineHeight - this.$size.scrollerHeight);
        }

        const scrollLeft = this.scrollLeft;

        if (scrollLeft > left) {
            if (left < this.$padding + 2 * this.layerConfig.characterWidth) {
                left = -this.scrollMargin.left;
            }
            session.setScrollLeft(left);
        }
        else if (scrollLeft + this.$size.scrollerWidth < left + this.characterWidth) {
            session.setScrollLeft(Math.round(left + this.characterWidth - this.$size.scrollerWidth));
        }
        else if (scrollLeft <= this.$padding && left - scrollLeft < this.characterWidth) {
            session.setScrollLeft(0);
        }
    }

    /**
     *
     */
    getScrollTop(): number {
        return this.sessionOrThrow().getScrollTop();
    }

    /**
     *
     */
    getScrollLeft(): number {
        return this.sessionOrThrow().getScrollLeft();
    }

    /**
     * Returns the first visible row, regardless of whether it's fully visible or not.
     */
    getScrollTopRow(): number {
        return this.scrollTop / this.lineHeight;
    }

    /**
     * Returns the last visible row, regardless of whether it's fully visible or not.
     *
     */
    getScrollBottomRow(): number {
        return Math.max(0, Math.floor((this.scrollTop + this.$size.scrollerHeight) / this.lineHeight) - 1);
    }

    /**
     * Gracefully scrolls from the top of the editor to the row indicated.
     *
     * @param row A row id.
     */
    scrollToRow(row: number): void {
        this.sessionOrThrow().setScrollTop(row * this.lineHeight);
    }

    alignCursor(cursor: number | Position, alignment: number): number {
        if (typeof cursor === "number") {
            cursor = { row: cursor, column: 0 };
        }

        const pos = this.getPixelPosition(cursor, false);
        const h = this.$size.scrollerHeight - this.lineHeight;
        const offset = pos.top - h * (alignment || 0);

        this.sessionOrThrow().setScrollTop(offset);
        return offset;
    }

    /**
     * Gracefully scrolls the editor to the row indicated.
     * 
     * @param line A line number
     * @param center If `true`, centers the editor the to indicated line
     * @param animate If `true` animates scrolling
     * @param callback Function to be called after the animation has finished
     */
    scrollToLine(line: number, center: boolean, animate?: boolean, callback?: () => any) {
        const session = this.sessionOrThrow();
        const pos = this.getPixelPosition({ row: line, column: 0 }, false);
        let offset = pos.top;
        if (center) {
            offset -= this.$size.scrollerHeight / 2;
        }

        const initialScroll = this.scrollTop;
        session.setScrollTop(offset);
        if (animate) {
            this.animateScrolling(initialScroll, callback);
        }
    }

    /**
     * fromValue is a scroll value.
     */
    animateScrolling(fromValue: number, callback?: () => any): void {
        const session = this.sessionOrThrow();
        const toValue = this.scrollTop;
        if (!this.animatedScroll) {
            return;
        }

        if (fromValue === toValue) {
            return;
        }

        if (this.$scrollAnimation) {
            const oldSteps = this.$scrollAnimation.steps;
            if (oldSteps.length) {
                fromValue = oldSteps[0];
                if (fromValue === toValue)
                    return;
            }
        }

        const steps = calcSteps(fromValue, toValue);
        this.$scrollAnimation = { from: fromValue, to: toValue, steps };

        if (typeof this.$timer === 'number') {
            window.clearInterval(this.$timer);
            this.$timer = void 0;
        }

        session.setScrollTop(<number>steps.shift());
        // trick session to think it's already scrolled to not loose toValue
        session.$scrollTop = toValue;
        // Every 10 milliseconds, animate the scrolling.
        let doneFinalTweak = false;
        this.$timer = window.setInterval(() => {
            if (steps.length > 0) {
                session.setScrollTop(<number>steps.shift());
                session.$scrollTop = toValue;
            }
            else if (!doneFinalTweak) {
                session.$scrollTop = -1;
                session.setScrollTop(toValue);
                doneFinalTweak = true;
            }
            else {
                // do this on separate step to not get spurious scroll event from scrollbar
                if (typeof this.$timer === 'number') {
                    window.clearInterval(this.$timer);
                    this.$timer = void 0;
                }
                this.$scrollAnimation = null;
                if (callback) {
                    callback();
                }
            }
        }, 10);
    }

    /**
     * Scrolls the editor to the y pixel indicated.
     * 
     * @param scrollTop The position to scroll to
     */
    scrollToY(scrollTop: number): void {
        // after calling scrollBar.setScrollTop
        // scrollbar sends us event with same scrollTop. ignore it
        if (this.scrollTop !== scrollTop) {
            this.scrollTop = scrollTop;
            this.$loop.schedule(CHANGE_SCROLL);
        }
    }

    /**
     * Scrolls the editor across the x-axis to the pixel indicated.
     *
     * @param scrollLeft The position to scroll to.
     */
    scrollToX(scrollLeft: number): void {
        if (this.scrollLeft !== scrollLeft) {
            this.scrollLeft = scrollLeft;
            this.$loop.schedule(CHANGE_H_SCROLL);
        }
    }

    /**
     * Scrolls the editor across axes to an absolute point (scrollLeft, scrollTop).
     */
    scrollTo(scrollLeft: number, scrollTop: number): void {
        const session = this.sessionOrThrow();
        session.setScrollLeft(scrollLeft);
        session.setScrollTop(scrollTop);
    }

    /**
     * Scrolls the editor across both axes by a displacement.
     */
    scrollBy(deltaX: number, deltaY: number): void {
        const session = this.sessionOrThrow();
        if (deltaY) {
            session.setScrollTop(session.getScrollTop() + deltaY);
        }
        if (deltaX) {
            session.setScrollLeft(session.getScrollLeft() + deltaX);
        }
    }

    /**
     * Returns `true` if you can still scroll by either parameter; in other words, you haven't reached the end of the file or line.
     */
    isScrollableBy(deltaX: number, deltaY: number): boolean {
        const session = this.sessionOrThrow();
        if (deltaY < 0 && session.getScrollTop() >= 1 - this.scrollMargin.top) {
            return true;
        }
        if (deltaY > 0 && session.getScrollTop() + this.$size.scrollerHeight - this.layerConfig.maxHeight < -1 + this.scrollMargin.bottom) {
            return true;
        }
        if (deltaX < 0 && session.getScrollLeft() >= 1 - this.scrollMargin.left) {
            return true;
        }
        if (deltaX > 0 && session.getScrollLeft() + this.$size.scrollerWidth - this.layerConfig.width < -1 + this.scrollMargin.right) {
            return true;
        }
        return false;
    }

    pixelToScreenCoordinates(x: number, y: number) {
        const canvasPos = this.scroller.getBoundingClientRect();

        const offset = (x + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth;
        const row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight);
        const col = Math.round(offset);

        return { row: row, column: col, side: offset - col > 0 ? 1 : -1 };
    }

    screenToTextCoordinates(clientX: number, clientY: number): Position {
        const session = this.sessionOrThrow();
        const canvasPos = this.scroller.getBoundingClientRect();

        const column = Math.round((clientX + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth);

        const row = (clientY + this.scrollTop - canvasPos.top) / this.lineHeight;

        return session.screenToDocumentPosition(row, Math.max(column, 0));
    }

    /**
     * Returns an object containing the screen coordinates of the document position.
     */
    textToScreenCoordinates(row: number, column: number): ScreenCoordinates {
        const session = this.sessionOrThrow();
        const canvasPos: ClientRect = this.scroller.getBoundingClientRect();
        const pos: Position = session.documentToScreenPosition(row, column);

        const x = this.$padding + Math.round(pos.column * this.characterWidth);
        const y = pos.row * this.lineHeight;

        return {
            pageX: canvasPos.left + x - this.scrollLeft,
            pageY: canvasPos.top + y - this.scrollTop
        };
    }

    /**
     * Focuses the current container.
     */
    visualizeFocus(): void {
        addCssClass(this.container, "ace_focus");
    }

    /**
     * Blurs the current container.
     */
    visualizeBlur(): void {
        removeCssClass(this.container, "ace_focus");
    }

    /**
     *
     */
    showComposition(position: Position) {
        if (!this.$composition)
            this.$composition = {
                keepTextAreaAtCursor: this.$keepTextAreaAtCursor,
                cssText: this.textarea.style.cssText
            };

        this.$keepTextAreaAtCursor = true;
        addCssClass(this.textarea, "ace_composition");
        this.textarea.style.cssText = "";
        this.$moveTextAreaToCursor();
    }

    /**
     * Sets the inner text of the current composition to `text`.
     */
    setCompositionText(text?: string): void {
        // TODO: Why is the parameter not used?
        this.$moveTextAreaToCursor();
    }

    /**
     * Hides the current composition.
     */
    hideComposition(): void {
        if (!this.$composition) {
            return;
        }

        removeCssClass(this.textarea, "ace_composition");
        this.$keepTextAreaAtCursor = this.$composition.keepTextAreaAtCursor;
        this.textarea.style.cssText = this.$composition.cssText;
        this.$composition = null;
    }

    getShowFoldWidgets(): boolean {
        return this.$gutterLayer.getShowFoldWidgets();
    }

    setShowFoldWidgets(showFoldWidgets: boolean) {
        this.$gutterLayer.setShowFoldWidgets(showFoldWidgets);
    }


    /**
     * Sets a new theme for the editor.
     * This is a synchronous method.
     */
    setTheme(modJs: { cssText: string; cssClass: string; isDark: boolean; padding: number }): void {

        if (!modJs.cssClass) {
            return;
        }

        ensureHTMLStyleElement(modJs.cssText, modJs.cssClass, this.container.ownerDocument);

        if (this.theme) {
            removeCssClass(this.container, this.theme.cssClass);
        }

        const padding = "padding" in modJs ? modJs.padding : "padding" in (this.theme || {}) ? 4 : this.$padding;

        if (this.$padding && padding !== this.$padding) {
            this.setPadding(padding);
        }

        this.theme = modJs;
        this.addCssClass(modJs.cssClass);
        this.setCssClass("ace_dark", modJs.isDark);

        // force re-measure of the gutter width
        if (this.$size) {
            this.$size.width = 0;
            this.$updateSizeAsync();
        }

        /**
         * @event themeLoaded
         */
        this.eventBus._emit('themeLoaded', { theme: modJs });
    }

    /**
     * @param cssClass
     */
    addCssClass(cssClass: string): void {
        addCssClass(this.container, cssClass);
    }

    removeCssClass(cssClass: string): void {
        removeCssClass(this.container, cssClass);
    }

    /**
     * @param className
     * @param include
     */
    setCssClass(className: string, include: boolean): void {
        setCssClass(this.container, className, include);
    }

    /**
     * Appends a link element with rel='stylesheet' type='text/css', and sets the cssClass as the id.
     * The cssClass doubles as both an identifier and a CSS class.
     */
    setThemeCss(themeId: string, href?: string): void {
        if (themeId !== this.themeId) {
            if (this.themeId) {
                this.removeCssClass(this.themeId);
                if (hasHTMLLinkElement(this.themeId, this.container.ownerDocument)) {
                    removeHTMLLinkElement(this.themeId, this.container.ownerDocument);
                }
            }
            if (href) {
                if (!hasHTMLLinkElement(themeId, this.container.ownerDocument)) {
                    appendHTMLLinkElement(themeId, 'stylesheet', 'text/css', href, this.container.ownerDocument);
                }
            }
            this.addCssClass(themeId);
            this.themeId = themeId;
        }
    }

    setThemeDark(isDark: boolean): void {
        this.setCssClass("ace_dark", isDark);
    }

    /**
     * Returns the path of the current theme.
     */
    getTheme(): string {
        return this.themeId;
    }

    // Methods allows to add / remove CSS classnames to the editor element.
    // This feature can be used by plug-ins to provide a visual indication of
    // a certain mode that editor is in.

    /**
     * Adds a new class, `className`, to the editor container.
     */
    setStyle(className: string, include?: boolean): void {
        setCssClass(this.container, className, include !== false);
    }

    /**
     * Removes the class `className` from the editor container.
     */
    unsetStyle(className: string): void {
        removeCssClass(this.container, className);
    }

    /**
     *
     */
    setCursorStyle(style: string): void {
        if (this.content.style.cursor !== style) {
            this.content.style.cursor = style;
        }
    }

    /**
     * @param cursorStyle A css cursor style. 'crosshair'.
     */
    setMouseCursor(cursorStyle: string): void {
        this.content.style.cursor = cursorStyle;
    }
}

/**
 * Returns pixels + "px"
 * TODO: This duplicates a function called toPixelString.
 * @param pixels The value in pixels.
 */
function pixelStyle(pixels: number): string {
    return `${pixels}px`;
}

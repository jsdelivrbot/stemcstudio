import {addCssClass, createElement, removeCssClass, setCssClass} from "./lib/dom";
import appendHTMLLinkElement from './dom/appendHTMLLinkElement';
import removeHTMLLinkElement from './dom/removeHTMLLinkElement';
import Disposable from '../base/Disposable';
import ensureHTMLStyleElement from './dom/ensureHTMLStyleElement';
import hasHTMLLinkElement from './dom/hasHTMLLinkElement';
import {isOldIE} from "./lib/useragent";
import Annotation from './Annotation';

import CursorLayer from "./layer/CursorLayer";
import FontMetrics from "./layer/FontMetrics";
import {changeCharacterSize} from './layer/FontMetrics';
import GutterLayer from "./layer/GutterLayer";
import MarkerLayer from "./layer/MarkerLayer";
// import PrintMarginLayer from "./layer/PrintMarginLayer";
import TextLayer from "./layer/TextLayer";

// TODO: 
import VScrollBar from "./VScrollBar";
import HScrollBar from "./HScrollBar";

import RenderLoop from "./RenderLoop";
import EventEmitterClass from "./lib/EventEmitterClass";
import EditSession from './EditSession';
import EventBus from './EventBus';
import OptionsProvider from "./OptionsProvider";
import PixelPosition from './PixelPosition';
import Position from './Position';
import ScreenCoordinates from './ScreenCoordinates';
import EditorRenderer from './EditorRenderer';

// FIXME: The editor.css is crucial to the operation of the renderer.
// import editorCss = require("./requirejs/text!./css/editor.css");
// ensureHTMLStyleElement(editorCss, "ace_editor");

var CHANGE_CURSOR = 1;
var CHANGE_MARKER = 2;
var CHANGE_GUTTER = 4;
var CHANGE_SCROLL = 8;
var CHANGE_LINES = 16;
var CHANGE_TEXT = 32;
var CHANGE_SIZE = 64;
var CHANGE_MARKER_BACK = 128;
var CHANGE_MARKER_FRONT = 256;
var CHANGE_FULL = 512;
var CHANGE_H_SCROLL = 1024;

// Useful for debugging...
/*
function changesToString(changes: number): string {
    var a = "";
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

/**
 * The class that is responsible for drawing everything you see on the screen!
 *
 * @class Renderer
 */
export default class Renderer implements Disposable, EventBus<any, Renderer>, EditorRenderer, OptionsProvider {
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
    public $maxLines: number;
    public $minLines: number;

    /**
     * FIXME: Leaky. ListViewPopup uses this property.
     */
    public cursorLayer: CursorLayer;

    /**
     * @property $gutterLayer
     * @type GutterLayer
     */
    public $gutterLayer: GutterLayer;

    /**
     * @property $markerFront
     * @type MarkerLayer
     */
    private $markerFront: MarkerLayer;

    /**
     * @property $markerBack
     * @type MarkerLayer
     */
    private $markerBack: MarkerLayer;

    /**
     * FIXME: Leaky. ListViewPopup uses this property.
     */
    public textLayer: TextLayer;

    /**
     * @property $padding
     * @type number
     * @private
     * @default 0
     */
    private $padding: number = 0;

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
    private $timer: number;

    private STEPS = 8;
    public $keepTextAreaAtCursor: boolean;
    public $gutter: HTMLDivElement;
    public scroller: HTMLDivElement;
    public content: HTMLDivElement;
    private canvas: HTMLDivElement;
    private $horizScroll: boolean;
    private $vScroll: boolean;
    public scrollBarH: HScrollBar;
    public scrollBarV: VScrollBar;

    /**
     *
     */
    public $scrollAnimation: { from: number; to: number; steps: number[] };

    public $scrollbarWidth: number;
    private session: EditSession;
    private eventBus: EventEmitterClass<any, Renderer>;

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
    private fontMetrics: FontMetrics;

    /**
     * A function that removes the changeCharacterSize handler.
     */
    private removeChangeCharacterSizeHandler: () => void;

    private $allowBoldFonts: boolean;
    private cursorPos: Position;

    /**
     * A cache of various sizes TBA.
     */
    public $size: { height: number; width: number; scrollerHeight: number; scrollerWidth; $dirty: boolean };

    private $loop: RenderLoop;
    private $changedLines: { firstRow: number; lastRow: number; };
    private $changes = 0;
    private resizing: number;
    private $gutterLineHighlight;
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
     * @property characterWidth
     * @type number
     */
    public characterWidth: number;

    /**
     * @property lineHeight
     * @type number
     */
    public lineHeight: number;

    private $extraHeight: number;
    private $composition: { keepTextAreaAtCursor: boolean; cssText: string };
    private $hScrollBarAlwaysVisible = false;
    private $vScrollBarAlwaysVisible = false;
    private $showGutter = true;
    private showInvisibles = false;
    private animatedScroll = false;
    private fadeFoldWidgets = false;
    private $scrollPastEnd: number;
    private $highlightGutterLine;
    private desiredHeight: number;

    /**
     * Constructs a new `Renderer` within the `container` specified.
     *
     * @param container The root element of the editor.
     */
    constructor(container: HTMLElement) {
        this.eventBus = new EventEmitterClass<any, Renderer>(this);

        this.container = container || <HTMLDivElement>createElement("div");

        // TODO: this breaks rendering in Cloud9 with multiple ace instances
        // // Imports CSS once per DOM document ('ace_editor' serves as an identifier).
        // ensureHTMLStyleElement(editorCss, "ace_editor", container.ownerDocument);

        // in IE <= 9 the native cursor always shines through
        this.$keepTextAreaAtCursor = !isOldIE;

        addCssClass(this.container, "ace_editor");

        this.$gutter = <HTMLDivElement>createElement("div");
        this.$gutter.className = "ace_gutter";
        this.container.appendChild(this.$gutter);

        this.scroller = <HTMLDivElement>createElement("div");
        this.scroller.className = "ace_scroller";
        this.container.appendChild(this.scroller);

        this.content = <HTMLDivElement>createElement("div");
        this.content.className = "ace_content";
        this.scroller.appendChild(this.content);

        this.$gutterLayer = new GutterLayer(this.$gutter);
        this.$gutterLayer.on("changeGutterWidth", this.onGutterResize.bind(this));

        this.$markerBack = new MarkerLayer(this.content);

        this.textLayer = new TextLayer(this.content);
        this.canvas = this.textLayer.element;

        this.$markerFront = new MarkerLayer(this.content);

        this.cursorLayer = new CursorLayer(this.content);

        // Indicates whether the horizontal scrollbar is visible
        this.$horizScroll = false;
        this.$vScroll = false;

        this.scrollBarV = new VScrollBar(this.container, this);
        this.scrollBarH = new HScrollBar(this.container, this);
        this.scrollBarV.on("scroll", (event, scrollBar: VScrollBar) => {
            if (!this.$scrollAnimation) {
                this.session.setScrollTop(event.data - this.scrollMargin.top);
            }
        });
        this.scrollBarH.on("scroll", (event, scrollBar: HScrollBar) => {
            if (!this.$scrollAnimation) {
                this.session.setScrollLeft(event.data - this.scrollMargin.left);
            }
        });

        this.cursorPos = {
            row: 0,
            column: 0
        };

        this.fontMetrics = new FontMetrics(this.container, 500);

        this.textLayer.setFontMetrics(this.fontMetrics);

        this.removeChangeCharacterSizeHandler = this.textLayer.on(changeCharacterSize, (event, text: TextLayer) => {
            this.updateCharacterSize();
            this.onResize(true, this.gutterWidth, this.$size.width, this.$size.height);
            /**
             * @event changeCharacterSize
             */
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

        this.fontMetrics.release();
        this.fontMetrics = void 0;

        this.textLayer.dispose();
        this.cursorLayer.dispose();
    }

    /**
     * @param eventName
     * @param callback
     * @returns A function that may be used to remove the callback.
     */
    on(eventName: string, callback: (event: any, source: Renderer) => any): () => void {
        this.eventBus.on(eventName, callback, false);
        return () => {
            this.eventBus.off(eventName, callback);
        };
    }

    /**
     * @param eventName
     * @param callback
     */
    off(eventName: string, callback: (event: any, source: Renderer) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * @property maxLines
     * @type number
     */
    set maxLines(maxLines: number) {
        this.$maxLines = maxLines;
    }

    /**
     * @property keepTextAreaAtCursor
     * @type boolean
     */
    set keepTextAreaAtCursor(keepTextAreaAtCursor: boolean) {
        this.$keepTextAreaAtCursor = keepTextAreaAtCursor;
    }

    /**
     * Sets the <code>style</code> property of the content to "default".
     *
     * @method setDefaultCursorStyle
     * @return {void}
     */
    setDefaultCursorStyle(): void {
        this.content.style.cursor = "default";
    }

    /**
     * Sets the <code>opacity</code> of the cursor layer to "0".
     *
     * @method setCursorLayerOff
     * @return {void}
     */
    setCursorLayerOff(): void {
        const noop = function () {/* Do nothing.*/ };
        this.cursorLayer.restartTimer = noop;
        this.cursorLayer.element.style.opacity = "0";
    }

    /**
     * @method updateCharacterSize
     * @return {void}
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
     *
     * @method setSession
     * @param session {EditSession}
     * @return {void}
     */
    setSession(session: EditSession): void {
        if (this.session) {
            this.session.doc.removeChangeNewLineModeListener(this.onChangeNewLineMode);
        }

        this.session = session;
        if (!session) {
            return;
        }

        if (this.scrollMargin.top && session.getScrollTop() <= 0) {
            session.setScrollTop(-this.scrollMargin.top);
        }

        this.cursorLayer.setSession(session);
        this.$markerBack.setSession(session);
        this.$markerFront.setSession(session);
        this.$gutterLayer.setSession(session);
        this.textLayer.setSession(session);
        this.$loop.schedule(CHANGE_FULL);

        this.onChangeNewLineMode = this.onChangeNewLineMode.bind(this);
        this.onChangeNewLineMode();
        this.session.doc.addChangeNewLineModeListener(this.onChangeNewLineMode);
    }

    /**
     * Triggers a partial update of the text, from the range given by the two parameters.
     *
     * @method updateLines
     * @param firstRow {number} The first row to update.
     * @param lastRow {number} The last row to update.
     * @param [force] {boolean}
     * @return {void}
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
     * @method onChangeNewLineMode
     * @return {void}
     * @private
     */
    private onChangeNewLineMode(): void {
        this.$loop.schedule(CHANGE_TEXT);
        this.textLayer.updateEolChar();
    }

    /**
     * @method onChangeTabSize
     * @return {void}
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
     *
     * @method updateText
     * @return {void}
     */
    updateText(): void {
        this.$loop.schedule(CHANGE_TEXT);
    }

    /**
     * Triggers a full update of all the layers, for all the rows.
     *
     * @method updateFull
     * @param [force] {boolean} If `true`, forces the changes through.
     * @return {void}
     */
    updateFull(force?: boolean): void {
        if (force)
            this.$renderChanges(CHANGE_FULL, true);
        else
            this.$loop.schedule(CHANGE_FULL);
    }

    /**
     * Updates the font size.
     *
     * @method updateFontSize
     * @return {void}
     */
    updateFontSize(): void {
        this.textLayer.checkForSizeChanges();
    }

    /**
     * @method $updateSizeAsync
     * @return {void}
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
     * @method
     * @param {Boolean} force If `true`, recomputes the size, even if the height and width haven't changed
     * @param {Number} gutterWidth The width of the gutter in pixels
     * @param {Number} width The width of the editor in pixels
     * @param {Number} height The hiehgt of the editor, in pixels
     * @return {number}
     */
    public onResize(force?: boolean, gutterWidth?: number, width?: number, height?: number): number {
        if (this.resizing > 2)
            return;
        else if (this.resizing > 0)
            this.resizing++;
        else
            this.resizing = force ? 1 : 0;
        // `|| el.scrollHeight` is required for outosizing editors on ie
        // where elements with clientHeight = 0 alsoe have clientWidth = 0
        var el = this.container;
        if (!height)
            height = el.clientHeight || el.scrollHeight;
        if (!width)
            width = el.clientWidth || el.scrollWidth;
        var changes = this.$updateCachedSize(force, gutterWidth, width, height);


        if (!this.$size.scrollerHeight || (!width && !height))
            return this.resizing = 0;

        if (force)
            this.$gutterLayer.$padding = null;

        if (force)
            this.$renderChanges(changes | this.$changes, true);
        else
            this.$loop.schedule(changes | this.$changes);

        if (this.resizing)
            this.resizing = 0;
    }

    private $updateCachedSize(force: boolean, gutterWidth: number, width: number, height: number): number {
        height -= (this.$extraHeight || 0);
        var changes = 0;
        var size = this.$size;
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

            this.scrollBarV.element.style.bottom = this.scrollBarH.height + "px";

            changes = changes | CHANGE_SCROLL;
        }

        if (width && (force || size.width !== width)) {
            changes |= CHANGE_SIZE;
            size.width = width;

            if (gutterWidth == null)
                gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0;

            this.gutterWidth = gutterWidth;

            this.scrollBarH.element.style.left =
                this.scroller.style.left = gutterWidth + "px";
            size.scrollerWidth = Math.max(0, width - gutterWidth - this.scrollBarV.width);

            this.scrollBarH.element.style.right =
                this.scroller.style.right = this.scrollBarV.width + "px";
            this.scroller.style.bottom = this.scrollBarH.height + "px";

            if (this.session && this.session.getUseWrapMode() && this.adjustWrapLimit() || force)
                changes |= CHANGE_FULL;
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
        var gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0;
        if (gutterWidth !== this.gutterWidth)
            this.$changes |= this.$updateCachedSize(true, gutterWidth, this.$size.width, this.$size.height);

        if (this.session.getUseWrapMode() && this.adjustWrapLimit()) {
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

    /**
     * Adjusts the wrap limit, which is the number of characters that can fit within the width of the edit area on screen.
     *
     * @method adjustWrapLimit
     * @return {boolean}
     */
    public adjustWrapLimit(): boolean {
        var availableWidth = this.$size.scrollerWidth - this.$padding * 2;
        var limit = Math.floor(availableWidth / this.characterWidth);
        return this.session.adjustWrapLimit(limit, this.$showPrintMargin && this.$printMarginColumn);
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

    /**
     * Identifies whether you want to show invisible characters or not.
     *
     * @method setShowInvisibles
     * @param {Boolean} showInvisibles Set to `true` to show invisibles
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

    setDisplayIndentGuides(displayIndentGuides: boolean): void {
        if (this.textLayer.setDisplayIndentGuides(displayIndentGuides)) {
            this.$loop.schedule(CHANGE_TEXT);
        }
    }

    /**
     * Identifies whether you want to show the print margin or not.
     *
     * @method setShowPrintMargin
     * @param showPrintMargin {boolean} Set to `true` to show the print margin.
     * @return {void}
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
     * @method setPrintMarginColumn
     * @param printMarginColumn {number} Specifies the new print margin.
     * @return {void}
     */
    setPrintMarginColumn(printMarginColumn: number): void {
        this.$printMarginColumn = printMarginColumn;
        this.$updatePrintMargin();
    }

    /**
     * Returns the column number of where the print margin is.
     *
     * @method getPrintMarginColumn
     * @return {number}
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

    getFontSize(): string {
        return this.container.style.fontSize;
    }

    /**
     * Defaults to "12px"
     */
    setFontSize(fontSize: string) {
        this.container.style.fontSize = fontSize;
        this.updateFontSize();
    }

    setHighlightGutterLine(highlightGutterLine: boolean): void {
        this.$highlightGutterLine = highlightGutterLine;
        if (!this.$gutterLineHighlight) {
            this.$gutterLineHighlight = createElement("div");
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

    getPixelPosition(position: Position, onScreen: boolean): PixelPosition {
        return this.cursorLayer.getPixelPosition(position, onScreen);
    }

    $updateGutterLineHighlight() {
        var pos = this.cursorLayer.$pixelPos;
        var height = this.layerConfig.lineHeight;
        if (this.session.getUseWrapMode()) {
            var cursor = this.session.getSelection().getCursor();
            cursor.column = 0;
            pos = this.getPixelPosition(cursor, true);
            height *= this.session.getRowLength(cursor.row);
        }
        this.$gutterLineHighlight.style.top = pos.top - this.layerConfig.offset + "px";
        this.$gutterLineHighlight.style.height = height + "px";
    }

    $updatePrintMargin() {
        if (!this.$showPrintMargin && !this.$printMarginEl)
            return;

        if (!this.$printMarginEl) {
            var containerEl: HTMLDivElement = <HTMLDivElement>createElement("div");
            containerEl.className = "ace_layer ace_print-margin-layer";
            this.$printMarginEl = <HTMLDivElement>createElement("div");
            this.$printMarginEl.className = "ace_print-margin";
            containerEl.appendChild(this.$printMarginEl);
            this.content.insertBefore(containerEl, this.content.firstChild);
        }

        var style = this.$printMarginEl.style;
        style.left = ((this.characterWidth * this.$printMarginColumn) + this.$padding) + "px";
        style.visibility = this.$showPrintMargin ? "visible" : "hidden";

        // FIXME: Should this be $useWrapMode?
        if (this.session && this.session['$wrap'] === -1)
            this.adjustWrapLimit();
    }

    /**
     * Returns the root element containing this renderer.
     *
     * @method getContainerElement
     * @return {HTMLElement}
     */
    getContainerElement(): HTMLElement {
        return this.container;
    }

    /**
     * Returns the element that the mouse events are attached to.
     *
     * @method getMouseEventTarget
     * @return {HTMLDivElement}
     */
    getMouseEventTarget(): HTMLDivElement {
        return this.content;
    }

    /**
     * Returns the element to which the hidden text area is added.
     *
     * @method getTextAreaContainer
     * @return {HTMLElement}
     */
    getTextAreaContainer(): HTMLElement {
        return this.container;
    }

    /**
     * Move text input over the cursor.
     * Required for iOS and IME.
     *
     * @method $moveTextAreaToCursor
     * @return {void}
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

        let posTop = this.cursorLayer.$pixelPos.top;
        let posLeft = this.cursorLayer.$pixelPos.left;
        posTop -= config.offset;

        let h = this.lineHeight;
        if (posTop < 0 || posTop > config.height - h)
            return;

        let w = this.characterWidth;
        if (this.$composition) {
            var val = this.textarea.value.replace(/^\x01+/, "");
            w *= (this.session.$getStringScreenWidth(val)[0] + 2);
            h += 2;
            posTop -= 1;
        }
        posLeft -= this.scrollLeft;
        if (posLeft > this.$size.scrollerWidth - w)
            posLeft = this.$size.scrollerWidth - w;

        posLeft -= this.scrollBarV.width;

        this.textarea.style.height = h + "px";
        this.textarea.style.width = w + "px";
        this.textarea.style.right = Math.max(0, this.$size.scrollerWidth - posLeft - w) + "px";
        this.textarea.style.bottom = Math.max(0, this.$size.height - posTop - h) + "px";
    }

    /**
     * Returns the index of the first visible row.
     *
     * @method getFirstVisibleRow
     * @return {Number}
     */
    getFirstVisibleRow(): number {
        return this.layerConfig.firstRow;
    }

    /**
     * Returns the index of the first fully visible row.
     * "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
     *
     * @method getFirstFullyVisibleRow
     * @return {number}
     */
    getFirstFullyVisibleRow(): number {
        return this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1);
    }

    /**
     * Returns the index of the last fully visible row.
     * "Fully" here means that the characters in the row are not truncated; that the top and the bottom of the row are on the screen.
     *
     * @method getLastFullyVisibleRow
     * @return {number}
     */
    getLastFullyVisibleRow(): number {
        var flint = Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.layerConfig.lineHeight);
        return this.layerConfig.firstRow - 1 + flint;
    }

    /**
     * Returns the index of the last visible row.
     *
     * @method getLastVisibleRow
     * @return {number}
     */
    getLastVisibleRow(): number {
        return this.layerConfig.lastRow;
    }

    /**
     * Gets the padding.
     *
     * @method getPadding
     * @return {number}
     */
    getPadding(): number {
        return this.$padding;
    }

    /**
     * Sets the padding for all the layers.
     *
     * @method setPadding
     * @param padding {number} A new padding value (in pixels).
     * @return {void}
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
        var sm = this.scrollMargin;
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
     *
     * @method getHScrollBarAlwaysVisible
     * @return {boolean}
     */
    getHScrollBarAlwaysVisible(): boolean {
        return this.$hScrollBarAlwaysVisible;
    }

    /**
     * Identifies whether you want to show the horizontal scrollbar or not.
     *
     * @method setHScrollBarAlwaysVisible
     * @param hScrollBarAlwaysVisible {boolean} Set to `true` to make the horizontal scroll bar visible.
     * @return {void}
     */
    setHScrollBarAlwaysVisible(hScrollBarAlwaysVisible: boolean) {
        this.$hScrollBarAlwaysVisible = hScrollBarAlwaysVisible;
        if (!this.$hScrollBarAlwaysVisible || !this.$horizScroll) {
            this.$loop.schedule(CHANGE_SCROLL);
        }
    }

    /**
     * Returns whether the vertical scrollbar is set to be always visible.
     *
     * @method getVScrollBarAlwaysVisible
     * @return {boolean}
     */
    getVScrollBarAlwaysVisible(): boolean {
        return this.$vScrollBarAlwaysVisible;
    }

    /**
     * Identifies whether you want to show the vertical scrollbar or not.
     * @param {Boolean} alwaysVisible Set to `true` to make the vertical scroll bar visible
     */
    setVScrollBarAlwaysVisible(alwaysVisible: boolean) {
        this.$vScrollBarAlwaysVisible = alwaysVisible;
        if (!this.$vScrollBarAlwaysVisible || !this.$vScroll) {
            this.$loop.schedule(CHANGE_SCROLL);
        }
    }

    setShowLineNumber(showLineNumbers: boolean) {
        this.$gutterLayer.setShowLineNumbers(showLineNumbers);
        this.$loop.schedule(CHANGE_GUTTER);
    }


    private $updateScrollBarV(): void {
        var scrollHeight = this.layerConfig.maxHeight;
        var scrollerHeight = this.$size.scrollerHeight;
        if (!this.$maxLines && this.$scrollPastEnd) {
            scrollHeight -= (scrollerHeight - this.lineHeight) * this.$scrollPastEnd;
            if (this.scrollTop > scrollHeight - scrollerHeight) {
                scrollHeight = this.scrollTop + scrollerHeight;
                this.scrollBarV.scrollTop = null;
            }
        }
        this.scrollBarV.setScrollHeight(scrollHeight + this.scrollMargin.v);
        this.scrollBarV.setScrollTop(this.scrollTop + this.scrollMargin.top);
    }

    private $updateScrollBarH() {
        this.scrollBarH.setScrollWidth(this.layerConfig.width + 2 * this.$padding + this.scrollMargin.h);
        this.scrollBarH.setScrollLeft(this.scrollLeft + this.scrollMargin.left);
    }

    freeze() {
        this.$frozen = true;
    }

    unfreeze() {
        this.$frozen = false;
    }

    /**
     * @method $renderChanges
     * @param changes {number}
     * @param force {boolean}
     * @return {number}
     * @private
     */
    private $renderChanges(changes: number, force: boolean): number {

        if (this.$changes) {
            changes |= this.$changes;
            this.$changes = 0;
        }
        if ((!this.session || !this.container.offsetWidth || this.$frozen) || (!changes && !force)) {
            this.$changes |= changes;
            return;
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

        var config = this.layerConfig;
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
            if (changes & CHANGE_H_SCROLL)
                this.$updateScrollBarH();
            this.$gutterLayer.element.style.marginTop = (-config.offset) + "px";
            this.content.style.marginTop = (-config.offset) + "px";
            this.content.style.width = config.width + 2 * this.$padding + "px";
            this.content.style.height = config.minHeight + "px";
        }

        // horizontal scrolling
        if (changes & CHANGE_H_SCROLL) {
            this.content.style.marginLeft = -this.scrollLeft + "px";
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

            return;
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
            return;
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
    }

    private $autosize() {
        var height = this.session.getScreenLength() * this.lineHeight;
        var maxHeight = this.$maxLines * this.lineHeight;
        var desiredHeight = Math.max(
            (this.$minLines || 1) * this.lineHeight,
            Math.min(maxHeight, height)
        ) + this.scrollMargin.v + (this.$extraHeight || 0);
        var vScroll = height > maxHeight;

        if (desiredHeight !== this.desiredHeight ||
            this.$size.height !== this.desiredHeight || vScroll !== this.$vScroll) {
            if (vScroll !== this.$vScroll) {
                this.$vScroll = vScroll;
                this.scrollBarV.setVisible(vScroll);
            }

            var w = this.container.clientWidth;
            this.container.style.height = desiredHeight + "px";
            this.$updateCachedSize(true, this.$gutterWidth, w, desiredHeight);
            // this.$loop.changes = 0;
            this.desiredHeight = desiredHeight;
        }
    }

    private $computeLayerConfig() {

        if (this.$maxLines && this.lineHeight > 1) {
            this.$autosize();
        }

        var session = this.session;
        var size = this.$size;

        var hideScrollbars = size.height <= 2 * this.lineHeight;
        var screenLines = this.session.getScreenLength();
        var maxHeight = screenLines * this.lineHeight;

        var offset = this.scrollTop % this.lineHeight;
        var minHeight = size.scrollerHeight + this.lineHeight;

        var longestLine = this.$getLongestLine();

        var horizScroll = !hideScrollbars && (this.$hScrollBarAlwaysVisible ||
            size.scrollerWidth - longestLine - 2 * this.$padding < 0);

        var hScrollChanged = this.$horizScroll !== horizScroll;
        if (hScrollChanged) {
            this.$horizScroll = horizScroll;
            this.scrollBarH.setVisible(horizScroll);
        }

        if (!this.$maxLines && this.$scrollPastEnd) {
            maxHeight += (size.scrollerHeight - this.lineHeight) * this.$scrollPastEnd;
        }

        var vScroll = !hideScrollbars && (this.$vScrollBarAlwaysVisible ||
            size.scrollerHeight - maxHeight < 0);
        var vScrollChanged = this.$vScroll !== vScroll;
        if (vScrollChanged) {
            this.$vScroll = vScroll;
            this.scrollBarV.setVisible(vScroll);
        }

        this.session.setScrollTop(Math.max(-this.scrollMargin.top,
            Math.min(this.scrollTop, maxHeight - size.scrollerHeight + this.scrollMargin.bottom)));

        this.session.setScrollLeft(Math.max(-this.scrollMargin.left, Math.min(this.scrollLeft,
            longestLine + 2 * this.$padding - size.scrollerWidth + this.scrollMargin.right)));

        var lineCount = Math.ceil(minHeight / this.lineHeight) - 1;
        var firstRow = Math.max(0, Math.round((this.scrollTop - offset) / this.lineHeight));
        var lastRow = firstRow + lineCount;

        // Map lines on the screen to lines in the document.
        var firstRowScreen, firstRowHeight;
        var lineHeight = this.lineHeight;
        firstRow = session.screenToDocumentRow(firstRow, 0);

        // Check if firstRow is inside of a foldLine. If true, then use the first
        // row of the foldLine.
        var foldLine = session.getFoldLine(firstRow);
        if (foldLine) {
            firstRow = foldLine.start.row;
        }

        firstRowScreen = session.documentToScreenRow(firstRow, 0);
        firstRowHeight = session.getRowLength(firstRow) * lineHeight;

        lastRow = Math.min(session.screenToDocumentRow(lastRow, 0), session.getLength() - 1);
        minHeight = size.scrollerHeight + session.getRowLength(lastRow) * lineHeight +
            firstRowHeight;

        offset = this.scrollTop - firstRowScreen * lineHeight;

        var changes = 0;
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

    private $updateLines() {
        var firstRow = this.$changedLines.firstRow;
        var lastRow = this.$changedLines.lastRow;
        this.$changedLines = null;

        var layerConfig = this.layerConfig;

        if (firstRow > layerConfig.lastRow + 1) { return; }
        if (lastRow < layerConfig.firstRow) { return; }

        // if the last row is unknown -> redraw everything
        if (lastRow === Infinity) {
            if (this.$showGutter)
                this.$gutterLayer.update(layerConfig);
            this.textLayer.update(layerConfig);
            return;
        }

        // else update only the changed rows
        this.textLayer.updateLines(layerConfig, firstRow, lastRow);
        return true;
    }

    private $getLongestLine(): number {
        var charCount = this.session.getScreenWidth();
        if (this.showInvisibles && !this.session.$useWrapMode)
            charCount += 1;

        return Math.max(this.$size.scrollerWidth - 2 * this.$padding, Math.round(charCount * this.characterWidth));
    }

    /**
     * Schedules an update to all the front markers in the document.
     *
     * @method updateFrontMarkers
     * @return {void}
     */
    updateFrontMarkers(): void {
        this.$markerFront.setMarkers(this.session.getMarkers(/*inFront=*/true));
        this.$loop.schedule(CHANGE_MARKER_FRONT);
    }

    /**
     * Schedules an update to all the back markers in the document.
     *
     * @method updateBackMarkers
     * @return {void}
     */
    updateBackMarkers(): void {
        this.$markerBack.setMarkers(this.session.getMarkers(false));
        this.$loop.schedule(CHANGE_MARKER_BACK);
    }

    /**
     * Redraw breakpoints.
     *
     * @method updateBreakpoints
     * @return {void}
     */
    updateBreakpoints(): void {
        this.$loop.schedule(CHANGE_GUTTER);
    }

    /**
     * Sets annotations for the gutter.
     *
     * @method setAnnotations
     * @param {Annotation[]} annotations An array containing annotations.
     * @return {void}
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
     * @method scrollSelectionIntoView
     * @param anchor {Position}
     * @param lead {Position}
     * @param [offset] {number}
     * @return {void}
     */
    scrollSelectionIntoView(anchor: Position, lead: Position, offset?: number): void {
        // first scroll anchor into view then scroll lead into view
        this.scrollCursorIntoView(anchor, offset);
        this.scrollCursorIntoView(lead, offset);
    }

    /**
     * Scrolls the cursor into the first visibile area of the editor.
     *
     * @method scrollCursorIntoView
     * @param cursor {Position}
     * @param [offset] {number}
     * @param [$viewMargin] {{top: number; bottom: number}}
     * @return {void}
     */
    scrollCursorIntoView(cursor?: Position, offset?: number, $viewMargin?: { top: number; bottom: number }): void {
        // the editor is not visible
        if (this.$size.scrollerHeight === 0)
            return;

        var pos = this.getPixelPosition(cursor, false);

        var left = pos.left;
        var top = pos.top;

        var topMargin = $viewMargin && $viewMargin.top || 0;
        var bottomMargin = $viewMargin && $viewMargin.bottom || 0;

        var scrollTop = this.$scrollAnimation ? this.session.getScrollTop() : this.scrollTop;

        if (scrollTop + topMargin > top) {
            if (offset)
                top -= offset * this.$size.scrollerHeight;
            if (top === 0)
                top = -this.scrollMargin.top;
            this.session.setScrollTop(top);
        }
        else if (scrollTop + this.$size.scrollerHeight - bottomMargin < top + this.lineHeight) {
            if (offset)
                top += offset * this.$size.scrollerHeight;
            this.session.setScrollTop(top + this.lineHeight - this.$size.scrollerHeight);
        }

        var scrollLeft = this.scrollLeft;

        if (scrollLeft > left) {
            if (left < this.$padding + 2 * this.layerConfig.characterWidth)
                left = -this.scrollMargin.left;
            this.session.setScrollLeft(left);
        }
        else if (scrollLeft + this.$size.scrollerWidth < left + this.characterWidth) {
            this.session.setScrollLeft(Math.round(left + this.characterWidth - this.$size.scrollerWidth));
        }
        else if (scrollLeft <= this.$padding && left - scrollLeft < this.characterWidth) {
            this.session.setScrollLeft(0);
        }
    }

    /**
     * @method getScrollTop
     * @return {Number}
     */
    getScrollTop(): number {
        return this.session.getScrollTop();
    }

    /**
     * @method getScrollLeft
     * @return {Number}
     */
    getScrollLeft(): number {
        return this.session.getScrollLeft();
    }

    /**
     * Returns the first visible row, regardless of whether it's fully visible or not.
     *
     * @method getScrollTopRow
     * @return {number}
     */
    getScrollTopRow(): number {
        return this.scrollTop / this.lineHeight;
    }

    /**
     * Returns the last visible row, regardless of whether it's fully visible or not.
     *
     * @method getScrollBottomRow
     * @return {number}
     */
    getScrollBottomRow(): number {
        return Math.max(0, Math.floor((this.scrollTop + this.$size.scrollerHeight) / this.lineHeight) - 1);
    }

    /**
     * Gracefully scrolls from the top of the editor to the row indicated.
     *
     * @method setScrollRow
     * @param row {number} A row id.
     */
    scrollToRow(row: number): void {
        this.session.setScrollTop(row * this.lineHeight);
    }

    alignCursor(cursor/*: Position*/, alignment: number) {
        // FIXME: Don't have polymorphic cursor parameter.
        if (typeof cursor === "number")
            cursor = { row: cursor, column: 0 };

        var pos = this.getPixelPosition(cursor, false);
        var h = this.$size.scrollerHeight - this.lineHeight;
        var offset = pos.top - h * (alignment || 0);

        this.session.setScrollTop(offset);
        return offset;
    }

    $calcSteps(fromValue: number, toValue: number): number[] {
        var i = 0;
        var l: number = this.STEPS;
        var steps: number[] = [];

        var func = function (t: number, x_min: number, dx: number): number {
            return dx * (Math.pow(t - 1, 3) + 1) + x_min;
        };

        for (i = 0; i < l; ++i) {
            steps.push(func(i / this.STEPS, fromValue, toValue - fromValue));
        }

        return steps;
    }

    /**
     * Gracefully scrolls the editor to the row indicated.
     * @param {Number} line A line number
     * @param {Boolean} center If `true`, centers the editor the to indicated line
     * @param {Boolean} animate If `true` animates scrolling
     * @param {Function} callback Function to be called after the animation has finished
     */
    scrollToLine(line: number, center: boolean, animate: boolean, callback: () => void) {
        const pos = this.getPixelPosition({ row: line, column: 0 }, false);
        let offset = pos.top;
        if (center) {
            offset -= this.$size.scrollerHeight / 2;
        }

        const initialScroll = this.scrollTop;
        this.session.setScrollTop(offset);
        if (animate !== false) {
            this.animateScrolling(initialScroll, callback);
        }
    }

    /**
     * @method animateScrolling
     * @param fromValue {number}
     * @param callback {()=>any}
     * @return {void}
     */
    animateScrolling(fromValue: number, callback?: () => any): void {
        let toValue = this.scrollTop;
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

        const steps = this.$calcSteps(fromValue, toValue);
        this.$scrollAnimation = { from: fromValue, to: toValue, steps: steps };

        clearInterval(this.$timer);

        this.session.setScrollTop(steps.shift());
        // trick session to think it's already scrolled to not loose toValue
        this.session.$scrollTop = toValue;
        this.$timer = setInterval(() => {
            if (steps.length) {
                this.session.setScrollTop(steps.shift());
                this.session.$scrollTop = toValue;
            }
            else if (toValue != null) {
                this.session.$scrollTop = -1;
                this.session.setScrollTop(toValue);
                toValue = null;
            }
            else {
                // do this on separate step to not get spurious scroll event from scrollbar
                clearInterval(this.$timer);
                this.$timer = void 0;
                this.$scrollAnimation = null;
                if (callback) {
                    callback();
                }
            }
        }, 10);
    }

    /**
     * Scrolls the editor to the y pixel indicated.
     * @param {Number} scrollTop The position to scroll to
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
     * @method scrollToX
     * @param scrollLeft {number} The position to scroll to.
     * @return {void}
     */
    scrollToX(scrollLeft: number): void {
        if (this.scrollLeft !== scrollLeft) {
            this.scrollLeft = scrollLeft;
            this.$loop.schedule(CHANGE_H_SCROLL);
        }
    }

    /**
     * Scrolls the editor across both x- and y-axes.
     *
     * @method scrollTo
     * @param x {number} The x value to scroll to.
     * @param y {number} The y value to scroll to.
     * @return {void}
     */
    scrollTo(x: number, y: number): void {
        this.session.setScrollTop(y);
        this.session.setScrollLeft(y);
    }

    /**
     * Scrolls the editor across both x- and y-axes.
     *
     * @method scrollBy
     * @param deltaX {number} The x value to scroll by.
     * @param deltaY {number} The y value to scroll by.
     * @return {void}
     */
    scrollBy(deltaX: number, deltaY: number): void {
        if (deltaY) {
            this.session.setScrollTop(this.session.getScrollTop() + deltaY);
        }
        if (deltaX) {
            this.session.setScrollLeft(this.session.getScrollLeft() + deltaX);
        }
    }

    /**
     * Returns `true` if you can still scroll by either parameter; in other words, you haven't reached the end of the file or line.
     *
     * @method isScrollableBy
     * @param {number} deltaX The x value to scroll by
     * @param {number} deltaY The y value to scroll by
     * @return {boolean}
     */
    isScrollableBy(deltaX: number, deltaY: number): boolean {
        if (deltaY < 0 && this.session.getScrollTop() >= 1 - this.scrollMargin.top)
            return true;
        if (deltaY > 0 && this.session.getScrollTop() + this.$size.scrollerHeight
            - this.layerConfig.maxHeight < -1 + this.scrollMargin.bottom)
            return true;
        if (deltaX < 0 && this.session.getScrollLeft() >= 1 - this.scrollMargin.left)
            return true;
        if (deltaX > 0 && this.session.getScrollLeft() + this.$size.scrollerWidth
            - this.layerConfig.width < -1 + this.scrollMargin.right)
            return true;
    }

    pixelToScreenCoordinates(x: number, y: number) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var offset = (x + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth;
        var row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight);
        var col = Math.round(offset);

        return { row: row, column: col, side: offset - col > 0 ? 1 : -1 };
    }

    screenToTextCoordinates(clientX: number, clientY: number): Position {
        var canvasPos = this.scroller.getBoundingClientRect();

        var column = Math.round((clientX + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth);

        var row = (clientY + this.scrollTop - canvasPos.top) / this.lineHeight;

        return this.session.screenToDocumentPosition(row, Math.max(column, 0));
    }

    /**
     * Returns an object containing the `pageX` and `pageY` coordinates of the document position.
     *
     * @method textToScreenCoordinates
     * @param row {number} The document row position
     * @param column {number} The document column position
     * @return {ScreenCoordinates}
     */
    textToScreenCoordinates(row: number, column: number): ScreenCoordinates {
        var canvasPos: ClientRect = this.scroller.getBoundingClientRect();
        var pos: Position = this.session.documentToScreenPosition(row, column);

        var x = this.$padding + Math.round(pos.column * this.characterWidth);
        var y = pos.row * this.lineHeight;

        return {
            pageX: canvasPos.left + x - this.scrollLeft,
            pageY: canvasPos.top + y - this.scrollTop
        };
    }

    /**
     * Focuses the current container.
     */
    visualizeFocus() {
        addCssClass(this.container, "ace_focus");
    }

    /**
     * Blurs the current container.
     */
    visualizeBlur() {
        removeCssClass(this.container, "ace_focus");
    }

    /**
     * @method showComposition
     * @param position
     * @private
     */
    showComposition(position: { row: number; column: number }) {
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
     * @param {String} text A string of text to use
     *
     * Sets the inner text of the current composition to `text`.
     */
    setCompositionText(text?: string): void {
        // TODO: Why is the parameter not used?
        this.$moveTextAreaToCursor();
    }

    /**
     * Hides the current composition.
     */
    hideComposition() {
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

        var padding = "padding" in modJs ? modJs.padding : "padding" in (this.theme || {}) ? 4 : this.$padding;

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
     * @method addCssClass
     * @param cssClass {string}
     * @return {void}
     */
    addCssClass(cssClass: string): void {
        addCssClass(this.container, cssClass);
    }

    removeCssClass(cssClass: string): void {
        removeCssClass(this.container, cssClass);
    }

    /**
     * @method setCssClass
     * @param className: {string}
     * @param include {boolean}
     * @return {void}
     */
    setCssClass(className: string, include: boolean): void {
        setCssClass(this.container, className, include);
    }

    /**
     * Appends a link element with rel='stylesheet' type='text/css', and sets the cssClass as the id.
     * The cssClass doubles as both an identifier and a CSS class.
     *
     * @method setThemeCss
     * @param themeId {string}
     * @param [href] {string}
     * @return {void}
     */
    setThemeCss(themeId: string, href?: string): void {
        if (this.themeId) {
            this.removeCssClass(this.themeId);
            if (hasHTMLLinkElement(this.themeId, this.container.ownerDocument)) {
                removeHTMLLinkElement(themeId, this.container.ownerDocument);
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

    setThemeDark(isDark: boolean): void {
        this.setCssClass("ace_dark", isDark);
    }

    /**
     * Returns the path of the current theme.
     *
     * @method getTheme
     * @return {string}
     */
    getTheme(): string {
        return this.themeId;
    }

    // Methods allows to add / remove CSS classnames to the editor element.
    // This feature can be used by plug-ins to provide a visual indication of
    // a certain mode that editor is in.

    /**
     * Adds a new class, `style`, to the editor.
     * @param {String} style A class name
     *
     */
    setStyle(style: string, include?: boolean): void {
        setCssClass(this.container, style, include !== false);
    }

    /**
     * Removes the class `style` from the editor.
     * @param {String} style A class name
     */
    unsetStyle(style: string): void {
        removeCssClass(this.container, style);
    }

    /**
     * @method setCursorStyle
     * @param style {string}
     * @return {void}
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
/*
defineOptions(Renderer.prototype, "renderer", {
    showInvisibles: {
        set: function(value) {
            if (this.$textLayer.setShowInvisibles(value))
                this.$loop.schedule(this.CHANGE_TEXT);
        },
    },
    showPrintMargin: {
        set: function() { this.$updatePrintMargin(); },
        initialValue: true
    },
    printMarginColumn: {
        set: function() { this.$updatePrintMargin(); },
        initialValue: 80
    },
    printMargin: {
        set: function(value: number) {
            if (typeof value === "number")
                this.$printMarginColumn = value;
            this.$showPrintMargin = !!value;
            this.$updatePrintMargin();
        },
        get: function() {
            return this.$showPrintMargin && this.$printMarginColumn;
        }
    },
    showFoldWidgets: {
        set: function(show) { this.$gutterLayer.setShowFoldWidgets(show); },
        initialValue: true
    },
    fontFamily: {
        set: function(fontFamily: string) {
            var that: Renderer = this;
            that.container.style.fontFamily = fontFamily;
            that.updateFontSize();
        }
    },
    maxLines: {
        set: function(val) {
            this.updateFull();
        }
    },
    minLines: {
        set: function(val) {
            this.updateFull();
        }
    },
    scrollPastEnd: {
        set: function(value: number) {
            value = +value || 0;
            if (this.$scrollPastEnd === value)
                return;
            this.$scrollPastEnd = value;
            this.$loop.schedule(this.CHANGE_SCROLL);
        },
        initialValue: 0,
        handlesSet: true
    },
    fixedWidthGutter: {
        set: function(val) {
            this.$gutterLayer.$fixedWidth = !!val;
            this.$loop.schedule(this.CHANGE_GUTTER);
        }
    },
    theme: {
        set: function(val) { this.setTheme(val); },
        get: function() { return this.themeId || this.theme; },
        initialValue: "./theme/textmate",
        handlesSet: true
    }
});
*/

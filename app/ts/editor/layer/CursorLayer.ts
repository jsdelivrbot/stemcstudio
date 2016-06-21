import {addCssClass, createElement, removeCssClass, setCssClass} from "../lib/dom";
import AbstractLayer from './AbstractLayer';
import Disposable from '../base/Disposable';
import EditSession from '../EditSession';
import Position from '../Position';
import PixelPosition from '../PixelPosition';
import CursorConfig from './CursorConfig';

let isIE8;

/**
 * This class is the HTML representation of the CursorLayer.
 */
export default class CursorLayer extends AbstractLayer implements Disposable {
    private session: EditSession;
    private isVisible = false;
    public isBlinking = true;
    private blinkInterval = 1000;
    private smoothBlinking = false;
    private intervalId: number;
    private timeoutId: number;
    private cursors: HTMLDivElement[] = [];
    private cursor: HTMLDivElement;
    private $padding: number = 0;
    private overwrite: boolean;
    private $updateCursors: (doIt: boolean) => void;
    public config: CursorConfig;
    public $pixelPos: PixelPosition;

    /**
     * @class CursorLayer
     * @constructor
     * @param parent {HTMLElement}
     */
    constructor(parent: HTMLElement) {
        super(parent, "ace_layer ace_cursor-layer");

        if (isIE8 === void 0) {
            isIE8 = !("opacity" in this.element.style);
        }

        this.cursor = this.addCursor();
        addCssClass(this.element, "ace_hidden-cursors");
        this.$updateCursors = (isIE8 ? this.$updateVisibility : this.$updateOpacity).bind(this);
    }

    /**
     *
     */
    public dispose(): void {
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
    }

    private $updateVisibility(visible: boolean): void {
        const cursors = this.cursors;
        for (let i = cursors.length; i--;) {
            cursors[i].style.visibility = visible ? "" : "hidden";
        }
    }

    private $updateOpacity(opaque: boolean): void {
        const cursors = this.cursors;
        for (let i = cursors.length; i--;) {
            cursors[i].style.opacity = opaque ? "" : "0";
        }
    }

    /**
     * @method setPadding
     * @param padding {number}
     * @return {void}
     */
    public setPadding(padding: number): void {
        if (typeof padding === 'number') {
            this.$padding = padding;
        }
        else {
            throw new TypeError("padding must be a number");
        }
    }

    /**
     * @method setSession
     * @param session {EditSession}
     * @return {void}
     */
    public setSession(session: EditSession): void {
        this.session = session;
    }

    public setBlinking(blinking: boolean) {
        if (blinking !== this.isBlinking) {
            this.isBlinking = blinking;
            this.restartTimer();
        }
    }

    public setBlinkInterval(blinkInterval: number): void {
        if (blinkInterval !== this.blinkInterval) {
            this.blinkInterval = blinkInterval;
            this.restartTimer();
        }
    }

    /**
     * @method setSmoothBlinking
     * @param smoothBlinking {boolean}
     * @return {void}
     */
    public setSmoothBlinking(smoothBlinking: boolean): void {
        if (smoothBlinking !== this.smoothBlinking && !isIE8) {
            this.smoothBlinking = smoothBlinking;
            setCssClass(this.element, "ace_smooth-blinking", smoothBlinking);
            this.$updateCursors(true);
            // TODO: Differs from ACE...
            this.$updateCursors = (smoothBlinking
                ? this.$updateOpacity
                : this.$updateVisibility).bind(this);
            this.restartTimer();
        }
    }

    private addCursor(): HTMLDivElement {
        const cursor: HTMLDivElement = <HTMLDivElement>createElement("div");
        cursor.className = "ace_cursor";
        this.element.appendChild(cursor);
        this.cursors.push(cursor);
        return cursor;
    }

    private removeCursor(): HTMLDivElement {
        if (this.cursors.length > 1) {
            const cursor = this.cursors.pop();
            cursor.parentNode.removeChild(cursor);
            return cursor;
        }
    }

    /**
     * @method hideCursor
     * @return {void}
     */
    public hideCursor(): void {
        this.isVisible = false;
        addCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    }

    /**
     * @method showCursor
     * @return {void}
     */
    public showCursor(): void {
        this.isVisible = true;
        removeCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    }

    /**
     * @method restartTimer
     * @return {void}
     */
    public restartTimer(): void {
        const update = this.$updateCursors;
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
        if (this.smoothBlinking) {
            removeCssClass(this.element, "ace_smooth-blinking");
        }

        update(true);

        if (!this.isBlinking || !this.blinkInterval || !this.isVisible)
            return;

        if (this.smoothBlinking) {
            setTimeout(() => {
                addCssClass(this.element, "ace_smooth-blinking");
            });
        }

        const blink = () => {
            this.timeoutId = setTimeout(() => {
                update(false);
            }, 0.6 * this.blinkInterval);
        };

        this.intervalId = setInterval(function() {
            update(true);
            blink();
        }, this.blinkInterval);

        blink();
    }

    /**
     * Computes the pixel position relative to the top-left corner of the cursor layer.
     * The number of rows is multiplied by the line height.
     * The number of columns is multiplied by the character width.
     * The padding is added to the left property only.
     *
     * @method getPixelPosition
     * @param [position] {Position}
     * @param [onScreen] {boolean}
     * @return {PixelPosition}
     */
    public getPixelPosition(position?: Position, onScreen?: boolean): PixelPosition {

        if (!this.config || !this.session) {
            return { left: 0, top: 0 };
        }

        if (!position) {
            position = this.session.getSelection().getCursor();
        }

        const pos: Position = this.session.documentToScreenPosition(position.row, position.column);

        const cursorLeft = this.$padding + pos.column * this.config.characterWidth;
        const cursorTop = (pos.row - (onScreen ? this.config.firstRowScreen : 0)) * this.config.lineHeight;

        return { left: cursorLeft, top: cursorTop };
    }

    /**
     * @method update
     * @param config {CursorConfig}
     * @return {void}
     */
    public update(config: CursorConfig): void {

        this.config = config;

        // Selection markers is a concept from multi selection.
        // FIXME: Why can't we type the selections as Range[]?
        var selections: any[] = this.session.$selectionMarkers;
        var i = 0, cursorIndex = 0;

        if (selections === undefined || selections.length === 0) {
            selections = [{ cursor: null }];
        }

        for (var i = 0, n = selections.length; i < n; i++) {

            var pixelPos = this.getPixelPosition(selections[i].cursor, true);

            if ((pixelPos.top > config.height + config.offset ||
                pixelPos.top < 0) && i > 1) {
                continue;
            }

            var style = (this.cursors[cursorIndex++] || this.addCursor()).style;

            style.left = pixelPos.left + "px";
            style.top = pixelPos.top + "px";
            style.width = config.characterWidth + "px";
            style.height = config.lineHeight + "px";
        }

        while (this.cursors.length > cursorIndex) {
            this.removeCursor();
        }

        var overwrite = this.session.getOverwrite();
        this.$setOverwrite(overwrite);

        // cache for textarea and gutter highlight
        this.$pixelPos = pixelPos;
        this.restartTimer();
    }

    private $setOverwrite(overwrite: boolean) {
        if (overwrite !== this.overwrite) {
            this.overwrite = overwrite;
            if (overwrite)
                addCssClass(this.element, "ace_overwrite-cursors");
            else
                removeCssClass(this.element, "ace_overwrite-cursors");
        }
    }
}

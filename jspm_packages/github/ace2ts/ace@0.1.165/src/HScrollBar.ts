import { addListener } from "./lib/event";
import ScrollBar from './ScrollBar';
import Renderer from "./Renderer";
import ScrollBarEvent from './events/ScrollBarEvent';

/**
 * A horizontal scroll bar.
 *
 * @class HScrollBar
 * @extends ScrollBar
 */
export default class HScrollBar extends ScrollBar {

    private _scrollLeft = 0;
    private _height: number;
    /**
     * Creates a new `HScrollBar`. `parent` is the owner of the scroll bar.
     *
     * @class HScrollBar
     * @constructor
     * @param parent {HTMLElement} A DOM element.
     * @param renderer {Renderer} An editor renderer.
     */
    constructor(parent: HTMLElement, renderer: Renderer) {
        super(parent, '-h');

        // in OSX lion the scrollbars appear to have no width. In this case resize the
        // element to show the scrollbar but still pretend that the scrollbar has a width
        // of 0px
        // in Firefox 6+ scrollbar is hidden if element has the same width as scrollbar
        // make element a little bit wider to retain scrollbar when page is zoomed 
        this._height = renderer.$scrollbarWidth;
        this.inner.style.height = this.element.style.height = (this._height || 15) + 5 + "px";
        // FIXME: We need a lifecycle so that this can be removed.
        addListener(this.element, "scroll", this.onScroll.bind(this));
    }

    /**
     * Emitted when the scroll bar, well, scrolls.
     * 
     * @method onScroll
     * @return {void}
     */
    onScroll(): void {
        if (!this.skipEvent) {
            this._scrollLeft = this.element.scrollLeft;
            /**
             * @event scroll
             * @param {ScrollBarEvent} Contains the scrollLeft value.
             */
            const event: ScrollBarEvent = { data: this._scrollLeft };
            this.eventBus._emit("scroll", event);
        }
        this.skipEvent = false;
    }

    /**
     * Returns the height of the scroll bar.
     * @return {Number}
     **/
    get height(): number {
        return this.isVisible ? this._height : 0;
    }

    /**
     * Sets the width of the scroll bar, in pixels.
     * @param {Number} width The new width
     **/
    setWidth(width: number): void {
        this.element.style.width = width + "px";
    }

    /**
     * Sets the inner width of the scroll bar, in pixels.
     * @param {Number} width The new inner width
     * @deprecated Use setScrollWidth instead
     **/
    setInnerWidth(width: number) {
        this.inner.style.width = width + "px";
    }

    /**
     * Sets the scroll width of the scroll bar, in pixels.
     * @param {Number} width The new scroll width
     **/
    setScrollWidth(width: number) {
        this.inner.style.width = width + "px";
    }

    /**
     * Sets the scroll left of the scroll bar.
     * @param {Number} scrollTop The new scroll left
     **/
    // on chrome 17+ for small zoom levels after calling this function
    // this.element.scrollTop != scrollTop which makes page to scroll up.
    setScrollLeft(scrollLeft: number) {
        if (this._scrollLeft != scrollLeft) {
            this.skipEvent = true;
            this._scrollLeft = this.element.scrollLeft = scrollLeft;
        }
    }
}

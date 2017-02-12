import { addListener } from "./lib/event";
import ScrollBar from './ScrollBar';
import { scrollbarWidth } from "./lib/dom";
import Renderer from "./Renderer";
import ScrollBarEvent from './events/ScrollBarEvent';
import toPixelString from './dom/toPixelString';

/**
 * A vertical scroll bar.
 */
export default class VScrollBar extends ScrollBar {

    /**
     * This may get set to null.
     */
    private _scrollTop = 0;

    /**
     * 
     */
    private _width: number;

    /**
     * Creates a new `VScrollBar`. `parent` is the owner of the scroll bar.
     * @param parent A DOM element
     * @param renderer An editor renderer
     */
    constructor(parent: HTMLElement, renderer: Renderer) {
        super(parent, '-v');
        // in OSX lion the scrollbars appear to have no width. In this case resize the
        // element to show the scrollbar but still pretend that the scrollbar has a width
        // of 0px
        // in Firefox 6+ scrollbar is hidden if element has the same width as scrollbar
        // make element a little bit wider to retain scrollbar when page is zoomed 
        renderer.$scrollbarWidth = this._width = scrollbarWidth(parent.ownerDocument);
        this.inner.style.width = this.element.style.width = toPixelString((this._width || 15) + 5);
        addListener(this.element, "scroll", this.onScroll.bind(this));
    }

    /**
     * Emitted when the scroll bar, well, scrolls.
     * @event scroll
     * @param {Object} e Contains one property, `"data"`, which indicates the current scroll top position
     */
    onScroll() {
        if (!this.skipEvent) {
            this._scrollTop = this.element.scrollTop;
            /**
             * @event scroll
             * @param {ScrollBarEvent}
             */
            const event: ScrollBarEvent = { data: this._scrollTop };
            this.eventBus._emit("scroll", event);
        }
        this.skipEvent = false;
    }

    /**
     * Returns the width of the scroll bar.
     */
    get width(): number {
        return this.isVisible ? this._width : 0;
    }

    /**
     * Sets the height of the scroll bar, in pixels.
     * @param height The new height
     */
    setHeight(height: number) {
        this.element.style.height = toPixelString(height);
    }

    /**
     * Sets the scroll height of the scroll bar, in pixels.
     * @param height The new scroll height
     */
    setScrollHeight(height: number) {
        this.inner.style.height = toPixelString(height);
    }

    /**
     * Sets the scroll top of the scroll bar.
     * @param scrollTop The new scroll top
     */
    // on chrome 17+ for small zoom levels after calling this function
    // this.element.scrollTop != scrollTop which makes page to scroll up.
    // FIXME: We don't need a method and a property! The code does use both!!
    setScrollTop(scrollTop: number) {
        if (this._scrollTop !== scrollTop) {
            this.skipEvent = true;
            this._scrollTop = this.element.scrollTop = scrollTop;
        }
    }

    get scrollTop(): number {
        return this._scrollTop;
    }
    set scrollTop(scrollTop: number) {
        this.setScrollTop(scrollTop);
    }
}

import { addListener, removeListener } from "./lib/event";
import { ScrollBar } from './ScrollBar';
import { refChange } from './refChange';
import { Renderer } from "./Renderer";
import { toPixelString } from './dom/toPixelString';

/**
 * A horizontal scroll bar.
 */
export class HScrollBar extends ScrollBar {

    private scrollLeft_ = 0;
    /**
     * The height of the scrollbar in pixels.
     */
    private height_: number;

    constructor(parent: HTMLElement, renderer: Renderer) {
        super(parent, '-h');
        refChange(this.uuid, 'HScrollBar', +1);

        // in OSX lion the scrollbars appear to have no width. In this case resize the
        // element to show the scrollbar but still pretend that the scrollbar has a width
        // of 0px
        // in Firefox 6+ scrollbar is hidden if element has the same width as scrollbar
        // make element a little bit wider to retain scrollbar when page is zoomed 
        this.height_ = renderer.$scrollbarWidth;
        this.inner.style.height = this.element.style.height = toPixelString((this.height_ || 15) + 5);
        addListener(this.element, "scroll", this.onScroll);
    }

    dispose(): void {
        removeListener(this.element, "scroll", this.onScroll);
        refChange(this.uuid, 'HScrollBar', -1);
        super.dispose();
    }

    private onScroll = (): void => {
        if (!this.skipEvent) {
            this.scrollLeft_ = this.element.scrollLeft;
            this.eventBus._emit("scroll", { data: this.scrollLeft_ });
        }
        this.skipEvent = false;
    }

    /**
     * Returns the height of the scroll bar in pixels.
     */
    get height(): number {
        return this.isVisible ? this.height_ : 0;
    }

    /**
     * Sets the scroll width of the scroll bar, in pixels.
     */
    setScrollWidth(width: number): this {
        this.inner.style.width = toPixelString(width);
        return this;
    }

    /**
     * Sets the scroll left of the scroll bar.
     */
    setScrollLeft(scrollLeft: number): this {
        // on chrome 17+ for small zoom levels after calling this function
        // this.element.scrollTop != scrollTop which makes page to scroll up.
        if (this.scrollLeft_ !== scrollLeft) {
            this.skipEvent = true;
            this.scrollLeft_ = this.element.scrollLeft = scrollLeft;
        }
        return this;
    }
}

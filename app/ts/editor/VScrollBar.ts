import { addListener, removeListener } from "./lib/event";
import { COEFF_DEFAULT, MAX_SCROLL_H, ScrollBar } from './ScrollBar';
import { scrollbarWidth } from "./lib/dom";
import { refChange } from './refChange';
import { Renderer } from "./Renderer";
import { toPixelString } from './dom/toPixelString';

/**
 * A vertical scroll bar.
 */
export class VScrollBar extends ScrollBar {

    /**
     * This may get set to null.
     */
    private scrollTop_: number | null = 0;
    private scrollHeight_ = 0;

    /**
     * The width of the ScrollBar in pixels.
     */
    private width_: number;

    /**
     * Creates a new `VScrollBar`. `parent` is the owner of the scroll bar.
     */
    constructor(parent: HTMLElement, renderer: Renderer) {
        super(parent, '-v');
        refChange(this.uuid, 'VScrollBar', +1);
        // in OSX lion the scrollbars appear to have no width. In this case resize the
        // element to show the scrollbar but still pretend that the scrollbar has a width
        // of 0px
        // in Firefox 6+ scrollbar is hidden if element has the same width as scrollbar
        // make element a little bit wider to retain scrollbar when page is zoomed 
        renderer.$scrollbarWidth = this.width_ = scrollbarWidth(parent.ownerDocument);
        this.inner.style.width = this.element.style.width = toPixelString((this.width_ || 15) + 5);
        addListener(this.element, "scroll", this.onScroll);
    }

    dispose(): void {
        removeListener(this.element, "scroll", this.onScroll);
        refChange(this.uuid, 'VScrollBar', -1);
        super.dispose();
    }

    private onScroll = () => {
        if (!this.skipEvent) {
            this.scrollTop_ = this.element.scrollTop;
            if (this.coeff !== COEFF_DEFAULT) {
                const h = this.element.clientHeight / this.scrollHeight_;
                this.scrollTop = this.scrollTop_ * (1 - h) / (this.coeff - h);
            }
            this.eventBus._emit("scroll", { data: this.scrollTop_ });
        }
        this.skipEvent = false;
    }

    /**
     * Returns the width of the scroll bar in pixels.
     */
    get width(): number {
        return this.isVisible ? this.width_ : 0;
    }

    /**
     * Sets the scroll height of the scroll bar, in pixels.
     */
    setScrollHeight(height: number): this {
        this.scrollHeight_ = height;
        if (height > MAX_SCROLL_H) {
            this.coeff = MAX_SCROLL_H / height;
            height = MAX_SCROLL_H;
        }
        else if (this.coeff !== COEFF_DEFAULT) {
            this.coeff = COEFF_DEFAULT;
        }
        this.inner.style.height = toPixelString(height);
        return this;
    }

    /**
     * Sets the scroll top of the scroll bar.
     */
    setScrollTop(scrollTop: number): this {
        if (this.scrollTop_ !== scrollTop) {
            this.skipEvent = true;
            this.scrollTop = scrollTop;
            this.element.scrollTop = scrollTop * this.coeff;
        }
        return this;
    }

    /**
     * FIXME : This is evil.
     */
    set scrollTop(scrollTop: number | null) {
        this.scrollTop_ = scrollTop;
    }
}

import { createElement } from "./lib/dom";
import { addListener, preventDefault, removeListener } from "./lib/event";
import { Disposable } from './Disposable';
import { EventEmitterClass } from "./lib/EventEmitterClass";
import { EventBus } from "./EventBus";
import { refChange } from './refChange';
import { ScrollBarEvent } from './events/ScrollBarEvent';

/**
 * The default coefficient.
 */
export const COEFF_DEFAULT = 1;

/**
 * On IE, maximal element height is smaller than what we get from 4-5K line document
 * so scrollbar doesn't work. As a workaround we do not set height higher than MAX_SCROLL_H
 * and rescale scrolltop.
 */
export const MAX_SCROLL_H = 0x8000;

export type ScrollBarEventName = 'scroll';

/**
 * An abstract class representing a native scrollbar control.
 */
export class ScrollBar implements EventBus<ScrollBarEventName, ScrollBarEvent, ScrollBar>, Disposable {
    /**
     * 
     */
    protected readonly uuid = `${Math.random()}`;
    /**
     * The `element` div property is a child of the `parent` div property
     * on which the scrollbar is constructed. 
     */
    public element: HTMLDivElement;
    /**
     * The `inner` div property is a child of the `element` div property. 
     */
    public inner: HTMLDivElement;
    /**
     * Determines how the scrollbar reports its dimensions.
     * If not visible, the dimensions are reported as zero.
     */
    protected isVisible: boolean;
    /**
     * 
     */
    public skipEvent: boolean;
    /**
     * Adjusts the height of the vertical scrollbar to satisfy IE limitations. 
     * This is reset when the scrollbar is made visible.
     */
    protected coeff = COEFF_DEFAULT;

    protected readonly eventBus: EventEmitterClass<ScrollBarEventName, ScrollBarEvent, ScrollBar>;

    constructor(private readonly parent: HTMLElement, classSuffix: string) {
        refChange(this.uuid, 'ScrollBar', +1);
        this.eventBus = new EventEmitterClass<ScrollBarEventName, ScrollBarEvent, ScrollBar>(this);
        this.element = <HTMLDivElement>createElement("div");
        this.element.className = `ace_scrollbar ace_scrollbar${classSuffix}`;
        parent.appendChild(this.element);

        this.inner = <HTMLDivElement>createElement("div");
        this.inner.className = "ace_scrollbar-inner";
        this.element.appendChild(this.inner);

        this.setVisible(false);
        this.skipEvent = false;

        addListener(this.element, "mousedown", preventDefault);
    }

    dispose(): void {
        removeListener(this.element, "mousedown", preventDefault);
        this.element.removeChild(this.inner);
        this.inner = <any>void 0;
        this.parent.removeChild(this.element);
        this.element = <any>void 0;
        refChange(this.uuid, 'ScrollBar', -1);
    }

    on(eventName: ScrollBarEventName, callback: (event: ScrollBarEvent, source: ScrollBar) => any): () => void {
        return this.eventBus.on(eventName, callback, false);
    }

    off(eventName: ScrollBarEventName, callback: (event: ScrollBarEvent, source: ScrollBar) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * Sets the CSS `display` property accordingly.
     * Affects the reporting of the height of the horizonatal scrollbar and the width of the vertical scrollbar.
     * Resets the coeddicient property
     */
    setVisible(isVisible: boolean): this {
        this.element.style.display = isVisible ? "" : "none";
        this.isVisible = isVisible;
        this.coeff = COEFF_DEFAULT;
        return this;
    }
}

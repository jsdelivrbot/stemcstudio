import { createElement } from "./lib/dom";
import { addListener, preventDefault } from "./lib/event";
import EventEmitterClass from "./lib/EventEmitterClass";
import EventBus from "./EventBus";
import ScrollBarEvent from './events/ScrollBarEvent';

/**
 * An abstract class representing a native scrollbar control.
 */
export default class ScrollBar implements EventBus<ScrollBarEvent, ScrollBar> {
    public element: HTMLDivElement;
    public inner: HTMLDivElement;
    public isVisible: boolean;
    public skipEvent: boolean;

    protected readonly eventBus: EventEmitterClass<ScrollBarEvent, ScrollBar>;

    constructor(parent: HTMLElement, classSuffix: string) {
        this.eventBus = new EventEmitterClass<ScrollBarEvent, ScrollBar>(this);
        this.element = <HTMLDivElement>createElement("div");
        this.element.className = "ace_scrollbar ace_scrollbar" + classSuffix;

        this.inner = <HTMLDivElement>createElement("div");
        this.inner.className = "ace_scrollbar-inner";
        this.element.appendChild(this.inner);

        parent.appendChild(this.element);

        this.setVisible(false);
        this.skipEvent = false;

        // FIXME: We need a lifecycle so that this can be removed.
        addListener(this.element, "mousedown", preventDefault);
    }

    on(eventName: string, callback: (event: ScrollBarEvent, source: ScrollBar) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    off(eventName: string, callback: (event: ScrollBarEvent, source: ScrollBar) => any): void {
        this.eventBus.off(eventName, callback);
    }

    setVisible(isVisible: boolean): ScrollBar {
        this.element.style.display = isVisible ? "" : "none";
        this.isVisible = isVisible;
        return this;
    }
}

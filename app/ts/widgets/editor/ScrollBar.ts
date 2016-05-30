import { createElement } from "./lib/dom";
import { addListener, preventDefault } from "./lib/event";
import EventEmitterClass from "./lib/EventEmitterClass";
import EventBus from "./EventBus";
import ScrollBarEvent from './events/ScrollBarEvent';

/**
 * An abstract class representing a native scrollbar control.
 *
 * @class ScrollBar
 */
export default class ScrollBar implements EventBus<ScrollBarEvent, ScrollBar> {
    public element: HTMLDivElement;
    public inner: HTMLDivElement;
    public isVisible: boolean;
    public skipEvent: boolean;

    /**
     * @property eventBus
     * @type EventEmitterClass<ScrollBar>
     * @protected
     */
    protected eventBus: EventEmitterClass<ScrollBarEvent, ScrollBar>;

    /**
     * Creates a new `ScrollBar`.
     *
     * @class ScrollBar
     * @constructor
     * @param parent {HTMLElement} A parent of the scrollbar.
     * @param classSuffix {string}
     */
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

    /**
     * @method on
     * @param eventName {string}
     * @param callback {(event: ScrollBarEvent, source: ScrollBar) => any}
     * @return {void}
     */
    on(eventName: string, callback: (event: ScrollBarEvent, source: ScrollBar) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    /**
     * @method off
     * @param eventName {string}
     * @param callback {(event: ScrollBarEvent, source: ScrollBar) => any}
     * @return {void}
     */
    off(eventName: string, callback: (event: ScrollBarEvent, source: ScrollBar) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * @method setVisible
     * @param isVisible {boolean}
     * @return {ScrollBar}
     */
    setVisible(isVisible: boolean): ScrollBar {
        this.element.style.display = isVisible ? "" : "none";
        this.isVisible = isVisible;
        return this;
    }
}

import { addCssClass, createElement, setInnerText } from "./lib/dom";

/**
 *
 */
export default class Tooltip {

    private isOpen = false;
    private $element: HTMLElement = null;
    private $parentElement: HTMLElement;

    /**
     *
     */
    constructor(parentElement: HTMLElement) {
        this.$parentElement = parentElement;
    }

    /**
     * This internal method is called (lazily) once through the `getElement` method.
     * It creates the $element member, which is returned.
     */
    private $init(): HTMLElement {
        this.$element = <HTMLElement>createElement('div');
        this.$element.className = "ace_tooltip";
        this.$element.style.display = "none";
        this.$parentElement.appendChild(this.$element);
        return this.$element;
    }

    /**
     * Provides the HTML div element.
     */
    getElement(): HTMLElement {
        return this.$element || this.$init();
    }

    /**
     * Use the dom method `setInnerText`
     */
    setText(text: string): void {
        setInnerText(this.getElement(), text);
    }

    /**
     * Sets the `innerHTML` property on the div element.
     */
    setHtml(html: string): void {
        this.getElement().innerHTML = html;
    }

    /**
     * Sets the `left` and `top` CSS style properties.
     * This action can also happen during the `show` method.
     *
     * @param left {number} The style 'left' value in pixels.
     * @param top {number} The style 'top' value in pixels.
     */
    setPosition(left: number, top: number): void {
        const style = this.getElement().style;
        style.left = `${left}px`;
        style.top = `${top}px`;
    }

    /**
     * Adds a CSS class to the underlying tooltip div element using the dom method `addCssClass`.
     */
    setClassName(className: string): void {
        addCssClass(this.getElement(), className);
    }

    /**
     * Shows the tool by setting the CSS display property to 'block'.
     */
    show(): void {
        if (!this.isOpen) {
            this.getElement().style.display = 'block';
            this.isOpen = true;
        }
    }

    /**
     * Hides the tool by setting the CSS display property to 'none'.
     */
    hide(): void {
        if (this.isOpen) {
            this.getElement().style.display = 'none';
            this.isOpen = false;
        }
    }

    /**
     * Returns the `offsetHeight` property of the element.
     */
    getHeight(): number {
        return this.getElement().offsetHeight;
    }

    /**
     * Returns the `offsetWidth` property of the element.
     */
    getWidth(): number {
        return this.getElement().offsetWidth;
    }
}

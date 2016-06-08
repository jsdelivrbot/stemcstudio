import { addCssClass, createElement, setInnerText } from "./lib/dom";

/**
 * @class Tooltip
 */
export default class Tooltip {

    /**
     * @property isOpen
     * @type {boolean}
     * @defualt false
     * @private
     */
    private isOpen: boolean;
    private $element: HTMLElement;
    private $parentElement: HTMLElement;

    /**
     * @class Tooltip
     * @constructor
     * @param parentElement {HTMLElement}
     */
    constructor(parentElement: HTMLElement) {
        this.isOpen = false;
        this.$element = null;
        this.$parentElement = parentElement;
    }

    /**
     * This internal method is called (lazily) once through the `getElement` method.
     * It creates the $element member.
     * @method $init
     * @return {HTMLElement}
     * @private
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
     * @method getElement
     * @return {HTMLElement}
     */
    getElement(): HTMLElement {
        return this.$element || this.$init();
    }

    /**
     * Use the dom method `setInnerText`
     * @method setText
     * @param {string} text
     * @return {void}
     */
    setText(text: string): void {
        setInnerText(this.getElement(), text);
    }

    /**
     * Sets the `innerHTML` property on the div element.
     * @method setHtml
     * @param {string} html
     * @return {void}
     */
    setHtml(html: string): void {
        this.getElement().innerHTML = html;
    }

    /**
     * Sets the `left` and `top` CSS style properties.
     * This action can also happen during the `show` method.
     *
     * @method setPosition
     * @param left {number} The style 'left' value in pixels.
     * @param top {number} The style 'top' value in pixels.
     * @return {void}
     */
    setPosition(left: number, top: number): void {
        var style = this.getElement().style;
        style.left = left + "px";
        style.top = top + "px";
    }

    /**
     * Adds a CSS class to the underlying tooltip div element using the dom method `addCssClass`.
     *
     * @method setClassName
     * @param className {string}
     * @return {void}
     */
    setClassName(className: string): void {
        addCssClass(this.getElement(), className);
    }

    /**
     * Shows the tool by setting the CSS display property to 'block'.
     *
     * @method show
     * @return {void}
     */
    show(): void {
        if (!this.isOpen) {
            this.getElement().style.display = 'block';
            this.isOpen = true;
        }
    }

    /**
     * Hides the tool by setting the CSS display property to 'none'.
     *
     * @method hide
     * @return {void}
     */
    hide(): void {
        if (this.isOpen) {
            this.getElement().style.display = 'none';
            this.isOpen = false;
        }
    }

    /**
     * Returns the `offsetHeight` property of the element.
     *
     * @method getHeight
     * @return {number}
     */
    getHeight(): number {
        return this.getElement().offsetHeight;
    }

    /**
     * Returns the `offsetWidth` property of the element.
     *
     * @method getWidth
     * @return {number}
     */
    getWidth(): number {
        return this.getElement().offsetWidth;
    }
}

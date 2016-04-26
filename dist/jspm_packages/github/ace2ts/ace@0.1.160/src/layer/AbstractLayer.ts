import {createElement, setCssClass} from "../lib/dom";

/**
 * Work In Progress
 *
 * @class AbstractLayer
 */
export default class AbstractLayer {

    /**
     * @property element
     * @type HTMLDivElement
     */
    public element: HTMLDivElement;

    /**
     * @class AbstractLayer
     * @constructor
     * @param parent {HTMLElement}
     * @param className {string} The className property assigned to the wrapped element.
     */
    constructor(parent: HTMLElement, className: string) {
        // TODO: createHTMLDivElement would be nice convenience to avoid casting?
        // We should probably pay more attention to the owner document too.
        this.element = <HTMLDivElement>createElement('div');
        this.element.className = className;
        parent.appendChild(this.element);
    }

    /**
     * @method setCssClass
     * @param className {string}
     * @param include {boolean}
     * @return {void}
     */
    setCssClass(className: string, include: boolean): void {
        setCssClass(this.element, className, include);
    }
}

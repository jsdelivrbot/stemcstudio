import {createElement, setCssClass} from "../lib/dom";

/**
 * 
 */
export default class AbstractLayer {

    /**
     *
     */
    public element: HTMLDivElement;

    /**
     *
     * @param parent
     * @param className The className property assigned to the wrapped element.
     */
    constructor(parent: HTMLElement, className: string) {
        // TODO: createHTMLDivElement would be nice convenience to avoid casting?
        // We should probably pay more attention to the owner document too.
        this.element = <HTMLDivElement>createElement('div');
        this.element.className = className;
        parent.appendChild(this.element);
    }

    /**
     *
     * @param className
     * @param include
     */
    setCssClass(className: string, include: boolean): void {
        setCssClass(this.element, className, include);
    }
}

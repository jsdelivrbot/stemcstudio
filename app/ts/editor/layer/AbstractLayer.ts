import { createElement, setCssClass } from "../lib/dom";
import { Disposable } from '../../base/Disposable';
import { refChange } from '../../utils/refChange';

/**
 * 
 */
export class AbstractLayer implements Disposable {

    /**
     * This is the child of the DOM element that the layer is associated with.
     */
    public element: HTMLDivElement;

    /**
     * 
     */
    protected readonly uuid = `${Math.random()}`;

    constructor(private readonly parent: HTMLElement, className: string) {
        refChange(this.uuid, 'AbstractLayer', +1);
        // TODO: createHTMLDivElement would be nice convenience to avoid casting?
        // We should probably pay more attention to the owner document too.
        this.element = <HTMLDivElement>createElement('div');
        this.element.className = className;
        parent.appendChild(this.element);
    }

    dispose(): void {
        this.parent.removeChild(this.element);
        this.element = <any>void 0;
        refChange(this.uuid, 'AbstractLayer', -1);
    }

    setCssClass(className: string, include: boolean): void {
        setCssClass(this.element, className, include);
    }
}

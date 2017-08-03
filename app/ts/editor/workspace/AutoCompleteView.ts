import { Editor } from '../Editor';
import { PixelPosition } from '../PixelPosition';

const CLASSNAME = 'ace_autocomplete';
const CLASSNAME_SELECTED = 'ace_autocomplete_selected';

function height(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    return parseFloat(computedStyle.height.replace('px', ''));
}

function borderTop(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    return parseFloat(computedStyle.borderTop.replace('px', ''));
}

function borderBottom(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    return parseFloat(computedStyle.borderBottom.replace('px', ''));
}

function marginTop(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    return parseFloat(computedStyle.marginTop.replace('px', ''));
}

function marginBottom(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    return parseFloat(computedStyle.marginBottom.replace('px', ''));
}

function paddingTop(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    return parseFloat(computedStyle.paddingTop.replace('px', ''));
}

function paddingBottom(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    return parseFloat(computedStyle.paddingBottom.replace('px', ''));
}

function outerHeight(element: HTMLElement): number {
    const h = height(element);
    const p = paddingTop(element) + paddingBottom(element);
    const m = marginTop(element) + marginBottom(element);
    const b = borderTop(element) + borderBottom(element);
    return h + p + m + b;
}

function position(el: HTMLElement): PixelPosition {
    let left = 0;
    let top = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        left += el.offsetLeft - el.scrollLeft;
        top += el.offsetTop - el.scrollTop;
        el = <HTMLElement>el.offsetParent;
    }
    return { top: top, left: left };
}

/**
 *
 */
export class AutoCompleteView {
    private editor: Editor;
    public wrap: HTMLDivElement;
    public listElement: HTMLUListElement;

    /**
     *
     */
    constructor(editor: Editor) {
        if (typeof editor === 'undefined') {
            throw new TypeError('editor must be defined');
        }

        this.editor = editor;

        this.wrap = document.createElement('div');
        this.listElement = document.createElement('ul');
        this.wrap.className = CLASSNAME;
        this.wrap.appendChild(this.listElement);

        this.editor.container.appendChild(this.wrap);

        this.wrap.style.display = 'none';
        this.listElement.style.listStyleType = 'none';
        this.wrap.style.position = 'fixed';
        this.wrap.style.zIndex = '1000';
    }

    /**
     * @param pos
     * @param lineHeight
     * @param topdownOnly
     */
    public show(pos: PixelPosition, lineHeight: number, topdownOnly?: boolean): void {
        const el = this.wrap;
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        const renderer = this.editor.renderer;
        // const maxLines = Math.min(renderer.maxLines, this.editor.session.getLength());
        const maxH = renderer.maxLines * lineHeight * 1.4;
        let top = pos.top/* + this.$borderSize*/;
        if (top + maxH > screenHeight - lineHeight && !topdownOnly) {
            el.style.top = "";
            el.style.bottom = screenHeight - top + "px";
            // this.isTopdown = false;
        }
        else {
            top += lineHeight;
            el.style.top = top + "px";
            el.style.bottom = "";
            // this.isTopdown = true;
        }

        el.style.display = "block";
        // FIXME: This seems to be correct. Why is it not caught by TypeScript?
        // renderer.textLayer.checkForSizeChanges();
        renderer.textLayer.checkForSizeChanges();

        let left = pos.left;
        if (left + el.offsetWidth > screenWidth) {
            left = screenWidth - el.offsetWidth;
        }

        el.style.left = left + "px";

        this.listElement.style.marginTop = "0";
    }

    /**
     *
     */
    public hide(): void {
        this.wrap.style.display = 'none';
    }

    /**
     *
     */
    public current(): HTMLElement {
        const children = this.listElement.childNodes;
        for (let i = 0, iLength = children.length; i < iLength; i++) {
            const child = <HTMLElement>children[i];
            if (child.className === CLASSNAME_SELECTED) {
                return child;
            }
        }
        return null;
    }

    /**
     *
     */
    public focusNext(): void {
        const curr = this.current();
        const focus = <Element>curr.nextSibling;
        if (focus) {
            curr.className = '';
            focus.className = CLASSNAME_SELECTED;
            return this.adjustPosition();
        }
    }

    /**
     *
     */
    public focusPrev(): void {
        const curr = this.current();
        const focus = <Element>curr.previousSibling;
        if (focus) {
            curr.className = '';
            focus.className = CLASSNAME_SELECTED;
            return this.adjustPosition();
        }
    }

    /**
     *
     */
    public ensureFocus(): void {
        if (!this.current()) {
            if (this.listElement.firstChild) {
                const firstChild: HTMLElement = <HTMLElement>this.listElement.firstChild;
                firstChild.className = CLASSNAME_SELECTED;
                return this.adjustPosition();
            }
        }
    }

    /**
     *
     */
    private adjustPosition(): void {

        let elm = this.current();
        if (elm) {
            let newMargin = '';
            let totalHeight = height(this.wrap);

            let itemHeight = outerHeight(elm);

            let oldMargin = marginTop(this.listElement);

            let pos = position(elm);

            while (pos.top >= (totalHeight - itemHeight)) {
                oldMargin = marginTop(this.listElement);
                newMargin = (oldMargin - itemHeight) + 'px';
                this.listElement.style.marginTop = newMargin;
                pos = position(elm);
            }
            while (pos.top < 0) {
                oldMargin = marginTop(this.listElement);
                newMargin = (oldMargin + itemHeight) + 'px';
                this.listElement.style.marginTop = newMargin;
                pos = position(elm);
            }
        }
    }
}

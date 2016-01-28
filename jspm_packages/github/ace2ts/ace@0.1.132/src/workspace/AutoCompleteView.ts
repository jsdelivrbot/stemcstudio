"use strict";

import Editor from '../Editor';
import KeyboardHandler from '../keyboard/KeyboardHandler';
import PixelPosition from '../PixelPosition';
import ScreenCoordinates from '../ScreenCoordinates';

var CLASSNAME = 'ace_autocomplete';
var CLASSNAME_SELECTED = 'ace_autocomplete_selected';

function height(element: HTMLElement): number {
    var computedStyle = getComputedStyle(element)
    return parseFloat(computedStyle.height.replace('px', ''));
}

function borderTop(element: HTMLElement): number {
    var computedStyle = getComputedStyle(element)
    return parseFloat(computedStyle.borderTop.replace('px', ''));
}

function borderBottom(element: HTMLElement): number {
    var computedStyle = getComputedStyle(element)
    return parseFloat(computedStyle.borderBottom.replace('px', ''));
}

function marginTop(element: HTMLElement): number {
    var computedStyle = getComputedStyle(element)
    return parseFloat(computedStyle.marginTop.replace('px', ''));
}

function marginBottom(element: HTMLElement): number {
    var computedStyle = getComputedStyle(element)
    return parseFloat(computedStyle.marginBottom.replace('px', ''));
}

function paddingTop(element: HTMLElement): number {
    var computedStyle = getComputedStyle(element)
    return parseFloat(computedStyle.paddingTop.replace('px', ''));
}

function paddingBottom(element: HTMLElement): number {
    var computedStyle = getComputedStyle(element)
    return parseFloat(computedStyle.paddingBottom.replace('px', ''));
}

function outerHeight(element: HTMLElement): number {
    var h = height(element);
    var p = paddingTop(element) + paddingBottom(element);
    var m = marginTop(element) + marginBottom(element);
    var b = borderTop(element) + borderBottom(element);
    return h + p + m + b;
}

function position(el: HTMLElement): PixelPosition {
    var left = 0;
    var top = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        left += el.offsetLeft - el.scrollLeft;
        top += el.offsetTop - el.scrollTop;
        el = <HTMLElement>el.offsetParent;
    }
    return { top: top, left: left };
}

/**
 * @class AutoCompleteView
 */
export default class AutoCompleteView {
    private editor: Editor;
    public wrap: HTMLDivElement;
    public listElement: HTMLUListElement;

    /**
     * @class AutoCompleteView
     * @constructor
     * @param editor {Editor}
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
     * @method show
     * @param pos {PixelPosition}
     * @param lineHeight {number}
     * @param [topdownOnly] {boolean}
     * @return {void}
     */
    public show(pos: PixelPosition, lineHeight: number, topdownOnly?: boolean): void {
        var el = this.wrap;
        var screenHeight = window.innerHeight;
        var screenWidth = window.innerWidth;
        var renderer = this.editor.renderer;
        // var maxLines = Math.min(renderer.$maxLines, this.session.getLength());
        var maxH = renderer.$maxLines * lineHeight * 1.4;
        var top = pos.top/* + this.$borderSize*/;
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
        renderer.$textLayer.checkForSizeChanges();

        var left = pos.left;
        if (left + el.offsetWidth > screenWidth) {
            left = screenWidth - el.offsetWidth;
        }

        el.style.left = left + "px";

        this.listElement.style.marginTop = "0";
    }

    /**
     * @method hide
     * @return {void}
     */
    public hide(): void {
        this.wrap.style.display = 'none';
    }

    /**
     * @method current
     * @return {HTMLElement}
     */
    public current(): HTMLElement {
        var i;
        var children = this.listElement.childNodes;
        for (i in children) {
            var child = <HTMLElement>children[i];
            if (child.className === CLASSNAME_SELECTED) {
                return child;
            }
        }
        return null;
    }

    /**
     * @method focusNext
     * @return {void}
     */
    public focusNext(): void {
        var curr: HTMLElement;
        var focus: Element;
        curr = this.current();
        focus = <Element>curr.nextSibling;
        if (focus) {
            curr.className = '';
            focus.className = CLASSNAME_SELECTED;
            return this.adjustPosition();
        }
    }

    /**
     * @method focusPrev
     * @return {void}
     */
    public focusPrev(): void {
        var curr: HTMLElement;
        var focus: Element;
        curr = this.current();
        focus = <Element>curr.previousSibling;
        if (focus) {
            curr.className = '';
            focus.className = CLASSNAME_SELECTED;
            return this.adjustPosition();
        }
    }

    /**
     * @method ensureFocus
     * @return {void}
     */
    public ensureFocus(): void {
        if (!this.current()) {
            if (this.listElement.firstChild) {
                var firstChild: HTMLElement = <HTMLElement>this.listElement.firstChild;
                firstChild.className = CLASSNAME_SELECTED;
                return this.adjustPosition();
            }
        }
    }

    /**
     * @method adjustPosition
     * @return {void}
     * @private
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

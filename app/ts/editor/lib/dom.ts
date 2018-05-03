const XHTML_NS = "http://www.w3.org/1999/xhtml";

export function getDocumentBody(doc: Document = document): HTMLBodyElement {
    return <HTMLBodyElement>(doc.body || doc.getElementsByTagName("body")[0]);
}

export function createHTMLDivElement(): HTMLDivElement {
    return document.createElementNS ?
        <HTMLDivElement>document.createElementNS(XHTML_NS, 'div') :
        document.createElement('div');
}

export function createHTMLDivElementNS(namespaceURI: string): HTMLDivElement {
    return document.createElementNS ?
        <HTMLDivElement>document.createElementNS(namespaceURI || XHTML_NS, 'div') :
        document.createElement('div');
}

export function createElement(tagName: string, namespaceURI?: string): Element {
    return document.createElementNS ?
        document.createElementNS(namespaceURI || XHTML_NS, tagName) :
        document.createElement(tagName);
}

export function hasCssClass(element: HTMLElement, className: string): boolean {
    const classes: string[] = element.className.split(/\s+/g);
    return classes.indexOf(className) !== -1;
}

/**
 * Add a CSS class to the list of classes on the given node
 */
export function addCssClass(element: HTMLElement, className: string): void {
    if (!hasCssClass(element, className)) {
        element.className += " " + className;
    }
}

/**
 * Remove a CSS class from the list of classes on the given node
 */
export function removeCssClass(element: HTMLElement, className: string): void {
    const classes: string[] = element.className.split(/\s+/g);
    while (true) {
        const index = classes.indexOf(className);
        if (index === -1) {
            break;
        }
        classes.splice(index, 1);
    }
    element.className = classes.join(" ");
}

export function toggleCssClass(element: HTMLElement, name: string): boolean {
    const classes = element.className.split(/\s+/g);
    let add = true;
    while (true) {
        const index = classes.indexOf(name);
        if (index === -1) {
            break;
        }
        add = false;
        classes.splice(index, 1);
    }
    if (add)
        classes.push(name);

    element.className = classes.join(" ");
    return add;
}

/*
 * Add or remove a CSS class from the list of classes on the given node
 * depending on the value of <tt>include</tt>
 */
export function setCssClass(node: HTMLElement, className: string, include: boolean): void {
    if (include) {
        addCssClass(node, className);
    }
    else {
        removeCssClass(node, className);
    }
}

/*
export function getInnerWidth(element: HTMLElement): number {
    return (
        parseInt(exports.computedStyle(element, "paddingLeft"), 10) +
        parseInt(exports.computedStyle(element, "paddingRight"), 10) +
        element.clientWidth
    );
}
*/
/*
export function getInnerHeight(element: HTMLElement): number {
    return (
        parseInt(exports.computedStyle(element, "paddingTop"), 10) +
        parseInt(exports.computedStyle(element, "paddingBottom"), 10) +
        element.clientHeight
    );
}
*/
/*
if (window.pageYOffset !== undefined) {
    exports.getPageScrollTop = function() {
        return window.pageYOffset;
    };

    exports.getPageScrollLeft = function() {
        return window.pageXOffset;
    };
}
else {
    exports.getPageScrollTop = function() {
        return document.body.scrollTop;
    };

    exports.getPageScrollLeft = function() {
        return document.body.scrollLeft;
    };
}
*/
// FIXME: I don't like this because we lose type safety.
function makeComputedStyle(): (element: HTMLElement, style: string) => CSSStyleDeclaration {
    if (window.getComputedStyle) {
        // You can also call getPropertyValue!
        return function (element: HTMLElement, style: string): CSSStyleDeclaration {
            return (window.getComputedStyle(element, "") || {})[style] || "";
        };
    }
    else {
        return function (element: HTMLElement, style: string): CSSStyleDeclaration {
            if (style) {
                return element['currentStyle'][style];
            }
            return element['currentStyle'];
        };
    }
}

export const computedStyle = makeComputedStyle();
// FIXME
/*
if (window.getComputedStyle)
    exports.computedStyle = function(element, style): any {
        if (style)
            return (window.getComputedStyle(element, "") || {})[style] || "";
        return window.getComputedStyle(element, "") || {};
    };
else
    exports.computedStyle = function(element, style) {
        if (style)
            return element.currentStyle[style];
        return element.currentStyle;
    };
*/

export function setStyle(styles: CSSStyleDeclaration, property: string, value: string) {
    if (styles[property] !== value) {
        styles[property] = value;
    }
}

export function scrollbarWidth(document: Document): number {
    const inner: HTMLElement = <HTMLElement>createElement("ace_inner");
    inner.style.width = "100%";
    inner.style.minWidth = "0px";
    inner.style.height = "200px";
    inner.style.display = "block";

    const outer: HTMLElement = <HTMLElement>createElement("ace_outer");
    const style = outer.style;

    style.position = "absolute";
    style.left = "-10000px";
    style.overflow = "hidden";
    style.width = "200px";
    style.minWidth = "0px";
    style.height = "150px";
    style.display = "block";

    outer.appendChild(inner);

    const body = document.documentElement;
    body.appendChild(outer);

    const noScrollbarWidth = inner.offsetWidth;

    style.overflow = "scroll";
    let withScrollbarWidth = inner.offsetWidth;

    if (noScrollbarWidth === withScrollbarWidth) {
        withScrollbarWidth = outer.clientWidth;
    }

    body.removeChild(outer);

    return noScrollbarWidth - withScrollbarWidth;
}

/*
 * Optimized set innerHTML. This is faster than plain innerHTML if the element
 * already contains a lot of child elements.
 *
 * See http://blog.stevenlevithan.com/archives/faster-than-innerhtml for details
 */
export function setInnerHtml(element: HTMLElement, innerHTML: string) {
    const clonedElement = <HTMLElement>element.cloneNode(false);
    clonedElement.innerHTML = innerHTML;
    if (element.parentNode) {
        element.parentNode.replaceChild(clonedElement, element);
    }
    return clonedElement;
}

function makeGetInnerText(): (el: HTMLElement) => string {
    if ("textContent" in document.documentElement) {
        return function (el: HTMLElement) {
            return <string>el.textContent;
        };
    }
    else {
        return function (el: HTMLElement) {
            return el.innerText;
        };
    }
}

function makeSetInnerText(): (el: HTMLElement, innerText: string) => void {
    if ("textContent" in document.documentElement) {
        return function (el: HTMLElement, innerText: string): void {
            el.textContent = innerText;
        };
    }
    else {
        return function (el: HTMLElement, innerText: string) {
            el.innerText = innerText;
        };
    }
}

export const getInnerText: (el: HTMLElement) => string = makeGetInnerText();
export const setInnerText: (el: HTMLElement, innerText: string) => void = makeSetInnerText();

export function getParentWindow(document: Document): Window {
    // This is a bit redundant now that parentWindow has been removed.
    return document.defaultView;
}

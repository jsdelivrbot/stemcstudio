import { StackItem } from "./StackItem";

function isScopeMarker(node) {
    if (node.namespaceURI === "http://www.w3.org/1999/xhtml") {
        return node.localName === "applet"
            || node.localName === "caption"
            || node.localName === "marquee"
            || node.localName === "object"
            || node.localName === "table"
            || node.localName === "td"
            || node.localName === "th";
    }
    if (node.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
        return node.localName === "mi"
            || node.localName === "mo"
            || node.localName === "mn"
            || node.localName === "ms"
            || node.localName === "mtext"
            || node.localName === "annotation-xml";
    }
    if (node.namespaceURI === "http://www.w3.org/2000/svg") {
        return node.localName === "foreignObject"
            || node.localName === "desc"
            || node.localName === "title";
    }
}

function isListItemScopeMarker(node) {
    return isScopeMarker(node)
        || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'ol')
        || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'ul');
}

function isTableScopeMarker(node) {
    return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'table')
        || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
}

function isTableBodyScopeMarker(node) {
    return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tbody')
        || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tfoot')
        || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'thead')
        || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
}

function isTableRowScopeMarker(node) {
    return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tr')
        || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
}

function isButtonScopeMarker(node) {
    return isScopeMarker(node)
        || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'button');
}

function isSelectScopeMarker(node) {
    return !(node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'optgroup')
        && !(node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'option');
}

export class ElementStack {
    rootNode: StackItem;
    elements: StackItem[];
    headElement: StackItem;
    bodyElement: StackItem;
    /**
     * Represents a stack of open elements
     * @constructor
     */
    constructor() {
        this.elements = [];
        this.rootNode = null;
        this.headElement = null;
        this.bodyElement = null;
    }
    /**
     *
     * @param localName
     * @param isMarker
     */
    private _inScope(localName: string, isMarker: (node: StackItem) => boolean): boolean {
        for (var i = this.elements.length - 1; i >= 0; i--) {
            var node = this.elements[i];
            if (node.localName === localName)
                return true;
            if (isMarker(node))
                return false;
        }
    }
    /**
     * Pushes the item on the stack top
     * @param item
     */
    push(item: StackItem): void {
        this.elements.push(item);
    }

    /**
     * Pushes the item on the stack top
     * @param item HTML element stack item
     */
    pushHtmlElement(item: StackItem): void {
        this.rootNode = item.node;
        this.push(item);
    }

    /**
     * Pushes the item on the stack top
     * @param {StackItem} item HEAD element stack item
     */
    pushHeadElement(item: StackItem) {
        this.headElement = item.node;
        this.push(item);
    }

    /**
     * Pushes the item on the stack top
     * @param {StackItem} item BODY element stack item
     */
    pushBodyElement(item: StackItem) {
        this.bodyElement = item.node;
        this.push(item);
    }

    /**
     * Pops the topmost item
     * @return {StackItem}
     */
    pop(): StackItem {
        return this.elements.pop();
    }

    /**
     * Removes the item from the element stack
     * @param {StackItem} item The item to remove
     */
    remove(item: StackItem): void {
        this.elements.splice(this.elements.indexOf(item), 1);
    }

    /**
     * Pops until an element with a given localName is popped
     * @param {String} localName
     */
    popUntilPopped(localName: string) {
        var element;
        do {
            element = this.pop();
        } while (element.localName !== localName);
    }

    popUntilTableScopeMarker(): void {
        while (!isTableScopeMarker(this.top))
            this.pop();
    }

    popUntilTableBodyScopeMarker(): void {
        while (!isTableBodyScopeMarker(this.top))
            this.pop();
    }

    popUntilTableRowScopeMarker(): void {
        while (!isTableRowScopeMarker(this.top))
            this.pop();
    }

    /**
     *
     * @param {Number} index
     * @return {StackItem}
     */
    item(index: number): StackItem {
        return this.elements[index];
    }

    /**
     *
     * @param {StackItem} element
     * @return {Boolean}
     */
    contains(element: StackItem): boolean {
        return this.elements.indexOf(element) !== -1;
    }

    /**
     *
     * @param {String} localName
     * @return {Boolean}
     */
    inScope(localName: string): boolean {
        return this._inScope(localName, isScopeMarker);
    }

    /**
     *
     * @param {String} localName
     * @return {Boolean}
     */
    inListItemScope(localName: string): boolean {
        return this._inScope(localName, isListItemScopeMarker);
    }

    /**
     *
     * @param {String} localName
     * @return {Boolean}
     */
    inTableScope(localName: string): boolean {
        return this._inScope(localName, isTableScopeMarker);
    }

    /**
     *
     * @param {String} localName
     * @return {Boolean}
     */
    inButtonScope(localName: string): boolean {
        return this._inScope(localName, isButtonScopeMarker);
    }

    /**
     *
     * @param {String} localName
     * @return {Boolean}
     */
    inSelectScope(localName: string): boolean {
        return this._inScope(localName, isSelectScopeMarker);
    }

    /**
     *
     * @return {Boolean}
     */
    hasNumberedHeaderElementInScope(): boolean {
        for (var i = this.elements.length - 1; i >= 0; i--) {
            var node = this.elements[i];
            if (node.isNumberedHeader())
                return true;
            if (isScopeMarker(node))
                return false;
        }
    }

    /**
     *
     * @param {StackItem} element
     * @return {StackItem}
     */
    furthestBlockForFormattingElement(element: StackItem): StackItem {
        var furthestBlock: StackItem = null;
        for (var i = this.elements.length - 1; i >= 0; i--) {
            var node = this.elements[i];
            if (node.node === element)
                break;
            if (node.isSpecial())
                furthestBlock = node;
        }
        return furthestBlock;
    }

    /**
     *
     * @param {String} localName
     * @return {Number}
     */
    findIndex(localName: string): number {
        for (var i = this.elements.length - 1; i >= 0; i--) {
            if (this.elements[i].localName === localName)
                return i;
        }
        return -1;
    }

    remove_openElements_until(callback: (element: StackItem) => boolean) {
        var finished = false;
        var element: StackItem;
        while (!finished) {
            element = this.elements.pop();
            finished = callback(element);
        }
        return element;
    }

    get top(): StackItem {
        return this.elements[this.elements.length - 1];
    }

    get length(): number {
        return this.elements.length;
    }
}

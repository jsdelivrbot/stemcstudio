import { Attr } from "./Attr";

export class Node {
    columnNumber: number;
    lineNumber: number;
    parentNode;
    nextSibling;
    firstChild;
    attributes: Attr[] = [];
    /**
     *
     */
    constructor(locator) {
        if (!locator) {
            this.columnNumber = -1;
            this.lineNumber = -1;
        } else {
            this.columnNumber = locator.columnNumber;
            this.lineNumber = locator.lineNumber;
        }
        this.parentNode = null;
        this.nextSibling = null;
        this.firstChild = null;
    }

    /**
     * Visit the node.
     *
     * @param treeParser the visitor
     * @throws SAXException if stuff goes wrong
     */
    visit(treeParser) {
        throw new Error("Not Implemented");
    }

    /**
     * Revisit the node.
     *
     * @param treeParser the visitor
     * @throws SAXException if stuff goes wrong
     */
    revisit(treeParser) {
        return;
    }


    // Subclass-specific accessors that are hoisted here to
    // avoid casting.

    /**
     * Detach this node from its parent.
     */
    detach() {
        if (this.parentNode !== null) {
            this.parentNode.removeChild(this);
            this.parentNode = null;
        }
    }

    get previousSibling() {
        var prev = null;
        var next = this.parentNode.firstChild;
        for (; ;) {
            if (this === next) {
                return prev;
            }
            prev = next;
            next = next.nextSibling;
        }
    }
}

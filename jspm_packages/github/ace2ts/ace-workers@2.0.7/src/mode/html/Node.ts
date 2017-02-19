/* ***** BEGIN LICENSE BLOCK *****
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 David Geo Holmes <david.geo.holmes@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ***** END LICENSE BLOCK ***** */
import Attr from "./Attr";

export default class Node {
    columnNumber: number;
    lineNumber: number;
    parentNode;
    nextSibling;
    firstChild;
    attributes: Attr[] = [];
    /**
     * The common node superclass.
     * @version $Id$
     * @author hsivonen
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

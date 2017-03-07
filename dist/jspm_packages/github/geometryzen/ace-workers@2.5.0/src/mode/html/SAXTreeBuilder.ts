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
import TreeBuilder from './TreeBuilder';
import Characters from './Characters';
import Comment from './Comment';
import Document from './Document';
import DocumentFragment from './DocumentFragment';
import DTD from './DTD';
import Element from './Element';
import ParentNode from "./ParentNode";
import getAttribute from './getAttribute';

export default class SAXTreeBuilder extends TreeBuilder {
    constructor() {
        super();
    }

    start(tokenizer) {
        this.document = new Document(this.tokenizer);
    }

    end() {
        this.document.endLocator = this.tokenizer;
    }

    insertDoctype(name, publicId, systemId) {
        var doctype = new DTD(this.tokenizer, name, publicId, systemId);
        doctype.endLocator = this.tokenizer;
        this.document.appendChild(doctype);
    }

    createElement(namespaceURI, localName, attributes) {
        var element = new Element(this.tokenizer, namespaceURI, localName, localName, attributes || []);
        return element;
    }

    insertComment(data, parent) {
        if (!parent)
            parent = this.currentStackItem();
        var comment = new Comment(this.tokenizer, data);
        parent.appendChild(comment);
    }

    appendCharacters(parent: ParentNode, data) {
        var text = new Characters(this.tokenizer, data);
        parent.appendChild(text);
    }

    insertText(data) {
        if (this.redirectAttachToFosterParent && this.openElements.top.isFosterParenting()) {
            var tableIndex = this.openElements.findIndex('table');
            var tableItem = this.openElements.item(tableIndex);
            var table = tableItem.node;
            if (tableIndex === 0) {
                return this.appendCharacters(table, data);
            }
            var text = new Characters(this.tokenizer, data);
            var parent = table.parentNode;
            if (parent) {
                parent.insertBetween(text, table.previousSibling, table);
                return;
            }
            var stackParent = this.openElements.item(tableIndex - 1).node;
            stackParent.appendChild(text);
            return;
        }
        this.appendCharacters(this.currentStackItem().node, data);
    }

    attachNode(node, parent) {
        parent.appendChild(node);
    }

    attachNodeToFosterParent(child, table, stackParent) {
        var parent = table.parentNode;
        if (parent)
            parent.insertBetween(child, table.previousSibling, table);
        else
            stackParent.appendChild(child);
    }

    detachFromParent(element) {
        element.detach();
    }

    reparentChildren(oldParent, newParent) {
        newParent.appendChildren(oldParent.firstChild);
    }

    getFragment() {
        var fragment = new DocumentFragment();
        this.reparentChildren(this.openElements.rootNode, fragment);
        return fragment;
    }

    addAttributesToElement(element, attributes) {
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            if (!getAttribute(element, attribute.nodeName))
                element.attributes.push(attribute);
        }
    }
}

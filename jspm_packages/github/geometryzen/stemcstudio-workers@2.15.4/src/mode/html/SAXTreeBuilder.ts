import { TreeBuilder } from './TreeBuilder';
import { Characters } from './Characters';
import { Comment } from './Comment';
import { Document } from './Document';
import { DocumentFragment } from './DocumentFragment';
import { DTD } from './DTD';
import { Element } from './Element';
import { ParentNode } from "./ParentNode";
import { getAttribute } from './getAttribute';

export class SAXTreeBuilder extends TreeBuilder {
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

import { ParentNode } from './ParentNode';
import { NodeType } from './NodeType';

export class Document extends ParentNode {
    nodeType: number;
    constructor(locator) {
        super(locator);
        this.nodeType = NodeType.DOCUMENT;
    }

    visit(treeParser) {
        treeParser.startDocument(this);
    }

    revisit(treeParser) {
        treeParser.endDocument(this.endLocator);
    }
}


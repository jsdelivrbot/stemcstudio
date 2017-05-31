import { Node } from './Node';
import { NodeType } from './NodeType';

export class Characters extends Node {
    data;
    nodeType;

    /**
     * @param locator the locator
     * @param data the buffer
     */
    constructor(locator, data) {
        super(locator);
        this.data = data;
        this.nodeType = NodeType.CHARACTERS;
    }

    visit(treeParser) {
        treeParser.characters(this.data, 0, this.data.length, this);
    }
}


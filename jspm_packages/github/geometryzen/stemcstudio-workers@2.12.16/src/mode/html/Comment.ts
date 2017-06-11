import { Node } from './Node';
import { NodeType } from './NodeType';

export class Comment extends Node {
    data;
    nodeType: number;
    /**
     * The constructor.
     * @param locator the locator
     * @param buf the buffer
     * @param start the offset
     * @param length the length
     */
    constructor(locator, data) {
        super(locator);
        this.data = data;
        this.nodeType = NodeType.COMMENT;
    }

    visit(treeParser) {
        treeParser.comment(this.data, 0, this.data.length, this);
    }
}

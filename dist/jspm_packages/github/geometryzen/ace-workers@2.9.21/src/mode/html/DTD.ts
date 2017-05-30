import { ParentNode } from './ParentNode';
import { NodeType } from './NodeType';

export class DTD extends ParentNode {
    name;
    publicIdentifier;
    systemIdentifier;
    nodeType: number;
    /**
     * The constructor.
     * @param locator the locator
     * @param name the name
     * @param publicIdentifier the public id
     * @param systemIdentifier the system id
     */
    constructor(locator, name, publicIdentifier, systemIdentifier) {
        super(locator);
        this.name = name;
        this.publicIdentifier = publicIdentifier;
        this.systemIdentifier = systemIdentifier;
        this.nodeType = NodeType.DTD;
    }

    /**
     * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
     */
    visit(treeParser) {
        treeParser.startDTD(this.name, this.publicIdentifier, this.systemIdentifier, this);
    }

    /**
     * @see nu.validator.saxtree.Node#revisit(nu.validator.saxtree.TreeParser)
     */
    revisit(treeParser) {
        treeParser.endDTD();
    }
}

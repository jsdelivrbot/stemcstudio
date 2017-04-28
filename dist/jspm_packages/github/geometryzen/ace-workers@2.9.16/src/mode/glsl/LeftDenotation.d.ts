import Node from './Node'

interface LeftDenotation {
    (left: Node): Node
}

export default LeftDenotation;

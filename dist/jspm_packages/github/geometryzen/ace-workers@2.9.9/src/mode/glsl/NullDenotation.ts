import Node from './Node';

/**
 * A nud does not care about tokens to the left.
 */
interface NullDenotation {
    (): Node;
}

export default NullDenotation;

import Hybrid from './Hybrid';
import Node from './Node';
import Scope from './Scope';
import Token from './Token';

interface State extends ArrayLike<Hybrid> {
    mode?: number;
    scope?: Scope;
    // length?: number;
    shift?: () => any;
    unshift?: (node: Node, addChild?: boolean) => any;
    fake?: (node: Node) => any;
    unexpected?: (message: string) => any;
    create_node?: () => Node;
}

export default State;

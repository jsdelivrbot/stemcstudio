import { Attr } from "./Attr";
import { Node } from "./Node";

export function getAttribute(node: Node, name: string): Attr {
    for (let i = 0; i < node.attributes.length; i++) {
        const attribute = node.attributes[i];
        if (attribute.nodeName === name) {
            return attribute;
        }
    }
    return null;
}

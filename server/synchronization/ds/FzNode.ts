import FzEditor from './FzEditor';
import FzLink from './FzLink';

interface FzNode {
    i: string;
    e: { [fileId: string]: FzEditor };
    k: { [nodeId: string]: FzLink };
}

export default FzNode;

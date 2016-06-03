import FzShadow from './FzShadow';
import MwEdit from '../MwEdit';

interface FzLink {
    s: { [fileId: string]: FzShadow };
    b: { [fileId: string]: FzShadow };
    e: MwEdit[];
}

export default FzLink;

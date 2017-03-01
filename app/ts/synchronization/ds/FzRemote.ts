import FzShadow from './FzShadow';
import MwBroadcast from '../MwBroadcast';

interface FzRemote {
    /**
     * The dehydrated shadow.
     */
    s: FzShadow | undefined;
    /**
     * The dehydrated backup.
     */
    b: FzShadow | undefined;
    /**
     * The edits by destination node identifier.
     */
    e: MwBroadcast;
}

export default FzRemote;

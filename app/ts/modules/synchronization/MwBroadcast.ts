import MwEdits from './MwEdits';

/**
 * A broadcast is a collection of edits distinguished by the destination node identifier.
 */
interface MwBroadcast {
    [nodeId: string]: MwEdits;
}

export default MwBroadcast;

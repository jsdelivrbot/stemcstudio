import { MwEdits } from './MwEdits';

/**
 * A broadcast is a collection of edits distinguished by the destination node identifier.
 */
export interface MwBroadcast {
    /**
     * A map from destination node identifier to a list of changes.
     */
    [nodeId: string]: MwEdits;
}

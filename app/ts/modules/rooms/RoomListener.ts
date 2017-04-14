import MwEdits from '../../synchronization/MwEdits';

/**
 * A room listener can be notified of changes to any file.
 */
export interface RoomListener {
    /**
     * nodeId is where the edits came from.
     * path is the file identifier.
     * edits are the changes to be applied.
     */
    setEdits(nodeId: string, path: string, edits: MwEdits): void;
}

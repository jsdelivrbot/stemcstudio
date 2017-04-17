import MwEdits from '../../synchronization/MwEdits';

/**
 * A room listener can be notified of changes to any file.
 */
export interface RoomListener {
    /**
     * 
     */
    getWorkspaceEdits(roomId: string): { [path: string]: MwEdits };

    /**
     * roomId is where the edits came from.
     * path is the file identifier.
     * edits are the changes to be applied.
     */
    setDocumentEdits(roomId: string, path: string, edits: MwEdits): void;
}

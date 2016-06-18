import MwEdits from '../../../synchronization/MwEdits';

interface RoomListener {
    /**
     * @param nodeId Where the edits came from.
     * @param path
     * @param edits
     */
    setEdits(nodeId: string, path: string, edits: MwEdits): void;
}

export default RoomListener;

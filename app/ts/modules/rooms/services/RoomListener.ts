import MwEdits from '../../../synchronization/MwEdits';

interface RoomListener {
    /**
     * @param nodeId Where the edits came from.
     * @param fileName
     * @param edits
     */
    setEdits(nodeId: string, fileName: string, edits: MwEdits): void;
}

export default RoomListener;

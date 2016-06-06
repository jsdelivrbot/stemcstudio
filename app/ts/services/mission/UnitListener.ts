import RoomListener from '../../modules/rooms/services/RoomListener';
import MwEdits from '../../modules/synchronization/MwEdits';
import MwUnit from '../../modules/synchronization/MwUnit';

/**
 * Adapter that listens to the RoomAgent and sends syncronization messages to the node.
 */
export default class UnitListener implements RoomListener {
    constructor(private units: { [fileName: string]: MwUnit }) {
        // Do something soon.
    }
    setEdits(nodeId: string, fileName: string, edits: MwEdits): void {
        const unit = this.units[fileName];
        if (unit) {
            unit.setEdits(nodeId, edits);
        }
        else {
            console.warn(`MwUnit not found for fileName ${fileName}.`);
        }
    }
}

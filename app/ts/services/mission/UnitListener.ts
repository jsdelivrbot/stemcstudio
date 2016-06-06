import RoomListener from '../../modules/rooms/services/RoomListener';
import MwEdits from '../../modules/synchronization/MwEdits';
import MwEditor from '../../modules/synchronization/MwEditor';
import MwUnit from '../../modules/synchronization/MwUnit';
import MwWorkspace from '../../modules/synchronization/MwWorkspace';

/**
 * Adapter that listens to the RoomAgent and sends syncronization messages to the node.
 */
export default class UnitListener implements RoomListener {
    constructor(private units: { [fileName: string]: MwUnit }, private workspace: MwWorkspace) {
        // Do something soon.
    }
    setEdits(nodeId: string, fileName: string, edits: MwEdits): void {
        const unit = this.units[fileName];
        if (unit) {
            unit.setEdits(nodeId, edits);
        }
        else {
            const newbie = new MwUnit(this.workspace);
            const editor: MwEditor = this.workspace.createEditor();
            newbie.setEditor(editor);
            newbie.setEdits(nodeId, edits);
            // console.warn(`MwUnit not found for fileName ${fileName}.`);
        }
    }
}

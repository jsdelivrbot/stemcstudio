import RoomListener from '../../modules/rooms/services/RoomListener';
import MwEdits from '../../synchronization/MwEdits';
import MwEditor from '../../synchronization/MwEditor';
import MwUnit from '../../synchronization/MwUnit';
import WsFile from './WsFile';
import WsModel from './WsModel';

/**
 * Adapter that listens to the RoomAgent and sends syncronization messages to the node.
 */
export default class UnitListener implements RoomListener {
    constructor(private workspace: WsModel) {
        // Do something soon.
    }
    setEdits(nodeId: string, path: string, edits: MwEdits): void {
        const file: WsFile = this.workspace.getFileWeakRef(path);
        if (file) {
            if (file.unit) {
                file.unit.setEdits(nodeId, edits);
            }
            else {
                file.unit = new MwUnit(this.workspace);
                const editor: MwEditor = this.workspace.createEditor();
                file.unit.setEditor(editor);
                file.unit.setEdits(nodeId, edits);
                // console.warn(`MwUnit not found for path ${path}.`);
            }
        }
        else {
            console.warn(`Unable to setEdits because file '${path}' is missing.`);
        }
    }
}

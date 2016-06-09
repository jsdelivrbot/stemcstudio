import RoomListener from '../../modules/rooms/services/RoomListener';
import MwEdits from '../../synchronization/MwEdits';
import MwEditor from '../../synchronization/MwEditor';
import MwUnit from '../../synchronization/MwUnit';
import MwWorkspace from '../../synchronization/MwWorkspace';
import WsFile from './WsFile';
import WsModel from './WsModel';

/**
 * Adapter that listens to the RoomAgent and sends syncronization messages to the node.
 */
export default class UnitListener implements RoomListener {
    constructor(private workspace: WsModel) {
        // Do something soon.
    }
    setEdits(nodeId: string, fileName: string, edits: MwEdits): void {
        const file: WsFile = this.workspace.findFileByName(fileName);
        if (file.unit) {
            file.unit.setEdits(nodeId, edits);
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

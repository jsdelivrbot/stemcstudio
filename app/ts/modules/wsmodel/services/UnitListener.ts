import { RoomListener } from '../../rooms/RoomListener';
import MwEdits from '../../../synchronization/MwEdits';
import MwEditor from '../../../synchronization/MwEditor';
import MwUnit from '../../../synchronization/MwUnit';
import WsModel from './WsModel';

/**
 * Adapter that listens to the RoomAgent and sends syncronization messages to the node.
 */
export default class UnitListener implements RoomListener {
    constructor(private workspace: WsModel) {
        // Do something soon.
    }

    /**
     * nodeId is the identifier of where the edits will be going to.
     */
    getWorkspaceEdits(nodeId: string): { [path: string]: MwEdits } {
        const map: { [path: string]: MwEdits } = {};
        const paths = this.workspace.getFileDocumentPaths();
        for (const path of paths) {
            const file = this.workspace.getFileWeakRef(path);
            const unit = file.unit;
            const edits = unit.getEdits(nodeId);
            map[path] = edits;
        }
        return map;
    }

    /**
     * Handles 'edits' sent down from the remote server.
     */
    setEdits(nodeId: string, path: string, edits: MwEdits): void {
        const file = this.workspace.getFileWeakRef(path);
        if (file) {
            if (file.unit) {
                file.unit.setEdits(nodeId, edits);
            }
            else {
                file.unit = new MwUnit(this.workspace);
                const editor: MwEditor = this.workspace.createEditor();
                file.unit.setEditor(editor);
                file.unit.setEdits(nodeId, edits);
            }
        }
        else {
            console.warn(`Unable to setEdits because file '${path}' is missing.`);
        }
    }
}

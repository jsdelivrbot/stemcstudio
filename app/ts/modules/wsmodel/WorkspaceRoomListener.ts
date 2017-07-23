import { RoomListener } from '../rooms/RoomListener';
import { ACTION_RAW_OVERWRITE } from '../../synchronization/MwAction';
import { ACTION_DELTA_MERGE } from '../../synchronization/MwAction';
import { MwEdits } from '../../synchronization/MwEdits';
import { MwOptions } from '../../synchronization/MwOptions';
import { MwUnit } from '../../synchronization/MwUnit';
import { WsModel } from './WsModel';

/**
 * Adapter onto the workspace that is called by the RoomAgent.
 *  and sends syncronization messages to the node.
 */
export class WorkspaceRoomListener implements RoomListener {
    constructor(private workspace: WsModel, private options: MwOptions) {
        // Do something soon.
    }

    /**
     * Called by the room agent in response to a reconnect event.
     * The room agent is asking for the current state of the workspace to update the room.
     * 
     * nodeId is the identifier of where the edits will be going to.
     * TODO: Isn't that the room?
     */
    getWorkspaceEdits(roomId: string): { [path: string]: MwEdits } {
        const map: { [path: string]: MwEdits } = {};
        const paths = this.workspace.getFileSessionPaths();
        for (const path of paths) {
            const file = this.workspace.getFileWeakRef(path);
            if (file) {
                const unit = file.unit;
                const edits = unit.getEdits(roomId);
                map[path] = edits;
            }
        }
        return map;
    }

    /**
     * Handles 'edits' sent down from the remote server via the room agent to the workspace.
     */
    setDocumentEdits(roomId: string, path: string, edits: MwEdits): void {
        const changes = edits.x;
        for (const change of changes) {
            const action = change.a;
            switch (action.c) {
                case ACTION_RAW_OVERWRITE: {
                    const file = this.workspace.createFile(path, roomId, change);
                    // Begin monitoring for changes to support the Language Service.
                    this.workspace.beginDocumentMonitoring(path, function (err) {
                        // Do we care if there are errors?
                        if (err) {
                            console.warn(`Failed to begin document monitoring on ${path}`);
                        }
                    });
                    file.release();
                    break;
                }
                case ACTION_DELTA_MERGE: {
                    const file = this.workspace.getFileWeakRef(path);
                    if (file) {
                        if (file.unit) {
                            file.unit.setChange(roomId, path, change);
                        }
                        else {
                            file.unit = new MwUnit(this.workspace, this.options);
                            file.unit.setEditor(file);
                            file.unit.setChange(roomId, path, change);
                        }
                    }
                    break;
                }
                default: {
                    throw new Error(`Unexpected action type ${action.c}`);
                }
            }
        }
    }
}

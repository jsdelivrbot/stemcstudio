import EditorAdapter from './EditorAdapter';
import NodeListener from './NodeListener';
import RoomAgent from '../../modules/rooms/services/RoomAgent';
import RoomListener from '../../modules/rooms/services/RoomListener';
import uniqueId from '../../modules/synchronization/uniqueId';
import Workspace from '../workspace/Workspace';
import MwEdit from '../../modules/synchronization/MwEdit';
import MwNode from '../../modules/synchronization/MwNode';
import WorkspaceAdapter from './WorkspaceAdapter';

export default class MissionControl {
    public static $inject: string[] = [

    ];

    private _room: RoomAgent;
    private _roomListener: RoomListener;
    /**
     * The node is the counterpart to the workspace for synchronization.
     */
    private _node: MwNode;
    // private _user: string;
    private _workspace: Workspace;

    constructor() {
        // console.lg("MissionControl");
    }
    get room(): RoomAgent {
        if (this._room) {
            this._room.addRef();
        }
        return this._room;
    }
    set room(room: RoomAgent) {
        // Be careful not to drop objects!
        if (room) {
            room.addRef();
        }
        if (this._room) {
            this._room.release();
        }
        this._room = room;
    }
    get workspace(): Workspace {
        return this._workspace;
    }
    set workspace(workspace: Workspace) {
        this._workspace = workspace;
    }
    connectWorkspaceToRoom() {
        if (this._workspace && this._room) {

            // Create the synchronization node associated with the workspace.
            this._node = new MwNode(uniqueId(), new WorkspaceAdapter(this._workspace));

            // Enumerate the editors in the workspace and use them to initialize the node.
            const fileNames = this._workspace.getEditorFileNames();
            for (let i = 0; i < fileNames.length; i++) {
                const fileName = fileNames[i];
                const editor = this.workspace.getEditor(fileName);
                this._node.addEditor(fileName, new EditorAdapter(editor));
            }

            this._roomListener = new NodeListener(this._node);
            this._room.addListener(this._roomListener);
        }
        else {
            throw new Error("Must have a workspace and a room.");
        }
    }
    disconnectWorkspaceFromRoom() {
        this._room.removeListener(this._roomListener);
        this._roomListener = void 0;
        this._node = void 0;
    }
    uploadWorkspaceToRoom() {
        if (this._node && this._room) {
            const edits: MwEdit[] = this._node.getEdits(this._room.id);
            // console.log(JSON.stringify(edits, null, 2));
            this._room.setEdits(edits);
        }
        else {
            console.warn("We appear to be missing a node and a room");
        }
    }
}

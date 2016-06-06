import Delta from '../../widgets/editor/Delta';
import Editor from '../../widgets/editor/Editor';
import EditorAdapter from './EditorAdapter';
import UnitListener from './UnitListener';
import RoomAgent from '../../modules/rooms/services/RoomAgent';
import RoomListener from '../../modules/rooms/services/RoomListener';
import Workspace from '../workspace/Workspace';
import MwEdits from '../../modules/synchronization/MwEdits';
import MwUnit from '../../modules/synchronization/MwUnit';
import WorkspaceAdapter from './WorkspaceAdapter';

const DEBOUNCE_DURATION_MILLISECONDS = 100;

function debounce(next: () => any, delay: number) {

    /**
     * The timer handle.
     */
    let timer: number;

    return function(delta: Delta, editor: Editor) {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = setTimeout(function() {
            timer = void 0;
            next();
        }, delay);
    };
}

function uploadFileEditsToRoom(fileId: string, units: { [fileId: string]: MwUnit }, room: RoomAgent) {
    return function() {
        const edits = units[fileId].getEdits(room.id);
        room.setEdits(fileId, edits);
    };
}

export default class MissionControl {
    public static $inject: string[] = [
        // Nothing yet.
    ];

    private _room: RoomAgent;
    private _roomListener: RoomListener;
    /**
     * The node is the counterpart to the workspace for synchronization.
     */
    private units: { [fileId: string]: MwUnit } = {};
    private _workspace: Workspace;

    /**
     * Keep track of the change handlers so that we can remove them when we stop listening.
     */
    private changeHandlers: { [fileName: string]: (delta: Delta, editor: Editor) => any } = {};

    constructor() {
        // Nothing to see here.
    }
    get room(): RoomAgent {
        if (this._room) {
            this._room.addRef();
        }
        return this._room;
    }
    set room(room: RoomAgent) {
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

    /**
     * Connect the workspace to the room agent with the node in the middle.
     */
    connectWorkspaceToRoom() {
        if (this._workspace && this._room) {

            // Enumerate the editors in the workspace and add them to the node.
            // This will enable the node to get/set the editor value, diff and apply patches.
            const fileNames = this._workspace.getEditorFileNames();
            for (let i = 0; i < fileNames.length; i++) {
                const fileName = fileNames[i];
                const editor = this.workspace.getEditor(fileName);
                // Create the synchronization node associated with the workspace.
                // This will enable the node to create and destroy editors.
                const unit = new MwUnit(new WorkspaceAdapter(this._workspace));
                unit.setEditor(new EditorAdapter(editor));
                this.units[fileName] = unit;
            }

            // Add a listener to the room agent so that edits broadcast from the room are sent to the node.
            this._roomListener = new UnitListener(this.units);
            this._room.addListener(this._roomListener);

            // Add listeners for editor changes. These will begin the flow of diffs to the server.
            // We debounce the change events so that the diff is trggered when things go quiet for a second.
            for (let i = 0; i < fileNames.length; i++) {
                const fileName = fileNames[i];
                const editor = this.workspace.getEditor(fileName);
                const changeHandler = debounce(uploadFileEditsToRoom(fileName, this.units, this._room), DEBOUNCE_DURATION_MILLISECONDS);
                editor.on('change', changeHandler);
                // Keep track of the handlers so that we can remove them later.
                this.changeHandlers[fileName] = changeHandler;
            }
        }
        else {
            throw new Error("Must have a workspace and a room.");
        }
    }
    disconnectWorkspaceFromRoom() {
        // Remove listeners on the editor for changes.
        const fileNames = this._workspace.getEditorFileNames();
        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i];
            const editor = this.workspace.getEditor(fileName);
            const changeHandler = this.changeHandlers[fileName];
            editor.off('change', changeHandler);
            delete this.changeHandlers[fileName];
        }
        // remove the listener on the room agent.
        this._room.removeListener(this._roomListener);
        this._roomListener = void 0;
        this.units = {};
    }
    uploadWorkspaceToRoom() {
        if (this.units && this._room) {
            const fileIds = Object.keys(this.units);
            for (let i = 0; i < fileIds.length; i++) {
                const fileId = fileIds[i];
                const unit = this.units[fileId];
                const edits: MwEdits = unit.getEdits(this._room.id);
                this._room.setEdits(fileId, edits);
            }
        }
        else {
            console.warn("We appear to be missing a node and a room");
        }
    }
}

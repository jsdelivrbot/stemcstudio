import RoomAgent from '../../modules/rooms/services/RoomAgent';
import WsModel from '../../wsmodel/services/WsModel';

export default class MissionControl {
    public static $inject: string[] = ['wsModel'];

    private _room: RoomAgent;

    constructor(private wsModel: WsModel) {
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

    /**
     * Connect the workspace to the room agent with the node in the middle.
     */
    connectWorkspaceToRoom() {
        if (this.wsModel && this._room) {
            this.wsModel.connectToRoom(this._room);
        }
        else {
            throw new Error("Must have a workspace and a room.");
        }
    }
    uploadWorkspaceToRoom() {
        if (this._room) {
            this.wsModel.uploadToRoom(this._room);
        }
        else {
            console.warn("We appear to be missing a node and a room");
        }
    }
    downloadWorkspaceFromRoomDEPRECATED() {
        if (this._room) {
            console.log("DEPRECATED: downloadWorkspaceFromRoom");
            // this.wsModel.downloadFromRoom(this._room);
        }
        else {
            console.warn("We appear to be missing a node and a room");
        }
    }
}

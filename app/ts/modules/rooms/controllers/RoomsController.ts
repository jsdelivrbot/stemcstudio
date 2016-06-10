import RoomAgent from '../services/RoomAgent';
import RoomParams from '../services/RoomParams';
import RoomsService from '../services/RoomsService';
import MissionControl from '../../../services/mission/MissionControl';
import ModalDialog from '../../../services/modalService/ModalDialog';

/**
 * A controller for a collection of rooms.
 */
export default class RoomsController {
    public static $inject: string[] = [
        'missionControl',
        'modalDialog',
        'roomsService'
    ];
    constructor(
        private missionControl: MissionControl,
        private modalDialog: ModalDialog,
        private roomsService: RoomsService
    ) {
        // Do nothing yet.
    }

    /**
     * 
     */
    createRoom(): void {
        const roomParams: RoomParams = {
            description: "My favorite room",
            public: true
        };
        this.roomsService.createRoom(roomParams).then((room: RoomAgent) => {
            this.missionControl.room = room;
            // This could use a flow.
            // Share dialog...
            // 1. OK button only
            // 2. readonly input
            // 3. No placeholder needed.
            // 4. Label
            this.modalDialog.share({
                title: 'Share Room',
                message: 'Please share the following room name so that others can join you.',
                text: room.id
            }).then((value) => {
                // Do nothing.
            }).catch((reason) => {
                // 
            });
            room.release();
            this.missionControl.connectWorkspaceToRoom();
            this.missionControl.uploadWorkspaceToRoom();
        }).catch(function(reason) {
            console.warn(`Sorry, we could not get you a room!`);
        });
    }

    /**
     * 
     */
    joinRoom(): void {
        this.modalDialog.prompt({ title: "Join Room", message: "Please enter the name of the room you would like to join.", text: "", placeholder: "r1234567" }).then((roomId) => {
            this.roomsService.getRoom(roomId).then((room: RoomAgent) => {
                this.missionControl.room = room;
                room.release();
                this.missionControl.connectWorkspaceToRoom();
                this.missionControl.downloadWorkspaceFromRoom();
            }).catch(function(reason) {
                console.warn(`Sorry, we could not get that room!`);
            });
        }).catch(function(err) {
            switch (err) {
                case 'cancel click':
                case 'escape key press':
                case 'backdrop click': {
                    break;
                }
                default: {
                    console.warn(err);
                }
            }
        });
    }

    /**
     * 
     */
    leaveRoom(): void {
        this.missionControl.disconnectWorkspaceFromRoom();
        this.missionControl.room = void 0;
    }

    /**
     * 
     */
    destroyRoom(): void {
        const room = this.missionControl.room;
        if (room) {
            this.missionControl.disconnectWorkspaceFromRoom();
            this.roomsService.destroyRoom(room.id).then(() => {
                this.missionControl.room = void 0;
                this.modalDialog.alert({ title: 'Destroy Room', message: `The room ${room.id} is no longer available.` });
                room.release();
            }).catch((reason) => {
                this.modalDialog.alert({ title: 'Destroy Room', message: `The room ${room.id} could not be destroyed: ${reason}` });
                room.release();
            });
        }
    }
}

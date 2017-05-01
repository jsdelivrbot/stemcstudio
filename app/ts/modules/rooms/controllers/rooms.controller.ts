import { GITHUB_AUTH_MANAGER_UUID, IGitHubAuthManager } from '../../../services/gham/IGitHubAuthManager';
import RoomAgent from '../RoomAgent';
import { IRoomsService, RoomParams, ROOMS_SERVICE_UUID } from '../api';
import ModalDialog from '../../../services/modalService/ModalDialog';
import { NAVIGATION_SERVICE_UUID, INavigationService } from '../../navigation/INavigationService';
import { WsModel } from '../../wsmodel/WsModel';
import { WORKSPACE_MODEL_UUID } from '../../wsmodel/IWorkspaceModel';

const TITLE_CREATE_ROOM = "Create Room";
const TITLE_DESTROY_ROOM = "Destroy Room";
const TITLE_JOIN_ROOM = "Join Room";
const TITLE_SHARE_ROOM = "Share Room";

/**
 * A controller for a collection of rooms.
 */
export class RoomsController {
    public static $inject: string[] = [
        GITHUB_AUTH_MANAGER_UUID,
        'modalDialog',
        NAVIGATION_SERVICE_UUID,
        ROOMS_SERVICE_UUID,
        WORKSPACE_MODEL_UUID
    ];
    constructor(
        private authManager: IGitHubAuthManager,
        private modalDialog: ModalDialog,
        private navigation: INavigationService,
        private roomsService: IRoomsService,
        private wsModel: WsModel
    ) {
        // Do nothing yet.
    }

    isCreateRoomEnabled(): boolean {
        return !this.wsModel.isConnectedToRoom() && this.authManager.isSignedIn();
    }

    isJoinRoomEnabled(): boolean {
        return !this.wsModel.isConnectedToRoom();
    }

    /**
     * Determines whether the current user is in a state where they can elect to leave a room.
     */
    isLeaveRoomEnabled(): boolean {
        if (this.wsModel.isConnectedToRoom()) {
            if (this.authManager.isSignedIn()) {
                return !this.wsModel.isRoomOwner(<string>this.authManager.userLogin());
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }

    isDestroyRoomEnabled(): boolean {
        if (this.wsModel.isConnectedToRoom() && this.authManager.isSignedIn()) {
            // FIXME: Why is the result if isRoomOwner undecided (undefined)?
            if (this.wsModel.isRoomOwner(<string>this.authManager.userLogin())) {
                return true;
            }
        }
        return false;
    }

    /**
     * The room creator stays put 
     */
    createRoom(): void {
        if (this.isCreateRoomEnabled()) {
            const roomParams: RoomParams = {
                owner: <string>this.authManager.userLogin(),
                description: "",
                public: true
            };
            this.roomsService.createRoom(roomParams)
                .then((room: RoomAgent) => {
                    // This could use a flow.
                    // Share dialog...
                    // 1. OK button only
                    // 2. readonly input
                    // 3. No placeholder needed.
                    // 4. Label
                    this.modalDialog.share({
                        title: TITLE_SHARE_ROOM,
                        message: 'Please share the following collaboration room name so that others can join you.',
                        text: room.id
                    }).then((value) => {
                        // Do nothing.
                    }).catch((reason) => {
                        // 
                    });

                    this.wsModel.connectToRoom(room, true);
                    this.wsModel.uploadToRoom(room);
                    room.release();

                })
                .catch(function (reason) {
                    console.warn(`Sorry, we could not get you a collaboration room!`);
                });
        }
        else {
            this.modalDialog.alert({ title: TITLE_CREATE_ROOM, message: "You must be signed in with GitHub to create a collaboration room." });
        }
    }

    /**
     * 
     */
    joinRoom(): void {
        if (this.isJoinRoomEnabled()) {
            this.modalDialog.prompt({ title: TITLE_JOIN_ROOM, message: "Please enter the name of the collaboration room you would like to join.", text: "", placeholder: "r1234567" })
                .then((roomId) => {
                    this.roomsService.existsRoom(roomId)
                        .then(() => {
                            this.navigation.gotoRoom(roomId);
                        })
                        .catch((reason) => {
                            this.modalDialog.alert({ title: TITLE_JOIN_ROOM, message: `The collaboration room '${roomId}' does not exist.` });
                        });
                })
                .catch(function (err) {
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
        else {
            console.warn("Join Room is not enabled.");
        }
    }

    /**
     * 
     */
    leaveRoom(): void {
        if (this.isLeaveRoomEnabled()) {
            const room = this.wsModel.disconnectFromRoom();
            if (room) {
                room.disconnect()
                    .then(() => {
                        room.release();
                        this.navigation.gotoWork();
                    });
            }
            else {
                console.warn("disconnectFromRoom did not return a room.");
            }
        }
        else {
            console.warn("Leave Room is not enabled.");
        }
    }

    /**
     * Allows the user who created or owns a room to destroy or tear-down the room.
     */
    destroyRoom(): void {
        if (this.isDestroyRoomEnabled()) {
            if (this.wsModel.isConnectedToRoom()) {
                const room = this.wsModel.disconnectFromRoom();
                if (room) {
                    this.roomsService.destroyRoom(room.id)
                        .then(() => {
                            this.modalDialog.alert({ title: TITLE_DESTROY_ROOM, message: `The collaboration room '${room.id}' is no longer available.` });
                            room.release();
                        })
                        .catch((reason) => {
                            this.modalDialog.alert({ title: TITLE_DESTROY_ROOM, message: `The collaboration room '${room.id}' could not be destroyed: ${reason}` });
                            room.release();
                        });
                }
            }
        }
        else {
            this.modalDialog.alert({ title: TITLE_DESTROY_ROOM, message: "You must be signed in with GitHub to destroy a collaboration room." });
        }
    }
}

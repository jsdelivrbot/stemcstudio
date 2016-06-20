import IGitHubAuthManager from '../../../services/gham/IGitHubAuthManager';
import {GITHUB_AUTH_MANAGER} from '../../../services/gham/IGitHubAuthManager';
import RoomAgent from '../services/RoomAgent';
import RoomParams from '../services/RoomParams';
import RoomScope from './RoomScope';
import RoomsService from '../services/RoomsService';
import ModalDialog from '../../../services/modalService/ModalDialog';
import NavigationService from '../../../modules/navigation/NavigationService';
import WsModel from '../../../wsmodel/services/WsModel';

/**
 * A controller for a collection of rooms.
 */
export default class RoomsController {
    public static $inject: string[] = [
        '$scope',
        GITHUB_AUTH_MANAGER,
        'modalDialog',
        'navigation',
        'roomsService',
        'wsModel'
    ];
    constructor(
        private $scope: RoomScope,
        private authManager: IGitHubAuthManager,
        private modalDialog: ModalDialog,
        private navigation: NavigationService,
        private roomsService: RoomsService,
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

    isLeaveRoomEnabled(): boolean {
        if (this.wsModel.isConnectedToRoom()) {
            if (this.authManager.isSignedIn()) {
                return !this.wsModel.isRoomOwner(this.authManager.userLogin());
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
        return this.wsModel.isConnectedToRoom() && this.authManager.isSignedIn() && this.wsModel.isRoomOwner(this.authManager.userLogin());
    }

    /**
     * The room creator stays put 
     */
    createRoom(): void {
        if (this.isCreateRoomEnabled()) {
            const roomParams: RoomParams = {
                owner: this.authManager.userLogin(),
                description: "",
                public: true
            };
            this.roomsService.createRoom(roomParams).then((room: RoomAgent) => {
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

                this.wsModel.connectToRoom(room);
                this.wsModel.uploadToRoom(room);
                room.release();

            }).catch(function(reason) {
                console.warn(`Sorry, we could not get you a room!`);
            });
        }
        else {
            this.modalDialog.alert({ title: "Create Room", message: "You must be signed in with GitHub to create a collaboration room." });
        }
    }

    /**
     * 
     */
    joinRoom(): void {
        if (this.isJoinRoomEnabled()) {
            this.modalDialog.prompt({ title: "Join Room", message: "Please enter the name of the room you would like to join.", text: "", placeholder: "r1234567" }).then((roomId) => {
                this.navigation.gotoRoom(roomId);
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
        else {
            console.warn("Join Room is not enabled.");
        }
    }

    /**
     * 
     */
    leaveRoom(label?: string, value?: number): void {
        if (this.isLeaveRoomEnabled()) {
            const room = this.wsModel.disconnectFromRoom();
            if (room) {
                room.release();
                this.navigation.gotoDoodle(label, value);
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
     * 
     */
    destroyRoom(): void {
        if (this.isDestroyRoomEnabled()) {
            if (this.wsModel.isConnectedToRoom()) {
                const room = this.wsModel.disconnectFromRoom();
                this.roomsService.destroyRoom(room.id).then(() => {
                    this.modalDialog.alert({ title: 'Destroy Room', message: `The room ${room.id} is no longer available.` });
                    room.release();
                }).catch((reason) => {
                    this.modalDialog.alert({ title: 'Destroy Room', message: `The room ${room.id} could not be destroyed: ${reason}` });
                    room.release();
                });
            }
        }
        else {
            this.modalDialog.alert({ title: "Destroy Room", message: "You must be signed in with GitHub to destroy a collaboration room." });
        }
    }
}

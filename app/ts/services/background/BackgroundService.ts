import Background from './Background';
import CloudService from '../../services/cloud/CloudService';
import copyDoodleToWorkspace from '../../mappings/copyDoodleToWorkspace';
import Doodle from '../../services/doodles/Doodle';
import IDoodleManager from '../../services/doodles/IDoodleManager';
import isString from '../../utils/isString';
import MwEdits from '../../synchronization/MwEdits';
import RoomAgent from '../../modules/rooms/services/RoomAgent';
import RoomsService from '../../modules/rooms/services/RoomsService';
import WsModel from '../../wsmodel/services/WsModel';

/**
 * If the workspace is in the foreground, then the background is everything else that the
 * workspace interacts with. This service allows the workspace to be decoupled from the
 * background for unit testing.
 */
export default class BackgroundService implements Background {
    public static $inject: string[] = [
        'cloud',
        'doodles',
        'roomsService',
        'wsModel'
    ];
    constructor(
        private cloud: CloudService,
        private doodles: IDoodleManager,
        private roomsService: RoomsService,
        private wsModel: WsModel) {
        // Do nothing.
    }

    /**
     * Loads the contents of the WsModel from the specified repo, gist, or Local Storage.
     * 
     * @param owner The GitHub account name of the repository owner.
     * @param repo The name of the GitHub repository.
     * @param gistId The identifier of the GitHub Gist.
     * @param roomId The identifier of the room (collaboration).
     */
    loadWsModel(owner: string, repo: string, gistId: string, roomId: string, callback: (err: Error) => any) {
        console.log(`loadWsModel(owner=${owner}, repo=${repo}, gistId=${gistId}, roomId=${roomId})`);
        // If there is a doodle in Local Storage with the specified keys, we load that
        // so as not to trample on any existing work.
        const matches = this.doodles.filter(function(doodle: Doodle) {
            if (isString(owner) && isString(repo)) {
                return doodle.owner === owner && doodle.repo === repo;
            }
            else if (isString(gistId)) {
                return doodle.gistId === gistId;
            }
            else if (isString(roomId)) {
                return doodle.roomId === roomId;
            }
            else {
                return false;
            }
        });
        if (matches.length > 0) {
            console.log("Copying doodle from Local Storage...");
            // We certainly don't want to overwrite anything in local storage.
            // The user should be advised and then may delete manually from local storage.
            const match = matches[0];
            this.doodles.makeCurrent(match);
            copyDoodleToWorkspace(match, this.wsModel);
            // We can also assume that we are already in the correct state.
            setTimeout(callback, 0);
        }
        else {
            if (owner && repo) {
                console.log("Downloading Repository...");
                this.cloud.downloadTree(owner, repo, 'heads/master')
                    .then((doodle) => {
                        this.doodles.addHead(doodle);
                        this.doodles.updateStorage();
                        copyDoodleToWorkspace(doodle, this.wsModel);
                        callback(void 0);
                    }, (reason) => {
                        callback(new Error(`Error attempting to download repository '${repo}':  ${JSON.stringify(reason, null, 2)}`));
                    }, function(state) {
                        // The state is {doneCount: number; todoCount: number}
                    });
            }
            else if (gistId) {
                console.log("Downloading Gist...");
                this.cloud.downloadGist(gistId, (reason: any, doodle: Doodle) => {
                    if (!reason) {
                        this.doodles.addHead(doodle);
                        this.doodles.updateStorage();
                        copyDoodleToWorkspace(doodle, this.wsModel);
                        callback(void 0);
                    }
                    else {
                        callback(new Error(`Error attempting to download gist '${gistId}':  ${JSON.stringify(reason, null, 2)}`));
                    }
                });
            }
            else if (roomId) {
                console.log("Dereferencing roomId...");
                this.roomsService.getRoom(roomId).then((room: RoomAgent) => {
                    console.log("Downloading Room edits...");
                    room.download((err, edits: { [path: string]: MwEdits }) => {
                        if (!err) {
                            const paths = Object.keys(edits);
                            console.log(`paths (edits) => ${paths}`);
                            // We'll first mirror the structure of the workspace in the room.
                            // We are expecting Raw edits on every file so every edit is a create.
                            for (let i = 0; i < paths.length; i++) {
                                const path = paths[i];
                                if (!this.wsModel.existsFile(path)) {
                                    this.wsModel.newFile(path).release();
                                }
                                else {
                                    console.warn(`Unexpected file ${path} in workspace`);
                                }
                            }
                            console.log("Connecting to Room...");
                            this.wsModel.connectToRoom(room);
                            console.log("Applying edits...");
                            for (let i = 0; i < paths.length; i++) {
                                const path = paths[i];
                                const file = this.wsModel.findFileByPath(path);
                                file.unit.setEdits(roomId, edits[path]);
                            }
                            // Because we are already connected, setting the edits should trigger the acknowledgement.
                            // this.wsModel.uploadToRoom(room);
                            const doodle = this.doodles.createDoodle();
                            // Tag the Doodle with the roomId so that we can serialize to it without making it the
                            // current doodle. Add it to the tail of the list and maybe remove it later?
                            doodle.roomId = roomId;
                            this.doodles.addTail(doodle);
                            console.log("Updating Local Storage...");
                            this.wsModel.updateStorage();
                            callback(void 0);
                        }
                        else {
                            callback(new Error(`Unable to download workspace from room: ${err}`));
                        }
                    });
                }).catch((reason: Error) => {
                    callback(new Error(`Error attempting to connect to room '${roomId}':  ${reason.message}`));
                });
            }
            else {
                if (this.doodles.length > 0) {
                    const doodle = this.doodles.current();
                    copyDoodleToWorkspace(doodle, this.wsModel);
                }
                else {
                    const doodle = this.doodles.createDoodle();
                    this.doodles.addHead(doodle);
                    this.doodles.updateStorage();
                    copyDoodleToWorkspace(doodle, this.wsModel);
                }
                setTimeout(callback, 0);
            }
        }
    }
}

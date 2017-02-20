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
     * @param callback Use to report when monitoring of the files has begun.
     */
    loadWsModel(owner: string, repo: string, gistId: string, roomId: string, callback: (err: Error) => any) {
        // If there is a doodle in Local Storage with the specified keys, we load that
        // so as not to trample on any existing work.
        const matches = this.doodles.filter(function (doodle: Doodle) {
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
            // We certainly don't want to overwrite anything in local storage.
            // The user should be advised and then may delete manually from local storage.
            const match = matches[0];
            this.doodles.makeCurrent(match);
            copyDoodleToWorkspace(match, this.wsModel, callback);
        }
        else {
            if (owner && repo) {
                this.cloud.downloadTree(owner, repo, 'heads/master')
                    .then((doodle) => {
                        this.doodles.addHead(doodle);
                        this.doodles.updateStorage();
                        copyDoodleToWorkspace(doodle, this.wsModel, callback);
                    }, (reason) => {
                        callback(new Error(`Error attempting to download repository '${repo}':  ${JSON.stringify(reason, null, 2)}`));
                    }, function (/* state */) {
                        // The state is {doneCount: number; todoCount: number}
                    });
            }
            else if (gistId) {
                this.cloud.downloadGist(gistId, (reason: any, doodle: Doodle) => {
                    if (!reason) {
                        this.doodles.addHead(doodle);
                        this.doodles.updateStorage();
                        copyDoodleToWorkspace(doodle, this.wsModel, callback);
                    }
                    else {
                        callback(new Error(`Error attempting to download gist '${gistId}':  ${JSON.stringify(reason, null, 2)}`));
                    }
                });
            }
            else if (roomId) {
                this.roomsService.getRoom(roomId).then((room: RoomAgent) => {
                    room.download((err, edits: { [path: string]: MwEdits }) => {
                        if (!err) {
                            try {
                                const paths = Object.keys(edits);
                                // We'll first mirror the structure of the workspace in the room.
                                // We are expecting Raw edits on every file so every edit is a create.
                                for (let i = 0; i < paths.length; i++) {
                                    const path = paths[i];
                                    if (!this.wsModel.existsFile(path)) {
                                        const newFile = this.wsModel.newFile(path);
                                        this.wsModel.beginDocumentMonitoring(path, function (monitoringError) {
                                            if (!monitoringError) {
                                                // Nothing to do.
                                            }
                                            else {
                                                console.warn(`Unexpected file ${path} in workspace`);
                                            }
                                        });
                                        newFile.release();
                                    }
                                    else {
                                        console.warn(`Unexpected file ${path} in workspace`);
                                    }
                                }
                                this.wsModel.connectToRoom(room, false);
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
                                this.wsModel.updateStorage();
                                callback(void 0);
                            }
                            finally {
                                room.release();
                            }
                        }
                        else {
                            room.release();
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
                    copyDoodleToWorkspace(doodle, this.wsModel, callback);
                }
                else {
                    const doodle = this.doodles.createDoodle();
                    this.doodles.addHead(doodle);
                    this.doodles.updateStorage();
                    copyDoodleToWorkspace(doodle, this.wsModel, callback);
                }
            }
        }
    }
}

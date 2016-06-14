import Background from './Background';
import CloudService from '../../services/cloud/CloudService';
import copyDoodleToWorkspace from '../../mappings/copyDoodleToWorkspace';
import Doodle from '../../services/doodles/Doodle';
import IDoodleManager from '../../services/doodles/IDoodleManager';
import isString from '../../utils/isString';
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
        'wsModel'
    ];
    constructor(
        private cloud: CloudService,
        private doodles: IDoodleManager,
        private wsModel: WsModel) {
        // Do nothing.
    }

    /**
     * Loads the contents of the WsModel from the specified repo, gist, or Local Storage.
     * 
     * @param owner The GitHub account name of the repository owner.
     * @param repo The name of the GitHub repository.
     * @param gistId The identifier of the GitHub Gist.
     */
    loadWsModel(owner: string, repo: string, gistId: string, callback: (err: Error) => any) {
        // If there is a doodle in Local Storage with the specified keys, we load that
        // so as not to trample on any existing work.
        const matches = this.doodles.filter(function(doodle: Doodle) {
            if (isString(owner) && isString(repo)) {
                return doodle.owner === owner && doodle.repo === repo;
            }
            else if (isString(gistId)) {
                return doodle.gistId === gistId;
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
            copyDoodleToWorkspace(match, this.wsModel);
            // We can also assume that we are already in the correct state.
            setTimeout(callback, 0);
        }
        else {
            if (owner && repo) {
                this.cloud.downloadTree(owner, repo, 'heads/master')
                    .then((doodle) => {
                        this.doodles.unshift(doodle);
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
                this.cloud.downloadGist(gistId, (reason: any, doodle: Doodle) => {
                    if (!reason) {
                        this.doodles.unshift(doodle);
                        this.doodles.updateStorage();
                        copyDoodleToWorkspace(doodle, this.wsModel);
                        callback(void 0);
                    }
                    else {
                        callback(new Error(`Error attempting to download gist '${gistId}':  ${JSON.stringify(reason, null, 2)}`));
                    }
                });
            }
            else {
                if (this.doodles.length > 0) {
                    const doodle = this.doodles.current();
                    copyDoodleToWorkspace(doodle, this.wsModel);
                }
                else {
                    const doodle = this.doodles.createDoodle();
                    this.doodles.unshift(doodle);
                    this.doodles.updateStorage();
                    copyDoodleToWorkspace(doodle, this.wsModel);
                }
                setTimeout(callback, 0);
            }
        }
    }
}

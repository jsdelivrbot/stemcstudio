import * as ng from 'angular';
import Doodle from '../doodles/Doodle';
import Gist from '../github/Gist';
import RepoData from '../github/RepoData';
import RepoKey from '../github/RepoKey';
import UploadToRepoFacts from './UploadToRepoFacts';
import WsModel from '../../modules/wsmodel/services/WsModel';

/**
 * A high-level API for managing Doodle(s) in the cloud.
 */
interface CloudService {

    /**
     *
     */
    downloadGist(gistId: string, callback: (reason: any, doodle: Doodle) => void): void;

    /**
     *
     */
    createGist(workspace: WsModel): ng.IHttpPromise<Gist>;

    /**
     *
     */
    updateGist(workspace: WsModel, gistId: string): ng.IHttpPromise<Gist>;

    /**
     *
     */

    /**
     * @param data
     */
    createRepo(data: RepoData): ng.IHttpPromise<RepoKey>;

    /**
     * TODO: Why is there no specification of the branch (commit).
     */
    downloadRepo(owner: string, repo: string, callback: (reason: any, doodle: Doodle) => void): void;
    downloadTree(owner: string, repo: string, ref: string): ng.IPromise<Doodle>;

    /**
     * TODO: This is currently fire-and-forget.
     * TODO: Use an ng.IPromise to provide progress.
     *
     * @param doodle
     * @param owner
     * @param repo
     * @param ref e.g. 'heads/master'
     * @param commitMessage
     */
    uploadToRepo(workspace: WsModel, owner: string, repo: string, ref: string, commitMessage: string, callback: (reason: any, facts: UploadToRepoFacts) => any): void;

    /**
     * @param title Provides the title and human readable context for the modal dialog.
     */
    chooseGistOrRepo(title: string): ng.IPromise<string>;

    /**
     * @param title Provides the title and human readable context for the modal dialog.
     * @param data Provides the defaults.
     */
    repoData(title: string, data: RepoData): ng.IPromise<RepoData>;

    /**
     * @param title Provides the title and human readable context for the modal dialog.
     */
    commitMessage(title: string): ng.IPromise<string>;
}

export default CloudService;

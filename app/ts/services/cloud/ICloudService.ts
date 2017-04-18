import { IHttpPromise, IPromise } from 'angular';
import Doodle from '../doodles/Doodle';
import Gist from '../github/Gist';
import RepoData from '../github/RepoData';
import RepoKey from '../github/RepoKey';
import UploadToRepoFacts from './UploadToRepoFacts';
import WsModel from '../../modules/wsmodel/WsModel';

/**
 * A high-level API for managing Doodle(s) in the cloud.
 */
export interface ICloudService {

    /**
     *
     */
    downloadGist(gistId: string, callback: (reason: any, doodle: Doodle) => void): void;

    /**
     *
     */
    createGist(workspace: WsModel): IHttpPromise<Gist>;

    /**
     *
     */
    updateGist(workspace: WsModel, gistId: string): IHttpPromise<Gist>;

    /**
     *
     */

    /**
     * @param data
     */
    createRepo(data: RepoData): IHttpPromise<RepoKey>;

    /**
     * TODO: Why is there no specification of the branch (commit).
     */
    downloadRepo(owner: string, repo: string, callback: (reason: any, doodle: Doodle) => void): void;
    downloadTree(owner: string, repo: string, ref: string): IPromise<Doodle>;

    /**
     * TODO: This is currently fire-and-forget.
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
    chooseGistOrRepo(title: string): IPromise<string>;

    /**
     * @param title Provides the title and human readable context for the modal dialog.
     * @param data Provides the defaults.
     */
    repoData(title: string, data: RepoData): IPromise<RepoData>;

    /**
     * @param title Provides the title and human readable context for the modal dialog.
     */
    commitMessage(title: string): IPromise<string>;
}

export const CLOUD_SERVICE_UUID = 'cloudService';

import { IPromise } from 'angular';
import Doodle from '../doodles/Doodle';
import { Gist } from '../github/Gist';
import { RepoData } from '../github/RepoData';
import { RepoKey } from '../github/RepoKey';
import UploadToRepoFacts from './UploadToRepoFacts';
import { WsModel } from '../../modules/wsmodel/WsModel';

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
    createGist(workspace: WsModel): Promise<Gist>;

    /**
     *
     */
    updateGist(workspace: WsModel, gistId: string): Promise<Gist>;

    /**
     *
     */

    /**
     * @param data
     */
    createRepo(data: RepoData): Promise<RepoKey>;

    /**
     * TODO: Why is there no specification of the branch (commit).
     */
    downloadRepo(owner: string, repo: string): Promise<Doodle>;
    downloadTree(owner: string, repo: string, ref: string): Promise<Doodle>;

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

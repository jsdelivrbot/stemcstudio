import Doodle from '../doodles/Doodle';
import PatchGistResponse from '../github/PatchGistResponse';
import PostGistResponse from '../github/PostGistResponse';

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
    createGist(doodle: Doodle, callback: (err: any, response: PostGistResponse) => any): void;

    /**
     * 
     */
    updateGist(doodle: Doodle, gistId: string, callback: (err: any, response: PatchGistResponse, status: number) => any);

    /**
     * TODO: Why is there no specification of the branch (commit).
     */
    downloadRepo(owner: string, repo: string, callback: (reason: any, doodle: Doodle) => void);

    /**
     * TODO: This is currently fire-and-forget.
     * TODO: Use an ng.IPromise to provide progress.
     *
     * @method uploadToRepo
     * @param doodle {Doodle}
     * @param owner {string}
     * @param repo {string}
     * @param ref {string} e.g. 'heads/master'
     * @return {void}
     */
    uploadToRepo(doodle: Doodle, owner: string, repo: string, ref: string): void;
}

export default CloudService;

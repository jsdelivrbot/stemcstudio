import Blob from './Blob';
import BlobData from './BlobData';
import BlobKey from './BlobKey';

import Commit from './Commit';
import CommitData from './CommitData';
import CommitKey from './CommitKey';

import Gist from './Gist';
import GistComment from './GistComment';
import GistData from './GistData';

import PathContents from './PathContents';
import PutFileResponse from './PutFileResponse';

import Reference from './Reference';
import ReferenceCreateData from './ReferenceCreateData';
import ReferenceUpdateData from './ReferenceUpdateData';

import Repo from './Repo';
import RepoData from './RepoData';
import RepoElement from './RepoElement';
import RepoKey from './RepoKey';

import Tree from './Tree';
import TreeData from './TreeData';
import TreeKey from './TreeKey';

import GitHubUser from './GitHubUser';

/**
 * The GItHub v3 API.
 * The return type is always (TODO) IHttpPromise because this API runs over HTTPS.
 * (The IHttpPromise maintains, statis, statusText, headers and config in addition to the payload).
 *
 * @class GitHubService
 */
interface GitHubService {
    deleteFile(owner: string, repo: string, path: string, message: string, sha: string, done: (err: any, response: any) => any): void;
    deleteRepo(owner: string, repo: string, done: (err: any, response: any) => any): void;

    /**
     *
     */
    getGists(): ng.IHttpPromise<Gist[]>;

    /**
     * Used for pagination of Gists.
     */
    getGistsPage(href: string): ng.IHttpPromise<Gist[]>;

    /**
     * Returns the contents of a file or directory in the repository.
     */
    getPathContents(owner: string, repo: string, path: string): ng.IPromise<PathContents>;

    /**
     * 
     */
    getRepoContents(owner: string, repo: string, done: (err: any, contents: RepoElement[]) => any): void;
    getUser(): ng.IHttpPromise<GitHubUser>;
    getUserGists(user: string, done: (err: any, response: any) => any): void;
    getUserRepos(done: (err: any, repos: Repo[]) => any): void;

    getGist(gistId: string): ng.IHttpPromise<Gist>;
    createGist(data: GistData): ng.IHttpPromise<Gist>;
    updateGist(gistId: string, data: GistData): ng.IHttpPromise<Gist>;
    deleteGist(gistId: string, done: (err: any, response: any) => any): void;
    getGistComments(gistId: string): ng.IHttpPromise<GistComment[]>;

    /**
     * 
     */
    getRepo(owner: string, repo: string): ng.IHttpPromise<Repo>;

    /**
     * 
     */
    createRepo(data: RepoData): ng.IHttpPromise<RepoKey>;

    putFile(owner: string, repo: string, path: string, message: string, content: string, sha: string): ng.IHttpPromise<PutFileResponse>;

    /**
     * Get a Blob
     * The content in the response will always be Base64 encoded.
     * This API supports blobs up to 100 megabytes in size.
     */
    getBlob(owner: string, repo: string, sha: string): ng.IHttpPromise<Blob>;

    /**
     * Create a Blob
     */
    createBlob(owner: string, repo: string, data: BlobData): ng.IHttpPromise<BlobKey>;

    /**
     * 
     */
    getTree(owner: string, repo: string, sha: string): ng.IHttpPromise<Tree>;

    /**
     * 
     */
    createTree(owner: string, repo: string, tree: TreeData): ng.IHttpPromise<TreeKey>;

    /**
     * 
     */
    getCommit(owner: string, repo: string, sha: string): ng.IHttpPromise<Commit>;

    /**
     * 
     */
    createCommit(owner: string, repo: string, commit: CommitData): ng.IHttpPromise<CommitKey>;

    /**
     * The ref must be formatted as 'heads/branch', not just 'branch'.
     */
    getReference(owner: string, repo: string, ref: string): ng.IHttpPromise<Reference>;

    createReference(owner: string, repo: string, data: ReferenceCreateData): ng.IHttpPromise<Reference>;

    updateReference(owner: string, repo: string, ref: string, data: ReferenceUpdateData): ng.IHttpPromise<Reference>;
}

export default GitHubService;

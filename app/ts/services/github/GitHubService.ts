import * as ng from 'angular';
import Blob from './Blob';
import BlobKey from './BlobKey';
import Commit from './Commit';
import CommitArg from './CommitArg';
import CommitKey from './CommitKey';
import GistData from '../gist/GistData';
import Gist from './Gist';
import PatchGistResponse from './PatchGistResponse';
import PathContents from './PathContents';
import PostGistResponse from './PostGistResponse';
import PutFileResponse from './PutFileResponse';
import Reference from './Reference';
import ReferenceData from './ReferenceData';
import Repo from './Repo';
import RepoElement from './RepoElement';
import Tree from './Tree';
import TreeArg from './TreeArg';
import TreeKey from './TreeKey';
import User from './User';

/**
 * The GItHub v3 API.
 * The return type is always (TODO) IHttpPromise because this API runs over HTTPS.
 * (The IHttpPromise maintains, statis, statusText, headers and config in addition to the payload).
 *
 * @class GitHubService
 */
interface GitHubService {
    deleteFile(owner: string, repo: string, path: string, message: string, sha: string, done: (err: any, response) => any);
    deleteGist(owner: string, gist: string, done: (err: any, response) => any);
    deleteRepo(owner: string, repo: string, done: (err: any, response) => any);
    getGist(gist: string, done: (err: any, gist: Gist) => any);
    /**
     *
     */
    getGists(done: (err: any, gists: Gist[], status: number, headers: ng.IHttpHeadersGetter) => any);
    /**
     * Used for pafination of Gists.
     */
    getGistsPage(href: string, done: (err: any, gists: Gist[], status: number, headers: ng.IHttpHeadersGetter) => any);
    /**
     * Returns the contents of a file or directory in the repository.
     */
    getPathContents(owner: string, repo: string, path: string): ng.IPromise<PathContents>;
    /**
     * 
     */
    getRepoContents(owner: string, repo: string, done: (err: any, contents: RepoElement[]) => any);
    getUser(): ng.IHttpPromise<User>;
    getUserGists(user: string, done: (err: any, response) => any);
    getUserRepos(done: (err: any, repos: Repo[]) => any);
    patchGist(gistId: string, data: GistData, done: (err: any, response: PatchGistResponse, status: number) => any);
    postGist(data: GistData, done: (err: any, response: PostGistResponse) => any);
    postRepo(name: string, description: string, priv: boolean, autoInit: boolean, done: (err: any, response) => any);
    putFile(owner: string, repo: string, path: string, message: string, content: string, sha: string): ng.IHttpPromise<PutFileResponse>;

    /**
     * The ref must be formatted as 'heads/branch', not just 'branch'.
     */
    getReference(owner: string, repo: string, ref: string): ng.IHttpPromise<Reference>;
    getCommit(owner: string, repo: string, sha: string): ng.IHttpPromise<Commit>;
    getTree(owner: string, repo: string, sha: string): ng.IHttpPromise<Tree>;
    getBlob(owner: string, repo: string, sha: string): ng.IHttpPromise<Blob>;
    createBlob(owner: string, repo: string, content: string, encoding: string): ng.IHttpPromise<BlobKey>;
    createTree(owner: string, repo: string, tree: TreeArg): ng.IHttpPromise<TreeKey>;
    createCommit(owner: string, repo: string, commit: CommitArg): ng.IHttpPromise<CommitKey>;
    updateReference(owner: string, repo: string, ref: string, data: ReferenceData): ng.IHttpPromise<Reference>;
}

export default GitHubService;

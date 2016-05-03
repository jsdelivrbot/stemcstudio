import * as ng from 'angular';
import GetGistResponse from './GetGistResponse';
import GistData from '../gist/GistData';
import Gist from './Gist';
import PatchGistResponse from './PatchGistResponse';
import PathContents from './PathContents';
import PostGistResponse from './PostGistResponse';
import Repo from './Repo';
import RepoElement from './RepoElement';
import User from './User';

/**
 * @class GitHubService
 */
interface GitHubService {
    deleteFile(owner: string, repo: string, path: string, message: string, sha: string, done: (err: any, response) => any);
    deleteGist(owner: string, gist: string, done: (err: any, response) => any);
    deleteRepo(owner: string, repo: string, done: (err: any, response) => any);
    getGist(gist: string, done: (err: any, response: GetGistResponse) => any);
    getGists(done: (err: any, gists: Gist[], status: number, headers: ng.IHttpHeadersGetter) => any);
    getGistsPage(href: string, done: (err: any, gists: Gist[], status: number, headers: ng.IHttpHeadersGetter) => any);
    /**
     * Returns the contents of a file or directory in the repository.
     */
    getPathContents(owner: string, repo: string, path: string): ng.IPromise<PathContents>;
    /**
     * 
     */
    getRepoContents(owner: string, repo: string, done: (err: any, contents: RepoElement[]) => any);
    getUser(done: (err: any, user: User) => any);
    getUserGists(user: string, done: (err: any, response) => any);
    getUserRepos(done: (err: any, repos: Repo[]) => any);
    patchGist(gistId: string, data: GistData, done: (err: any, response: PatchGistResponse, status: number) => any);
    postGist(data: GistData, done: (err: any, response: PostGistResponse) => any);
    postRepo(name: string, description: string, priv: boolean, autoInit: boolean, done: (err: any, response) => any);
    putFile(owner: string, repo: string, path: string, message: string, content: string, sha: string, done: (err: any, response) => any);
}

export default GitHubService;

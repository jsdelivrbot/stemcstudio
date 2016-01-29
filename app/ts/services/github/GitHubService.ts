import GetGistResponse from './GetGistResponse';
import GistData from '../gist/GistData';
import Gist from './Gist';
import PatchGistResponse from './PatchGistResponse';
import PostGistResponse from './PostGistResponse';
import Repo from './Repo';
import User from './User';
/**
 * @class GitHubService
 */
interface GitHubService {
    deleteFile(token: string, owner: string, repo: string, path: string, message: string, sha: string, done: (err: any, response, status, headers, config) => any);
    deleteGist(token: string, owner: string, gistId: string, done: (err: any, response, status, headers, config) => any);
    deleteRepo(token: string, owner: string, repo: string, done: (err: any, response, status, headers, config) => any);
    getGist(token: string, gist: string, done: (err: any, response: GetGistResponse, status, headers, config) => any);
    getGists(token: string, done: (err: any, gists: Gist[], status: number, headers, config) => any);
    getGistsPage(token: string, href: string, done: (err: any, gists: Gist[], status: number, headers, config) => any);
    getPathContents(token: string, user: string, repo: string, path: string, done: (err: any, response, status, headers, config) => any);
    getRepoContents(token: string, user: string, repo: string, done: (err: any, response, status, headers, config) => any);
    getUser(token: string, done: (err: any, user: User, status, headers, config) => any);
    getUserGists(token: string, user: string, done: (err: any, response, status, headers, config) => any);
    getUserRepos(token: string, done: (err: any, repos: Repo[], status: number, headers, config) => any);
    patchGist(token: string, gistId: string, data: GistData, done: (err: any, response: PatchGistResponse, status: number, headers, config) => any);
    postGist(token: string, data: GistData, done: (err: any, response: PostGistResponse, status: number, headers, config) => any);
    postRepo(token: string, name: string, description: string, priv: boolean, autoInit: boolean, done: (err: any, response, status, headers, config) => any);
    putFile(token: string, owner: string, repo: string, path: string, message: string, content: string, sha: string, done: (err: any, response, status, headers, config) => any);
}

export default GitHubService;
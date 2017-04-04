import { IHttpPromise, IHttpService, IQService } from 'angular';
import Blob from './Blob';
import BlobData from './BlobData';
import BlobKey from './BlobKey';
import Commit from './Commit';
import CommitData from './CommitData';
import CommitKey from './CommitKey';
import Gist from './Gist';
import GistComment from './GistComment';
import GistData from './GistData';
import isString from '../../utils/isString';
import Repo from './Repo';
import RepoData from './RepoData';
import RepoElement from './RepoElement';
import RepoKey from './RepoKey';
import { IGitHubService } from './IGitHubService';
import { COOKIE_SERVICE_UUID, ICookieService } from '../cookie/ICookieService';
import PathContents from './PathContents';
import PutFileResponse from './PutFileResponse';
import Reference from './Reference';
import ReferenceCreateData from './ReferenceCreateData';
import ReferenceUpdateData from './ReferenceUpdateData';
import Tree from './Tree';
import TreeData from './TreeData';
import TreeKey from './TreeKey';
import GitHubUser from './GitHubUser';
// TODO: Get rid of the underscore dependency.
import { map } from 'underscore';

/**
 * Explicity request the v3 version of the API
 * 
 * https://developer.github.com/v3/#current-version
 */
const ACCEPT_HEADER = "application/vnd.github.v3+json";

/**
 * All access is over HTTPS, and accessed from https://api/github.com
 * 
 * https://developer.github.com/v3/#schema
 */
const GITHUB_PROTOCOL = 'https';
const GITHUB_DOMAIN = 'api.github.com';
const HTTP_METHOD_DELETE = 'DELETE';
const HTTP_METHOD_GET = 'GET';
const HTTP_METHOD_PATCH = 'PATCH';
const HTTP_METHOD_POST = 'POST';
const HTTP_METHOD_PUT = 'PUT';

export class GitHubService implements IGitHubService {
    static $inject = ['$http', '$q', COOKIE_SERVICE_UUID, 'GITHUB_TOKEN_COOKIE_NAME'];
    constructor(private $http: IHttpService, $q: IQService, private cookieService: ICookieService, private GITHUB_TOKEN_COOKIE_NAME: string) {
        //
    }

    /**
     * api.github.com over HTTPS protocol.
     */
    gitHub(): string {
        return `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}`;
    }
    gists(): string {
        return `${this.gitHub()}/gists`;
    }
    repos(): string {
        return `${this.gitHub()}/user/repos`;
    }
    requestHeaders(): { 'Accept': string; 'Authorization'?: string } {
        const token = this.cookieService.getItem(this.GITHUB_TOKEN_COOKIE_NAME);
        const headers: { 'Accept': string; 'Authorization'?: string; } = {
            Accept: ACCEPT_HEADER
        };
        if (token) {
            headers.Authorization = `token ${token}`;
        }
        return headers;
    }

    getUser(): IHttpPromise<GitHubUser> {
        const method = HTTP_METHOD_GET;
        const url = `${this.gitHub()}/user`;
        const headers = this.requestHeaders();
        return this.$http<GitHubUser>({ method, url, headers });
    }
    getUserRepos(done: (err: any, repo: Repo[]) => any) {
        return this.$http({
            method: HTTP_METHOD_GET,
            url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/user/repos",
            headers: this.requestHeaders()
        }).then(function (repos: Repo[]) {
            return done(null, repos);
        }).catch(function (response) {
            return done(new Error(response.message), response);
        });
    }

    getRepo(owner: string, repo: string): IHttpPromise<Repo> {
        if (!isString(owner)) {
            throw new Error("owner must be a string");
        }
        if (!isString(repo)) {
            throw new Error("repo must be a string");
        }
        const method = HTTP_METHOD_GET;
        const url = `${this.gitHub()}/repos/${owner}/${repo}`;
        const headers = this.requestHeaders();
        return this.$http<Repo>({ method, url, headers });
    }

    /**
     * We're using this method in the GitHubCloudService to download a repo.
     */
    getRepoContents(owner: string, repo: string, done: (err: any | undefined, contents?: RepoElement[]) => any) {
        const method = HTTP_METHOD_GET;
        const url = `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}/repos/${owner}/${repo}/contents`;
        // TODO: The GitHUb v3 API lets us specify the name of the commit/branch/tag.
        // The default is the repository default branch, usually master.
        return this.$http({ method, url, headers: this.requestHeaders() })
            .then(function (contents: RepoElement[]) {
                return done(void 0, contents);
            })
            .catch(function (response) {
                return done(new Error(response.message), void 0);
            });
    }
    /**
     * We're using this method in the GitHubCloudService to download a Repo
     */
    getPathContents(owner: string, repo: string, path: string): IHttpPromise<PathContents> {
        const method = HTTP_METHOD_GET;
        const url = `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}/repos/${owner}/${repo}/contents/${path}`;
        // TODO: The GitHUb v3 API lets us specify the name of the commit/branch/tag.
        // The default is the repository default branch, usually master.
        return this.$http<PathContents>({ method, url, headers: this.requestHeaders() });
    }

    /*
    The GitHub API uses the same method (PUT) and URL (/repos/:owner/:repo/contents/:path)
    for creating a file as for updating a file. The key difference is that the update
    requires the blob SHA of the file being replaced. In effect, the existence of the sha
    determines whether the intention is to create a new file or update an existing one.
    */
    putFile(owner: string, repo: string, path: string, message: string, content: string, sha: string): IHttpPromise<PutFileResponse> {
        const method = HTTP_METHOD_PUT;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/contents/${path}`;
        const data = { message, content, sha };
        const headers = this.requestHeaders();
        return this.$http<PutFileResponse>({ method, url, data, headers });
    }
    deleteFile(owner: string, repo: string, path: string, message: string, sha: string, done: (err: any, response: any) => any) {
        const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + owner + "/" + repo + "/contents/" + path;
        const data = {
            message: message,
            sha: sha
        };
        return this.$http({
            method: HTTP_METHOD_DELETE,
            url: url,
            data: data,
            headers: this.requestHeaders()
        }).then(function (file) {
            return done(null, file);
        }).catch(function (response) {
            return done(new Error(response.message), response);
        });
    }
    createRepo(data: RepoData): IHttpPromise<RepoKey> {
        const url = this.repos();
        const method = HTTP_METHOD_POST;
        const headers = this.requestHeaders();
        return this.$http({ method, url: url, data, headers });
    }
    deleteRepo(owner: string, repo: string, done: (reason: Error | null, value: any) => void) {
        const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + owner + "/" + repo;
        return this.$http({
            method: HTTP_METHOD_DELETE,
            url: url,
            headers: this.requestHeaders()
        }).then(function (repo) {
            return done(null, repo);
        }).catch(function (response) {
            return done(new Error(response.message), response);
        });
    }
    getGist(gistId: string): IHttpPromise<Gist> {
        const url = `${this.gists()}/${gistId}`;
        const method = HTTP_METHOD_GET;
        const headers = this.requestHeaders();
        return this.$http<Gist>({ method, url, headers });
    }
    createGist(data: GistData): IHttpPromise<Gist> {
        const url = this.gists();
        const method = HTTP_METHOD_POST;
        const headers = this.requestHeaders();
        return this.$http<Gist>({ method, url, data, headers });
    }
    updateGist(gistId: string, data: GistData): IHttpPromise<Gist> {
        const url = `${this.gists()}/${gistId}`;
        const method = HTTP_METHOD_PATCH;
        const headers = this.requestHeaders();
        return this.$http<Gist>({ method, url, data, headers });
    }
    deleteGist(gistId: string, done: (err: any, response: any) => any) {
        const url = `${this.gists()}/${gistId}`;
        const method = HTTP_METHOD_DELETE;
        const headers = this.requestHeaders();
        return this.$http({ method, url, headers })
            .then(function (response) {
                return done(null, response);
            })
            .catch(function (response) {
                return done(new Error(response.message), response);
            });
    }
    getGistComments(gistId: string): IHttpPromise<GistComment[]> {
        const url = `${this.gists()}/${gistId}/comments`;
        const method = HTTP_METHOD_GET;
        const headers = this.requestHeaders();
        return this.$http({ method, url, headers });
    }
    getUserGists(user: string, done: (reason: Error | null, value: any) => void) {
        return this.$http({
            method: HTTP_METHOD_GET,
            url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/users/" + user + "/gists",
            headers: this.requestHeaders()
        }).then(function (gists: any) {
            gists = map(gists, function (gist: any) {
                return gist;
            });
            return done(null, gists);
        }).catch(function (response) {
            return done(new Error(response.message), response);
        });
    }
    getGists() {
        const url = `${this.gitHub()}/gists`;
        return this.$http<Gist[]>({ method: HTTP_METHOD_GET, url: url, headers: this.requestHeaders() });
    }
    getGistsPage(url: string) {
        return this.$http<Gist[]>({ method: HTTP_METHOD_GET, url: url, headers: this.requestHeaders() });
    }
    getReference(owner: string, repo: string, ref: string): IHttpPromise<Reference> {
        const method = HTTP_METHOD_GET;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/refs/${ref}`;
        const headers = this.requestHeaders();
        return this.$http<Reference>({ method, url, headers });
    }
    getCommit(owner: string, repo: string, sha: string): IHttpPromise<Commit> {
        const method = HTTP_METHOD_GET;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/commits/${sha}`;
        const headers = this.requestHeaders();
        return this.$http<Commit>({ method, url, headers });
    }
    getTree(owner: string, repo: string, sha: string): IHttpPromise<Tree> {
        const method = HTTP_METHOD_GET;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/trees/${sha}`;
        const headers = this.requestHeaders();
        return this.$http<Tree>({ method, url, headers });
    }
    getBlob(owner: string, repo: string, sha: string): IHttpPromise<Blob> {
        const method = HTTP_METHOD_GET;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/blobs/${sha}`;
        const headers = this.requestHeaders();
        return this.$http<Blob>({ method, url, headers });
    }
    createBlob(owner: string, repo: string, data: BlobData): IHttpPromise<BlobKey> {
        const method = HTTP_METHOD_POST;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/blobs`;
        const headers = this.requestHeaders();
        return this.$http({ method, url, data, headers });
    }
    createTree(owner: string, repo: string, data: TreeData): IHttpPromise<TreeKey> {
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/trees`;
        return this.$http({
            method: HTTP_METHOD_POST,
            url: url,
            data: data,
            headers: this.requestHeaders()
        });
    }
    createCommit(owner: string, repo: string, data: CommitData): IHttpPromise<CommitKey> {
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/commits`;
        return this.$http({
            method: HTTP_METHOD_POST,
            url: url,
            data: data,
            headers: this.requestHeaders()
        });
    }
    createReference(owner: string, repo: string, data: ReferenceCreateData): IHttpPromise<Reference> {
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/refs`;
        return this.$http({
            method: HTTP_METHOD_POST,
            url: url,
            data: data,
            headers: this.requestHeaders()
        });
    }
    updateReference(owner: string, repo: string, ref: string, data: ReferenceUpdateData): IHttpPromise<Reference> {
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/refs/${ref}`;
        return this.$http({
            method: HTTP_METHOD_PATCH,
            url: url,
            data: data,
            headers: this.requestHeaders()
        });
    }
}

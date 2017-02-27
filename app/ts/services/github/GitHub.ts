import * as ng from 'angular';
import app from '../../app';
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
import GitHubService from './GitHubService';
import CookieService from '../cookie/CookieService';
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
import * as _ from 'underscore';

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

app.factory('GitHub', ['$http', '$q', 'cookie', 'GITHUB_TOKEN_COOKIE_NAME',
    function ($http: ng.IHttpService, $q: ng.IQService, cookie: CookieService, GITHUB_TOKEN_COOKIE_NAME: string): GitHubService {

        /**
         * api.github.com over HTTPS protocol.
         */
        function gitHub(): string {
            return `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}`;
        }
        function gists(): string {
            return `${gitHub()}/gists`;
        }
        function repos(): string {
            return `${gitHub()}/user/repos`;
        }
        function requestHeaders(): { 'Accept': string; 'Authorization'?: string } {
            const token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
            const headers: { 'Accept': string; 'Authorization'?: string; } = {
                Accept: ACCEPT_HEADER
            };
            if (token) {
                headers.Authorization = `token ${token}`;
            }
            return headers;
        }
        return {
            getUser: function (): ng.IHttpPromise<GitHubUser> {
                const method = HTTP_METHOD_GET;
                const url = `${gitHub()}/user`;
                const headers = requestHeaders();
                return $http<GitHubUser>({ method, url, headers });
            },
            getUserRepos: function (done: (err: any, repo: Repo[]) => any) {
                return $http({
                    method: HTTP_METHOD_GET,
                    url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/user/repos",
                    headers: requestHeaders()
                }).then(function (repos: Repo[]) {
                    return done(null, repos);
                }).catch(function (response) {
                    return done(new Error(response.message), response);
                });
            },
            getRepo(owner: string, repo: string): ng.IHttpPromise<Repo> {
                if (!isString(owner)) {
                    throw new Error("owner must be a string");
                }
                if (!isString(repo)) {
                    throw new Error("repo must be a string");
                }
                const method = HTTP_METHOD_GET;
                const url = `${gitHub()}/repos/${owner}/${repo}`;
                const headers = requestHeaders();
                return $http<Repo>({ method, url, headers });
            },

            /**
             * We're using this method in the GitHubCloudService to download a repo.
             */
            getRepoContents: function (owner: string, repo: string, done: (err: any | undefined, contents?: RepoElement[]) => any) {
                const method = HTTP_METHOD_GET;
                const url = `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}/repos/${owner}/${repo}/contents`;
                // TODO: The GitHUb v3 API lets us specify the name of the commit/branch/tag.
                // The default is the repository default branch, usually master.
                return $http({ method, url, headers: requestHeaders() })
                    .then(function (contents: RepoElement[]) {
                        return done(void 0, contents);
                    })
                    .catch(function (response) {
                        return done(new Error(response.message), void 0);
                    });
            },
            /**
             * We're using this method in the GitHubCloudService to download a Repo
             */
            getPathContents: function (owner: string, repo: string, path: string): ng.IHttpPromise<PathContents> {
                const method = HTTP_METHOD_GET;
                const url = `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}/repos/${owner}/${repo}/contents/${path}`;
                // TODO: The GitHUb v3 API lets us specify the name of the commit/branch/tag.
                // The default is the repository default branch, usually master.
                return $http<PathContents>({ method, url, headers: requestHeaders() });
            },

            /*
            The GitHub API uses the same method (PUT) and URL (/repos/:owner/:repo/contents/:path)
            for creating a file as for updating a file. The key difference is that the update
            requires the blob SHA of the file being replaced. In effect, the existence of the sha
            determines whether the intention is to create a new file or update an existing one.
            */
            putFile: function (owner: string, repo: string, path: string, message: string, content: string, sha: string): ng.IHttpPromise<PutFileResponse> {
                const method = HTTP_METHOD_PUT;
                const url = `${gitHub()}/repos/${owner}/${repo}/contents/${path}`;
                const data = { message, content, sha };
                const headers = requestHeaders();
                return $http<PutFileResponse>({ method, url, data, headers });
            },
            deleteFile: function (owner: string, repo: string, path: string, message: string, sha: string, done: (err: any, response: any) => any) {
                const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + owner + "/" + repo + "/contents/" + path;
                const data = {
                    message: message,
                    sha: sha
                };
                return $http({
                    method: HTTP_METHOD_DELETE,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                }).then(function (file) {
                    return done(null, file);
                }).catch(function (response) {
                    return done(new Error(response.message), response);
                });
            },
            createRepo: function (data: RepoData): ng.IHttpPromise<RepoKey> {
                const url = repos();
                const method = HTTP_METHOD_POST;
                const headers = requestHeaders();
                return $http({ method, url: url, data, headers });
            },
            deleteRepo: function (owner, repo, done) {
                const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + owner + "/" + repo;
                return $http({
                    method: HTTP_METHOD_DELETE,
                    url: url,
                    headers: requestHeaders()
                }).then(function (repo) {
                    return done(null, repo);
                }).catch(function (response) {
                    return done(new Error(response.message), response);
                });
            },
            getGist: function (gistId: string): ng.IHttpPromise<Gist> {
                const url = `${gists()}/${gistId}`;
                const method = HTTP_METHOD_GET;
                const headers = requestHeaders();
                return $http<Gist>({ method, url, headers });
            },
            createGist: function (data: GistData): ng.IHttpPromise<Gist> {
                const url = gists();
                const method = HTTP_METHOD_POST;
                const headers = requestHeaders();
                return $http<Gist>({ method, url, data, headers });
            },
            updateGist: function (gistId: string, data: GistData): ng.IHttpPromise<Gist> {
                const url = `${gists()}/${gistId}`;
                const method = HTTP_METHOD_PATCH;
                const headers = requestHeaders();
                return $http<Gist>({ method, url, data, headers });
            },
            deleteGist: function (gistId: string, done: (err: any, response: any) => any) {
                const url = `${gists()}/${gistId}`;
                const method = HTTP_METHOD_DELETE;
                const headers = requestHeaders();
                return $http({ method, url, headers })
                    .then(function (response) {
                        return done(null, response);
                    })
                    .catch(function (response) {
                        return done(new Error(response.message), response);
                    });
            },
            getGistComments: function (gistId: string): ng.IHttpPromise<GistComment[]> {
                const url = `${gists()}/${gistId}/comments`;
                const method = HTTP_METHOD_GET;
                const headers = requestHeaders();
                return $http({ method, url, headers });
            },
            getUserGists: function (user: string, done) {
                return $http({
                    method: HTTP_METHOD_GET,
                    url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/users/" + user + "/gists",
                    headers: requestHeaders()
                }).then(function (gists: any) {
                    gists = _.map(gists, function (gist: any) {
                        return gist;
                    });
                    return done(null, gists);
                }).catch(function (response) {
                    return done(new Error(response.message), response);
                });
            },
            getGists: function () {
                const url = `${gitHub()}/gists`;
                return $http<Gist[]>({ method: HTTP_METHOD_GET, url: url, headers: requestHeaders() });
            },
            getGistsPage: function (url: string) {
                return $http<Gist[]>({ method: HTTP_METHOD_GET, url: url, headers: requestHeaders() });
            },
            getReference: function (owner: string, repo: string, ref: string): ng.IHttpPromise<Reference> {
                const method = HTTP_METHOD_GET;
                const url = `${gitHub()}/repos/${owner}/${repo}/git/refs/${ref}`;
                const headers = requestHeaders();
                return $http<Reference>({ method, url, headers });
            },
            getCommit: function (owner: string, repo: string, sha: string): ng.IHttpPromise<Commit> {
                const method = HTTP_METHOD_GET;
                const url = `${gitHub()}/repos/${owner}/${repo}/git/commits/${sha}`;
                const headers = requestHeaders();
                return $http<Commit>({ method, url, headers });
            },
            getTree: function (owner: string, repo: string, sha: string): ng.IHttpPromise<Tree> {
                const method = HTTP_METHOD_GET;
                const url = `${gitHub()}/repos/${owner}/${repo}/git/trees/${sha}`;
                const headers = requestHeaders();
                return $http<Tree>({ method, url, headers });
            },
            getBlob: function (owner: string, repo: string, sha: string): ng.IHttpPromise<Blob> {
                const method = HTTP_METHOD_GET;
                const url = `${gitHub()}/repos/${owner}/${repo}/git/blobs/${sha}`;
                const headers = requestHeaders();
                return $http<Blob>({ method, url, headers });
            },
            createBlob(owner: string, repo: string, data: BlobData): ng.IHttpPromise<BlobKey> {
                const method = HTTP_METHOD_POST;
                const url = `${gitHub()}/repos/${owner}/${repo}/git/blobs`;
                const headers = requestHeaders();
                return $http({ method, url, data, headers });
            },
            createTree(owner: string, repo: string, data: TreeData): ng.IHttpPromise<TreeKey> {
                const url = `${gitHub()}/repos/${owner}/${repo}/git/trees`;
                return $http({
                    method: HTTP_METHOD_POST,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                });
            },
            createCommit(owner: string, repo: string, data: CommitData): ng.IHttpPromise<CommitKey> {
                const url = `${gitHub()}/repos/${owner}/${repo}/git/commits`;
                return $http({
                    method: HTTP_METHOD_POST,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                });
            },
            createReference(owner: string, repo: string, data: ReferenceCreateData): ng.IHttpPromise<Reference> {
                const url = `${gitHub()}/repos/${owner}/${repo}/git/refs`;
                return $http({
                    method: HTTP_METHOD_POST,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                });
            },
            updateReference(owner: string, repo: string, ref: string, data: ReferenceUpdateData): ng.IHttpPromise<Reference> {
                const url = `${gitHub()}/repos/${owner}/${repo}/git/refs/${ref}`;
                return $http({
                    method: HTTP_METHOD_PATCH,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                });
            }
        };
    }
]);

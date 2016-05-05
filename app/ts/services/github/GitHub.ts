import * as ng from 'angular';
import app from '../../app';
import Blob from './Blob';
import BlobKey from './BlobKey';
import Commit from './Commit';
import CommitArg from './CommitArg';
import CommitKey from './CommitKey';
import Gist from './Gist';
import Repo from './Repo';
import RepoElement from './RepoElement';
import GitHubService from './GitHubService';
import GistData from '../gist/GistData';
import CookieService from '../cookie/CookieService';
import PatchGistResponse from './PatchGistResponse';
import PathContents from './PathContents';
import PostGistResponse from './PostGistResponse';
import PutFileResponse from './PutFileResponse';
import Reference from './Reference';
import ReferenceData from './ReferenceData';
import Tree from './Tree';
import TreeArg from './TreeArg';
import TreeKey from './TreeKey';
import User from './User';
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
    function($http: angular.IHttpService, $q: ng.IQService, cookie: CookieService, GITHUB_TOKEN_COOKIE_NAME: string): GitHubService {

        /**
         * api.github.com over HTTPS protocol.
         */
        function gitHub(): string {
            return `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}`;
        }
        function requestHeaders(): { 'Accept': string; 'Authorization'?: string } {
            const token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)
            const headers: { 'Accept': string; 'Authorization'?: string; } = {
                Accept: ACCEPT_HEADER
            }
            if (token) {
                headers.Authorization = `token ${token}`
            }
            return headers
        }
        function getGistsPage(url: string, done: (err: any, response: Gist[], status: number, headers) => any) {
            return $http({ method: HTTP_METHOD_GET, url: url, headers: requestHeaders() })
                .success(function(gists: Gist[], status: number, headers, config) {
                    return done(null, gists, status, headers);
                })
                .error(function(response, status: number, headers, config) {
                    if (response && response.message) {
                        return done(new Error(response.message), response, status, headers);
                    }
                    else {
                        return done(new Error("Invalid response from GitHub."), response, status, headers);
                    }
                });
        }

        return {
            getUser: function(): ng.IHttpPromise<User> {
                const method = HTTP_METHOD_GET;
                const url = `${gitHub()}/user`;
                const headers = requestHeaders();
                return $http<User>({ method, url, headers });
            },
            getUserRepos: function(done: (err: any, repo: Repo[]) => any) {
                return $http({
                    method: HTTP_METHOD_GET,
                    url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/user/repos",
                    headers: requestHeaders()
                }).success(function(response, status, headers, config) {
                    const repos = _.map(response, function(repo: any) {
                        return new Repo(repo.name, repo.description, repo.language, repo.html_url);
                    });
                    return done(null, repos);
                }).error(function(response, status, headers, config) {
                    return done(new Error(response.message), response);
                });
            },
            getRepoContents: function(user: string, repo: string, done: (err: any, contents: RepoElement[]) => any) {
                const method = HTTP_METHOD_GET
                const url = `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}/repos/${user}/${repo}/contents`
                return $http({ method, url, headers: requestHeaders() })
                    .success(function(contents: RepoElement[], status, headers, config) {
                        return done(void 0, contents);
                    })
                    .error(function(response, status, headers, config) {
                        return done(new Error(response.message), void 0);
                    });
            },
            getPathContents: function(owner: string, repo: string, path: string): ng.IPromise<PathContents> {
                const method = HTTP_METHOD_GET
                const url = `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}/repos/${owner}/${repo}/contents/${path}`;
                const deferred = $q.defer<PathContents>()
                $http({ method, url, headers: requestHeaders() })
                    .success(function(response: PathContents, status, headers, config) {
                        deferred.resolve(response)
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(new Error(response.message))
                    });
                return deferred.promise;
            },

            /*
            The GitHub API uses the same method (PUT) and URL (/repos/:owner/:repo/contents/:path)
            for creating a file as for updating a file. The key difference is that the update
            requires the blob SHA of the file being replaced. In effect, the existence of the sha
            determines whether the intention is to create a new file or update an existing one.
            */
            putFile: function(owner: string, repo: string, path: string, message: string, content: string, sha: string): ng.IHttpPromise<PutFileResponse> {
                const method = HTTP_METHOD_PUT
                const url = `${gitHub()}/repos/${owner}/${repo}/contents/${path}`
                const data = { message, content, sha }
                const headers = requestHeaders()
                return $http<PutFileResponse>({ method, url, data, headers });
            },
            deleteFile: function(owner: string, repo: string, path: string, message: string, sha: string, done: (err: any, response) => any) {
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
                }).success(function(file, status, headers, config) {
                    return done(null, file);
                }).error(function(response, status, headers, config) {
                    return done(new Error(response.message), response);
                });
            },
            postRepo: function(name, description, priv, autoInit, done: (err: any, response: any) => any) {
                const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/user/repos";
                const data = {
                    name: name,
                    description: description,
                    "private": priv,
                    auto_init: autoInit
                };
                return $http({
                    method: HTTP_METHOD_POST,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                }).success(function(repo, status, headers, config) {
                    return done(null, repo);
                }).error(function(response, status, headers, config) {
                    return done(new Error(response.message), response);
                });
            },
            deleteRepo: function(owner, repo, done) {
                const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + owner + "/" + repo;
                return $http({
                    method: HTTP_METHOD_DELETE,
                    url: url,
                    headers: requestHeaders()
                }).success(function(repo, status, headers, config) {
                    return done(null, repo);
                }).error(function(response, status, headers, config) {
                    return done(new Error(response.message), response);
                });
            },
            getGist: function(id: string, done: (err: any, response: Gist) => any) {
                const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists/" + id;
                return $http({
                    "method": HTTP_METHOD_GET,
                    "url": url,
                    "headers": requestHeaders()
                }).success(function(contents: Gist, status, headers, config) {
                    return done(null, contents);
                }).error(function(response, status, headers, config) {
                    return done(new Error(response.message), response);
                });
            },
            patchGist: function(gistId: string, data: GistData, done: (err: any, response: PatchGistResponse, status: number) => any) {
                const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists/" + gistId;
                return $http({
                    method: HTTP_METHOD_PATCH,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                }).success(function(response: PatchGistResponse, status: number, headers, config) {
                    return done(null, response, status);
                }).error(function(response, status, headers, config) {
                    return done(new Error(response.message), response, status);
                });
            },
            postGist: function(data: GistData, done: (err: any, response: PostGistResponse) => any) {
                const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists";
                return $http({
                    method: HTTP_METHOD_POST,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                }).success(function(response: PostGistResponse, status, headers, config) {
                    return done(null, response);
                }).error(function(response, status, headers, config) {
                    if (response && response.message) {
                        return done(new Error(response.message), response);
                    }
                    else {
                        return done(new Error("Invalid response from GitHub."), response);
                    }
                });
            },
            deleteGist: function(owner: string, gist: string, done: (err: any, response) => any) {
                const url = `${gitHub()}/gists/${gist}`;
                return $http({
                    method: HTTP_METHOD_DELETE,
                    url: url,
                    headers: requestHeaders()
                }).success(function(response, status, headers, config) {
                    return done(null, response);
                }).error(function(response, status, headers, config) {
                    return done(new Error(response.message), response);
                });
            },
            getUserGists: function(user: string, done) {
                return $http({
                    method: HTTP_METHOD_GET,
                    url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/users/" + user + "/gists",
                    headers: requestHeaders()
                }).success(function(gists: any, status, headers, config) {
                    gists = _.map(gists, function(gist: any) {
                        return gist;
                    });
                    return done(null, gists, status, headers, config);
                }).error(function(response, status, headers, config) {
                    return done(new Error(response.message), response, status, headers, config);
                });
            },
            getGists: function(done: (err: any, response: Gist[], status: number, headers) => any) {
                const url = `${gitHub()}/gists`;
                return getGistsPage(url, done);
            },
            getGistsPage: function(url: string, done: (err: any, response: Gist[], status: number, headers) => any) {
                return getGistsPage(url, done);
            },
            getReference: function(owner: string, repo: string, ref: string): ng.IHttpPromise<Reference> {
                const method = HTTP_METHOD_GET
                const url = `${gitHub()}/repos/${owner}/${repo}/git/refs/${ref}`
                const headers = requestHeaders()
                return $http<Reference>({ method, url, headers });
            },
            getCommit: function(owner: string, repo: string, sha: string): ng.IHttpPromise<Commit> {
                const method = HTTP_METHOD_GET
                const url = `${gitHub()}/repos/${owner}/${repo}/git/commits/${sha}`
                const headers = requestHeaders()
                return $http<Commit>({ method, url, headers });
            },
            getTree: function(owner: string, repo: string, sha: string): ng.IHttpPromise<Tree> {
                const method = HTTP_METHOD_GET
                const url = `${gitHub()}/repos/${owner}/${repo}/git/trees/${sha}`
                const headers = requestHeaders()
                return $http<Tree>({ method, url, headers });
            },
            getBlob: function(owner: string, repo: string, sha: string): ng.IHttpPromise<Blob> {
                const method = HTTP_METHOD_GET
                const url = `${gitHub()}/repos/${owner}/${repo}/git/blobs/${sha}`
                const headers = requestHeaders()
                return $http<Blob>({ method, url, headers });
            },
            createBlob(owner: string, repo: string, content: string, encoding: string): ng.IHttpPromise<BlobKey> {
                const url = `${gitHub()}/repos/${owner}/${repo}/git/blobs`;
                const data = { content, encoding };
                return $http({
                    method: HTTP_METHOD_POST,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                });
            },
            createTree(owner: string, repo: string, data: TreeArg): ng.IHttpPromise<TreeKey> {
                const url = `${gitHub()}/repos/${owner}/${repo}/git/trees`;
                return $http({
                    method: HTTP_METHOD_POST,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                });
            },
            createCommit(owner: string, repo: string, data: CommitArg): ng.IHttpPromise<CommitKey> {
                const url = `${gitHub()}/repos/${owner}/${repo}/git/commits`;
                return $http({
                    method: HTTP_METHOD_POST,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                });
            },
            updateReference(owner: string, repo: string, ref: string, data: ReferenceData): ng.IHttpPromise<Reference> {
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

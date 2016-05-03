import * as ng from 'angular';
import app from '../../app';
import Gist from './Gist';
import Repo from './Repo';
import RepoElement from './RepoElement';
import User from './User';
import GetGistResponse from './GetGistResponse';
import GitHubUser from './GitHubUser';
import GitHubService from './GitHubService';
import GistData from '../gist/GistData';
import CookieService from '../cookie/CookieService';
import PatchGistResponse from './PatchGistResponse';
import PathContents from './PathContents';
import PostGistResponse from './PostGistResponse';
// TODO: Get rid of the underscore dependency.
import * as _ from 'underscore';

const GITHUB_PROTOCOL = 'https';
const GITHUB_DOMAIN = 'api.github.com';
const HTTP_METHOD_DELETE = 'DELETE';
const HTTP_METHOD_GET = 'GET';
const HTTP_METHOD_PATCH = 'PATCH';
const HTTP_METHOD_POST = 'POST';
const HTTP_METHOD_PUT = 'PUT';
const ACCEPT_HEADER = "application/vnd.github.v3+json";

app.factory('GitHub', ['$http', '$q', 'cookie', 'GITHUB_TOKEN_COOKIE_NAME',
    function($http: angular.IHttpService, $q: ng.IQService, cookie: CookieService, GITHUB_TOKEN_COOKIE_NAME: string): GitHubService {

        /**
         * api.github.com over HTTPS protocol.
         */
        function gitHub(): string {
            return `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}`;
        }
        function requestHeaders(): { Accept?: string; Authorization?: string } {
            const token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME)
            if (token) {
                return { Accept: ACCEPT_HEADER, Authorization: `token ${token}` }
            }
            else {
                return {}
            }
        }
        function getGistsPage(url: string, done: (err: any, response: Gist[], status: number, headers) => any) {
            return $http({ method: HTTP_METHOD_GET, url: url, headers: requestHeaders() })
                .success(function(gists: Gist[], status: number, headers, config) {
                    // Hypermedia Links...
                    // console.log(headers('link'));
                    gists = _.map(gists, function(gist: Gist) {
                        return new Gist(gist.id, gist.description, gist["public"], gist.files, gist.html_url);
                    });
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
            getUser: function(done: (err: any, user: User) => any) {
                return $http({
                    method: HTTP_METHOD_GET,
                    url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/user",
                    headers: requestHeaders()
                }).success(function(user: GitHubUser, status, headers, config) {
                    return done(null, new User(user.name, user.login, user.avatar_url));
                }).error(function(response, status, headers, config) {
                    if (response && response.message) {
                        return done(new Error(response.message), response);
                    }
                    else {
                        return done(new Error("Invalid response from GitHub."), void 0);
                    }
                });
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
            putFile: function(owner: string, repo: string, path: string, message: string, content: string, sha: string, done: (err, file) => any) {
                const url = `${gitHub()}/repos/${owner}/${repo}/contents/${path}`
                const data = {
                    //                  path: path, // I don't think this is needed (wasn't in geometryzen).
                    message: message,
                    content: content,
                    sha: sha
                    //                  branch: 'master'    // This should default to master anyway.
                }
                console.log(`putFile(${owner}, ${repo}, ${path}) data => ${JSON.stringify(data)}`)
                return $http({
                    method: HTTP_METHOD_PUT,
                    url: url,
                    data: data,
                    headers: requestHeaders()
                }).success(function(file, status, headers, config) {
                    return done(null, file);
                }).error(function(response, status, headers, config) {
                    return done(new Error(response.message), response);
                });
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
            getGist: function(id: string, done: (err: any, response: GetGistResponse) => any) {
                const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists/" + id;
                return $http({
                    "method": HTTP_METHOD_GET,
                    "url": url,
                    "headers": requestHeaders()
                }).success(function(contents: GetGistResponse, status, headers, config) {
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
            }
        };
    }
]);

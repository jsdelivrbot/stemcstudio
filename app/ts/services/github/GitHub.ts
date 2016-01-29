import app from '../../app';
import Gist from './Gist';
import Repo from './Repo';
import User from './User';
import GetGistResponse from './GetGistResponse';
import GitHubUser from './GitHubUser';
import GitHubService from './GitHubService';
import GistData from '../gist/GistData';
import PatchGistResponse from './PatchGistResponse';
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

app.factory('GitHub', ['$http', function($http: angular.IHttpService): GitHubService {

    return {
        getUser: function(token: string, done: (err: any, user: User, status: number, headers, config) => any) {
            var headers;
            headers = token ? {
                Accept: ACCEPT_HEADER,
                Authorization: "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_GET,
                url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/user",
                headers: headers
            }).success(function(user: GitHubUser, status, headers, config) {
                return done(null, new User(user.name, user.login), status, headers, config);
            }).error(function(response, status, headers, config) {
                if (response && response.message) {
                    return done(new Error(response.message), response, status, headers, config);
                }
                else {
                    return done(new Error("Invalid response from GitHub."), response, status, headers, config);
                }
            });
        },
        getUserRepos: function(token: string, done: (err: any, repo: Repo[], status: number, headers, config) => any) {
            var headers;
            headers = token ? {
                Accept: ACCEPT_HEADER,
                Authorization: "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_GET,
                url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/user/repos",
                headers: headers
            }).success(function(response, status, headers, config) {
                const repos = _.map(response, function(repo: any) {
                    return new Repo(repo.name, repo.description, repo.language, repo.html_url);
                });
                return done(null, repos, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        getRepoContents: function(token: string, user: string, repo: string, done: (err: any, contents, status: number, headers, config) => any) {
            var url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + user + "/" + repo + "/contents";
            return $http({
                "method": HTTP_METHOD_GET,
                "url": url,
                "headers": {
                    Accept: ACCEPT_HEADER,
                    Authorization: "token " + token
                }
            }).success(function(contents, status, headers, config) {
                return done(void 0, contents, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), void 0, status, headers, config);
            });
        },
        getPathContents: function(token: string, user: string, repo: string, path: string, done: (err: any, contents, status, headers, config) => any) {
            var headers, url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + user + "/" + repo + "/contents";
            if (path) {
                url = "" + url + "/" + path;
            }
            headers = token ? {
                Accept: ACCEPT_HEADER,
                Authorization: "token " + token
            } : {};
            return $http({
                "method": HTTP_METHOD_GET,
                "url": url,
                "headers": headers
            }).success(function(contents, status, headers, config) {
                return done(null, contents, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },

        /*
        The GitHub API uses the same method (PUT) and URL (/repos/:owner/:repo/contents/:path)
        for Creating a file as for updating a file. The key difference is that the update
        requires the blob SHA of the file being replaced. In effect, the existence of the sha
        determines whether the intention is to create a new file or update and existing one.
        */
        putFile: function(token: string, owner: string, repo: string, path: string, message: string, content: string, sha: string, done: (err, file, status, headers, config) => any) {
            var data, headers, url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + owner + "/" + repo + "/contents/" + path;
            data = {
                message: message,
                content: content
            };
            if (sha) {
                data.sha = sha;
            }
            headers = token ? {
                Accept: ACCEPT_HEADER,
                Authorization: "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_PUT,
                url: url,
                data: data,
                headers: headers
            }).success(function(file, status, headers, config) {
                return done(null, file, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        deleteFile: function(token: string, owner: string, repo: string, path: string, message: string, sha: string, done: (err: any, response, status, headers, config) => any) {
            var data, url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + owner + "/" + repo + "/contents/" + path;
            data = {
                message: message,
                sha: sha
            };
            return $http({
                method: HTTP_METHOD_DELETE,
                url: url,
                data: data,
                headers: {
                    Accept: ACCEPT_HEADER,
                    Authorization: "token " + token
                }
            }).success(function(file, status, headers, config) {
                return done(null, file, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        postRepo: function(token, name, description, priv, autoInit, done) {
            var data, headers, url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/user/repos";
            data = {
                name: name,
                description: description,
                "private": priv,
                auto_init: autoInit
            };
            headers = token ? {
                Accept: ACCEPT_HEADER,
                Authorization: "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_POST,
                url: url,
                data: data,
                headers: headers
            }).success(function(repo, status, headers, config) {
                return done(null, repo, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        deleteRepo: function(token, owner, repo, done) {
            var url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + owner + "/" + repo;
            return $http({
                method: HTTP_METHOD_DELETE,
                url: url,
                headers: {
                    Accept: ACCEPT_HEADER,
                    Authorization: "token " + token
                }
            }).success(function(repo, status, headers, config) {
                return done(null, repo, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        getGist: function(token: string, id: string, done: (err: any, response: GetGistResponse, status: number, headers, config) => any) {
            var headers, url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists/" + id;
            headers = token ? {
                Accept: ACCEPT_HEADER,
                Authorization: "token " + token
            } : {};
            return $http({
                "method": HTTP_METHOD_GET,
                "url": url,
                "headers": headers
            }).success(function(contents: GetGistResponse, status, headers, config) {
                return done(null, contents, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        patchGist: function(token: string, gistId: string, data: GistData, done: (err: any, response: PatchGistResponse, status: number, headers, config) => any) {
            var headers, url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists/" + gistId;
            headers = token ? {
                Accept: ACCEPT_HEADER,
                Authorization: "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_PATCH,
                url: url,
                data: data,
                headers: headers
            }).success(function(response: PatchGistResponse, status: number, headers, config) {
                return done(null, response, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        postGist: function(token: string, data: GistData, done: (err: any, response: PostGistResponse, status: number, headers, config) => any) {
            var headers, url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists";
            headers = token ? {
                Accept: ACCEPT_HEADER,
                Authorization: "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_POST,
                url: url,
                data: data,
                headers: headers
            }).success(function(response: PostGistResponse, status, headers, config) {
                return done(null, response, status, headers, config);
            }).error(function(response, status, headers, config) {
                if (response && response.message) {
                    return done(new Error(response.message), response, status, headers, config);
                }
                else {
                    return done(new Error("Invalid response from GitHub."), response, status, headers, config);
                }
            });
        },
        deleteGist: function(token: string, owner: string, id: string, done: (err: any, response, status, headers, config) => any) {
            var url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists/" + id;
            return $http({
                method: HTTP_METHOD_DELETE,
                url: url,
                headers: {
                    Accept: ACCEPT_HEADER,
                    Authorization: "token " + token
                }
            }).success(function(response, status, headers, config) {
                return done(null, response, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        getUserGists: function(token: string, user: string, done) {
            var headers;
            headers = token ? {
                Accept: ACCEPT_HEADER,
                Authorization: "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_GET,
                url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/users/" + user + "/gists",
                headers: headers
            }).success(function(gists: any, status, headers, config) {
                gists = _.map(gists, function(gist: any) {
                    return gist;
                });
                return done(null, gists, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        getGists: function(token: string, done: (err: any, response: Gist[], status: number, headers, config) => any) {
            var headers;
            headers = token ? {
                Accept: ACCEPT_HEADER,
                Authorization: "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_GET,
                url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists",
                headers: headers
            }).success(function(gists: Gist[], status, headers, config) {
                gists = _.map(gists, function(gist: Gist) {
                    return new Gist(gist.id, gist.description, gist["public"], gist.files, gist.html_url);
                });
                return done(null, gists, status, headers, config);
            }).error(function(response, status, headers, config) {
                if (response && response.message) {
                    return done(new Error(response.message), response, status, headers, config);
                }
                else {
                    return done(new Error("Invalid response from GitHub."), response, status, headers, config);
                }
            });
        }
    };
}
]);

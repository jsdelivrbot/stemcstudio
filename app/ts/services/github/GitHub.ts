import app from '../../app';
import Gist from './Gist';
import Repo from './Repo';
import User from './User';
import GitHubUser from './GitHubUser';
// TODO: Get rid of the underscore dependency.
import * as _ from 'underscore';

const GITHUB_PROTOCOL = 'https';
const GITHUB_DOMAIN = 'api.github.com';
const HTTP_METHOD_DELETE = 'DELETE';
const HTTP_METHOD_GET = 'GET';
const HTTP_METHOD_PATCH = 'PATCH';
const HTTP_METHOD_POST = 'POST';
const HTTP_METHOD_PUT = 'PUT';

app.factory('GitHub', ['$http', function($http: angular.IHttpService) {

    return {
        getUser: function(token, done) {
            var headers;
            headers = token ? {
                "Authorization": "token " + token
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
        getUserRepos: function(token, done) {
            var headers;
            headers = token ? {
                "Authorization": "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_GET,
                url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/user/repos",
                headers: headers
            }).success(function(repos: any, status, headers, config) {
                repos = _.map(repos, function(repo: any) {
                    return new Repo(repo.name, repo.description, repo.language, repo.html_url);
                });
                return done(null, repos, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        getRepoContents: function(token, user, repo, done) {
            var url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + user + "/" + repo + "/contents";
            return $http({
                "method": HTTP_METHOD_GET,
                "url": url,
                "headers": {
                    Authorization: "token " + token
                }
            }).success(function(contents, status, headers, config) {
                return done(null, contents, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        getPathContents: function(token, user, repo, path, done) {
            var headers, url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + user + "/" + repo + "/contents";
            if (path) {
                url = "" + url + "/" + path;
            }
            headers = token ? {
                "Authorization": "token " + token
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

        putFile: function(token, owner, repo, path, message, content, sha, done) {
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
                "Authorization": "token " + token
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
        deleteFile: function(token, owner, repo, path, message, sha, done) {
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
                "Authorization": "token " + token
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
                    Authorization: "token " + token
                }
            }).success(function(repo, status, headers, config) {
                return done(null, repo, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        getGist: function(token, id, done) {
            var headers, url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists/" + id;
            headers = token ? {
                "Authorization": "token " + token
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
        patchGist: function(token, gistId, data, done) {
            var headers, url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists/" + gistId;
            headers = token ? {
                "Authorization": "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_PATCH,
                url: url,
                data: data,
                headers: headers
            }).success(function(file, status, headers, config) {
                return done(null, file, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        postGist: function(token, data, done) {
            var headers, url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists";
            headers = token ? {
                "Authorization": "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_POST,
                url: url,
                data: data,
                headers: headers
            }).success(function(response, status, headers, config) {
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
        deleteGist: function(token, owner, id, done) {
            var url;
            url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists/" + id;
            return $http({
                method: HTTP_METHOD_DELETE,
                url: url,
                headers: {
                    Authorization: "token " + token
                }
            }).success(function(response, status, headers, config) {
                return done(null, response, status, headers, config);
            }).error(function(response, status, headers, config) {
                return done(new Error(response.message), response, status, headers, config);
            });
        },
        getUserGists: function(token, user, done) {
            var headers;
            headers = token ? {
                "Authorization": "token " + token
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
        getGists: function(token: string, done: (err, response, status, headers, config) => any) {
            var headers;
            headers = token ? {
                "Authorization": "token " + token
            } : {};
            return $http({
                method: HTTP_METHOD_GET,
                url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists",
                headers: headers
            }).success(function(gists: any, status, headers, config) {
                gists = _.map(gists, function(gist: any) {
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

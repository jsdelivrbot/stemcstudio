/// <reference path="../../../../typings/angularjs/angular.d.ts" />
module mathdoodle {
  export class User {
    public name: string;
    public login: string;
    constructor(name: string, login: string) {
      this.name = name;
      this.login = login;
    }
  }
  export interface GitHubUser {
    name: string;
    login: string;
  }
}

angular.module('app').factory('GitHub', [
  '$http',
  '_',
  function(
    $http: angular.IHttpService,
    _
  ) {
    var GITHUB_DOMAIN, GITHUB_PROTOCOL, Gist, HTTP_METHOD_DELETE, HTTP_METHOD_GET, HTTP_METHOD_PATCH, HTTP_METHOD_POST, HTTP_METHOD_PUT, Repo, User;
    GITHUB_PROTOCOL = 'https';
    GITHUB_DOMAIN = 'api.github.com';
    HTTP_METHOD_DELETE = 'DELETE';
    HTTP_METHOD_GET = 'GET';
    HTTP_METHOD_PATCH = 'PATCH';
    HTTP_METHOD_POST = 'POST';
    HTTP_METHOD_PUT = 'PUT';
    Gist = (function() {
      function Gist(id, description, isPublic, files, html_url) {
        this.id = id;
        this.description = description;
        this["public"] = isPublic;
        this.files = files;
        this.html_url = html_url;
      }

      return Gist;

    })();
    Repo = (function() {
      function Repo(name, description, language, html_url) {
        this.name = name;
        this.description = description;
        this.language = language;
        this.html_url = html_url;
      }

      return Repo;

    })();
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
        }).success(function(user: mathdoodle.GitHubUser, status, headers, config) {
          return done(null, new mathdoodle.User(user.name, user.login), status, headers, config);
        }).error(function(response, status, headers, config) {
          return done(new Error(response.message), response, status, headers, config);
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
        }).success(function(repos, status, headers, config) {
          repos = _.map(repos, function(repo) {
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
          return done(new Error(response.message), response, status, headers, config);
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
        }).success(function(gists, status, headers, config) {
          gists = _.map(gists, function(gist) {
            return gist;
          });
          return done(null, gists, status, headers, config);
        }).error(function(response, status, headers, config) {
          return done(new Error(response.message), response, status, headers, config);
        });
      },
      getGists: function(token, done) {
        var headers;
        headers = token ? {
          "Authorization": "token " + token
        } : {};
        return $http({
          method: HTTP_METHOD_GET,
          url: "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/gists",
          headers: headers
        }).success(function(gists, status, headers, config) {
          console.log;
          gists = _.map(gists, function(gist) {
            return new Gist(gist.id, gist.description, gist["public"], gist.files, gist.html_url);
          });
          return done(null, gists, status, headers, config);
        }).error(function(response, status, headers, config) {
          return done(new Error(response.message), response, status, headers, config);
        });
      }
    };
  }
]);

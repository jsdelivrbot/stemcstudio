/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="IGitHubAuthManager.ts" />
/// <reference path="IGitHubItem.ts" />
/// <reference path="../cookie/CookieService.ts" />

angular.module('app').service('GitHubAuthManager', [
  '$http',
  '$location',
  '$window',
  'cookie',
  'GitHub',
  'githubKey',
  function(
    $http: angular.IHttpService,
    $location: angular.ILocationService,
    $window: angular.IWindowService,
    cookie: CookieService,
    github,
    githubKey: string
  ) {

    var GATEKEEPER_DOMAIN = "" + ($location.protocol()) + "://" + ($location.host()) + ":" + ($location.port());
    var GITHUB_TOKEN_COOKIE_NAME = 'github-token';
    var GITHUB_LOGIN_COOKIE_NAME = 'github-login';

    var handleGitHubLoginCallback = function(done) {
      var ghItem = <IGitHubItem>JSON.parse($window.localStorage.getItem(githubKey));
      if (ghItem) {
        $window.localStorage.removeItem(githubKey);
        var code = ghItem.oauth.code;
        $http.get("" + GATEKEEPER_DOMAIN + "/authenticate/" + code)
        .success(function(data:{token:string}, status, headers, config) {
          var token;
          token = data.token;
          cookie.setItem(GITHUB_TOKEN_COOKIE_NAME, token);
          github.getUser(token, function(error, user) {
            if (!error) {
              cookie.setItem(GITHUB_LOGIN_COOKIE_NAME, user.login);
              done(null, token);
            }
            else {
              done(new Error("Unable to retrieve your user information."));
            }
          });
        })
        .error(function(data, status, headers, config) {
          done(new Error("Unable to retrieve your authentication token."));
        });
      }
      else {

      }
    };
    var handleLoginCallback = function(done) {
      var match = $window.location.href.match(/\?code=([a-z0-9]*)/);
      if (match) {
        $location.search({});
        var code = match[1];
        $http.get("" + GATEKEEPER_DOMAIN + "/authenticate/" + code)
        .success(function(data:{token:string}, status, headers, config) {
          var token;
          token = data.token;
          cookie.setItem(GITHUB_TOKEN_COOKIE_NAME, token);
          github.getUser(token, function(error, user) {
            if (!error) {
              cookie.setItem(GITHUB_LOGIN_COOKIE_NAME, user.login);
              done(null, token);
            }
            else {
              done(new Error("Unable to retrieve your user information."));
            }
          });
        })
        .error(function(data, status, headers, config) {
          done(new Error("Unable to retrieve your authentication token."));
        });
      }
      else if ($window.location.href.match(/\?error=access_denied/)) {
        $location.search({});
      }
    };
    var api: IGitHubAuthManager = {
      handleGitHubLoginCallback: handleGitHubLoginCallback,
      handleLoginCallback: handleLoginCallback
    };
    return api;
  }
]);

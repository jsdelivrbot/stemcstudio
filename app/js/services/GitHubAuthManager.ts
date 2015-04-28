/// <reference path="../../../typings/angularjs/angular.d.ts" />
var module = angular.module('app');

module.service('GitHubAuthManager', ['$http', '$location', '$window', 'cookie', 'GitHub', function($http, $location, $window, cookie, github) {
    var handleLoginCallback = function(done) {
      var GATEKEEPER_DOMAIN, GITHUB_LOGIN_COOKIE_NAME, GITHUB_TOKEN_COOKIE_NAME, code, match;
      GATEKEEPER_DOMAIN = "" + ($location.protocol()) + "://" + ($location.host()) + ":" + ($location.port());
      GITHUB_TOKEN_COOKIE_NAME = 'github-token';
      GITHUB_LOGIN_COOKIE_NAME = 'github-login';
      match = $window.location.href.match(/\?code=([a-z0-9]*)/);
      if (match) {
        $location.search({});
        code = match[1];
        return $http.get("" + GATEKEEPER_DOMAIN + "/authenticate/" + code).success(function(data, status, headers, config) {
          var token;
          token = data.token;
          cookie.setItem(GITHUB_TOKEN_COOKIE_NAME, token);
          return github.getUser(token, function(error, user) {
            if (!error) {
              cookie.setItem(GITHUB_LOGIN_COOKIE_NAME, user.login);
              return done(null, token);
            } else {
              return done(new Error("Unable to retrieve your user information."));
            }
          });
        }).error(function(data, status, headers, config) {
          return done(new Error("Unable to retrieve your authentication token."));
        });
      } else if ($window.location.href.match(/\?error=access_denied/)) {
        return $location.search({});
      }
    };
    return {
      handleLoginCallback: handleLoginCallback
    };
  }
]);

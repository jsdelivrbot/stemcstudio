/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../typings/google-analytics/ga.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../services/cookie/cookie.ts" />
/// <reference path="../services/gham/IGitHubItem.ts" />

module doodle.login {
  export interface LoginScope extends angular.IScope {
    githubLogin(label?: string, value?: number): void;
  }
}

(function(module) {

  module.controller('LoginController', [
    '$scope',
    '$state',
    '$window',
    'cookie',
    'uuid4',
    'ga',
    'githubKey',
    function(
      $scope: doodle.login.LoginScope,
      $state: angular.ui.IStateService,
      $window: angular.IWindowService,
      cookie: ICookieService,
      uuid4: IUuidService,
      ga: UniversalAnalytics.ga,
      githubKey: string
    ) {

      // The name of this cookie must correspond with the cookie sent back from the server.
      var GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'mathdoodle-github-application-client-id';
      var GITHUB_TOKEN_COOKIE_NAME = 'github-token';
      var GITHUB_LOGIN_COOKIE_NAME = 'github-login';
      var GITHUB_GET_LOGIN_OAUTH_AUTHORIZE = "https://github.com/login/oauth/authorize";

      $scope.githubLogin = function(label?: string, value?: number) {
        ga('send', 'event', 'GitHub', 'login', label, value);
        // This is the beginning of the Web Application Flow for GitHub OAuth2.
        // The API now allows us to specify an unguessable random string called 'state'.
        // This 'state' string is used to protect against cross-site request forgery attacks.
        var clientId = cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME)

        var state = uuid4.generate();
        var githubURL = GITHUB_GET_LOGIN_OAUTH_AUTHORIZE +
        "?client_id=" + clientId +
        "&amp;scope=user,gist" +
        "&amp;state=" + state;

        var github: IGitHubItem = {oauth: {pending: state}};

        $window.localStorage.setItem(githubKey, JSON.stringify(github));

        $window.location.href = githubURL;
      };
    }
  ]);

})(angular.module('app'));

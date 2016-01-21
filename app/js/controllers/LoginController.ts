/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../typings/google-analytics/ga.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../services/cookie/CookieService.ts" />
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
      cookie: CookieService,
      uuid4: IUuidService,
      ga: UniversalAnalytics.ga,
      githubKey: string
    ) {

      // The name of this cookie must correspond with the cookie sent back from the server.
      const GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'mathdoodle-github-application-client-id';
      const GITHUB_TOKEN_COOKIE_NAME = 'github-token';
      const GITHUB_LOGIN_COOKIE_NAME = 'github-login';
      const GITHUB_GET_LOGIN_OAUTH_AUTHORIZE = "https://github.com/login/oauth/authorize";

      $scope.githubLogin = function(label?: string, value?: number) {
        ga('send', 'event', 'GitHub', 'login', label, value);
        // This is the beginning of the Web Application Flow for GitHub OAuth2.
        // The API now allows us to specify an unguessable random string called 'state'.
        // This 'state' string is used to protect against cross-site request forgery attacks.
        const clientId = cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME);

        const state = uuid4.generate();
        const githubURL = GITHUB_GET_LOGIN_OAUTH_AUTHORIZE +
        "?client_id=" + clientId +
        "&amp;scope=user,gist" +
        "&amp;state=" + state;

        const github: IGitHubItem = {oauth: {pending: state}};

        $window.localStorage.setItem(githubKey, JSON.stringify(github));

        $window.location.href = githubURL;
      };
    }
  ]);

})(angular.module('app'));

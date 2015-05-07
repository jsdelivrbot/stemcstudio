/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../typings/google-analytics/ga.d.ts" />
/// <reference path="typings/AppScope.ts" />
/// <reference path="services/cookie/cookie.ts" />
/// <reference path="services/gham/IGitHubItem.ts" />
/// <reference path="services/uuid/IUuidService.ts" />
angular.module('app',
[
  'ui.router',
  'ngAnimate',
  'davinci.mathscript',
  'ui.bootstrap',
  'ui.bootstrap.modal',
  'pascalprecht.translate',
  'jQuery',
  'underscore',
  'uuid4',
  'google-analytics'
])
.run([
  '$rootScope',
  '$state',
  '$stateParams',
  '$window',
  'cookie',
  'uuid4',
  'ga',
  'githubKey',
  function(
    $rootScope: AppScope,
    $state: angular.ui.IStateService,
    $stateParams: angular.ui.IStateParams,
    $window: Window,
    cookie: ICookieService,
    uuid4: IUuidService,
    ga: UniversalAnalytics.ga,
    githubKey: string
  ) {

  // The name of this cookie must correspond with the cookie sent back from the server.
  var GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'davincidoodle-github-application-client-id';
  var GITHUB_TOKEN_COOKIE_NAME = 'github-token';
  var GITHUB_LOGIN_COOKIE_NAME = 'github-login';
  var GITHUB_GET_LOGIN_OAUTH_AUTHORIZE = "https://github.com/login/oauth/authorize";

  // It's very handy to add references to $state and $stateParams to the $rootScope
  // so that you can access them from any scope (HTML template) within the application.
  // For example,
  // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
  // to active whenever 'contacts.list' or one of its decendents is active.
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  // If we don't specify where to go we'll get a blank screen!
  //$state.transitionTo('home');

  // The server drops this cookie so that we can make the GitHub autorization request.
  $rootScope.clientId = function() {
    return cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME);
  };

  $rootScope.log = function(thing) {
    console.log(thing);
  };

  $rootScope.alert = function(thing) {
    alert(thing);
  };

  $rootScope.login = function(label?: string, value?: number) {
    ga('send', 'event', 'GitHub', 'login', label, value);
    // This is the beginning of the Web Application Flow for GitHub OAuth2.
    // The API now allows us to specify an unguessable random string called 'state'.
    // This 'state' string is used to protect against cross-site request forgery attacks.
    var clientId = cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME)

    var pending = uuid4.generate();
    var githubURL = GITHUB_GET_LOGIN_OAUTH_AUTHORIZE +
    "?client_id=" + clientId +
    "&amp;scope=user,gist" +
    "&amp;state=" + pending;

    // We effectively reset the GitHub property.
    var github: IGitHubItem = {oauth: {pending: pending}};
    $window.localStorage.setItem(githubKey, JSON.stringify(github));
    // Begin the GET request to GitHub.
    $window.location.href = githubURL;
  };

  $rootScope.logout = function(label?: string, value?: number) {
    ga('send', 'event', 'GitHub', 'logout', label, value);
    cookie.removeItem(GITHUB_TOKEN_COOKIE_NAME);
    cookie.removeItem(GITHUB_LOGIN_COOKIE_NAME);
  };

  $rootScope.isLoggedIn = function() {
    return cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME);
  };

  $rootScope.userLogin = function() {
    return cookie.getItem(GITHUB_LOGIN_COOKIE_NAME);
  };

}]);

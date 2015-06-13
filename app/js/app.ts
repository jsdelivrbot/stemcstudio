/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../typings/bootstrap-dialog/bootstrap-dialog.d.ts" />
/// <reference path="../../typings/google-analytics/ga.d.ts" />
/// <reference path="services/cookie/cookie.ts" />
/// <reference path="services/gham/IGitHubItem.ts" />
/// <reference path="services/uuid/IUuidService.ts" />
module mathdoodle {
  export interface IAppScope extends angular.IRootScopeService {
    $state: angular.ui.IStateService;
    $stateParams: angular.ui.IStateParams;
    log: (thing) => void;
    alert: (thing) => void;

    clientId: () => string;
    isLoggedIn(): boolean;
    login(): void;
    logout(): void;
    userLogin(): string;
  }
}

angular.module('app',
[
  'davinci.mathscript',
  'google-analytics',
  'twitter-widgets',
  'jQuery',
  'ngAnimate',
  'ngMdIcons',
  'pascalprecht.translate',
  'ui.bootstrap',
  'ui.bootstrap.modal',
  'ui.router', // <= We're using Angular UI Router
  'underscore',
  'uuid4'
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
    $rootScope: mathdoodle.IAppScope,
    $state: angular.ui.IStateService,
    $stateParams: angular.ui.IStateParams,
    $window: Window,
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

  // It's very handy to add references to $state and $stateParams to the $rootScope
  // so that you can access them from any scope (HTML template) within the application.
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  // Doing this twice is a hack for Firefox. It may not be required anymore.
  $window.applicationCache.addEventListener('updateready', function(e: Event) {
    $rootScope.$apply(function() {
    });
  }, false);
  $window.onload = function() {
    $window.applicationCache.addEventListener('updateready', function(e:Event) {
      if ($window.applicationCache.status === $window.applicationCache.UPDATEREADY) {
        BootstrapDialog.show({
          type: BootstrapDialog.TYPE_SUCCESS,
          title: $("<h3>Upload Ready</h3>"),
          message: "A new version of mathdoodle is available. Would you like me to reload now?",
          closable: false,
          closeByBackdrop: false,
          closeByKeyboard: false,
          buttons: [
          {
            label: "Yes",
            cssClass: 'btn btn-primary',
            action: function(dialog) {
              $window.location.reload();
              dialog.close();
            }
          },
          {
            label: "No",
            cssClass: 'btn',
            action: function(dialog) {
              dialog.close();
            }
          }
          ]
        });
      }
      else {
        // Manifest didn't changed. Nothing new to server.
      }
    }, false);
  };
  $window.applicationCache.addEventListener('checking', function(e: Event) {
    $rootScope.$apply(function() {
    });
  }, false);
  $window.applicationCache.addEventListener('noupdate', function(e: Event) {
    $rootScope.$apply(function() {
    });
  }, false);
  $window.applicationCache.addEventListener('downloading', function(e: Event) {
    $rootScope.$apply(function() {
    });
  }, false);
  $window.applicationCache.addEventListener('progress', function(e: Event) {
    $rootScope.$apply(function() {
    });
  }, false);
  $window.applicationCache.addEventListener('cached', function(e: Event) {
    $rootScope.$apply(function() {
    });
  }, false);
  $window.applicationCache.addEventListener('obsolete', function(e: Event) {
    $rootScope.$apply(function() {
    });
  }, false);
  $window.applicationCache.addEventListener('error', function(e: Event) {
    $rootScope.$apply(function() {
    });
  }, false);

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

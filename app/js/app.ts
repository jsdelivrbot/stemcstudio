/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/google-analytics/ga.d.ts" />
/// <reference path="typings/AppScope.ts" />
/// <reference path="typings/cookie.ts" />
var app = angular.module('app', ['ngResource', 'ngRoute', 'davinci.mathscript', 'underscore', 'uuid4', 'google-analytics']);

app.run(['$rootScope', '$window', 'cookie', 'ga', function(rootScope: AppScope, $window: Window, cookie: ICookieService, ga: UniversalAnalytics.ga) {

  // The name of this cookie must correspond with the cookie sent back from the server.
  var GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME = 'davincidoodle-github-application-client-id';
  var GITHUB_TOKEN_COOKIE_NAME = 'github-token';
  var GITHUB_LOGIN_COOKIE_NAME = 'github-login';

  // The server drops this cookie so that we can make the GitHub autorization request.
  rootScope.clientId = function() {
    return cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME);
  };

  rootScope.log = function(thing) {
    console.log(thing);
  };

  rootScope.alert = function(thing) {
    alert(thing);
  };

  rootScope.login = function(label?: string, value?: number) {
    ga('send', 'event', 'GitHub', 'login', label, value);
    // This is the beginning of the Web Application Flow for GitHub OAuth2.
    // TODO: The API now allows us to specify an unguessable random string called 'state'.
    // This 'state' string is used to protect against cross-site request forgery attacks.
    var clientId = cookie.getItem(GITHUB_APPLICATION_CLIENT_ID_COOKIE_NAME)
    $window.location.href = "https://github.com/login/oauth/authorize?client_id=" + clientId + "&amp;scope=repo,user,gist"
  };

  rootScope.logout = function(label?: string, value?: number) {
    ga('send', 'event', 'GitHub', 'login', label, value);
    cookie.removeItem(GITHUB_TOKEN_COOKIE_NAME);
    cookie.removeItem(GITHUB_LOGIN_COOKIE_NAME);
  };

  rootScope.isLoggedIn = function() {
    return cookie.hasItem(GITHUB_TOKEN_COOKIE_NAME);
  };

  rootScope.userLogin = function() {
    return cookie.getItem(GITHUB_LOGIN_COOKIE_NAME);
  };

}]);

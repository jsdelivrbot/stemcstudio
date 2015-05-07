/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-ui-router/angular-ui-router.d.ts" />
angular.module('app')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function(
      $stateProvider: angular.ui.IStateProvider,
      $urlRouterProvider: angular.ui.IUrlRouterProvider) {

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'login.html',
        controller: 'LoginController'
      })
      .state('secure', {
        url: '/secure',
        templateUrl: 'secure.html',
        controller: 'SecureController'
      })
      .state('home',  {
        url: '/home',
        templateUrl: 'home.html',
        controller: 'HomeController'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'about.html',
        controller: 'AboutController'
      });

    $urlRouterProvider.otherwise('/home');
}]);
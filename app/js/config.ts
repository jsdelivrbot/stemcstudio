/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-ui-router/angular-ui-router.d.ts" />
angular.module('app')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function(
      $stateProvider: angular.ui.IStateProvider,
      $urlRouterProvider: angular.ui.IUrlRouterProvider
    ) {

    $stateProvider
      .state('home',  {
        url: '/home',
        templateUrl: 'home.html',
        controller: 'home-controller'
      })
      .state('new',  {
        url: '/new',
        templateUrl: 'new.html',
        controller: 'new-controller'
      })
      .state('open',  {
        url: '/open',
        templateUrl: 'open.html',
        controller: 'open-controller'
      })
      .state('copy',  {
        url: '/copy',
        templateUrl: 'copy.html',
        controller: 'copy-controller'
      })
      .state('properties', {
        url: '/properties',
        templateUrl: function($stateParams: angular.ui.IStateParams) {
          return 'properties.html';
        },
        controllerProvider: function(
          $stateParams: angular.ui.IStateParams) {
          return 'properties-controller';
        }
      })
      .state('download',  {
        url: '/download',
        templateUrl: 'download.html',
        controller: 'download-controller'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'about.html',
        controller: 'about-controller'
      });

    $urlRouterProvider.otherwise('/home');
}]);
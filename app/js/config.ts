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
      .state('about', {
        url: '/about',
        templateUrl: 'about.html',
        controller: 'about-controller'
      });

    $urlRouterProvider.otherwise('/home');
}]);
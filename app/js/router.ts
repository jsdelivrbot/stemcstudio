/// <reference path="../../typings/angularjs/angular.d.ts" />
var app = angular.module('app');

app.config(['$routeProvider', '$locationProvider', function(routeProvider, locationProvider: angular.ILocationProvider) {

  // Hashbang Mode is actually the AngularJS default mode. Explicit is better than implicit...
  locationProvider.html5Mode(false).hashPrefix('!');

  routeProvider.when('/', {templateUrl: 'home.html', controller: 'HomeController'});
  routeProvider.when('/shares/:share', {templateUrl: 'home.html', controller: 'HomeController'});

  routeProvider.otherwise({redirectTo: '/'});
}]);

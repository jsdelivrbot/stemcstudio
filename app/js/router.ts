/// <reference path="../../typings/angularjs/angular.d.ts" />
var app = angular.module('app');

app.config(['$routeProvider', '$locationProvider', function(routeProvider, locationProvider: angular.ILocationProvider) {
  locationProvider.html5Mode(true);

  routeProvider.when('/', {templateUrl: 'home.html', controller: 'HomeController'});
  routeProvider.when('/gists/:gistId', {templateUrl: 'home.html', controller: 'HomeController'});

  routeProvider.otherwise({redirectTo: '/'});
}]);

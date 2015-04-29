/// <reference path="../../../typings/angularjs/angular.d.ts" />
var mod = angular.module('google-analytics', [])

mod.factory('ga', ['$window', function($window: any) {
  // https://github.com/panrafal/angular-ga/blob/master/ga.js
  var ga = function() {
    if (angular.isArray(arguments[0])) {
      for(var i = 0; i < arguments.length; ++i) {
        ga.apply(this, arguments[i]);
      }
      return;
    }
    if ($window.ga) {
      $window.ga.apply(this, arguments);
    }
  };
  return ga;
}]);
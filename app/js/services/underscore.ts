/// <reference path="../../../typings/angularjs/angular.d.ts" />
angular.module('underscore', []).factory('_', [
  '$window',
  function($window: angular.IWindowService) {
    return $window['_'];
  }
]);
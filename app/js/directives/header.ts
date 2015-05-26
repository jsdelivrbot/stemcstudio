/// <reference path="../../../typings/angularjs/angular.d.ts" />
angular.module('app')
.directive('mathdoodleHeader', function() {
  return {
    restrict : 'E',
    scope: {},
    templateUrl: 'header.html'
  };
});
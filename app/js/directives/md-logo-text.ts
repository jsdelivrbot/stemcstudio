/// <reference path="../../../typings/angularjs/angular.d.ts" />
angular.module('app')
.directive('mdLogoText', function() {
  return {
    restrict : 'E',
    templateUrl: 'md-logo-text.html'
  };
});
/// <reference path="../../../typings/angularjs/angular.d.ts" />
angular.module('jQuery', []).factory('$', ['$window', function($window: any) {return $window.$;}]);
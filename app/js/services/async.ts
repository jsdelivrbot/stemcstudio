/// <reference path="../../../typings/angularjs/angular.d.ts" />
'use strict';
angular.module('async', []).factory('async', ['$window', ($window: angular.IWindowService) => { return $window['async'] }]);
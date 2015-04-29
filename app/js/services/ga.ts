/// <reference path="../../../typings/angularjs/angular.d.ts" />
angular.module('google-analytics', []).factory('ga', ['$window', function(wnd: any) {return wnd.ga;}]);
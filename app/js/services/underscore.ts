/// <reference path="../../../typings/angularjs/angular.d.ts" />
angular.module('underscore', []).factory('_', ['$window', function(wnd: any) {return wnd._;}]);
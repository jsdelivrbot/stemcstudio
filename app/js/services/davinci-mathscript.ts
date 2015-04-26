/// <reference path="../../../typings/angularjs/angular.d.ts" />
angular.module('davinci.mathscript', []).factory('mathscript', ['$window', function(wnd: any) {return wnd.Ms;}]);
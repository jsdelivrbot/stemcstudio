/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="AppScope.ts" />
var app = angular.module('app', ['ngResource', 'ngRoute', 'davinci.mathscript', 'underscore']);

app.run(['$rootScope', function(rootScope: AppScope) {

    rootScope.log = function(thing) { console.log(thing) };

    rootScope.alert = function(thing) { alert(thing) };
}]);

/// <reference path="../../typings/angularjs/angular.d.ts" />
var app = angular.module('app', ['ngResource', 'ngRoute']);

app.run(function($rootScope) {

    $rootScope.log = function(thing) { console.log(thing) };

    $rootScope.alert = function(thing) { alert(thing) };
});

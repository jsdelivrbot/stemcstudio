/// <reference path="../../../typings/angularjs/angular.d.ts" />
var app = angular.module('app');

app.controller('HomeController', ['$scope', function($scope) {
    $scope.title = "Home";
}]);
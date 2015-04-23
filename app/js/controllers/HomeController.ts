/// <reference path="../../../typings/angularjs/angular.d.ts" />
var app = angular.module('app');

var TEXT_CODE_HIDE = "Hide Code";
var TEXT_CODE_SHOW = "Show Code";

app.controller('HomeController', ['$scope', function($scope) {

  $scope.isCodeVisible = true;
  $scope.toggleText = TEXT_CODE_HIDE;

  $scope.toggleMode = function() {
    $scope.isCodeVisible = !$scope.isCodeVisible;
    $scope.toggleText = $scope.isCodeVisible ? TEXT_CODE_HIDE : TEXT_CODE_SHOW;
  };

}]);
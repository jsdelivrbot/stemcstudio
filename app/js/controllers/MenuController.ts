/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../IHomeScope.ts" />
var app = angular.module('app');

interface IMenuScope extends IHomeScope {
    isOpenEnabled: () => boolean;
}

app.controller('MenuController', ['$scope', function(scope: IMenuScope) {

  scope.isOpenEnabled = function() {
      return scope.documents.length > 0;
  }

}]);

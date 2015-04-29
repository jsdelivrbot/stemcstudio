/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../typings/IHomeScope.ts" />
var app = angular.module('app');

interface IShareScope extends IHomeScope {
  name: string;
  doClose: () => void;
}

app.controller('ShareController', ['$scope', function(scope: IShareScope) {
  
  var d: any = document.getElementById('share-dialog');
  var dialog: HTMLDialogElement = d;

  scope.doClose = function() {
    dialog.close();
  };

}]);

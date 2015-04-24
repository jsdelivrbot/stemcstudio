/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../IOpenParameters.ts" />
var app = angular.module('app');

interface IOpenScope extends angular.IScope {
  doCancel: () => void;
  doOpen: (fileName: string) => void;
  doDelete: (fileName: string) => void;
}

app.controller('OpenController', ['$scope', function(scope: IOpenScope) {
  
  var d: any = document.getElementById('open-dialog');
  var dialog: HTMLDialogElement = d;

  scope.doOpen = function(fileName: string) {
    var response: IOpenParameters = {fileName: fileName, byeBye: false};
    dialog.close(JSON.stringify(response));
  }

  scope.doDelete = function(fileName: string) {
    var response: IOpenParameters = {fileName: fileName, byeBye: true};
    dialog.close(JSON.stringify(response));
  }

  scope.doCancel = function() {
    dialog.close("");
  };

}]);

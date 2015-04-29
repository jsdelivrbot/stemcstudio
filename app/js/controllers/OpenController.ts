/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../IOpenParameters.ts" />
var app = angular.module('app');

interface IOpenScope extends angular.IScope {
  doCancel: () => void;
  doOpen: (uuid: string) => void;
  doDelete: (uuid: string) => void;
}

app.controller('OpenController', ['$scope', function(scope: IOpenScope) {
  
  var d: any = document.getElementById('open-dialog');
  var dialog: HTMLDialogElement = d;

  scope.doOpen = function(uuid: string) {
    var response: IOpenParameters = {uuid: uuid, byeBye: false};
    dialog.close(JSON.stringify(response));
  }

  scope.doDelete = function(uuid: string) {
    var response: IOpenParameters = {uuid: uuid, byeBye: true};
    dialog.close(JSON.stringify(response));
  }

  scope.doCancel = function() {
    dialog.close("");
  };

}]);

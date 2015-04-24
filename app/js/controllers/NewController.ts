/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../INewParameters.ts" />
var app = angular.module('app');

interface INewScope extends angular.IScope {
  name: string;
  doOK: () => void;
  doCancel: () => void;
}

app.controller('NewController', ['$scope', function(scope: INewScope) {
  
  var d: any = document.getElementById('new-dialog');
  var dialog: HTMLDialogElement = d;

  // Note: This happens when the controller initializes, not when the dialog is shown.
  scope.name = "";

  scope.doOK = function() {
    var response: INewParameters = {name: scope.name, templateName: ""};
    dialog.close(JSON.stringify(response));
  };

  scope.doCancel = function() {
    dialog.close("");
  };

}]);

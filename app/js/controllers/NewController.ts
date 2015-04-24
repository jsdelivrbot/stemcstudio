/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../INewParameters.ts" />
/// <reference path="../IHomeScope.ts" />
var app = angular.module('app');

interface INewScope extends IHomeScope {
  name: string;
  template: ICodeInfo;
  doOK: () => void;
  doCancel: () => void;
}

app.controller('NewController', ['$scope', function(scope: INewScope) {
  
  var d: any = document.getElementById('new-dialog');
  var dialog: HTMLDialogElement = d;

  // Note: This happens when the controller initializes, not when the dialog is shown.
  scope.name = "";
  scope.template = scope.templates[0];

  scope.doOK = function() {
    var response: INewParameters = {name: scope.name, template: scope.template};
    var returnValue: string = JSON.stringify(response);
    dialog.close(returnValue);
  };

  scope.doCancel = function() {
    dialog.close("");
  };

}]);

/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../INewParameters.ts" />
/// <reference path="../typings/IHomeScope.ts" />

interface INewScope extends IHomeScope {
  description: string;
  template: IDoodle;
  doOK: () => void;
  doCancel: () => void;
}

angular.module('app').controller('NewController', ['$scope', function(scope: INewScope) {
  
  var d: any = document.getElementById('new-dialog');
  var dialog: HTMLDialogElement = d;

  // Note: This happens when the controller initializes, not when the dialog is shown.
  scope.description = "";
  scope.template = scope.templates[0];

  scope.doOK = function() {
    var response: INewParameters = {description: scope.description, template: scope.template};
    var returnValue: string = JSON.stringify(response);
    dialog.close(returnValue);
  };

  scope.doCancel = function() {
    dialog.close("");
  };

}]);

/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../typings/IDoodleParameters.ts" />
var app = angular.module('app');

interface IDoodleScope extends angular.IScope {
  description: string;
  doOK: () => void;
  doCancel: () => void;
}

app.controller('DoodleController', ['$scope', function(scope: IDoodleScope) {
  
  var d: any = document.getElementById('doodle-dialog');
  var dialog: HTMLDialogElement = d;

  scope.doOK = function() {
    var response: IDoodleParameters = {description: scope.description};
    dialog.close(JSON.stringify(response));
  };

  scope.doCancel = function() {
    dialog.close("");
  };

}]);

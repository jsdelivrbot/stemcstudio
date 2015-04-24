/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../ICopyParameters.ts" />
var app = angular.module('app');

interface ICopyScope extends angular.IScope {
  name: string;
  doOK: () => void;
  doCancel: () => void;
}

app.controller('CopyController', ['$scope', function(scope: ICopyScope) {
  
  var d: any = document.getElementById('copy-dialog');
  var dialog: HTMLDialogElement = d;

  scope.doOK = function() {
    var response: ICopyParameters = {name: scope.name};
    dialog.close(JSON.stringify(response));
  };

  scope.doCancel = function() {
    dialog.close("");
  };

}]);

/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../ICopyParameters.ts" />

interface ICopyScope extends angular.IScope {
  description: string;
  doOK: () => void;
  doCancel: () => void;
}

angular.module('app').controller('CopyController', ['$scope', function(scope: ICopyScope) {
  
  var d: any = document.getElementById('copy-dialog');
  var dialog: HTMLDialogElement = d;

  scope.doOK = function() {
    var response: ICopyParameters = {description: scope.description};
    dialog.close(JSON.stringify(response));
  };

  scope.doCancel = function() {
    dialog.close("");
  };

}]);

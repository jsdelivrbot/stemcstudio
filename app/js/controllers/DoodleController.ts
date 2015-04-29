/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../typings/IDoodleParameters.ts" />
var app = angular.module('app');

interface IDoodleScope extends angular.IScope {
  description: string;
  dependencies: string[];
  toggleDependency(name:string);
  doOK: () => void;
  doCancel: () => void;
}

app.controller('DoodleController', ['$scope', function(scope: IDoodleScope) {
  
  var d: any = document.getElementById('doodle-dialog');
  var dialog: HTMLDialogElement = d;

  scope.toggleDependency = function(name: string) {
    var idx = scope.dependencies.indexOf(name);
    if (idx > -1) {
      scope.dependencies.splice(idx, 1);
    }
    else {
      scope.dependencies.push(name);
    }
  }

  scope.doOK = function() {
    var response: IDoodleParameters = {
      description: scope.description,
      dependencies: scope.dependencies
    };
    dialog.close(JSON.stringify(response));
  };

  scope.doCancel = function() {
    dialog.close("");
  };

}]);

/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../typings/IDoodleParameters.ts" />

interface IDoodleScope extends angular.IScope {
  description: string;
  dependencies: string[];
  toggleDependency(name:string);
  doOK: () => void;
  doCancel: () => void;
}

angular.module('app').controller('DoodleController', ['$scope', function(scope: IDoodleScope) {
  
  var d: any = document.getElementById('doodle-dialog');
  var dialog: HTMLDialogElement = d;

  /**
   * This method changes the scope.dependencies array.
   * It is therefore essential that this array is a copy
   * of the dependencies of the doodle in order for the
   * Cancel processing to work correctly.
   */
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

/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />

/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../typings/IDoodleParameters.ts" />

interface IDoodleScope extends angular.IScope {
  description: string;
  dependencies: string[];
  toggleDependency(name:string);
  doOK: () => void;
  doCancel: () => void;
}

angular.module('app').controller('properties-controller', [
  '$scope',
  '$state',
  '$stateParams',
  function(
    scope: IDoodleScope,
    $state: angular.ui.IStateService,
    $stateParams: angular.ui.IStateParams
  ) {
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
    $state.transitionTo('home');
  };

  scope.doCancel = function() {
    $state.transitionTo('home');
  };

}]);

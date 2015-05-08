/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/IDoodle.ts" />
/// <reference path="../services/doodles/IDoodleManager.ts" />
/// <reference path="../services/options/IOption.ts" />
/// <reference path="../services/options/IOptionManager.ts" />

/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../typings/IDoodleParameters.ts" />

interface IDoodleScope extends angular.IScope {
  zombie: IDoodle;
  options: IOption[];
  toggleDependency(name:string);
  doOK: () => void;
  doCancel: () => void;
}

// FIXME: Doing this as a state is causing the home-controller to reload.
angular.module('app').controller('properties-controller', [
  '$scope',
  '$state',
  '$stateParams',
  'doodles',
  'options',
  function(
    scope: IDoodleScope,
    $state: angular.ui.IStateService,
    $stateParams: angular.ui.IStateParams,
    doodles: IDoodleManager,
    options: IOptionManager
  ) {
  scope.zombie = JSON.parse(JSON.stringify(doodles.current()));
  scope.options = options.filter(function() { return true; });
  /**
   * This method changes the scope.dependencies array.
   * It is therefore essential that this array is a copy
   * of the dependencies of the doodle in order for the
   * Cancel processing to work correctly.
   */
  scope.toggleDependency = function(name: string) {
    var idx = scope.zombie.dependencies.indexOf(name);
    if (idx > -1) {
      scope.zombie.dependencies.splice(idx, 1);
    }
    else {
      scope.zombie.dependencies.push(name);
    }
  }

  scope.doOK = function() {
    doodles.current().description = scope.zombie.description;
    doodles.current().dependencies = scope.zombie.dependencies;
    $state.transitionTo('home');
  };

  scope.doCancel = function() {
    $state.transitionTo('home');
  };

}]);

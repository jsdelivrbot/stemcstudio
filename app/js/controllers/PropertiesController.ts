/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../services/options/IOption.ts" />
/// <reference path="../services/options/IOptionManager.ts" />

interface IBodyScope extends angular.IScope {
  zombie: mathdoodle.IDoodle;
  options: IOption[];
  toggleDependency(name:string);
  doOK: () => void;
  doCancel: () => void;
}

// FIXME: Doing this as a state is causing the doodle-controller to reload.
angular.module('app').controller('properties-controller', [
  '$scope',
  '$state',
  '$stateParams',
  'doodles',
  'options',
  'STATE_DOODLE',
  function(
    scope: IBodyScope,
    $state: angular.ui.IStateService,
    $stateParams: angular.ui.IStateParams,
    doodles: mathdoodle.IDoodleManager,
    options: IOptionManager,
    STATE_DOODLE: string
  ) {
  scope.zombie = JSON.parse(JSON.stringify(doodles.current()));
  scope.options = options.filter(function(option: IOption) { return option.visible; });
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
    // Perform some clanup, while we map dependencies.
    doodles.current().dependencies = scope.zombie.dependencies.filter(function(name) {return options.filter(function(option){return option.visible && option.name === name}).length > 0});
    doodles.current().operatorOverloading = scope.zombie.operatorOverloading;
    doodles.current().lastKnownJs = undefined;
    $state.go(STATE_DOODLE);
  };

  scope.doCancel = function() {
    $state.go(STATE_DOODLE);
  };

}]);

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
  'STATE_GISTS',
  function(
    scope: IBodyScope,
    $state: angular.ui.IStateService,
    $stateParams: angular.ui.IStateParams,
    doodles: mathdoodle.IDoodleManager,
    options: IOptionManager,
    STATE_DOODLE: string,
    STATE_GISTS: string
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
    if (doodles.current().gistId) {
      $state.go(STATE_GISTS, {gistId: doodles.current().gistId});
    }
    else {
      $state.go(STATE_DOODLE);
    }
  };

  scope.doCancel = function() {
    // TODO: It would seem that we should be able to simply go to the doodle state
    // and then let that state take care of setting the correct doodle.
    // FIXME: In other words, this abstraction leaks!
    // Even better, properties should be a child state?
    if (doodles.current().gistId) {
      $state.go(STATE_GISTS, {gistId: doodles.current().gistId});
    }
    else {
      $state.go(STATE_DOODLE);
    }
  };

}]);

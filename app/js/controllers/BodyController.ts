/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/IDoodle.ts" />
/// <reference path="../services/doodles/IDoodleManager.ts" />

module mathdoodle {
  export interface IBodyScope extends angular.IScope {
    currentDoodle(): IDoodle;
    doodles(): IDoodle[];
  }
}

(function(module) {

  module.controller('body-controller', [
    '$scope',
    '$state',
    'doodles',
    function(
      $scope: mathdoodle.IBodyScope,
      $state: angular.ui.IStateService,
      doodles: IDoodleManager
    ) {

      $scope.currentDoodle = function() {
        return doodles.current();
      };

      $scope.doodles = function() {
          return doodles.filter(function() { return true; });
      };
    }
  ]);

})(angular.module('app'));

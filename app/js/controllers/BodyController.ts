/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/IDoodle.ts" />
/// <reference path="../services/doodles/IDoodleManager.ts" />

module doodle.body {
  export interface BodyScope extends angular.IScope {
    currentDoodle(): IDoodle;
  }
}

(function(module) {

  module.controller('body-controller', [
    '$scope',
    '$state',
    'doodles',
    function(
      $scope: doodle.body.BodyScope,
      $state: angular.ui.IStateService,
      doodles: IDoodleManager
    ) {

      $scope.currentDoodle = function() {
        return doodles.current();
      };

    }
  ]);

})(angular.module('app'));

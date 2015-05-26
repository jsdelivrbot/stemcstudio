/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../controllers/BodyController.ts" />

module mathdoodle {
  export interface IOpenScope extends mathdoodle.IBodyScope {
    doClose: () => void;
    doOpen: (uuid: string) => void;
    doDelete: (uuid: string) => void;
  }
}

angular.module('app').controller('open-controller', [
  '$scope',
  '$state',
  'doodles',
  function(
    $scope: mathdoodle.IOpenScope,
    $state: angular.ui.IStateService,
    doodles: mathdoodle.IDoodleManager
  ) {

  $scope.doOpen = function(uuid: string) {
    doodles.makeCurrent(uuid);
    $state.go('doodle');
  }

  $scope.doDelete = function(uuid: string) {
    doodles.deleteDoodle(uuid);
  }

  $scope.doClose = function() {
    $state.go('doodle');
  };

}]);

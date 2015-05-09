/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../controllers/DoodleController.ts" />

module mathdoodle {
  export interface IOpenScope extends mathdoodle.IDoodleScope {
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
    $state.go('home');
  }

  $scope.doDelete = function(uuid: string) {
    doodles.deleteDoodle(uuid);
  }

  $scope.doClose = function() {
    $state.go('home');
  };

}]);

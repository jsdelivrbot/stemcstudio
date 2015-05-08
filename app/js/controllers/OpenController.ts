/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/IDoodle.ts" />
/// <reference path="../services/doodles/IDoodleManager.ts" />
/// <reference path="BodyController.ts" />

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
    doodles: IDoodleManager
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

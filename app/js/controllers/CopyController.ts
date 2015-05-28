/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../controllers/BodyController.ts" />

module mathdoodle {
  export interface ICopyScope extends mathdoodle.IBodyScope {
    description: string;
    template: IDoodle;
    doOK: () => void;
    doCancel: () => void;
  }
}

angular.module('app').controller('copy-controller', [
  '$scope',
  '$state',
  'doodles',
  'STATE_DOODLE',
  'STATE_GISTS',
  function(
    $scope: mathdoodle.ICopyScope,
    $state: angular.ui.IStateService,
    doodles: mathdoodle.IDoodleManager,
    STATE_DOODLE: string,
    STATE_GISTS: string
  ) {

  $scope.description = doodles.suggestName();
  $scope.template = doodles.current();

  $scope.doOK = function() {
    doodles.createDoodle($scope.template, $scope.description);
    doodles.updateStorage();
    $state.go(STATE_DOODLE);
  };

  $scope.doCancel = function() {
    if (doodles.current().gistId) {
      $state.go(STATE_GISTS, {gistId: doodles.current().gistId});
    }
    else {
      $state.go(STATE_DOODLE);
    }
  };

}]);

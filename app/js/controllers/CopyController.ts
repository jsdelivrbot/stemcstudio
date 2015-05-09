/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../controllers/DoodleController.ts" />

module mathdoodle {
  export interface ICopyScope extends mathdoodle.IDoodleScope {
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
  function(
    $scope: mathdoodle.ICopyScope,
    $state: angular.ui.IStateService,
    doodles: mathdoodle.IDoodleManager
  ) {

  $scope.description = doodles.suggestName();
  $scope.template = doodles.current();

  $scope.doOK = function() {
    doodles.createDoodle($scope.template, $scope.description);
    doodles.updateStorage();
    $state.go('home');
  };

  $scope.doCancel = function() {
    $state.go('home');
  };

}]);

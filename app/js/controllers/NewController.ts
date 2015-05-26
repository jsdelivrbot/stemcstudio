/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../app.ts" />
module mathdoodle {
  export interface INewScope extends mathdoodle.IAppScope {
    description: string;
    template: mathdoodle.IDoodle;
    templates: mathdoodle.IDoodle[];
    doOK: () => void;
    doCancel: () => void;
  }
}

angular.module('app').controller('new-controller', [
  '$scope',
  '$state',
  'doodles',
  'templates',
  function(
    $scope: mathdoodle.INewScope,
    $state: angular.ui.IStateService,
    doodles: mathdoodle.IDoodleManager,
    templates: mathdoodle.IDoodle[]
  ) {

  $scope.description = doodles.suggestName();
  $scope.template = templates[0];
  $scope.templates = templates;

  $scope.doOK = function() {
    doodles.createDoodle($scope.template, $scope.description);
    doodles.updateStorage();
    $state.transitionTo('doodle');
  };

  $scope.doCancel = function() {
    $state.transitionTo('doodle');
  };

}]);

/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/IDoodle.ts" />
/// <reference path="../services/doodles/IDoodleManager.ts" />
/// <reference path="../typings/IHomeScope.ts" />

interface INewScope extends IHomeScope {
  description: string;
  template: IDoodle;
  templates: IDoodle[];
  doOK: () => void;
  doCancel: () => void;
}

angular.module('app').controller('new-controller', [
  '$scope',
  '$state',
  'doodles',
  'templates',
  function(
    $scope: INewScope,
    $state: angular.ui.IStateService,
    doodles: IDoodleManager,
    templates: IDoodle[]
  ) {

  $scope.description = "";
  $scope.template = templates[0];
  $scope.templates = templates;

  $scope.doOK = function() {
    doodles.createDoodle($scope.template, $scope.description);
    doodles.updateStorage();
    $state.transitionTo('home');
  };

  $scope.doCancel = function() {
    $state.transitionTo('home');
  };

}]);

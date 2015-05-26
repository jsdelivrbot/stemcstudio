/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../controllers/BodyController.ts" />

module mathdoodle {
  export interface IHomeScope extends mathdoodle.IBodyScope {
    goDoodle(): void;
  }
}

angular.module('app').controller('home-controller', [
  '$scope',
  '$state',
  '$window',
  function(
    $scope: mathdoodle.IHomeScope,
    $state: angular.ui.IStateService,
    $window: angular.IWindowService
  ) {

  // Ensure that scrollbars are disabled.
  // This is so that we don't get double scrollbars when using the editor.
  $window.document.body.style.overflow = 'auto'

    $scope.goDoodle = function() {
      $state.go('doodle');
    }
}]);

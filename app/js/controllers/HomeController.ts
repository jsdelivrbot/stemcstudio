/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../controllers/BodyController.ts" />
/// <reference path="../services/gham/IGitHubAuthManager.ts" />

module mathdoodle {
  export interface IHomeScope extends mathdoodle.IBodyScope {
    goDoodle(): void;
    twitterShareText: string;
  }
}

angular.module('app').controller('home-controller', [
  '$scope',
  '$state',
  '$window',
  'GitHubAuthManager',
  'STATE_DOODLE',
  function(
    $scope: mathdoodle.IHomeScope,
    $state: angular.ui.IStateService,
    $window: angular.IWindowService,
    authManager: IGitHubAuthManager,
    STATE_DOODLE: string
  ) {

  // Ensure that scrollbars are disabled.
  // This is so that we don't get double scrollbars when using the editor.
  $window.document.body.style.overflow = 'auto';

  authManager.handleGitHubLoginCallback(function(err, token: string) {
    if (err) {
      $scope.alert(err.message);
    }
  });

  $scope.twitterShareText = "MathDoodle · Learning Mathematics and Geometric Physics through Computational Modeling.";

  $scope.goDoodle = function() {
    $state.go(STATE_DOODLE);
  }
}]);

/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../controllers/BodyController.ts" />
/// <reference path="../services/gham/IGitHubAuthManager.ts" />
/// <reference path="../../../typings/twitter/twitter.d.ts" />

module mathdoodle {
  export interface IHomeScope extends mathdoodle.IBodyScope {
    goDoodle(): void;
    twitterShareText: string;
  }
}

angular.module('app').controller('home-controller', [
  '$scope',
  '$state',
  '$twitter',
  '$window',
  'GitHubAuthManager',
  'NAMESPACE_TWITTER_WIDGETS',
  'STATE_DOODLE',
  function(
    $scope: mathdoodle.IHomeScope,
    $state: angular.ui.IStateService,
    $twitter: Twitter,
    $window: angular.IWindowService,
    authManager: IGitHubAuthManager,
    NAMESPACE_TWITTER_WIDGETS: string,
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

  if ($window[NAMESPACE_TWITTER_WIDGETS] && $window[NAMESPACE_TWITTER_WIDGETS].widgets) {
    $window[NAMESPACE_TWITTER_WIDGETS].widgets.load();
  }
  else {
    // We'll probably end up here the first time because the script load is asynchronous.
    // But that doesn't matter because the widgets will be initialized by the script itself.
    // On subsequent reloading of the home template, when the controller is invoked, it triggers a load.
  }

  $scope.twitterShareText = "MathDoodle · Learning Mathematics and Geometric Physics through Computational Modeling.";

  $scope.goDoodle = function() {
    $state.go(STATE_DOODLE);
  }
}]);

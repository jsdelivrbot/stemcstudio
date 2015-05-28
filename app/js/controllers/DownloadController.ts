/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../typings/google-analytics/ga.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../services/cloud/cloud.ts" />
/// <reference path="../services/gist/IGist.ts" />
/// <reference path="../controllers/BodyController.ts" />
/// <reference path="../app.ts" />
module mathdoodle {
  export interface IDownloadScope extends mathdoodle.IBodyScope {
    doCancel: () => void;
  }
}

// FIXME: Too much implementation detail.
angular.module('app').controller('download-controller', [
  '$scope',
  '$state',
  'cloud',
  'doodles',
  'cookie',
  'ga',
  'GITHUB_TOKEN_COOKIE_NAME',
  'STATE_DOODLE',
  'STATE_GISTS',
  function(
    $scope: mathdoodle.IDownloadScope,
    $state: angular.ui.IStateService,
    cloud: mathdoodle.ICloud,
    doodles: mathdoodle.IDoodleManager,
    cookie: ICookieService,
    ga: UniversalAnalytics.ga,
    GITHUB_TOKEN_COOKIE_NAME: string,
    STATE_DOODLE: string,
    STATE_GISTS: string
  ) {

    $scope.doCancel = function() {
      if (doodles.current().gistId) {
        $state.go(STATE_GISTS, {gistId: doodles.current().gistId});
      }
      else {
        $state.go(STATE_DOODLE);
      }
    };

  }
]);

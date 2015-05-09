/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../services/cloud/cloud.ts" />
/// <reference path="../services/gist/IGist.ts" />
/// <reference path="../controllers/DoodleController.ts" />
/// <reference path="../app.ts" />
module mathdoodle {
  export interface IDownloadScope extends mathdoodle.IDoodleScope {
    doCancel: () => void;
    clickDownloadGist: (gistId: string) => void;
  }
}

// FIXME: Too much implementation detail.
angular.module('app').controller('download-controller', [
  '$scope',
  '$state',
  'cloud',
  'doodles',
  'cookie',
  'GITHUB_TOKEN_COOKIE_NAME',
  function(
    $scope: mathdoodle.IDownloadScope,
    $state: angular.ui.IStateService,
    cloud: mathdoodle.ICloud,
    doodles: mathdoodle.IDoodleManager,
    cookie: ICookieService,
    GITHUB_TOKEN_COOKIE_NAME: string
  ) {

  $scope.clickDownloadGist = function(gistId: string) {
    ga('send', 'event', 'cloud', 'downloadGist');
    // TODO: Google Analytics
    var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
    cloud.downloadGist(token, gistId, function(err, doodle: mathdoodle.IDoodle) {
      if (!err) {
        doodles.deleteDoodle(doodle.uuid);
        doodles.unshift(doodle);
        doodles.updateStorage();
        $state.go('home');
      }
      else {
        $scope.alert("Error attempting to download Gist");
        $state.go('home');
      }
    });
    // FIXME: Should be in a handler with progress (generally).
  }

  $scope.doCancel = function() {
    $state.go('home');
  };

}]);

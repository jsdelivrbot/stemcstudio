/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/doodles/IDoodle.ts" />
/// <reference path="../services/doodles/IDoodleManager.ts" />
/// <reference path="../services/gist/IDoodleConfig.ts" />
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
  'doodles',
  'cookie',
  'GitHub',
  'FILENAME_META',
  'FILENAME_HTML',
  'FILENAME_CODE',
  'GITHUB_TOKEN_COOKIE_NAME',
  function(
    $scope: mathdoodle.IDownloadScope,
    $state: angular.ui.IStateService,
    doodles: IDoodleManager,
    cookie: ICookieService,
    github,
    FILENAME_META: string,
    FILENAME_HTML: string,
    FILENAME_CODE: string,
    GITHUB_TOKEN_COOKIE_NAME: string
  ) {

  // Temporary to ensure correct Gist deserialization.
  function depArray(deps: {[key:string]:string}): string[] {
    var ds: string[] = [];
    for (var prop in deps) {
      ds.push(prop);
    }
    return ds;
  }

  // TODO: in a service.
  function downloadGist(token: string, gistId: string, callback: (err, doodle?: IDoodle) => void) {
    github.getGist(token, gistId, function(err, gist) {
      if (!err) {
        var metaInfo: IDoodleConfig = JSON.parse(gist.files[FILENAME_META].content);
        var html = gist.files[FILENAME_HTML].content;
        var code = gist.files[FILENAME_CODE].content;

        var doodle: IDoodle = {
          gistId: gistId,
          uuid: metaInfo.uuid,
          description: gist.description,
          isCodeVisible: true,
          isViewVisible: false,
          focusEditor: FILENAME_CODE,
          lastKnownJs: undefined,
          html: gist.files[FILENAME_HTML].content,
          code: gist.files[FILENAME_CODE].content,
          dependencies: depArray(metaInfo.dependencies)
        };
        callback(undefined, doodle);
      }
      else {
        callback(err);
      }
    });
  }

  $scope.clickDownloadGist = function(gistId: string) {
    // TODO: Google Analytics
    var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
    downloadGist(token, gistId, function(err, doodle: IDoodle) {
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

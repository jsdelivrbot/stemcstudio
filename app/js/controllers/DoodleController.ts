/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../services/cookie/cookie.ts" />
/// <reference path="../services/doodles/IDoodle.ts" />
/// <reference path="../services/doodles/IDoodleManager.ts" />
/// <reference path="../services/gist/IGist.ts" />
/// <reference path="../app.ts" />

module mathdoodle {
  export interface IDoodleScope extends mathdoodle.IAppScope {
    currentDoodle(): IDoodle;
    doodles(): IDoodle[];
    gists: IGist[];
    clickDownload(): void;
  }
}

(function(module) {

  module.controller('body-controller', [
    '$scope',
    '$state',
    'doodles',
    'GitHub',
    'cookie',
    'GITHUB_TOKEN_COOKIE_NAME',
    function(
      $scope: mathdoodle.IDoodleScope,
      $state: angular.ui.IStateService,
      doodles: IDoodleManager,
      github,
      cookie: ICookieService,
      GITHUB_TOKEN_COOKIE_NAME: string
    ) {

      $scope.currentDoodle = function() {
        return doodles.current();
      };

      $scope.doodles = function() {
          return doodles.filter(function() { return true; });
      };

      $scope.clickDownload = function(label?: string, value?: number) {
        ga('send', 'event', 'doodle', 'download', label, value);
        var token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
        github.getGists(token, function(err, gists: IGist[]) {
          if (!err) {
            $scope.gists = gists;
            $state.go('download');
            /*
            var dialog = <HTMLDialogElement>document.getElementById('download-dialog');
            var closeHandler = function() {
              hideModalDialog(dialog, closeHandler);
              if (dialog.returnValue.length > 0) {
                var response: IDownloadParameters = JSON.parse(dialog.returnValue);
                downloadGist(token, response.gistId);
              }
              else {

              }
            };
            showModalDialog(dialog, closeHandler);
            */
          }
          else {
              $scope.alert("Error attempting to download Gists");
          }
        });
      };

    }
  ]);

})(angular.module('app'));

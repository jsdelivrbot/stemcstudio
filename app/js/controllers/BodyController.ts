/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../typings/google-analytics/ga.d.ts" />
/// <reference path="../services/cookie/cookie.ts" />
/// <reference path="../services/doodles/doodles.ts" />
/// <reference path="../services/gist/IGist.ts" />
/// <reference path="../app.ts" />

module mathdoodle {
  export interface IBodyScope extends mathdoodle.IAppScope {
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
    'ga',
    '$twitter',
    'GitHub',
    'cookie',
    'GITHUB_TOKEN_COOKIE_NAME',
    function(
      $scope: mathdoodle.IBodyScope,
      $state: angular.ui.IStateService,
      doodles: mathdoodle.IDoodleManager,
      ga: UniversalAnalytics.ga,
      $twitter,
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

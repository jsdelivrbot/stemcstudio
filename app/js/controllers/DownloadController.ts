/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../typings/IDownloadParameters.ts" />

interface IDownloadScope extends angular.IScope {
  doCancel: () => void;
  doDownload: (gistId: string) => void;
}

angular.module('app').controller('DownloadController', ['$scope', function(scope: IDownloadScope) {
  
  var d: any = document.getElementById('download-dialog');
  var dialog: HTMLDialogElement = d;

  scope.doDownload = function(gistId: string) {
    var response: IDownloadParameters = {gistId: gistId};
    dialog.close(JSON.stringify(response));
  }

  scope.doCancel = function() {
    dialog.close("");
  };

}]);

/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../HTMLDialogElement.ts" />
/// <reference path="../typings/IHomeScope.ts" />

interface IShareScope extends IHomeScope {
  name: string;
  doClose: () => void;
}

angular.module('app').controller('ShareController', ['$scope', function(scope: IShareScope) {
  
  var d: any = document.getElementById('share-dialog');
  var dialog: HTMLDialogElement = d;

  scope.doClose = function() {
    dialog.close();
  };

}]);

/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />

module doodle.login {
  export interface SecureScope extends angular.IScope {
    sessionCode: string;
    pending: string;
    state: string;
  }
}

(function(module) {

  module
  .controller('SecureController', [
    '$scope',
    '$state',
    '$window',
    function(
      $scope: doodle.login.SecureScope,
      $state: angular.ui.IStateService,
      $window: angular.IWindowService
    ) {

      var github = <IGitHubItem>JSON.parse($window.localStorage.getItem("davincidoodle.github"));
      $scope.sessionCode = github.oauth.code;
      $scope.pending = github.oauth.pending;
      $scope.state = github.oauth.state;
    }
  ]);

})(angular.module('app'));

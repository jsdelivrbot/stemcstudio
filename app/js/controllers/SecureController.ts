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
    'githubKey',
    function(
      $scope: doodle.login.SecureScope,
      $state: angular.ui.IStateService,
      $window: angular.IWindowService,
      githubKey: string
    ) {
      var ghItem = <IGitHubItem>JSON.parse($window.localStorage.getItem(githubKey));
      $scope.sessionCode = ghItem.oauth.code;
      $scope.pending = ghItem.oauth.pending;
      $scope.state = ghItem.oauth.state;
    }
  ]);

})(angular.module('app'));

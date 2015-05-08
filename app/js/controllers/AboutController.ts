/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />

module doodle.about {
  export interface AboutScope extends angular.IScope {
    doClose(): void;
  }
}

(function(module) {

  module.controller('about-controller', [
    '$scope',
    '$state',
    function(
      $scope: doodle.about.AboutScope,
      $state: angular.ui.IStateService
    ) {
      $scope.doClose = function() {
        $state.transitionTo('home');
      }
    }
  ]);

})(angular.module('app'));

/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />

module doodle.about {
  export interface AboutScope extends angular.IScope {
    doCheckForUpdates(): void;
    doClose(): void;
  }
}

(function(module) {

  module.controller('about-controller', [
    '$scope',
    '$state',
    '$window',
    function(
      $scope: doodle.about.AboutScope,
      $state: angular.ui.IStateService,
      $window: angular.IWindowService
    ) {

      $scope.doCheckForUpdates = function() {
          var appCache: ApplicationCache = $window.applicationCache;

          appCache.update();

          if (appCache.status === $window.applicationCache.UPDATEREADY) {
              appCache.swapCache();
          }
      }

      $scope.doClose = function() {
        $state.transitionTo('home');
      }

    }
  ]);

})(angular.module('app'));

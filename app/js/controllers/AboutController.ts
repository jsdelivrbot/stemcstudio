/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />

module doodle.about {
  export interface AboutScope extends angular.IScope {
    doOK(): void;
  }
}

(function(module) {

  module.controller('AboutController', ['$scope', '$state', function($scope: doodle.about.AboutScope, $state: angular.ui.IStateService) {

    $scope.doOK = function() {
      $state.transitionTo('home');
    }

}]);

})(angular.module('app'));

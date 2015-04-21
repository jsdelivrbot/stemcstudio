angular.module("app", ["ngResource", "ngRoute"]).run(function($rootScope) {

  $rootScope.log = function(thing) {
    console.log(thing);
  };

  $rootScope.alert = function(thing) {
    alert(thing);
  };
});

app = angular.module "app", ["ngResource", "ngRoute"]

app.run ($rootScope) ->

  $rootScope.log = (thing) -> console.log(thing)

  $rootScope.alert = (thing) -> alert(thing)

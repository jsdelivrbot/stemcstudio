app = angular.module "app"

app.controller 'HomeController', ['$scope','$location', ($scope, $location) ->

  $scope.title = "Home"

]

app = angular.module "app"

app.config ($routeProvider, $locationProvider) ->

  $locationProvider.html5Mode enabled: true

  $routeProvider.when '/', templateUrl: 'home.html', controller: 'HomeController'

  $routeProvider.otherwise redirectTo: '/'

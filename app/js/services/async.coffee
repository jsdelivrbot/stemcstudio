module = angular.module('async', [])

module.factory 'async', ['$window', ($window) -> $window.async]
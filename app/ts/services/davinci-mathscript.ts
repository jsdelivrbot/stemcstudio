angular.module('davinci.mathscript', []).factory('mathscript', [
    '$window',
    function($window: angular.IWindowService) {
        return $window['Ms'];
    }
]);
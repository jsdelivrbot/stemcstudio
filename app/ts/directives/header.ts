import app from '../app';

app.directive('mathdoodleHeader', function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'header.html'
    };
});
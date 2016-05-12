import * as angular from 'angular';
import app from '../app';
import AboutScope from '../scopes/AboutScope';

app.controller('about-controller', [
    '$scope',
    '$state',
    '$window',
    function(
        $scope: AboutScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService
    ) {

        $scope.doCheckForUpdates = function() {
            var appCache: ApplicationCache = $window.applicationCache;

            appCache.update();

            if (appCache.status === $window.applicationCache.UPDATEREADY) {
                appCache.swapCache();
            }
        };

        $scope.doClose = function() {
            $state.transitionTo('doodle');
        };

    }
]);

import app from '../app';
import ICloud from '../services/cloud/ICloud';
import CookieService from '../services/cookie/CookieService';
import IDoodleManager from '../services/doodles/IDoodleManager';
import DownloadScope from './DownloadScope';

app.controller('download-controller', [
    '$scope',
    '$state',
    'cloud',
    'doodles',
    'cookie',
    'ga',
    'GITHUB_TOKEN_COOKIE_NAME',
    'STATE_DOODLE',
    function(
        $scope: DownloadScope,
        $state: angular.ui.IStateService,
        cloud: ICloud,
        doodles: IDoodleManager,
        cookie: CookieService,
        ga: UniversalAnalytics.ga,
        GITHUB_TOKEN_COOKIE_NAME: string,
        STATE_DOODLE: string
    ) {

        $scope.doCancel = function() {
            $state.go(STATE_DOODLE);
        };

    }
]);

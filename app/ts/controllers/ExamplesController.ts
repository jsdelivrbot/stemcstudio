import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import ExamplesScope from '../scopes/ExamplesScope';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';

/**
 * The examples are currently not data-driven and not very pretty!
 * 
 * @class ExamplesController
 */
export default class ExamplesController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$state',
        '$stateParams',
        '$http',
        '$location',
        '$timeout',
        '$window',
        'GitHubAuthManager',
        'ga',
        'STATE_GISTS',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    constructor(
        $scope: ExamplesScope,
        $state: angular.ui.IStateService,
        $stateParams: angular.ui.IStateParamsService,
        http: angular.IHttpService,
        $location: angular.ILocationService,
        $timeout: angular.ITimeoutService,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        STATE_GISTS: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string
    ) {
        super($scope, $window, authManager, ga, UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto')

        $scope.goHome = function(label?: string, value?: number) {
            ga('send', 'event', 'examples', 'goHome', label, value);
            $state.go('home');
        };
    }
}

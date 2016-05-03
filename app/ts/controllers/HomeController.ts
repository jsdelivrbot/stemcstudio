import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import HomeScope from '../scopes/HomeScope';

/**
 * @class HomeController
 */
export default class HomeController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$state',
        '$twitter',
        '$window',
        'GitHubAuthManager',
        'ga',
        'NAMESPACE_TWITTER_WIDGETS',
        'STATE_DASHBOARD',
        'STATE_DOODLE',
        'STATE_EXAMPLES',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    constructor(
        $scope: HomeScope,
        $state: angular.ui.IStateService,
        $twitter: Twitter,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        NAMESPACE_TWITTER_WIDGETS: string,
        STATE_DASHBOARD: string,
        STATE_DOODLE: string,
        STATE_EXAMPLES: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string
    ) {
        super($scope, $window, authManager, ga, UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto')

        if ($window[NAMESPACE_TWITTER_WIDGETS] && $window[NAMESPACE_TWITTER_WIDGETS].widgets) {
            $window[NAMESPACE_TWITTER_WIDGETS].widgets.load();
        }
        else {
            // We'll probably end up here the first time because the script load is asynchronous.
            // But that doesn't matter because the widgets will be initialized by the script itself.
            // On subsequent reloading of the home template, when the controller is invoked, it triggers a load.
        }

        $scope.twitterShareText = "STEMCstudio · Learning Science and Mathematics through Computational Modeling.";

        $scope.goDashboard = function() {
            $state.go(STATE_DASHBOARD);
        }

        $scope.goDoodle = function() {
            $state.go(STATE_DOODLE);
        }

        $scope.goExamples = function() {
            $state.go(STATE_EXAMPLES);
        }
    }
}

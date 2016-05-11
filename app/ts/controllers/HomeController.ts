import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import HitService from '../services/hits/HitService';
import HomeScope from '../scopes/HomeScope';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 * @class HomeController
 */
export default class HomeController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$state',
        '$window',
        'GitHubAuthManager',
        'ga',
        'hits',
        'modalDialog',
        'FEATURE_DASHBOARD_ENABLED',
        'FEATURE_EXAMPLES_ENABLED',
        'STATE_DASHBOARD',
        'STATE_DOODLE',
        'STATE_EXAMPLES',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    constructor(
        $scope: HomeScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        hits: HitService,
        modalDialog: ModalDialog,
        FEATURE_DASHBOARD_ENABLED: boolean,
        FEATURE_EXAMPLES_ENABLED: boolean,
        STATE_DASHBOARD: string,
        STATE_DOODLE: string,
        STATE_EXAMPLES: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string
    ) {
        super($scope, $window, authManager, ga, modalDialog, UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto')

        $scope.FEATURE_DASHBOARD_ENABLED = FEATURE_DASHBOARD_ENABLED
        $scope.FEATURE_EXAMPLES_ENABLED = FEATURE_EXAMPLES_ENABLED

        /*
        if ($window[NAMESPACE_TWITTER_WIDGETS] && $window[NAMESPACE_TWITTER_WIDGETS].widgets) {
            $window[NAMESPACE_TWITTER_WIDGETS].widgets.load();
        }
        else {
            // We'll probably end up here the first time because the script load is asynchronous.
            // But that doesn't matter because the widgets will be initialized by the script itself.
            // On subsequent reloading of the home template, when the controller is invoked, it triggers a load.
        }

        $scope.twitterShareText = "STEMCstudio · Learning Science and Mathematics through Computational Modeling.";
        */

        $scope.goDashboard = function() {
            if (FEATURE_DASHBOARD_ENABLED) {
                $state.go(STATE_DASHBOARD);
            }
            else {
                console.warn(`FEATURE_DASHBOARD_ENABLED => ${FEATURE_DASHBOARD_ENABLED}`)
            }
        }

        $scope.goDoodle = function() {
            $state.go(STATE_DOODLE);
        }

        $scope.goExamples = function() {
            if (FEATURE_EXAMPLES_ENABLED) {
                $state.go(STATE_EXAMPLES);
            }
            else {
                console.warn(`FEATURE_EXAMPLES_ENABLED => ${FEATURE_EXAMPLES_ENABLED}`)
            }
        }
    }
}

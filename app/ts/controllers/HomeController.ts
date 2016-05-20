import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import IDoodleManager from '../services/doodles/IDoodleManager';
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
        'doodles',
        'GitHubAuthManager',
        'ga',
        'hits',
        'modalDialog',
        'FEATURE_DASHBOARD_ENABLED',
        'FEATURE_EXAMPLES_ENABLED',
        'FEATURE_GOOGLE_SIGNIN_ENABLED',
        'STATE_DASHBOARD',
        'STATE_DOODLE',
        'STATE_EXAMPLES',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    /**
     * @class HomeController
     * @constructor
     */
    constructor(
        $scope: HomeScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService,
        doodles: IDoodleManager,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        hits: HitService,
        modalDialog: ModalDialog,
        FEATURE_DASHBOARD_ENABLED: boolean,
        FEATURE_EXAMPLES_ENABLED: boolean,
        FEATURE_GOOGLE_SIGNIN_ENABLED: boolean,
        STATE_DASHBOARD: string,
        STATE_DOODLE: string,
        STATE_EXAMPLES: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string
    ) {
        super($scope, $state, $window, authManager, ga, modalDialog, UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto');

        $scope.FEATURE_DASHBOARD_ENABLED = FEATURE_DASHBOARD_ENABLED;
        $scope.FEATURE_EXAMPLES_ENABLED = FEATURE_EXAMPLES_ENABLED;
        $scope.FEATURE_GOOGLE_SIGNIN_ENABLED = FEATURE_GOOGLE_SIGNIN_ENABLED;

        $scope.goDashboard = () => {
            if (FEATURE_DASHBOARD_ENABLED) {
                this.navigateTo(STATE_DASHBOARD);
            }
            else {
                console.warn(`FEATURE_DASHBOARD_ENABLED => ${FEATURE_DASHBOARD_ENABLED}`);
            }
        };

        $scope.goDoodle = () => {
            this.navigateTo(STATE_DOODLE);
        };

        $scope.goExamples = () => {
            if (FEATURE_EXAMPLES_ENABLED) {
                this.navigateTo(STATE_EXAMPLES);
            }
            else {
                console.warn(`FEATURE_EXAMPLES_ENABLED => ${FEATURE_EXAMPLES_ENABLED}`);
            }
        };

        //
        // The thumbnails are initially populated from local storage (the doodle manager).
        //
        $scope.doodleRefs = doodles.filter(function(doodle, index) {
            return true;
        }).map(function(doodle) {
            return {
                owner: doodle.owner,
                gistId: doodle.gistId,
                // description comes from package.json and it should be short so it corresponds to a title in a publication.
                title: doodle.description,
                author: doodle.author,
                keywords: doodle.keywords
            };
        });
    }

    /**
     * @method $onInit
     * @return {void}
     */
    $onInit(): void {
        console.warn("HomeController.$onInit");
    }

    /**
     * @method $onDestroy
     * @return {void}
     */
    $onDestroy(): void {
        console.warn("HomeController.$onDestroy");
    }
}

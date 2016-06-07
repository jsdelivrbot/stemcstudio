import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import Doodle from '../services/doodles/Doodle';
import IDoodleManager from '../services/doodles/IDoodleManager';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import HitService from '../services/hits/HitService';
import HomeScope from '../scopes/HomeScope';
import ModalDialog from '../services/modalService/ModalDialog';
import StemcArXiv from '../stemcArXiv/StemcArXiv';

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
        'stemcArXiv',
        'FEATURE_DASHBOARD_ENABLED',
        'FEATURE_EXAMPLES_ENABLED',
        'FEATURE_GOOGLE_SIGNIN_ENABLED',
        'STATE_DASHBOARD',
        'STATE_DOODLE',
        'STATE_EXAMPLES',
        'STATE_GIST',
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
        stemcArXiv: StemcArXiv,
        FEATURE_DASHBOARD_ENABLED: boolean,
        FEATURE_EXAMPLES_ENABLED: boolean,
        FEATURE_GOOGLE_SIGNIN_ENABLED: boolean,
        STATE_DASHBOARD: string,
        STATE_DOODLE: string,
        STATE_EXAMPLES: string,
        STATE_GIST: string,
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
        // We keep the search results and Local Storage doodles distinct.
        // This should be useful for 'dragging' search results to Local Storage. 
        //
        $scope.doodleRefs = [];
        $scope.doodles = function() {
            return doodles.filter(function() { return true; });
        };

        $scope.params = { query: '' };

        $scope.doSearch = function() {
            // Save the previous query value so that we can warn the user when no documents are returned.
            $scope.query = $scope.params.query;
            // Reset the other cached values.
            $scope.found = void 0;
            $scope.start = void 0;
            if ($scope.params.query) {
                stemcArXiv.search({ query: $scope.params.query }).then((promiseValue) => {
                    $scope.found = promiseValue.found;
                    $scope.start = promiseValue.start;
                    $scope.doodleRefs = promiseValue.refs;
                }).catch((err: any) => {
                    modalDialog.alert({ title: 'Search', message: "I'm sorry, we seem to be experiencing technical difficulties! Please try again later." });
                    console.warn(JSON.stringify(err, null, 2));
                });
            }
            else {
                $scope.doodleRefs = [];
            }
        };

        $scope.doOpen = (doodle: Doodle) => {
            // We know that the Doodle is in Local Storage, but we can avoid
            // a state change by going to the correct state the first time.
            doodles.makeCurrent(doodle);
            if (doodle.gistId) {
                this.navigateTo(STATE_GIST, { gistId: doodle.gistId });
            }
            else {
                this.navigateTo(STATE_DOODLE);
            }
        };

        $scope.doDelete = function(doodle: Doodle) {
            // TODO: DRY. This code also exists in the OpenController.
            modalDialog.confirm({ title: 'Delete', message: `Are you sure you want to delete '${doodle.description}' from your Local Storage?` }).then(function(promiseValue) {
                doodles.deleteDoodle(doodle);
                doodles.updateStorage();
            }).catch(function(reason) {
                switch (reason) {
                    case 'cancel click':
                    case 'escape key press': {
                        // Do nothing.
                        break;
                    }
                    default: {
                        console.warn(JSON.stringify(reason, null, 2));
                    }
                }
            });
        };
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

import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import Doodle from '../services/doodles/Doodle';
import IDoodleManager from '../services/doodles/IDoodleManager';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import {GITHUB_AUTH_MANAGER} from '../services/gham/IGitHubAuthManager';
import HitService from '../services/hits/HitService';
import HomeScope from '../scopes/HomeScope';
import ModalDialog from '../services/modalService/ModalDialog';
import NavigationService from '../modules/navigation/NavigationService';
import StemcArXiv from '../stemcArXiv/StemcArXiv';

/**
 * Manages the Home Page.
 */
export default class HomeController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        'doodles',
        GITHUB_AUTH_MANAGER,
        'ga',
        'hits',
        'modalDialog',
        'navigation',
        'stemcArXiv',
        'FEATURE_DASHBOARD_ENABLED',
        'FEATURE_EXAMPLES_ENABLED',
        'FEATURE_GOOGLE_SIGNIN_ENABLED',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'
    ];

    /**
     *
     */
    constructor(
        $scope: HomeScope,
        $window: angular.IWindowService,
        doodles: IDoodleManager,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        hits: HitService,
        modalDialog: ModalDialog,
        navigation: NavigationService,
        stemcArXiv: StemcArXiv,
        FEATURE_DASHBOARD_ENABLED: boolean,
        FEATURE_EXAMPLES_ENABLED: boolean,
        FEATURE_GOOGLE_SIGNIN_ENABLED: boolean,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string
    ) {
        super($scope, $window, authManager, ga, modalDialog, UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto');

        $scope.FEATURE_DASHBOARD_ENABLED = FEATURE_DASHBOARD_ENABLED;
        $scope.FEATURE_EXAMPLES_ENABLED = FEATURE_EXAMPLES_ENABLED;
        $scope.FEATURE_GOOGLE_SIGNIN_ENABLED = FEATURE_GOOGLE_SIGNIN_ENABLED;

        $scope.goDashboard = () => {
            if (FEATURE_DASHBOARD_ENABLED) {
                navigation.gotoDashboard();
            }
            else {
                console.warn(`FEATURE_DASHBOARD_ENABLED => ${FEATURE_DASHBOARD_ENABLED}`);
            }
        };

        $scope.clickCodeNow = (label?: string, value?: number) => {

            // console.lg(`clickCodeNow(label => ${label}, value => ${value})`);

            // It's now possible to select a doodle from Local Storage, and very
            // easy to select the most recent doodle at the head of the list.
            // We don't want to duplicate that functionality.
            // Instead, we create an empty doodle and leave it to be discovered.
            const doodle = doodles.createDoodle();
            doodles.addHead(doodle);
            doodles.updateStorage();

            navigation.gotoDoodle(label, value);
        };

        $scope.goExamples = () => {
            if (FEATURE_EXAMPLES_ENABLED) {
                navigation.gotoExamples().then(function(promiseValue: any) {
                    // console.lg(`gotoExamples() completed.`);
                }).catch(function(reason: any) {
                    console.warn(`gotoExamples() failed: ${JSON.stringify(reason, null, 2)}`);
                });
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

        //
        // Opening a doodle from Local Storage.
        //
        $scope.doOpen = (doodle: Doodle) => {
            doodles.makeCurrent(doodle);
            // We know that the Doodle is in Local Storage, but we can avoid
            // a state change by going to the correct state the first time.
            if (doodle.owner && doodle.repo) {
                navigation.gotoRepo(doodle.owner, doodle.repo);
            }
            else if (doodle.gistId) {
                navigation.gotoGist(doodle.gistId);
            }
            else {
                navigation.gotoDoodle();
            }
        };

        $scope.doDelete = function(doodle: Doodle) {
            // TODO: DRY. This code also exists in the OpenController.
            modalDialog.confirm({ title: 'Delete', message: `Are you sure you want to delete '${doodle.description}' from your Local Storage?` }).then(function(promiseValue) {
                doodles.deleteDoodle(doodle);
                doodles.updateStorage();
            }).catch(function(reason) {
                switch (reason) {
                    case 'backdrop click':
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
     *
     */
    $onInit(): void {
        console.warn("HomeController.$onInit");
    }

    /**
     *
     */
    $onDestroy(): void {
        console.warn("HomeController.$onDestroy");
    }
}

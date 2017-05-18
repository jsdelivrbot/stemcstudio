import { IWindowService } from 'angular';
import { AbstractPageController } from './AbstractPageController';
import { copyNewProjectSettingsToDoodle } from '../mappings/copyNewProjectSettingsToDoodle';
import Doodle from '../services/doodles/Doodle';
import { DOODLE_MANAGER_SERVICE_UUID, IDoodleManager } from '../services/doodles/IDoodleManager';
import { GITHUB_AUTH_MANAGER_UUID, IGitHubAuthManager } from '../services/gham/IGitHubAuthManager';
import { GOOGLE_ANALYTICS_UUID } from '../fugly/ga/ga';
import HomeScope from '../scopes/HomeScope';
import initNewProjectDefaults from '../mappings/initNewProjectDefaults';
import { ModalDialog } from '../services/modalService/ModalDialog';
import { NAVIGATION_SERVICE_UUID, INavigationService } from '../modules/navigation/INavigationService';
import NewProjectDialog from '../modules/project/NewProjectDialog';
import StemcArXiv from '../modules/stemcArXiv/StemcArXiv';
import { ITranslateService, TRANSLATE_SERVICE_UUID } from '../modules/translate/api';

/**
 * Manages the Home Page.
 */
export class HomeController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        DOODLE_MANAGER_SERVICE_UUID,
        GITHUB_AUTH_MANAGER_UUID,
        GOOGLE_ANALYTICS_UUID,
        'modalDialog',
        NAVIGATION_SERVICE_UUID,
        'newProject',
        'stemcArXiv',
        TRANSLATE_SERVICE_UUID,
        'FEATURE_DASHBOARD_ENABLED',
        'FEATURE_EXAMPLES_ENABLED',
        'FEATURE_GOOGLE_SIGNIN_ENABLED'
    ];

    /**
     *
     */
    constructor(
        $scope: HomeScope,
        $window: IWindowService,
        doodleManager: IDoodleManager,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        navigation: INavigationService,
        newProjectDialog: NewProjectDialog,
        stemcArXiv: StemcArXiv,
        translateService: ITranslateService,
        FEATURE_DASHBOARD_ENABLED: boolean,
        FEATURE_EXAMPLES_ENABLED: boolean,
        FEATURE_GOOGLE_SIGNIN_ENABLED: boolean
    ) {
        super($window, authManager, modalDialog, 'auto');

        $scope.FEATURE_DASHBOARD_ENABLED = FEATURE_DASHBOARD_ENABLED;
        $scope.FEATURE_EXAMPLES_ENABLED = FEATURE_EXAMPLES_ENABLED;
        $scope.FEATURE_GOOGLE_SIGNIN_ENABLED = FEATURE_GOOGLE_SIGNIN_ENABLED;

        $scope.goDashboard = () => {
            if (FEATURE_DASHBOARD_ENABLED) {
                navigation.gotoDash();
            }
            else {
                console.warn(`FEATURE_DASHBOARD_ENABLED => ${FEATURE_DASHBOARD_ENABLED}`);
            }
        };

        $scope.clickCodeNow = (label?: string, value?: number) => {
            newProjectDialog.open(initNewProjectDefaults(doodleManager.suggestName()))
                .then(function (settings) {
                    const doodle = doodleManager.createDoodle();
                    copyNewProjectSettingsToDoodle(settings, doodle);
                    doodleManager.addHead(doodle);
                    doodleManager.updateStorage();
                    navigation.gotoWork();
                })
                .catch(function (reason) {
                    // The user cancelled from the dialog.
                });
        };

        $scope.goExamples = () => {
            if (FEATURE_EXAMPLES_ENABLED) {
                navigation.gotoExamples()
                    .then(function () {
                        // Nothing to do.
                    })
                    .catch(function (reason: any) {
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
        $scope.doodles = function () {
            return doodleManager.filter(function () { return true; });
        };

        $scope.params = { query: '' };

        $scope.doSearch = function () {
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
            doodleManager.makeCurrent(doodle);
            // We know that the Doodle is in Local Storage, but we can avoid
            // a state change by going to the correct state the first time.
            if (doodle.owner && doodle.repo) {
                navigation.gotoRepo(doodle.owner, doodle.repo);
            }
            else if (doodle.gistId) {
                navigation.gotoGist(doodle.gistId);
            }
            else {
                navigation.gotoWork();
            }
        };

        $scope.doDelete = function (doodle: Doodle) {
            // TODO: DRY. This code also exists in the OpenController.
            modalDialog.confirm({ title: 'Delete', message: `Are you sure you want to delete '${doodle.description}' from your Local Storage?` }).then(function () {
                doodleManager.deleteDoodle(doodle);
                doodleManager.updateStorage();
            }).catch(function (reason) {
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
        // This is being called, every time I go to or return to the home page.
    }

    /**
     *
     */
    $onDestroy(): void {
        // However, this is not being called.
        console.warn("HomeController.$onDestroy");
    }
}

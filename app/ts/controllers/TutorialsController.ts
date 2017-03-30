import AbstractPageController from './AbstractPageController';
import Tutorial from '../models/Tutorial';
import TutorialsScope from '../scopes/TutorialsScope';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import { GITHUB_AUTH_MANAGER } from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 * The examples are currently not data-driven and not very pretty!
 */
export default class TutorialsController extends AbstractPageController {

    public static $inject: string[] = [
        '$http',
        '$sce',
        '$scope',
        '$templateCache',
        '$window',
        GITHUB_AUTH_MANAGER,
        'ga',
        'modalDialog',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    constructor(
        $http: ng.IHttpService,
        $sce: ng.ISCEService,
        $scope: TutorialsScope,
        $templateCache: ng.ITemplateCacheService,
        $window: ng.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {
        super($window, authManager, modalDialog, 'auto');

        $scope.tutorials = [];
        const url = 'data/tutorials.json';
        $http.get<Tutorial[]>(url, { cache: $templateCache })
            .then(function (response) {
                if (Array.isArray(response.data)) {
                    $scope.tutorials = response.data.map(function (tutorial) {
                        tutorial.gistUrl = $sce.trustAsResourceUrl(`/#/gists/${tutorial.gistId}?output=embed`);
                        tutorial.showEmbedded = false;
                        return tutorial;
                    });
                }
            })
            .catch(function (err) {
                console.warn(`Unable to get ${url}. Cause: ${err}`);
            });

        $scope.toggleShowEmbedded = function (gistId: string): void {
            $scope.tutorials.forEach(function (tutorial) {
                if (tutorial.gistId === gistId) {
                    tutorial.showEmbedded = !tutorial.showEmbedded;
                }
            });
        };
    }
}

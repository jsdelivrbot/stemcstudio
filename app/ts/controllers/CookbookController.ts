import { IHttpService, ISCEService, ITemplateCacheService, IWindowService } from 'angular';
import AbstractPageController from './AbstractPageController';
import Tutorial from '../models/Tutorial';
import TutorialsScope from '../scopes/TutorialsScope';
import { GITHUB_AUTH_MANAGER_UUID, IGitHubAuthManager } from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 *
 */
export default class CookbookController extends AbstractPageController {

    public static $inject: string[] = [
        '$http',
        '$sce',
        '$scope',
        '$templateCache',
        '$window',
        GITHUB_AUTH_MANAGER_UUID,
        'ga',
        'modalDialog',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    constructor(
        $http: IHttpService,
        $sce: ISCEService,
        $scope: TutorialsScope,
        $templateCache: ITemplateCacheService,
        $window: IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {
        super($window, authManager, modalDialog, 'auto');

        $scope.tutorials = [];
        const url = `data/cookbook.json?bust=${Date.now()}`;
        $http.get<Tutorial[]>(url, { cache: $templateCache })
            .then(function (promiseValue) {
                if (Array.isArray(promiseValue.data)) {
                    $scope.tutorials = promiseValue.data.map(function (tutorial) {
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

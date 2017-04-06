import { IWindowService } from 'angular';
import BodyScope from '../scopes/BodyScope';
import AbstractPageController from './AbstractPageController';
import { GITHUB_AUTH_MANAGER_UUID, IGitHubAuthManager } from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 * Controller when the project is based upon a GitHub repository.
 */
export default class RepoController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        GITHUB_AUTH_MANAGER_UUID,
        'ga',
        'modalDialog',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'
    ];
    constructor(
        $scope: BodyScope,
        $window: IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {
        super($window, authManager, modalDialog, 'hidden');
    }
    $onInit(): void {
        // This will not be called because this is a routing controller.
        console.warn("RepoController.$onDestroy()");
    }
    $onDestroy(): void {
        // This will not be called because this is a routing controller.
        console.warn("RepoController.$onDestroy()");
    }
}

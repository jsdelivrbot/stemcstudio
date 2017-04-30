import { IWindowService } from 'angular';
import { BodyScope } from '../scopes/BodyScope';
import { AbstractPageController } from './AbstractPageController';
import { GITHUB_AUTH_MANAGER_UUID, IGitHubAuthManager } from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';
import { GOOGLE_ANALYTICS_UUID } from '../fugly/ga/ga';

/**
 * Controller when the project is based upon a GitHub repository.
 */
export class RepoController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        GITHUB_AUTH_MANAGER_UUID,
        GOOGLE_ANALYTICS_UUID,
        'modalDialog'
    ];
    constructor(
        $scope: BodyScope,
        $window: IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog) {
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

import { IWindowService } from 'angular';
import { AbstractPageController } from './AbstractPageController';
import { DashboardScope } from '../scopes/DashboardScope';
import { GITHUB_AUTH_MANAGER_UUID, IGitHubAuthManager } from '../services/gham/IGitHubAuthManager';
import { GOOGLE_ANALYTICS_UUID } from '../fugly/ga/ga';
import { ModalDialog } from '../services/modalService/ModalDialog';

export class DashboardController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        GITHUB_AUTH_MANAGER_UUID,
        GOOGLE_ANALYTICS_UUID,
        'modalDialog'
    ];

    constructor(
        $scope: DashboardScope,
        $window: IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog) {
        super($window, authManager, modalDialog, 'auto');
    }
}

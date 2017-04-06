import { IWindowService } from 'angular';
import AbstractPageController from './AbstractPageController';
import DashboardScope from '../scopes/DashboardScope';
import { GITHUB_AUTH_MANAGER_UUID, IGitHubAuthManager } from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

export default class DashboardController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        GITHUB_AUTH_MANAGER_UUID,
        'ga',
        'modalDialog',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    constructor(
        $scope: DashboardScope,
        $window: IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {
        super($window, authManager, modalDialog, 'auto');
    }
}

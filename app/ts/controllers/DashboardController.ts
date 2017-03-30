import AbstractPageController from './AbstractPageController';
import DashboardScope from '../scopes/DashboardScope';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import { GITHUB_AUTH_MANAGER } from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

export default class DashboardController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        GITHUB_AUTH_MANAGER,
        'ga',
        'modalDialog',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    constructor(
        $scope: DashboardScope,
        $window: ng.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {
        super($window, authManager, modalDialog, 'auto');
    }
}

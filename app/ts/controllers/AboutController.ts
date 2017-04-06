import AboutScope from '../scopes/AboutScope';
import AbstractPageController from './AbstractPageController';
import { IWindowService } from 'angular';
import { GITHUB_AUTH_MANAGER_UUID, IGitHubAuthManager } from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

export default class AboutController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        GITHUB_AUTH_MANAGER_UUID,
        'ga',
        'modalDialog',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'];
    constructor(
        $scope: AboutScope,
        $window: IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {
        super($window, authManager, modalDialog, 'hidden');
    }
}

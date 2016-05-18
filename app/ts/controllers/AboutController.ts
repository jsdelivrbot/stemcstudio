import * as angular from 'angular';
import AboutScope from '../scopes/AboutScope';
import AbstractPageController from './AbstractPageController';
import IDoodleManager from '../services/doodles/IDoodleManager';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

export default class AboutController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$state',
        '$window',
        'GitHubAuthManager',
        'ga',
        'modalDialog',
        'doodles',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'];
    constructor(
        $scope: AboutScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        doodles: IDoodleManager,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {

        super($scope, $state, $window, authManager, ga, modalDialog, UNIVERSAL_ANALYTICS_TRACKING_ID, 'hidden');
    }
}

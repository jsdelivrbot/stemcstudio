import * as angular from 'angular';
import AboutScope from '../scopes/AboutScope';
import AbstractPageController from './AbstractPageController';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

export default class AboutController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        'GitHubAuthManager',
        'ga',
        'modalDialog',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'];
    constructor(
        $scope: AboutScope,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {
        super($scope, $window, authManager, ga, modalDialog, UNIVERSAL_ANALYTICS_TRACKING_ID, 'hidden');
    }
}

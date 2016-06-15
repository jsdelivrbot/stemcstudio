import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import DashboardScope from '../scopes/DashboardScope';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 * The examples are currently not data-driven and not very pretty!
 * 
 * @class DashboardController
 */
export default class DashboardController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$state',
        '$stateParams',
        '$http',
        '$location',
        '$timeout',
        '$window',
        'GitHubAuthManager',
        'ga',
        'modalDialog',
        'STATE_GIST',
        'STATE_REPO',
        'STATE_ROOM',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    constructor(
        $scope: DashboardScope,
        $state: angular.ui.IStateService,
        $stateParams: angular.ui.IStateParamsService,
        http: angular.IHttpService,
        $location: angular.ILocationService,
        $timeout: angular.ITimeoutService,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        STATE_GIST: string,
        STATE_REPO: string,
        STATE_ROOM: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {
        super($scope, $state, $window, authManager, ga, modalDialog, STATE_GIST, STATE_REPO, STATE_ROOM, UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto');
    }
}

import * as angular from 'angular';
import BodyScope from '../scopes/BodyScope';
import AbstractPageController from './AbstractPageController';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 * Controller when the project is based upon a GitHub repository.
 *
 * @class RepoController
 * @extends AbstractPageController
 */
export default class RepoController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$state',
        '$window',
        'GitHubAuthManager',
        'ga',
        'modalDialog',
        'STATE_GIST',
        'STATE_REPO',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'
    ];
    constructor(
        $scope: BodyScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        STATE_GIST: string,
        STATE_REPO: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {
        super($scope, $state, $window, authManager, ga, modalDialog, STATE_GIST, STATE_REPO, UNIVERSAL_ANALYTICS_TRACKING_ID, 'hidden');
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

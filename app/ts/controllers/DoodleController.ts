import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import IDoodleManager from '../services/doodles/IDoodleManager';
import DoodleScope from '../scopes/DoodleScope';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import ITemplate from '../services/templates/ITemplate';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 * This class could probably be merged with the WorkspaceController?
 *
 * @class DoodleController
 * @extends AbstractPageController
 */
export default class DoodleController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$state',
        '$window',
        'GitHubAuthManager',
        'templates',
        'ga',
        'modalDialog',
        'doodles',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'];
    constructor(
        $scope: DoodleScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        templates: ITemplate[],
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        doodles: IDoodleManager,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {

        super($scope, $state, $window, authManager, ga, modalDialog, UNIVERSAL_ANALYTICS_TRACKING_ID, 'hidden');

        // ExplorerMixin implementation.
        $scope.isExplorerVisible = true;
        $scope.toggleExplorer = function() {
            $scope.isExplorerVisible = !$scope.isExplorerVisible;
        };

        $scope.templates = templates;

        $scope.doNew = (label?: string, value?: number) => {
            this.navigateTo('new');
        };

        $scope.doOpen = (label?: string, value?: number) => {
            this.navigateTo('open');
        };

        $scope.doCopy = (label?: string, value?: number) => {
            this.navigateTo('copy');
        };

        $scope.doProperties = (label?: string, value?: number) => {
            this.navigateTo('properties');
        };
    }

    $onInit(): void {
        // This is not called. Maybe because it's a routing controller?
    }

    $onDestroy(): void {
        // This is not called. Maybe because it's a routing controller?
    }
}

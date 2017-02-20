import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import DoodleScope from '../scopes/DoodleScope';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import { GITHUB_AUTH_MANAGER } from '../services/gham/IGitHubAuthManager';
import ITemplate from '../services/templates/ITemplate';
import ModalDialog from '../services/modalService/ModalDialog';
import NavigationService from '../modules/navigation/NavigationService';

/**
 * This class could probably be merged with the WorkspaceController?
 */
export default class DoodleController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        GITHUB_AUTH_MANAGER,
        'templates',
        'ga',
        'modalDialog',
        'navigation',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'];
    constructor(
        $scope: DoodleScope,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        templates: ITemplate[],
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        navigation: NavigationService,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {

        super($window, authManager, modalDialog, 'hidden');

        // ExplorerMixin implementation.
        $scope.isExplorerVisible = true;
        $scope.toggleExplorer = function () {
            $scope.isExplorerVisible = !$scope.isExplorerVisible;
        };

        // ProblemsMixin implementation.
        $scope.isProblemsVisible = true;
        $scope.toggleProblems = function () {
            $scope.isProblemsVisible = !$scope.isProblemsVisible;
        };

        $scope.templates = templates;

        $scope.doNew = (label?: string, value?: number) => {
            navigation.gotoNew(label, value);
        };

        $scope.doOpen = (label?: string, value?: number) => {
            navigation.gotoOpen(label, value);
        };

        $scope.doCopy = (label?: string, value?: number) => {
            navigation.gotoCopy(label, value);
        };
    }

    $onInit(): void {
        // This is not called. Maybe because it's a routing controller?
    }

    $onDestroy(): void {
        // This is not called. Maybe because it's a routing controller?
    }
}

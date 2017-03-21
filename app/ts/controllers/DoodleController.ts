import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import copyNewProjectSettingsToDoodle from '../mappings/copyNewProjectSettingsToDoodle';
import DoodleScope from '../scopes/DoodleScope';
import IDoodleManager from '../services/doodles/IDoodleManager';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import { GITHUB_AUTH_MANAGER } from '../services/gham/IGitHubAuthManager';
import initNewProjectDefaults from '../mappings/initNewProjectDefaults';
import ITemplate from '../services/templates/ITemplate';
import ModalDialog from '../services/modalService/ModalDialog';
import NavigationService from '../modules/navigation/NavigationService';
import NewProjectService from '../modules/project/NewProjectService';

/**
 * This class could probably be merged with the WorkspaceController?
 */
export default class DoodleController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        'doodles',
        GITHUB_AUTH_MANAGER,
        'templates',
        'ga',
        'modalDialog',
        'navigation',
        'newProject',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'];
    constructor(
        $scope: DoodleScope,
        $window: angular.IWindowService,
        doodles: IDoodleManager,
        authManager: IGitHubAuthManager,
        templates: ITemplate[],
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        navigation: NavigationService,
        newProject: NewProjectService,
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
            newProject.open(initNewProjectDefaults(doodles.suggestName()))
                .then(function (settings) {
                    const doodle = doodles.createDoodle();
                    copyNewProjectSettingsToDoodle(settings, doodle);
                    doodles.addHead(doodle);
                    doodles.updateStorage();
                    navigation.gotoDoodle();
                })
                .catch(function (reason) {
                    // The user cancelled from the dialog.
                });
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

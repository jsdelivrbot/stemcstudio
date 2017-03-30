import AbstractPageController from './AbstractPageController';
import copyDoodleToDoodle from '../mappings/copyDoodleToDoodle';
import copyNewProjectSettingsToDoodle from '../mappings/copyNewProjectSettingsToDoodle';
import DoodleScope from '../scopes/DoodleScope';
import IDoodleManager from '../services/doodles/IDoodleManager';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import { GITHUB_AUTH_MANAGER } from '../services/gham/IGitHubAuthManager';
import initNewProjectDefaults from '../mappings/initNewProjectDefaults';
import ITemplate from '../services/templates/ITemplate';
import ModalDialog from '../services/modalService/ModalDialog';
import NavigationService from '../modules/navigation/NavigationService';
import NewProjectDialog from '../modules/project/NewProjectDialog';
import OpenProjectDialog from '../modules/project/OpenProjectDialog';
import CopyProjectDialog from '../modules/project/CopyProjectDialog';
import CopyProjectSettings from '../modules/project/CopyProjectSettings';

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
        'openProject',
        'copyProject',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'];
    constructor(
        $scope: DoodleScope,
        $window: ng.IWindowService,
        doodles: IDoodleManager,
        authManager: IGitHubAuthManager,
        templates: ITemplate[],
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        navigation: NavigationService,
        newProjectDialog: NewProjectDialog,
        openProjectDialog: OpenProjectDialog,
        copyProjectDialog: CopyProjectDialog,
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
            newProjectDialog.open(initNewProjectDefaults(doodles.suggestName()))
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
            openProjectDialog.open({})
                .then(function (settings) {
                    const doodle = settings.doodle;
                    if (doodle) {
                        doodles.makeCurrent(doodle);
                        doodles.updateStorage();
                        if (doodle.owner && doodle.repo) {
                            navigation.gotoRepo(doodle.owner, doodle.repo);
                        }
                        else if (doodle.gistId) {
                            navigation.gotoGist(doodle.gistId);
                        }
                        else {
                            navigation.gotoDoodle();
                        }
                    }
                })
                .catch(function (reason) {
                    // The user cancelled from the dialog.
                });
        };

        $scope.doCopy = (label?: string, value?: number) => {
            const original = doodles.current();
            if (original) {
                const description = <string>original.description;
                const version = <string>original.version;
                const defaults: CopyProjectSettings = { description, version };
                copyProjectDialog.open(defaults)
                    .then(function (settings) {
                        const doodle = doodles.createDoodle();

                        if (original) {
                            copyDoodleToDoodle(original, doodle);
                        }

                        doodle.author = void 0;
                        doodle.created_at = void 0;
                        doodle.gistId = void 0;
                        if (original) {
                            doodle.isCodeVisible = original.isCodeVisible;
                            doodle.isViewVisible = original.isViewVisible;
                            doodle.keywords = original.keywords;
                            doodle.name = 'copy-of-' + original.name;
                        }
                        doodle.lastKnownJs = {};
                        doodle.lastKnownJsMap = {};
                        doodle.owner = void 0;
                        doodle.repo = void 0;
                        doodle.updated_at = void 0;

                        doodle.description = settings.description;
                        doodle.version = settings.version;

                        doodles.addHead(doodle);

                        if (doodle) {
                            doodles.makeCurrent(doodle);
                            doodles.updateStorage();
                            if (doodle.owner && doodle.repo) {
                                navigation.gotoRepo(doodle.owner, doodle.repo);
                            }
                            else if (doodle.gistId) {
                                navigation.gotoGist(doodle.gistId);
                            }
                            else {
                                navigation.gotoDoodle();
                            }
                        }
                    })
                    .catch(function (reason) {
                        // The user cancelled from the dialog.
                    });
            }
        };
    }

    $onInit(): void {
        // This is not called. Maybe because it's a routing controller?
    }

    $onDestroy(): void {
        // This is not called. Maybe because it's a routing controller?
    }
}

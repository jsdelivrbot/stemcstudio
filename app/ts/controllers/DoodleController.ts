import { IWindowService } from 'angular';
import { AbstractPageController } from './AbstractPageController';
import copyDoodleToDoodle from '../mappings/copyDoodleToDoodle';
import { copyNewProjectSettingsToDoodle } from '../mappings/copyNewProjectSettingsToDoodle';
import { DoodleScope } from '../scopes/DoodleScope';
import { DOODLE_MANAGER_SERVICE_UUID, IDoodleManager } from '../services/doodles/IDoodleManager';
import { GITHUB_AUTH_MANAGER_UUID, IGitHubAuthManager } from '../services/gham/IGitHubAuthManager';
import { GOOGLE_ANALYTICS_UUID } from '../fugly/ga/ga';
import initNewProjectDefaults from '../mappings/initNewProjectDefaults';
import { ITemplate } from '../services/templates/template';
import { ModalDialog } from '../services/modalService/ModalDialog';
import { NAVIGATION_SERVICE_UUID, INavigationService } from '../modules/navigation/INavigationService';
import NewProjectDialog from '../modules/project/NewProjectDialog';
import OpenProjectDialog from '../modules/project/OpenProjectDialog';
import CopyProjectDialog from '../modules/project/CopyProjectDialog';
import CopyProjectSettings from '../modules/project/CopyProjectSettings';

/**
 * This class could probably be merged with the WorkspaceController?
 */
export class DoodleController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        DOODLE_MANAGER_SERVICE_UUID,
        GITHUB_AUTH_MANAGER_UUID,
        'templates',
        GOOGLE_ANALYTICS_UUID,
        'modalDialog',
        NAVIGATION_SERVICE_UUID,
        'newProject',
        'openProject',
        'copyProject'];
    constructor(
        $scope: DoodleScope,
        $window: IWindowService,
        doodleManager: IDoodleManager,
        authManager: IGitHubAuthManager,
        templates: ITemplate[],
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        navigation: INavigationService,
        newProjectDialog: NewProjectDialog,
        openProjectDialog: OpenProjectDialog,
        copyProjectDialog: CopyProjectDialog) {

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

        $scope.doNew = () => {
            newProjectDialog.open(initNewProjectDefaults(doodleManager.suggestName()))
                .then(function (settings) {
                    const doodle = doodleManager.createDoodle();
                    copyNewProjectSettingsToDoodle(settings, doodle);
                    doodleManager.addHead(doodle);
                    doodleManager.updateStorage();
                    navigation.gotoWork();
                })
                .catch(function (reason) {
                    // The user cancelled from the dialog.
                });
        };

        $scope.doOpen = () => {
            openProjectDialog.open({})
                .then(function (settings) {
                    const doodle = settings.doodle;
                    if (doodle) {
                        doodleManager.makeCurrent(doodle);
                        doodleManager.updateStorage();
                        if (doodle.owner && doodle.repo) {
                            navigation.gotoRepo(doodle.owner, doodle.repo);
                        }
                        else if (doodle.gistId) {
                            navigation.gotoGist(doodle.gistId);
                        }
                        else {
                            navigation.gotoWork();
                        }
                    }
                })
                .catch(function (reason) {
                    // The user cancelled from the dialog.
                });
        };

        $scope.doCopy = () => {
            const original = doodleManager.current();
            if (original) {
                const description = <string>original.description;
                const version = <string>original.version;
                const defaults: CopyProjectSettings = { description, version };
                copyProjectDialog.open(defaults)
                    .then(function (settings) {
                        const doodle = doodleManager.createDoodle();

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

                        doodleManager.addHead(doodle);

                        if (doodle) {
                            doodleManager.makeCurrent(doodle);
                            doodleManager.updateStorage();
                            if (doodle.owner && doodle.repo) {
                                navigation.gotoRepo(doodle.owner, doodle.repo);
                            }
                            else if (doodle.gistId) {
                                navigation.gotoGist(doodle.gistId);
                            }
                            else {
                                navigation.gotoWork();
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

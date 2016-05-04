import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import Base64Service from '../services/base64/Base64Service';
import ICloud from '../services/cloud/ICloud';
import IDoodleManager from '../services/doodles/IDoodleManager';
import DoodleScope from '../scopes/DoodleScope';
import GitHubService from '../services/github/GitHubService';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import IOptionManager from '../services/options/IOptionManager';
import ISettingsService from '../services/settings/ISettingsService';
import ITemplate from '../services/templates/ITemplate';
import IUuidService from '../services/uuid/IUuidService';

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
        '$stateParams',
        '$http',
        '$location',
        '$timeout',
        '$window',
        'base64',
        'GitHub',
        'GitHubAuthManager',
        'cloud',
        'templates',
        'uuid4',
        'ga',
        'doodlesKey',
        'doodles',
        'options',
        'FEATURE_GIST_ENABLED',
        'FEATURE_REPO_ENABLED',
        'FILENAME_HTML',
        'FILENAME_CODE',
        'FILENAME_LIBS',
        'FILENAME_LESS',
        'FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS',
        'FILENAME_TYPESCRIPT_CURRENT_LIB_DTS',
        'STATE_GIST',
        'STYLE_MARKER',
        'SCRIPTS_MARKER',
        'CODE_MARKER',
        'LIBS_MARKER',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
        'VENDOR_FOLDER_MARKER',
        'settings']
    constructor(
        $scope: DoodleScope,
        $state: angular.ui.IStateService,
        $stateParams: angular.ui.IStateParamsService,
        http: angular.IHttpService,
        $location: angular.ILocationService,
        $timeout: angular.ITimeoutService,
        $window: angular.IWindowService,
        base64: Base64Service,
        github: GitHubService,
        authManager: IGitHubAuthManager,
        cloud: ICloud,
        templates: ITemplate[],
        uuid4: IUuidService,
        ga: UniversalAnalytics.ga,
        doodlesKey: string,
        doodles: IDoodleManager,
        options: IOptionManager,
        FEATURE_GIST_ENABLED: boolean,
        FEATURE_REPO_ENABLED: boolean,
        FILENAME_HTML: string,
        FILENAME_CODE: string,
        FILENAME_LIBS: string,
        FILENAME_LESS: string,
        FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS: string,
        FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
        STATE_GIST: string,
        STYLE_MARKER: string,
        SCRIPTS_MARKER: string,
        CODE_MARKER: string,
        LIBS_MARKER: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string,
        VENDOR_FOLDER_MARKER: string,
        settings: ISettingsService) {

        super($scope, $window, authManager, ga, UNIVERSAL_ANALYTICS_TRACKING_ID, 'hidden')

        // ExplorerMixin implementation.
        $scope.isExplorerVisible = true
        $scope.toggleExplorer = function() {
            $scope.isExplorerVisible = !$scope.isExplorerVisible
        }

        $scope.templates = templates;

        $scope.doNew = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'new', label, value);
            $state.go('new');
        };

        $scope.doOpen = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'open', label, value);
            $state.go('open');
        };

        $scope.doCopy = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'copy', label, value);
            $state.go('copy');
        };

        $scope.doProperties = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'properties', label, value);
            $state.go('properties', { doodle: doodles.current() });
        };

        $scope.goHome = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'goHome', label, value);
            $state.go('home');
        };

        $scope.doHelp = function() {
            // Do nothing.
        };
    }

    $onInit(): void {
        // This is not called. Maybe because it's a routing controller?
    }

    $onDestroy(): void {
        // This is not called. Maybe because it's a routing controller?
    }
}

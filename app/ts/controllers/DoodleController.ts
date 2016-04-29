import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import ICloud from '../services/cloud/ICloud';
import CookieService from '../services/cookie/CookieService';
import IDoodleManager from '../services/doodles/IDoodleManager';
import DoodleScope from '../scopes/DoodleScope';
import GistData from '../services/gist/GistData';
import GitHubService from '../services/github/GitHubService';
import PatchGistResponse from '../services/github/PatchGistResponse';
import PostGistResponse from '../services/github/PostGistResponse';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import IOptionManager from '../services/options/IOptionManager';
import ISettingsService from '../services/settings/ISettingsService';
import ITemplate from '../services/templates/ITemplate';
import doodleToGist from '../utils/doodleToGist';
import IUuidService from '../services/uuid/IUuidService';

import BootstrapDialog from 'bootstrap-dialog';

/**
 * This class could probably be merged with the WorkspaceController?
 *
 * @class DoodleController
 * @extends AppController
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
        'GitHub',
        'GitHubAuthManager',
        'cloud',
        'cookie',
        'templates',
        'uuid4',
        'ga',
        'doodlesKey',
        'doodles',
        'options',
        'FILENAME_META',
        'FILENAME_HTML',
        'FILENAME_CODE',
        'FILENAME_LIBS',
        'FILENAME_LESS',
        'FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS',
        'FILENAME_TYPESCRIPT_CURRENT_LIB_DTS',
        'STATE_GISTS',
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
        github: GitHubService,
        authManager: IGitHubAuthManager,
        cloud: ICloud,
        cookie: CookieService,
        templates: ITemplate[],
        uuid4: IUuidService,
        ga: UniversalAnalytics.ga,
        doodlesKey: string,
        doodles: IDoodleManager,
        options: IOptionManager,
        FILENAME_META: string,
        FILENAME_HTML: string,
        FILENAME_CODE: string,
        FILENAME_LIBS: string,
        FILENAME_LESS: string,
        FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS: string,
        FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
        STATE_GISTS: string,
        STYLE_MARKER: string,
        SCRIPTS_MARKER: string,
        CODE_MARKER: string,
        LIBS_MARKER: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string,
        VENDOR_FOLDER_MARKER: string,
        settings: ISettingsService) {

        super($scope, $window, authManager, ga, UNIVERSAL_ANALYTICS_TRACKING_ID, 'hidden')

        const GITHUB_TOKEN_COOKIE_NAME = 'github-token';

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

        $scope.doUpload = function(label?: string, value?: number) {
            ga('send', 'event', 'doodle', 'upload', label, value);
            const token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
            if (token) {
                const doodle = doodles.current();
                const data: GistData = doodleToGist(doodle, options);
                const gistId = doodle.gistId;
                if (gistId) {
                    github.patchGist(token, gistId, data, function(err: any, response: PatchGistResponse, status: number, headers, config) {
                        if (err) {
                            if (status === 404) {
                                if (confirm("The Gist associated with your doodle no longer exists.\nWould you like me to disassociate your doodle so that you can create a new Gist?")) {
                                    doodle.gistId = undefined;
                                    doodles.updateStorage();
                                }
                            }
                            else {
                                console.warn(`PATCH ${JSON.stringify(data, null, 2)}`)
                                // If the status is 404 then the Gist no longer exists on GitHub.
                                // We might as well set the gistId to undefined and let the user try to POST.
                                alert("status: " + JSON.stringify(status));
                                alert("err: " + JSON.stringify(err));
                                alert("response: " + JSON.stringify(response));
                            }
                        }
                        else {
                            doodle.emptyTrash();
                            doodle.updated_at = response.updated_at;

                            doodles.updateStorage();

                            BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_SUCCESS,
                                title: $("<h3>Upload complete</h3>"),
                                message: "Your doodle was successfully uploaded and patched the existing Gist.",
                                buttons: [{
                                    label: "Close",
                                    cssClass: 'btn btn-primary',
                                    action: function(dialog: IBootstrapDialog) {
                                        $state.go(STATE_GISTS, { gistId: gistId });
                                        dialog.close();
                                    }
                                }]
                            });
                        }
                    });
                }
                else {
                    github.postGist(token, data, function(err: any, response: PostGistResponse, status: number, headers, config) {
                        if (err) {
                            console.warn(`POST ${JSON.stringify(data, null, 2)}`)
                            BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_DANGER,
                                title: $("<h3>Upload failed</h3>"),
                                message: "Unable to post your Gist at this time.",
                                buttons: [{
                                    label: "Close",
                                    cssClass: 'btn btn-primary',
                                    action: function(dialog: IBootstrapDialog) {
                                        dialog.close();
                                    }
                                }]
                            });
                        }
                        else {
                            doodle.gistId = response.id;
                            doodle.created_at = response.created_at;
                            doodle.updated_at = response.updated_at;

                            doodles.updateStorage();

                            BootstrapDialog.show({
                                type: BootstrapDialog.TYPE_SUCCESS,
                                title: $("<h3>Upload complete</h3>"),
                                message: "Your doodle was successfully uploaded and associated with a new Gist.",
                                buttons: [{
                                    label: "Close",
                                    cssClass: 'btn btn-primary',
                                    action: function(dialog: IBootstrapDialog) {
                                        $state.go(STATE_GISTS, { gistId: doodles.current().gistId });
                                        dialog.close();
                                    }
                                }]
                            });
                        }
                    });
                }
            }
            else {
                BootstrapDialog.alert({
                    type: BootstrapDialog.TYPE_INFO,
                    message: "You must be logged in."
                });
            }
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

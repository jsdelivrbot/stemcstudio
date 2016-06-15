import * as angular from 'angular';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';
import BodyScope from '../scopes/BodyScope';

/**
 * This class is intended to serve as an abstract base, not as a concrete controller.
 * It's main purpose is to DRY (Don't Repeat Yourself) the derived classes.
 *
 * @class AbstractPageController
 */
export default class AbstractPageController {
    // We're not a concrete controller so we don't need to declare our dependencies.
    /**
     * @class AbstractPageController
     * @constructor
     * @param $scope {BodyScope}
     * @param $window {IWindowService}
     * @param authManager {IGitHubAuthManager}
     * @param UNIVERSAL_ANALYTICS_TRACKING_ID {string}
     * @param overflow {string} 'hidden' or 'auto' to control scrollbars on the page.
     */
    constructor(
        $scope: BodyScope,
        private $state: angular.ui.IStateService,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        private ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        private STATE_GIST: string,
        private STATE_REPO: string,
        private STATE_ROOM: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string,
        overflow: string) {

        // Our main reponsibility is handling the GitHub OAuth callback.
        authManager.handleGitHubLoginCallback(function(err, token: string) {
            if (err) {
                modalDialog.alert({ title: 'Login', message: err.message });
            }
        });

        // ga('send', 'pageview');

        // We don't use a scrollbar on the editing page to avoid double scrollbars
        // which is very annoying. However, that means that we must be careful to put
        // them back on the other pages.
        $window.document.body.style.overflow = overflow;

        $scope.goLogin = (label?: string, value?: number) => {
            const destination = 'login';
            this.navigateTo(destination, void 0, void 0, label, value)
                .then(function(promiseValue: any) {
                    // console.lg(`navigateTo('${destination}') completed.`);
                })
                .catch(function(reason: any) {
                    console.warn(`navigateTo('${destination}') failed.`);
                });
        };

        $scope.goSearch = (label?: string, value?: number) => {
            const destination = 'search';
            this.navigateTo(destination, void 0, void 0, label, value)
                .then(function(promiseValue: any) {
                    // console.lg(`navigateTo('${destination}') completed.`);
                })
                .catch(function(reason: any) {
                    console.warn(`navigateTo('${destination}') failed.`);
                });
        };
    }

    protected navigateToGist(gistId: string) {
        return this.navigateTo(this.STATE_GIST, { gistId });
    }

    protected navigateToRepo(owner: string, repo: string) {
        return this.navigateTo(this.STATE_REPO, { owner, repo });
    }

    protected navigateToRoom(roomId: string) {
        return this.navigateTo(this.STATE_ROOM, { roomId });
    }

    /**
     * DRY This also exists in BodyController.
     * @method navigateTo
     * @param to {string}
     * @param [params] {}
     * @param [options] {IStateOptions}
     * @param [label] {string} Contextual information from UI.
     * @param [value] {string} Contextual information from UI.
     * @return {IPromise}
     */
    protected navigateTo(to: string, params?: {}, options?: angular.ui.IStateOptions, label?: string, value?: number): angular.IPromise<any> {
        this.ga('send', 'event', 'navigateTo', to, label, value);
        return this.$state.go(to, params, options);
    }
}

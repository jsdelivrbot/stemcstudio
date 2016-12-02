import * as angular from 'angular';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';
import BodyScope from '../scopes/BodyScope';

/**
 * This class is intended to serve as an abstract base, not as a concrete controller.
 * It's main purpose is to DRY (Don't Repeat Yourself) the derived classes.
 */
export default class AbstractPageController {
    // We're not a concrete controller so we don't need to declare our dependencies.
    /**
     * @param $scope 
     * @param $window
     * @param authManager
     * @param UNIVERSAL_ANALYTICS_TRACKING_ID
     * @param overflow 'hidden' or 'auto' to control scrollbars on the page.
     */
    constructor(
        $scope: BodyScope,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        private ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string,
        overflow: string) {

        // Our main reponsibility is handling the GitHub OAuth callback.
        authManager.handleGitHubLoginCallback(function (err: Error, token: string) {
            if (err) {
                modalDialog.alert({ title: 'Login', message: err.message });
            }
        });

        // We don't use a scrollbar on the editing page to avoid double scrollbars
        // which is very annoying. However, that means that we must be careful to put
        // them back on the other pages.
        $window.document.body.style.overflow = overflow;
    }
}

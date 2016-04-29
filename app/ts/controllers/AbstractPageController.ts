import * as angular from 'angular';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import AppScope from '../AppScope';

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
     * @param $scopr {AppScope}
     * @param $window {IWindowService}
     * @param authManager {IGitHubAuthManager}
     * @param UNIVERSAL_ANALYTICS_TRACKING_ID {string}
     * @param overflow {string} 'hidden' or 'auto' to control scrollbars on the page.
     */
    constructor(
        $scope: AppScope,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string,
        overflow: string) {

        // Our main reponsibility is handling the GitHub OAuth callback.
        authManager.handleGitHubLoginCallback(function(err, token: string) {
            if (err) {
                $scope.alert(err.message);
            }
        });

        // Google Universal Analytics.
        // Reminder: Do not create multiple trackers in this (single page) app.
        ga('create', UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto');
        ga('send', 'pageview');

        // We don't use a scrollbar on the editing page to avoid double scrollbars
        // which is very annoying. However, that means that we must be careful to put
        // them back on the other pages.
        $window.document.body.style.overflow = overflow;
    }
}

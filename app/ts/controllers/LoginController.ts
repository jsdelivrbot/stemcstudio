import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import CredentialsService from '../services/credentials/CredentialsService';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import HitService from '../services/hits/HitService';
import LoginScope from '../scopes/LoginScope';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 * @class LoginController
 */
export default class LoginController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$state',
        '$window',
        'credentials',
        'GitHubAuthManager',
        'ga',
        'hits',
        'modalDialog',
        'FEATURE_DASHBOARD_ENABLED',
        'FEATURE_EXAMPLES_ENABLED',
        'FEATURE_GITHUB_SIGNIN_ENABLED',
        'FEATURE_GOOGLE_SIGNIN_ENABLED',
        'FEATURE_TWITTER_SIGNIN_ENABLED',
        'FEATURE_FACEBOOK_SIGNIN_ENABLED',
        'STATE_DASHBOARD',
        'STATE_DOODLE',
        'STATE_EXAMPLES',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    constructor(
        $scope: LoginScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService,
        credentials: CredentialsService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        hits: HitService,
        modalDialog: ModalDialog,
        FEATURE_DASHBOARD_ENABLED: boolean,
        FEATURE_EXAMPLES_ENABLED: boolean,
        FEATURE_GITHUB_SIGNIN_ENABLED: boolean,
        FEATURE_GOOGLE_SIGNIN_ENABLED: boolean,
        FEATURE_TWITTER_SIGNIN_ENABLED: boolean,
        FEATURE_FACEBOOK_SIGNIN_ENABLED: boolean,
        STATE_DASHBOARD: string,
        STATE_DOODLE: string,
        STATE_EXAMPLES: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string
    ) {
        super($scope, $state, $window, authManager, ga, modalDialog, UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto');

        $scope.FEATURE_GITHUB_SIGNIN_ENABLED = FEATURE_GITHUB_SIGNIN_ENABLED;
        $scope.FEATURE_GOOGLE_SIGNIN_ENABLED = FEATURE_GOOGLE_SIGNIN_ENABLED;
        $scope.FEATURE_TWITTER_SIGNIN_ENABLED = FEATURE_TWITTER_SIGNIN_ENABLED;
        $scope.FEATURE_FACEBOOK_SIGNIN_ENABLED = FEATURE_FACEBOOK_SIGNIN_ENABLED;

        $scope.googleSignInOptions = {
            scope: 'profile email',
            width: 240,
            height: 34, // The height of the buttons in the toolbar.
            longtitle: true,
            theme: 'dark',
            onsuccess: function(googleUser: gapi.auth2.GoogleUser) {
                $scope.$apply(function() {
                    const id_token = googleUser.getAuthResponse().id_token;
                    credentials.googleSignIn(id_token);
                });
            },
            onfailure: function(error: any) {
                credentials.googleSignIn(void 0);
                console.warn(error);
            }
        };
    }

    $onInit(): void {
        console.warn("This is not called.");
    }

    $onDestroy(): void {
        console.warn("This is not called.");
    }
}

import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import HitService from '../services/hits/HitService';
import HomeScope from '../scopes/HomeScope';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 * @class HomeController
 */
export default class HomeController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$state',
        '$window',
        'GitHubAuthManager',
        'ga',
        'hits',
        'modalDialog',
        'FEATURE_DASHBOARD_ENABLED',
        'FEATURE_EXAMPLES_ENABLED',
        'FEATURE_GOOGLE_API_ENABLED',
        'STATE_DASHBOARD',
        'STATE_DOODLE',
        'STATE_EXAMPLES',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    constructor(
        $scope: HomeScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        hits: HitService,
        modalDialog: ModalDialog,
        FEATURE_DASHBOARD_ENABLED: boolean,
        FEATURE_EXAMPLES_ENABLED: boolean,
        FEATURE_GOOGLE_API_ENABLED: boolean,
        STATE_DASHBOARD: string,
        STATE_DOODLE: string,
        STATE_EXAMPLES: string,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string
    ) {
        super($scope, $window, authManager, ga, modalDialog, UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto');

        $scope.FEATURE_DASHBOARD_ENABLED = FEATURE_DASHBOARD_ENABLED;
        $scope.FEATURE_EXAMPLES_ENABLED = FEATURE_EXAMPLES_ENABLED;
        $scope.FEATURE_GOOGLE_API_ENABLED = FEATURE_GOOGLE_API_ENABLED;

        /*
        if ($window[NAMESPACE_TWITTER_WIDGETS] && $window[NAMESPACE_TWITTER_WIDGETS].widgets) {
            $window[NAMESPACE_TWITTER_WIDGETS].widgets.load();
        }
        else {
            // We'll probably end up here the first time because the script load is asynchronous.
            // But that doesn't matter because the widgets will be initialized by the script itself.
            // On subsequent reloading of the home template, when the controller is invoked, it triggers a load.
        }

        $scope.twitterShareText = "STEMCstudio · Learning Science and Mathematics through Computational Modeling.";
        */

        // for more options visit https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderwzxhzdk114idwzxhzdk115_wzxhzdk116optionswzxhzdk117
        $scope.options = {
            scope: 'profile email',
            width: 240,
            height: 34, // The height of the buttons in the toolbar.
            longtitle: true,
            theme: 'dark',
            onsuccess: function(googleUser: gapi.auth2.GoogleUser) {
                $scope.$apply(function() {
                    const profile: gapi.auth2.BasicProfile = googleUser.getBasicProfile();

                    /**
                     * https://developers.google.com/identity/sign-in/web/backend-auth
                     */
                    const id_token = googleUser.getAuthResponse().id_token;
                    // Get AWS Credentials.
                    // (The unauthenticated part could be done in app.run)
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: 'us-east-1:b419a8b6-2753-4af4-a76b-41a451eb2278',
                        Logins: {
                            'accounts.google.com': id_token
                        }
                    });

                    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
                    console.log('Full Name: ' + profile.getName());
                    // console.log('Given Name: ' + profile.getGivenName());
                    // console.log('Familty Name: ' + profile.getFamilyName());
                    // console.log('Image URL: ' + profile.getImageUrl());
                    // console.log('Email: ' + profile.getEmail());
                    const db = new AWS.DynamoDB();
                    db.listTables({}, function(err, data) {
                        if (err) console.log(err, err.stack); // an error occurred
                        else console.log(JSON.stringify(data.TableNames, null, 2));           // successful response
                    });
                });
            },
            onfailure: function(error: any) {
                console.warn(error);
            }
        };

        $scope.goDashboard = function() {
            if (FEATURE_DASHBOARD_ENABLED) {
                $state.go(STATE_DASHBOARD);
            }
            else {
                console.warn(`FEATURE_DASHBOARD_ENABLED => ${FEATURE_DASHBOARD_ENABLED}`);
            }
        };

        $scope.goDoodle = function() {
            $state.go(STATE_DOODLE);
        };

        $scope.goExamples = function() {
            if (FEATURE_EXAMPLES_ENABLED) {
                $state.go(STATE_EXAMPLES);
            }
            else {
                console.warn(`FEATURE_EXAMPLES_ENABLED => ${FEATURE_EXAMPLES_ENABLED}`);
            }
        };
    }
}

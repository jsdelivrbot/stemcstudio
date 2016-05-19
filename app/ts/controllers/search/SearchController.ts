import * as angular from 'angular';
import AbstractPageController from '../AbstractPageController';
import IGitHubAuthManager from '../../services/gham/IGitHubAuthManager';
import SearchService from '../../services/search/SearchService';
import SearchScope from '../../scopes/SearchScope';
import ModalDialog from '../../services/modalService/ModalDialog';
// import queryToDoodleRefs from './queryToDoodleRefs';
// import {TableName} from './DoodleRefTable';
// import {OWNER_KEY} from './DoodleRefTable';

/**
 * @class SearchController
 */
export default class SearchController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$state',
        '$window',
        'GitHubAuthManager',
        'ga',
        'modalDialog',
        'search',
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
        $scope: SearchScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        search: SearchService,
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

        $scope.params = { query: '' };

        $scope.search = () => {
            search.search({ query: $scope.params.query })
                .then((promiseValue) => {
                    // console.log(JSON.stringify(promiseValue, null, 2));
                    $scope.doodleRefs = promiseValue.refs;
                })
                .catch((err: any) => {
                    console.warn(JSON.stringify(err, null, 2));
                });
            /*
            const db = new AWS.DynamoDB();
            db.query(
                {
                    TableName,
                    KeyConditionExpression: "#P = :ghOwner",
                    ExpressionAttributeNames: {
                        '#P': OWNER_KEY,
                    },
                    ExpressionAttributeValues: {
                        ':ghOwner': { S: $scope.userLogin() }
                    }
                }, (err: AWS.Reason, data) => {
                    if (!err) {
                        // console.log(JSON.stringify(data, null, 2));
                        $scope.$apply(function() {
                            $scope.doodleRefs = queryToDoodleRefs(data);
                            // console.log(JSON.stringify($scope.doodleRefs, null, 2));
                        });
                    }
                    else {
                        switch (err.statusCode) {
                            case 400: {
                                modalDialog.alert({ title: 'Search', message: "I'm sorry Dave, I can't let you do that." })
                                    .then(function() {
                                        // Do nothing
                                    })
                                    .catch(function(err: any) {
                                        console.warn(JSON.stringify(err, null, 2));
                                    });
                                break;
                            }
                            default: {
                                console.warn(JSON.stringify(err, null, 2));
                            }
                        }
                    }
                });
            */
        };
    }

    $onInit(): void {
        console.warn("This is not called.");
    }

    $onDestroy(): void {
        console.warn("This is not called.");
    }
}

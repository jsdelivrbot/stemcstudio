import * as angular from 'angular';
import AbstractPageController from '../AbstractPageController';
import IGitHubAuthManager from '../../services/gham/IGitHubAuthManager';
import HitService from '../../services/hits/HitService';
import SearchScope from '../../scopes/SearchScope';
import ModalDialog from '../../services/modalService/ModalDialog';
import queryToDoodleRefs from './queryToDoodleRefs';

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
        $scope: SearchScope,
        $state: angular.ui.IStateService,
        $window: angular.IWindowService,
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

        $scope.query = () => {
            const db = new AWS.DynamoDB();
            db.query(
                {
                    TableName: 'Doodle',
                    KeyConditionExpression: "#P = :ghOwner",
                    ExpressionAttributeNames: {
                        '#P': 'owner',
                    },
                    ExpressionAttributeValues: {
                        ':ghOwner': { S: 'mathdoodle' }
                    }
                }, (err, data) => {
                    if (!err) {
                        $scope.$apply(function() {
                            $scope.doodleRefs = queryToDoodleRefs(data);
                        });
                    }
                    else {
                        console.warn(JSON.stringify(err, null, 2));
                    }
                });
        };
    }

    $onInit(): void {
        console.warn("This is not called.");
    }

    $onDestroy(): void {
        console.warn("This is not called.");
    }
}

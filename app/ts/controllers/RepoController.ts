import * as angular from 'angular';
import AppScope from '../scopes/AppScope';
import AbstractPageController from './AbstractPageController';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';

/**
 * Controller when the project is based upon a GitHub repository.
 *
 * @class RepoController
 * @extends AbstractPageController
 */
export default class RepoController extends AbstractPageController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        'GitHubAuthManager',
        'ga',
        'UNIVERSAL_ANALYTICS_TRACKING_ID'
    ];
    constructor(
        $scope: AppScope,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {
        super($scope, $window, authManager, ga, UNIVERSAL_ANALYTICS_TRACKING_ID, 'hidden')
    }
    $onInit(): void {
        // This will not be called because this is a routing controller.
        console.warn("RepoController.$onDestroy()")
    }
    $onDestroy(): void {
        // This will not be called because this is a routing controller.
        console.warn("RepoController.$onDestroy()")
    }
}

import * as angular from 'angular';
import FacebookLoginScope from './FacebookLoginScope';

export default class FacebookLoginController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        'ga',
        'FEATURE_FACEBOOK_SIGNIN_ENABLED'
    ];
    constructor(
        private $scope: FacebookLoginScope,
        private $window: angular.IWindowService,
        private ga: UniversalAnalytics.ga,
        private FEATURE_FACEBOOK_SIGNIN_ENABLED: boolean
    ) {
        // Do nothing.
    }

    /**
     * @method $onInit
     * @return {void}
     */
    $onInit(): void {
        // Do nothing.
    }

    /**
     * @method $onDestroy
     * @return {void}
     */
    $onDestroy(): void {
        // Do nothing.
    }

    /**
     * @method login
     * @return {void}
     */
    login(): void {
        if (this.FEATURE_FACEBOOK_SIGNIN_ENABLED) {
            this.ga('send', 'event', 'Facebook', 'login');
        }
        else {
            console.warn(`FEATURE_FACEBOOK_SIGNIN_ENABLED => ${this.FEATURE_FACEBOOK_SIGNIN_ENABLED}`);
        }
    }

    /**
     * @method logout
     * @return {void}
     */
    logout(): void {
        if (this.FEATURE_FACEBOOK_SIGNIN_ENABLED) {
            this.ga('send', 'event', 'Facebook', 'logout');
        }
        else {
            console.warn(`FEATURE_FACEBOOK_SIGNIN_ENABLED => ${this.FEATURE_FACEBOOK_SIGNIN_ENABLED}`);
        }
    }
}

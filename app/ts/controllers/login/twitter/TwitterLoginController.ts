import TwitterLoginScope from './TwitterLoginScope';

export default class TwitterLoginController {
    public static $inject: string[] = [
        '$scope',
        '$window',
        'FEATURE_TWITTER_SIGNIN_ENABLED'
    ];
    constructor(
        private $scope: TwitterLoginScope,
        private $window: angular.IWindowService,
        private FEATURE_TWITTER_SIGNIN_ENABLED: boolean
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
        if (this.FEATURE_TWITTER_SIGNIN_ENABLED) {
            ga('send', 'event', 'Twitter', 'login');
        }
        else {
            console.warn(`FEATURE_TWITTER_SIGNIN_ENABLED => ${this.FEATURE_TWITTER_SIGNIN_ENABLED}`);
        }
    }

    /**
     * @method logout
     * @return {void}
     */
    logout(): void {
        if (this.FEATURE_TWITTER_SIGNIN_ENABLED) {
            ga('send', 'event', 'Twitter', 'logout');
        }
        else {
            console.warn(`FEATURE_TWITTER_SIGNIN_ENABLED => ${this.FEATURE_TWITTER_SIGNIN_ENABLED}`);
        }
    }
}

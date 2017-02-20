export default class TwitterLoginController {
    public static $inject: string[] = [
        'FEATURE_TWITTER_SIGNIN_ENABLED'
    ];
    constructor(
        private FEATURE_TWITTER_SIGNIN_ENABLED: boolean
    ) {
        // Do nothing.
    }

    /**
     *
     */
    $onInit(): void {
        // Do nothing.
    }

    /**
     *
     */
    $onDestroy(): void {
        // Do nothing.
    }

    /**
     *
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
     *
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

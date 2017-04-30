import { GOOGLE_ANALYTICS_UUID } from '../../../fugly/ga/ga';

export class FacebookLoginController {
    public static $inject: string[] = [
        GOOGLE_ANALYTICS_UUID,
        'FEATURE_FACEBOOK_SIGNIN_ENABLED'
    ];
    constructor(
        private ga: UniversalAnalytics.ga,
        private FEATURE_FACEBOOK_SIGNIN_ENABLED: boolean
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
        if (this.FEATURE_FACEBOOK_SIGNIN_ENABLED) {
            this.ga('send', 'event', 'Facebook', 'login');
        }
        else {
            console.warn(`FEATURE_FACEBOOK_SIGNIN_ENABLED => ${this.FEATURE_FACEBOOK_SIGNIN_ENABLED}`);
        }
    }

    /**
     *
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

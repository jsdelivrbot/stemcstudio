import BodyScope from './BodyScope';

export interface HomeScope extends BodyScope {
    FEATURE_DASHBOARD_ENABLED: boolean;
    FEATURE_EXAMPLES_ENABLED: boolean;

    onGoogleSignIn(googleUser): void;

    /**
     * Navigate to the Dashboard page.
     */
    goDashboard(): void;

    /**
     * Navigate to the Doodle page.
     */
    goDoodle(): void;

    /**
     * Navigate to the Examples page.
     */
    goExamples(): void;

    /**
     * Navigate to the Log In page.
     */
    goLogin(): void;

    /**
     * @deprecated
     */
    twitterShareText: string;
}

export default HomeScope;

import BodyScope from './BodyScope';
import SearchScope from './SearchScope';
import ThumbnailsScope from './ThumbnailsScope';

export interface HomeScope extends BodyScope, SearchScope, ThumbnailsScope {
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
     *
     */
    doSearch(): void;
}

export default HomeScope;

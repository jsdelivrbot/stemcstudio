import { BodyScope } from './BodyScope';
import Doodle from '../services/doodles/Doodle';
import { SearchScope } from './SearchScope';
import { ThumbnailsScope } from './ThumbnailsScope';

export interface HomeScope extends BodyScope, SearchScope, ThumbnailsScope {
    /**
     * 
     */
    FEATURE_DASHBOARD_ENABLED: boolean;
    /**
     * Determines whether an Examples button or link is available.
     */
    FEATURE_EXAMPLES_ENABLED: boolean;

    onGoogleSignIn(googleUser: any): void;

    /**
     * Navigate to the Dashboard page.
     */
    goDashboard(): void;

    /**
     * Navigate to the Doodle page.
     */
    clickCodeNow(): void;

    /**
     * Navigate to the Examples page.
     */
    goExamples(): void;

    /**
     *
     */
    doodles(): Doodle[];

    /**
     * 
     */
    doOpen(doodle: Doodle): void;

    /**
     * 
     */
    doDelete(doodle: Doodle): void;

    /**
     *
     */
    doSearch(): void;
}

export default HomeScope;

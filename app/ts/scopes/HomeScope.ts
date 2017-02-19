import BodyScope from './BodyScope';
import Doodle from '../services/doodles/Doodle';
import SearchScope from './SearchScope';
import ThumbnailsScope from './ThumbnailsScope';

export interface HomeScope extends BodyScope, SearchScope, ThumbnailsScope {
    /**
     * Determines whether a Cookbook button or link is available.
     */
    FEATURE_COOKBOOK_ENABLED: boolean;
    /**
     * 
     */
    FEATURE_DASHBOARD_ENABLED: boolean;
    /**
     * Determines whether an Examples button or link is available.
     */
    FEATURE_EXAMPLES_ENABLED: boolean;
    /**
     * Determines whether a Tutorials button or link is available.
     */
    FEATURE_TUTORIALS_ENABLED: boolean;

    onGoogleSignIn(googleUser: any): void;

    /**
     * Navigate to the Cookbook page.
     */
    goCookbook(): void;

    /**
     * Navigate to the Dashboard page.
     */
    goDashboard(): void;

    /**
     * Navigate to the Doodle page.
     */
    clickCodeNow(label?: string, value?: number): void;

    /**
     * Navigate to the Examples page.
     */
    goExamples(): void;

    /**
     * Navigate to the Tutorials page.
     */
    goTutorials(): void;

    /**
     *
     */
    doodles(): Doodle[];
    doOpen(doodle: Doodle): void;
    doDelete(doodle: Doodle): void;

    /**
     *
     */
    doSearch(): void;
}

export default HomeScope;

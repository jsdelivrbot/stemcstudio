import BodyScope from './BodyScope';

export interface HomeScope extends BodyScope {
    FEATURE_DASHBOARD_ENABLED: boolean;
    FEATURE_EXAMPLES_ENABLED: boolean;
    goDashboard(): void;
    goDoodle(): void;
    goExamples(): void;
    twitterShareText: string;
}

export default HomeScope;

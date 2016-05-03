import BodyScope from './BodyScope';

export interface HomeScope extends BodyScope {
    goDashboard(): void;
    goDoodle(): void;
    goExamples(): void;
    twitterShareText: string;
}

export default HomeScope;

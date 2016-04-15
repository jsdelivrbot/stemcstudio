import BodyScope from './BodyScope';

export interface HomeScope extends BodyScope {
    goDoodle(): void;
    goExamples(): void;
    twitterShareText: string;
}

export default HomeScope;

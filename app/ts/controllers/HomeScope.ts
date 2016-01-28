import BodyScope from './BodyScope';

export interface HomeScope extends BodyScope {
    goDoodle(): void;
    twitterShareText: string;
}

export default HomeScope;

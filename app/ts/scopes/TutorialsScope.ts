import BodyScope from './BodyScope';
import Tutorial from '../models/Tutorial';

interface TutorialsScope extends BodyScope {
    tutorials: Tutorial[];
    goHome: () => void;
    toggleShowEmbedded(gistId: string): void;
}

export default TutorialsScope;

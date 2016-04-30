import BodyScope from './BodyScope';
import Example from '../models/Example';

interface ExamplesScope extends BodyScope {
    examples: Example[];
    goHome: () => void;
}

export default ExamplesScope;

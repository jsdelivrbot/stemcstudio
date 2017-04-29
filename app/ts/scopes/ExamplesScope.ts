import { BodyScope } from './BodyScope';
import Example from '../models/Example';

export interface ExamplesScope extends BodyScope {
    /**
     * 
     */
    examples: Example[];
    /**
     * 
     */
    goHome: () => void;
}

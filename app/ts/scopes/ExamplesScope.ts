import { BodyScope } from './BodyScope';
import { Category, Example, Level } from '../models/Example';

export interface ExamplesScope extends BodyScope {
    /**
     * The categories will be inferred from those actually used in the examples.
     */
    categories: Category[];
    /**
     * 
     */
    examples: Example[];
    /**
     * The levels will be inferred from those actually used in the examples.
     */
    levels: Level[];
}

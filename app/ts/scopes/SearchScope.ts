import { BodyScope } from './BodyScope';
import { DoodleRef } from '../controllers/search/DoodleRef';

export interface SearchScope extends BodyScope {
    params: {
        query: string;
    };
    search(): void;
    found: number | undefined;
    start: number | undefined;
    /**
     * The previous query string.
     */
    query: string;
    doodleRefs: DoodleRef[];
}

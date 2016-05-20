import BodyScope from './BodyScope';
import DoodleRef from '../controllers/search/DoodleRef';

export interface SearchScope extends BodyScope {
    params: {
        query: string;
    };
    search(): void;
    found: number;
    start: number;
    /**
     * The previous query string.
     */
    query: string;
    doodleRefs: DoodleRef[];
}

export default SearchScope;

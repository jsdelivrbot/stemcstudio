import BodyScope from './BodyScope';
import DoodleRef from '../controllers/search/DoodleRef';

export interface SearchScope extends BodyScope {
    params: {
        query: string;
    };
    search(): void;
    doodleRefs: DoodleRef[];
}

export default SearchScope;

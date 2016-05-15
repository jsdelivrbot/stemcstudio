import BodyScope from './BodyScope';
import DoodleRef from '../controllers/search/DoodleRef';

export interface SearchScope extends BodyScope {
    query(): void;
    doodleRefs: DoodleRef[];
}

export default SearchScope;

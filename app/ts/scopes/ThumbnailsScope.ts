import BodyScope from './BodyScope';
import DoodleRef from '../controllers/search/DoodleRef';

/**
 * A mixin scope anywhere you want to display thumbnails of projects.
 */
export interface ThumbnailsScope extends BodyScope {
    doodleRefs: DoodleRef[];
}

export default ThumbnailsScope;

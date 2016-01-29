import AppScope from '../AppScope';
import IDoodle from '../services/doodles/IDoodle';
import Gist from '../services/github/Gist';

interface BodyScope extends AppScope {
    currentDoodle(): IDoodle;
    doodles(): IDoodle[];
    /**
     * A page of Gist.
     */
    gists: Gist[];
    /**
     * Hypermedia Links for pagination.
     */
    links: { [rel: string]: string };
    clickDownload(): void;
}

export default BodyScope;

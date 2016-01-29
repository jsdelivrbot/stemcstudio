import AppScope from '../AppScope';
import IDoodle from '../services/doodles/IDoodle';
import Gist from '../services/github/Gist';

interface BodyScope extends AppScope {
    currentDoodle(): IDoodle;
    doodles(): IDoodle[];
    gists: Gist[];
    clickDownload(): void;
}

export default BodyScope;

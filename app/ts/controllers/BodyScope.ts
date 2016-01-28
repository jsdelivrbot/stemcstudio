import AppScope from '../AppScope';
import IDoodle from '../services/doodles/IDoodle';
import IGist from '../services/gist/IGist';

interface BodyScope extends AppScope {
    currentDoodle(): IDoodle;
    doodles(): IDoodle[];
    gists: IGist[];
    clickDownload(): void;
}

export default BodyScope;

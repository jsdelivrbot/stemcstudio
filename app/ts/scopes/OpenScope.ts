import BodyScope from './BodyScope';
import Doodle from '../services/doodles/Doodle';

interface OpenScope extends BodyScope {
    doodles(): Doodle[];
    doClose: () => void;
    doOpen: (doodle: Doodle) => void;
    doDelete: (doodle: Doodle) => void;
}

export default OpenScope;

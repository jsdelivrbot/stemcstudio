import BodyScope from './BodyScope';
import Doodle from '../services/doodles/Doodle';

interface CopyScope extends BodyScope {
    description: string;
    template: Doodle;
    doOK: () => void;
    doCancel: () => void;
}
export default CopyScope;

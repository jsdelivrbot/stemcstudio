import BodyScope from './BodyScope';
import IDoodle from '../services/doodles/IDoodle';

interface CopyScope extends BodyScope {
    description: string;
    template: IDoodle;
    doOK: () => void;
    doCancel: () => void;
}
export default CopyScope;

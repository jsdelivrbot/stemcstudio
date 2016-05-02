import BodyScope from './BodyScope';
import ITemplate from '../services/templates/ITemplate';

interface CopyScope extends BodyScope {
    description: string;
    template: ITemplate;
    doOK: () => void;
    doCancel: () => void;
}
export default CopyScope;

import BodyScope from './BodyScope';

interface CopyScope extends BodyScope {
    description: string;
    doOK: () => void;
    doCancel: () => void;
}
export default CopyScope;

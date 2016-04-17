import BodyScope from './BodyScope';
import ExplorerMixin from './ExplorerMixin';
import Doodle from '../services/doodles/Doodle';
import ITemplate from '../services/templates/ITemplate';

interface DoodleScope extends BodyScope, ExplorerMixin {

    doNew: () => void;
    doOpen: () => void;
    doCopy: () => void;
    doProperties(): void;
    doHelp: () => void;

    doUpload(): void;

    goHome: () => void;

    templates: ITemplate[];
}

export default DoodleScope;

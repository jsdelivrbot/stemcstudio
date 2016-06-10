import BodyScope from './BodyScope';
import ExplorerMixin from './ExplorerMixin';
import ITemplate from '../services/templates/ITemplate';

interface DoodleScope extends BodyScope, ExplorerMixin {

    /**
     * New Project
     */
    doNew: () => void;

    /**
     * Open existing Project
     */
    doOpen: () => void;

    /**
     * Copy this Project
     */
    doCopy: () => void;

    templates: ITemplate[];
}

export default DoodleScope;

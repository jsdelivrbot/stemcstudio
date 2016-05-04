import BodyScope from './BodyScope';
import ExplorerMixin from './ExplorerMixin';
import Doodle from '../services/doodles/Doodle';
import DoodleFile from '../services/doodles/DoodleFile';
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

    /**
     * 
     */
    doProperties(): void;

    /**
     *
     */
    doHelp: () => void;

    goHome: () => void;

    templates: ITemplate[];
}

export default DoodleScope;

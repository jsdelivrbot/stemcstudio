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
     * View the specified file in the Viewer.
     */
    doView(name: string): void;

    /**
     * 
     */
    doProperties(): void;
    
    /**
     *
     */
    doHelp: () => void;

    /**
     * Upload
     */
    doUpload(): void;

    goHome: () => void;

    templates: ITemplate[];
}

export default DoodleScope;

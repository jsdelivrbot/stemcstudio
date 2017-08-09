import { BodyScope } from './BodyScope';
import { CodeVisibleMixin } from './CodeVisibleMixin';
import { ITemplate } from '../services/templates/template';
import { ProblemsMixin } from './ProblemsMixin';

export interface DoodleScope extends BodyScope, CodeVisibleMixin, ProblemsMixin {

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
    templates: ITemplate[];
}

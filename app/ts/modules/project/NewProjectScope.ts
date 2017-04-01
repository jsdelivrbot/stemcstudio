import { IFormController, IRootScopeService } from 'angular';
import ITemplate from '../../services/templates/ITemplate';

/**
 * 
 */
export interface NewProjectScope extends IRootScopeService {
    /**
     * 
     */
    project: {
        description: string;
        template: ITemplate;
        version: string;
    };

    templates: ITemplate[];

    reset(form: IFormController): void;
    cancel(): void;
    ok(): void;
}

export default NewProjectScope;

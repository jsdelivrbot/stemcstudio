import ITemplate from '../../services/templates/ITemplate';

/**
 * 
 */
export interface NewProjectScope extends ng.IRootScopeService {
    /**
     * 
     */
    project: {
        description: string;
        template: ITemplate;
        version: string;
    };

    templates: ITemplate[];

    reset(form: ng.IFormController): void;
    cancel(): void;
    ok(): void;
}

export default NewProjectScope;

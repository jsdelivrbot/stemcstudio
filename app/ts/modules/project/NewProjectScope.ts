import * as angular from 'angular';
import ITemplate from '../../services/templates/ITemplate';

/**
 * 
 */
interface NewProjectScope {
    /**
     * 
     */
    project: {
        description: string;
        template: ITemplate;
        version: string;
    };

    templates: ITemplate[];

    reset(form: angular.IFormController): void;
    cancel(): void;
    ok(): void;
}

export default NewProjectScope;

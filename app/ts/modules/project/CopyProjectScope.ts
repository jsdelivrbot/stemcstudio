import { IFormController, IRootScopeService } from 'angular';
/**
 * 
 */
export interface CopyProjectScope extends IRootScopeService {
    /**
     * 
     */
    project: {
        newDescription: string;
        oldDescription: string;
        newVersion: string;
        oldVersion: string;
    };

    reset(form: IFormController): void;
    cancel(): void;
    ok(): void;
}

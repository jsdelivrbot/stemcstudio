import * as angular from 'angular';

/**
 * 
 */
export interface CopyProjectScope extends angular.IRootScopeService {
    /**
     * 
     */
    project: {
        newDescription: string;
        oldDescription: string;
        newVersion: string;
        oldVersion: string;
    };

    reset(form: angular.IFormController): void;
    cancel(): void;
    ok(): void;
}

export default CopyProjectScope;

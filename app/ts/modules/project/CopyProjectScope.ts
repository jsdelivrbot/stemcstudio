/**
 * 
 */
export interface CopyProjectScope extends ng.IRootScopeService {
    /**
     * 
     */
    project: {
        newDescription: string;
        oldDescription: string;
        newVersion: string;
        oldVersion: string;
    };

    reset(form: ng.IFormController): void;
    cancel(): void;
    ok(): void;
}

export default CopyProjectScope;

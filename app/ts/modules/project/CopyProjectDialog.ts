import { IPromise } from 'angular';
import { CopyProjectSettings } from './CopyProjectSettings';

/**
 * Provides the capability for opening a modal dialog to copy settings for a new project.
 */
export interface CopyProjectDialog {
    /**
     * Opens the dialog. The promise resolves when the user completes the dialog.
     */
    open(defaults: CopyProjectSettings): IPromise<CopyProjectSettings>;
}

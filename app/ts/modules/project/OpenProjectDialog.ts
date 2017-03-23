import * as ng from 'angular';
import OpenProjectSettings from './OpenProjectSettings';

/**
 * Provides the capability to open projects in local storage.
 */
export interface OpenProjectDialog {
    /**
     * Opens the dialog. The promise resolves when the user completes the dialog.
     */
    open(defaults: OpenProjectSettings): ng.IPromise<OpenProjectSettings>;
}

export default OpenProjectDialog;

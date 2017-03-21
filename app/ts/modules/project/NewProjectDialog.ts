import * as ng from 'angular';
import NewProjectDefaults from './NewProjectDefaults';
import NewProjectSettings from './NewProjectSettings';

/**
 * Provides the interface for the NewProjectService.
 */
interface NewProjectDialog {
    /**
     * Opens the dialog. The promise resolves when the user completes the dialog.
     */
    open(defaults: NewProjectDefaults): ng.IPromise<NewProjectSettings>;
}

export default NewProjectDialog;

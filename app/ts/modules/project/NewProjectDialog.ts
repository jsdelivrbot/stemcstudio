import NewProjectDefaults from './NewProjectDefaults';
import NewProjectSettings from './NewProjectSettings';

/**
 * Provides the capability for opening a modal dialog to obtain settings for a new project.
 */
interface NewProjectDialog {
    /**
     * Opens the dialog. The promise resolves when the user completes the dialog.
     */
    open(defaults: NewProjectDefaults): ng.IPromise<NewProjectSettings>;
}

export default NewProjectDialog;

import CopyProjectSettings from './CopyProjectSettings';

/**
 * Provides the capability for opening a modal dialog to copy settings for a new project.
 */
interface CopyProjectDialog {
    /**
     * Opens the dialog. The promise resolves when the user completes the dialog.
     */
    open(defaults: CopyProjectSettings): ng.IPromise<CopyProjectSettings>;
}

export default CopyProjectDialog;

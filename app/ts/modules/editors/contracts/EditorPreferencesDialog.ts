import EditorPreferencesDialogModel from './EditorPreferencesDialogModel';

/**
 * The interface implemented by a service that provides the dialog.
 * Controllers interact with this service.
 */
interface EditorPreferencesDialog {
    open(defaults: EditorPreferencesDialogModel): ng.IPromise<EditorPreferencesDialogModel>;
}

export default EditorPreferencesDialog;

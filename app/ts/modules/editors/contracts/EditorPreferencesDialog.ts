import { IPromise } from 'angular';
import { EditorPreferencesDialogModel } from './EditorPreferencesDialogModel';

/**
 * The interface implemented by a service that provides the dialog.
 * Controllers interact with this service.
 */
export interface EditorPreferencesDialog {
    open(defaults: EditorPreferencesDialogModel): IPromise<EditorPreferencesDialogModel>;
}

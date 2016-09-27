import * as ng from 'angular';
import ThemesDialogModel from './ThemesDialogModel';

/**
 * The interface implemented by a service that provides the dialog.
 * Controllers interact with this service.
 */
interface ThemesDialog {
    open(defaults: ThemesDialogModel): ng.IPromise<ThemesDialogModel>;
}

export default ThemesDialog;

import PropertiesSettings from './PropertiesSettings';

/**
 * Provides the interface for the PropertiesDialogService.
 */
interface PropertiesDialog {
    /**
     * Opens the dialog. The promise resolves when the user completes the dialog.
     */
    open(defaults: PropertiesSettings): ng.IPromise<PropertiesSettings>;
}

export default PropertiesDialog;

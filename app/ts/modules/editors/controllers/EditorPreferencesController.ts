import EditorPreferencesDialog from '../contracts/EditorPreferencesDialog';
import EditorPreferencesDialogModel from '../contracts/EditorPreferencesDialogModel';
import EditorPreferencesService from '../EditorPreferencesService';
import {EDITOR_PREFERENCES_DIALOG} from '../constants';
import {EDITOR_PREFERENCES_SERVICE} from '../constants';

/**
 * This controller is responsible for handling the request from the UI
 * to show the editor preferences dialog.
 */
export default class EditorPreferencesController {
    public static $inject: string[] = [
        EDITOR_PREFERENCES_DIALOG,
        EDITOR_PREFERENCES_SERVICE
    ];
    constructor(
        private dialog: EditorPreferencesDialog,
        private editorPreferencesService: EditorPreferencesService
    ) {
        // Do nothing yet. 
    }
    public showEditorPreferences(): void {
        // TODO: Either we extend the responsibilities of the ThemeManager,
        // or we create additional managers for every property!
        const theme = this.editorPreferencesService.getCurrentTheme();
        const showInvisibles = this.editorPreferencesService.getShowInvisibles();

        const model: EditorPreferencesDialogModel = {
            theme,
            showInvisibles
        };
        this.dialog.open(model).then((model) => {
            // Send the new editor preferences for distribution.
            // Given that we already have an immediate change notification, this is duplication?
            this.editorPreferencesService.setCurrentThemeByName(model.theme.name);
            this.editorPreferencesService.setShowInvisibles(model.showInvisibles);
        }).catch((reason) => {
            switch (reason) {
                case 'cancel click':
                case 'escape key press':
                case 'backdrop click': {
                    // Restore the prior editor preferences.
                    this.editorPreferencesService.setCurrentThemeByName(theme.name);
                    this.editorPreferencesService.setShowInvisibles(showInvisibles);
                    break;
                }
                default: {
                    console.warn(reason);
                }
            }
        });
    }
}

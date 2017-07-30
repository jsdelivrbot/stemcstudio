import { EditorPreferencesDialog } from '../contracts/EditorPreferencesDialog';
import { EditorPreferencesDialogModel } from '../contracts/EditorPreferencesDialogModel';
import { EditorPreferencesService } from '../EditorPreferencesService';
import { EDITOR_PREFERENCES_DIALOG } from '../constants';
import { EDITOR_PREFERENCES_SERVICE } from '../constants';

/**
 * This controller is responsible for handling the request from the UI
 * to show the editor preferences dialog.
 */
export class EditorPreferencesController {
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
        const displayIndentGuides = this.editorPreferencesService.getDisplayIndentGuides();
        const fontSize = this.editorPreferencesService.getFontSize();
        const theme = this.editorPreferencesService.getCurrentTheme();
        const showFoldWidgets = this.editorPreferencesService.getShowFoldWidgets();
        const showGutter = this.editorPreferencesService.getShowGutter();
        const showInvisibles = this.editorPreferencesService.getShowInvisibles();
        const showLineNumbers = this.editorPreferencesService.getShowLineNumbers();
        const showPrintMargin = this.editorPreferencesService.getShowPrintMargin();
        const tabSize = this.editorPreferencesService.getTabSize();
        const useSoftTabs = this.editorPreferencesService.getUseSoftTabs();

        const model: EditorPreferencesDialogModel = {
            displayIndentGuides,
            fontSize,
            showFoldWidgets,
            showGutter,
            showInvisibles,
            showLineNumbers,
            showPrintMargin,
            tabSize,
            theme,
            useSoftTabs
        };
        this.dialog.open(model).then((model) => {
            // Send the new editor preferences for distribution.
            // Given that we already have an immediate change notification, this is duplication?
            this.editorPreferencesService.setDisplayIndentGuides(model.displayIndentGuides);
            this.editorPreferencesService.setFontSize(model.fontSize);
            this.editorPreferencesService.setCurrentThemeByName(model.theme.name);
            this.editorPreferencesService.setShowFoldWidgets(model.showFoldWidgets);
            this.editorPreferencesService.setShowGutter(model.showGutter);
            this.editorPreferencesService.setShowInvisibles(model.showInvisibles);
            this.editorPreferencesService.setShowLineNumbers(model.showLineNumbers);
            this.editorPreferencesService.setShowPrintMargin(model.showPrintMargin);
            this.editorPreferencesService.setTabSize(model.tabSize);
            this.editorPreferencesService.setUseSoftTabs(model.useSoftTabs);
        }).catch((reason) => {
            switch (reason) {
                case 'cancel click':
                case 'escape key press':
                case 'backdrop click': {
                    // Restore the prior editor preferences.
                    this.editorPreferencesService.setDisplayIndentGuides(displayIndentGuides);
                    this.editorPreferencesService.setFontSize(fontSize);
                    this.editorPreferencesService.setCurrentThemeByName(theme.name);
                    this.editorPreferencesService.setShowFoldWidgets(showFoldWidgets);
                    this.editorPreferencesService.setShowGutter(showGutter);
                    this.editorPreferencesService.setShowInvisibles(showInvisibles);
                    this.editorPreferencesService.setShowLineNumbers(showLineNumbers);
                    this.editorPreferencesService.setShowPrintMargin(showPrintMargin);
                    this.editorPreferencesService.setTabSize(tabSize);
                    this.editorPreferencesService.setUseSoftTabs(useSoftTabs);
                    break;
                }
                default: {
                    console.warn(reason);
                }
            }
        });
    }
}

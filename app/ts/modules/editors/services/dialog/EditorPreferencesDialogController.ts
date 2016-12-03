import * as uib from 'angular-bootstrap';
import EditorPreferencesDialogScope from './EditorPreferencesDialogScope';
import EditorPreferencesDialogModel from '../../contracts/EditorPreferencesDialogModel';
import EditorPreferencesService from '../../EditorPreferencesService';
import {EDITOR_PREFERENCES_SERVICE} from '../../constants';

/**
 * 
 */
export default class EditorPreferencesDialogController {
    public static $inject: string[] = [
        '$scope',
        '$uibModalInstance',
        EDITOR_PREFERENCES_SERVICE,
        'model'];
    constructor(
        private $scope: EditorPreferencesDialogScope,
        private $uibModalInstance: uib.IModalServiceInstance,
        private editorPreferencesService: EditorPreferencesService,
        private dialogModel: EditorPreferencesDialogModel) {
    }

    /**
     * 
     */
    $onInit(): void {
        // Copy from the model to the scope.
        this.$scope.displayIndentGuides = this.dialogModel.displayIndentGuides;
        this.$scope.fontSize = this.dialogModel.fontSize;
        this.$scope.showFoldWidgets = this.dialogModel.showFoldWidgets;
        this.$scope.showInvisibles = this.dialogModel.showInvisibles;
        this.$scope.showLineNumbers = this.dialogModel.showLineNumbers;
        this.$scope.showPrintMargin = this.dialogModel.showPrintMargin;
        this.$scope.theme = this.dialogModel.theme;

        // If anything changes, apply it immediately so that the user can see the result.

        this.$scope.displayIndentGuidesChange = () => {
            this.editorPreferencesService.setDisplayIndentGuides(this.$scope.displayIndentGuides);
        };

        this.$scope.fontSizeChange = () => {
            this.editorPreferencesService.setFontSize(this.$scope.fontSize);
        };

        this.$scope.showFoldWidgetsChange = () => {
            this.editorPreferencesService.setShowFoldWidgets(this.$scope.showFoldWidgets);
        };

        this.$scope.showInvisiblesChange = () => {
            this.editorPreferencesService.setShowInvisibles(this.$scope.showInvisibles);
        };

        this.$scope.showLineNumbersChange = () => {
            this.editorPreferencesService.setShowLineNumbers(this.$scope.showLineNumbers);
        };

        this.$scope.showPrintMarginChange = () => {
            this.editorPreferencesService.setShowPrintMargin(this.$scope.showPrintMargin);
        };

        this.$scope.themeChange = () => {
            this.editorPreferencesService.setCurrentThemeByName(this.$scope.theme.name);
        };

        this.$scope.ok = () => {
            // Copy from the scope to the model.
            this.dialogModel.displayIndentGuides = this.$scope.displayIndentGuides;
            this.dialogModel.fontSize = this.$scope.fontSize;
            this.dialogModel.showFoldWidgets = this.$scope.showFoldWidgets;
            this.dialogModel.showInvisibles = this.$scope.showInvisibles;
            this.dialogModel.showLineNumbers = this.$scope.showLineNumbers;
            this.dialogModel.showPrintMargin = this.$scope.showPrintMargin;
            this.dialogModel.theme = this.$scope.theme;
            this.$uibModalInstance.close(this.dialogModel);
        };

        this.$scope.cancel = () => {
            // Important that this string be consistent with workflow.
            this.$uibModalInstance.dismiss('cancel click');
        };

        // Initialize available themes and fontSizes on scope. 

        this.editorPreferencesService.getFontSizes().then((fontSize) => {
            this.$scope.fontSizes = fontSize;
        }).catch((reason) => {
            // Ignore
        });

        this.editorPreferencesService.getThemes().then((themes) => {
            this.$scope.themes = themes;
        }).catch((reason) => {
            // Ignore
        });
    }

    /**
     * 
     */
    $onDestroy(): void {
        // This is NOT called. Don't know why.
        console.warn("$onDestroy");
    }
}

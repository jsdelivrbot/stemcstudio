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
        this.$scope.theme = this.dialogModel.theme;
        this.$scope.showInvisibles = this.dialogModel.showInvisibles;

        // If anything changes, apply it immediately so that the user can see the result.

        this.$scope.themeChange = () => {
            this.editorPreferencesService.setCurrentThemeByName(this.$scope.theme.name);
        };

        this.$scope.showInvisiblesChange = () => {
            this.editorPreferencesService.setShowInvisibles(this.$scope.showInvisibles);
        };

        this.$scope.ok = () => {
            // Copy from the scope to the model.
            this.dialogModel.theme = this.$scope.theme;
            this.dialogModel.showInvisibles = this.$scope.showInvisibles;
            this.$uibModalInstance.close(this.dialogModel);
        };

        this.$scope.cancel = () => {
            // Important that this string be consistent with workflow.
            this.$uibModalInstance.dismiss('cancel click');
        };

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

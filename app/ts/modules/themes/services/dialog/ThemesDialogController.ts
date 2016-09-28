import * as uib from 'angular-bootstrap';
import ThemesDialogScope from './ThemesDialogScope';
import ThemesDialogModel from '../../contracts/ThemesDialogModel';
import ThemeManager from '../../ThemeManager';
import {THEME_MANAGER} from '../../constants';

/**
 * 
 */
export default class PropertiesModalController {
    public static $inject: string[] = [
        '$scope',
        '$uibModalInstance',
        THEME_MANAGER,
        'model'];
    constructor(
        private $scope: ThemesDialogScope,
        private $uibModalInstance: uib.IModalServiceInstance,
        private themeManager: ThemeManager,
        private model: ThemesDialogModel) {
    }

    /**
     * 
     */
    $onInit(): void {
        this.$scope.theme = this.model.theme;

        // If the theme changes, apply it immediately so that the user can see the result.
        this.$scope.themeChange = () => {
            this.themeManager.setCurrentThemeByName(this.$scope.theme.name);
        };

        this.$scope.ok = () => {
            this.model.theme = this.$scope.theme;
            this.$uibModalInstance.close(this.model);
        };

        this.$scope.cancel = () => {
            // Important that this string be consistent with workflow.
            this.$uibModalInstance.dismiss('cancel click');
        };

        this.themeManager.getThemes().then((themes) => {
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
        console.warn("ThemesDialogController.$onDestroy");
    }
}

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
        $scope: ThemesDialogScope,
        $uibModalInstance: uib.IModalServiceInstance,
        themeManager: ThemeManager,
        model: ThemesDialogModel) {

        $scope.theme = model.theme;

        themeManager.getThemes().then((themes) => {
            $scope.themes = themes;
        }).catch((reason) => {
            // Ignore
        });

        $scope.ok = function () {
            model.theme = $scope.theme;
            $uibModalInstance.close(model);
        };

        $scope.cancel = function () {
            // Important that this string be consistent with workflow.
            $uibModalInstance.dismiss('cancel click');
        };
    }
    $onInit(): void {
        // This IS called.
        console.warn("ThemesDialogController.$onInit");
    }
    $onDestroy(): void {
        // This is NOT called. Don't know why.
        console.warn("ThemesDialogController.$onDestroy");
    }
}

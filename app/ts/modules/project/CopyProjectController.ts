import { IFormController } from 'angular';
import { IModalServiceInstance } from 'angular-bootstrap';
import { isString } from '../../utils/isString';
import CopyProjectScope from './CopyProjectScope';
import CopyProjectSettings from './CopyProjectSettings';
import { ITranslateService, TRANSLATE_SERVICE_UUID } from '../translate/api';

function copySettingsToScope(settings: CopyProjectSettings, $scope: CopyProjectScope): void {
    const oldDescription = isString(settings.description) ? settings.description : "";
    const oldVersion = isString(settings.version) ? settings.version : "0.9.0";
    $scope.project = {
        newDescription: oldDescription,
        oldDescription,
        newVersion: oldVersion,
        oldVersion
    };
}

/**
 * The controller for the CopyProjectScope.
 */
export default class CopyProjectController {

    public static $inject: string[] = [
        '$scope',
        '$uibModalInstance',
        TRANSLATE_SERVICE_UUID,
        'pkgInfo'];

    constructor(
        $scope: CopyProjectScope,
        $uibModalInstance: IModalServiceInstance,
        translateService: ITranslateService,
        settings: CopyProjectSettings) {

        copySettingsToScope(settings, $scope);

        $scope.ok = function () {
            // The reality is that the input data and output data have the same data type.
            settings.description = $scope.project.newDescription;
            settings.version = $scope.project.newVersion;
            $uibModalInstance.close(settings);
        };
        $scope.cancel = function () {
            // Important that this string be consistent with workflow.
            $uibModalInstance.dismiss('cancel click');
        };
        $scope.reset = function (form: IFormController) {
            copySettingsToScope(settings, $scope);
            // This code demonstrates a technique for future development.
            // The Reset button is currently disabled.
            form.$setPristine();
            form.$setUntouched();
        };
    }

    /**
     * 
     */
    $onInit(): void {
        //
        // Note that when $onInit is called, we are already inside a digest loop.
        // We must not call apply on the scope.
        //
    }
    $onDestroy(): void {
        // This is NOT called. Don't know why.
    }
}

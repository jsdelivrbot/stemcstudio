import * as uib from 'angular-bootstrap';
import OpenProjectScope from './OpenProjectScope';
import OpenProjectSettings from './OpenProjectSettings';
import { ITranslateService, TRANSLATE_SERVICE_UUID } from '../translate/api';
import Doodle from '../../services/doodles/Doodle';
import IDoodleManager from '../../services/doodles/IDoodleManager';

/**
 * The controller for the OpenProjectScope.
 */
export default class OpenProjectController {

    public static $inject: string[] = [
        '$scope',
        '$uibModalInstance',
        'doodles',
        TRANSLATE_SERVICE_UUID,
        'pkgInfo'];

    constructor(
        $scope: OpenProjectScope,
        $uibModalInstance: uib.IModalServiceInstance,
        doodles: IDoodleManager,
        translateService: ITranslateService,
        pkgInfo: OpenProjectSettings) {

        $scope.doodles = function () {
            return doodles.filter(function () { return true; });
        };

        $scope.doOpen = function (doodle: Doodle) {
            pkgInfo.doodle = doodle;
            $uibModalInstance.close(pkgInfo);
        };

        $scope.doClose = function () {
            // Important that this string be consistent with workflow.
            $uibModalInstance.dismiss('cancel click');
        };
    }

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

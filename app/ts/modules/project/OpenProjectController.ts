import { IModalServiceInstance } from 'angular-bootstrap';
import { OpenProjectScope } from './OpenProjectScope';
import { OpenProjectSettings } from './OpenProjectSettings';
import { Doodle } from '../../services/doodles/Doodle';
import { DOODLE_MANAGER_SERVICE_UUID, IDoodleManager } from '../../services/doodles/IDoodleManager';

/**
 * The controller for the OpenProjectScope.
 */
export class OpenProjectController {

    public static $inject: string[] = [
        '$scope',
        '$uibModalInstance',
        DOODLE_MANAGER_SERVICE_UUID,
        'pkgInfo'];

    constructor(
        $scope: OpenProjectScope,
        $uibModalInstance: IModalServiceInstance,
        doodleManager: IDoodleManager,
        pkgInfo: OpenProjectSettings) {

        $scope.doodles = function () {
            return doodleManager.filter(function () { return true; });
        };

        $scope.doOpen = function (doodle: Doodle) {
            pkgInfo.doodle = doodle;
            $uibModalInstance.close(pkgInfo);
        };

        $scope.doClose = function () {
            $scope.cancel();
        };

        $scope.cancel = function () {
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

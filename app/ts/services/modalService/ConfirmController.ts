import { IModalServiceInstance } from 'angular-bootstrap';
import { ConfirmScope } from './ConfirmScope';
import { ConfirmOptions } from './ConfirmOptions';

export class ConfirmController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options'];
    constructor($scope: ConfirmScope, $uibModalInstance: IModalServiceInstance, options: ConfirmOptions) {

        $scope.options = options;

        $scope.ok = function () {
            $uibModalInstance.close(null);
        };

        $scope.cancel = function () {
            const reason = 'cancel click';
            $uibModalInstance.dismiss(reason);
        };
    }
}

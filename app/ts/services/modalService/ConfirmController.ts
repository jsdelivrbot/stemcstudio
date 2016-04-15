import * as uib from 'angular-bootstrap';
import ConfirmScope from './ConfirmScope';
import ConfirmOptions from './ConfirmOptions';

export default class ConfirmController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options']
    constructor($scope: ConfirmScope, $uibModalInstance: uib.IModalServiceInstance, options: ConfirmOptions) {

        $scope.options = options

        $scope.ok = function() {
            const result = null;
            $uibModalInstance.close(result);
        }
        $scope.cancel = function() {
            const reason = 'cancel click';
            $uibModalInstance.dismiss(reason);
        }
    }
}

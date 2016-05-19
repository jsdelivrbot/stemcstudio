import * as uib from 'angular-bootstrap';
import AlertScope from './AlertScope';
import AlertOptions from './AlertOptions';

export default class AlertController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options'];
    constructor($scope: AlertScope, $uibModalInstance: uib.IModalServiceInstance, options: AlertOptions) {

        $scope.options = options;

        $scope.close = function() {
            const result = null;
            $uibModalInstance.close(result);
        };
    }
}

import { IModalServiceInstance } from 'angular-bootstrap';
import AlertScope from './AlertScope';
import { AlertOptions } from './AlertOptions';

export default class AlertController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options'];
    constructor($scope: AlertScope, $uibModalInstance: IModalServiceInstance, options: AlertOptions) {

        $scope.options = options;

        $scope.close = function () {
            $uibModalInstance.close(null);
        };
    }
}

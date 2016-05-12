import * as uib from 'angular-bootstrap';
import PromptScope from './PromptScope';
import PromptOptions from './PromptOptions';

export default class PromptController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options'];
    constructor($scope: PromptScope, $uibModalInstance: uib.IModalServiceInstance, options: PromptOptions) {

        $scope.options = options;

        $scope.ok = function() {
            $uibModalInstance.close($scope.options.text);
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel click');
        };
    }
}

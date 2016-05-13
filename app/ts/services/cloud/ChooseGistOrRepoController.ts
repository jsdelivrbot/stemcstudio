import * as uib from 'angular-bootstrap';
import ChooseGistOrRepoScope from './ChooseGistOrRepoScope';
import ChooseGistOrRepoOptions from './ChooseGistOrRepoOptions';

export default class ChooseGistOrRepoController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options'];
    constructor($scope: ChooseGistOrRepoScope, $uibModalInstance: uib.IModalServiceInstance, options: ChooseGistOrRepoOptions) {
        $scope.options = options;
        $scope.gist = function() {
            $uibModalInstance.close('gist');
        };

        $scope.repo = function() {
            $uibModalInstance.close('repo');
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel click');
        };
    }
}

import * as uib from 'angular-bootstrap';
import RepoData from '../github/RepoData';
import RepoDataScope from './RepoDataScope';
import RepoDataOptions from './RepoDataOptions';

export default class RepoDataController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options', 'data'];
    constructor($scope: RepoDataScope, $uibModalInstance: uib.IModalServiceInstance, options: RepoDataOptions, data: RepoData) {

        $scope.options = options;
        $scope.data = data;

        $scope.ok = function() {
            const message = $scope.data.name.trim();
            if (message) {
                $uibModalInstance.close(data);
            }
            else {
                $uibModalInstance.dismiss('empty name');
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel click');
        };
    }
}

import * as uib from 'angular-bootstrap';
import CommitMessageScope from './CommitMessageScope';
import CommitMessageOptions from './CommitMessageOptions';

export default class CommitMessageModalController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options'];
    constructor($scope: CommitMessageScope, $uibModalInstance: uib.IModalServiceInstance, options: CommitMessageOptions) {

        $scope.options = options;

        $scope.ok = function() {
            const message = $scope.options.text.trim();
            if (message) {
                $uibModalInstance.close(message);
            }
            else {
                // This ensures that we don't trigger the mainline.
                // Of course, we sgould have a user interface that prevents OK from being enabled.
                $uibModalInstance.dismiss('empty message');
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel click');
        };
    }
}

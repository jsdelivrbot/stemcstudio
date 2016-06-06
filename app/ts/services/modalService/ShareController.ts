import * as uib from 'angular-bootstrap';
import Clipboard from 'clipboard';
import ShareScope from './ShareScope';
import ShareOptions from './ShareOptions';

export default class ShareController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options'];
    constructor($scope: ShareScope, $uibModalInstance: uib.IModalServiceInstance, options: ShareOptions) {

        $scope.options = options;

        const clipboard = new Clipboard('.btn', {
            // options here: action, target, text.
        });

        clipboard.on('success', function(e: ClipboardEvent) {
            e.clearSelection();
        });

        clipboard.on('error', function(e: ClipboardEvent) {
            console.warn("The text could not be copied to the clipboard.");
        });

        $scope.close = function() {
            clipboard.destroy();
            $uibModalInstance.close($scope.options.text);
        };

        // FIXME: How do we handle Esc key pressed?
    }
}

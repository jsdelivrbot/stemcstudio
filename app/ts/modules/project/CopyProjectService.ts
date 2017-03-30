import * as ng from 'angular';
import * as uib from 'angular-bootstrap';
import CopyProjectDialog from './CopyProjectDialog';
import CopyProjectSettings from './CopyProjectSettings';
import CopyProjectController from './CopyProjectController';

/**
 * The implementation that is registered with the application module.
 */
export default class CopyProjectService implements CopyProjectDialog {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: uib.IModalService) {
        // Do nothing.
    }
    open(defaults: CopyProjectSettings): ng.IPromise<CopyProjectSettings> {
        const modalSettings: uib.IModalSettings = {
            backdrop: 'static',
            controller: CopyProjectController,
            templateUrl: 'project-copy.html'
        };
        modalSettings.resolve = {
            pkgInfo: function () {
                return defaults;
            }
        };
        return this.$uibModal.open(modalSettings).result;
    }
}

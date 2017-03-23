import * as ng from 'angular';
import * as uib from 'angular-bootstrap';
import OpenProjectDialog from './OpenProjectDialog';
import OpenProjectSettings from './OpenProjectSettings';
import OpenProjectController from './OpenProjectController';

/**
 * The implementation that is registered with the application module.
 */
export default class OpenProjectService implements OpenProjectDialog {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: uib.IModalService) {
        // Do nothing.
    }
    open(defaults: OpenProjectSettings): ng.IPromise<OpenProjectSettings> {
        const settings: uib.IModalSettings = {
            backdrop: 'static',
            controller: OpenProjectController,
            templateUrl: 'open-project-modal.html'
        };
        settings.resolve = {
            pkgInfo: function () {
                return defaults;
            }
        };
        return this.$uibModal.open(settings).result;
    }
}

import * as ng from 'angular';
import * as uib from 'angular-bootstrap';
import NewProjectDialog from './NewProjectDialog';
import NewProjectDefaults from './NewProjectDefaults';
import NewProjectSettings from './NewProjectSettings';
import NewProjectController from './NewProjectController';

/**
 * The implementation that is registered with the application module.
 */
export default class NewProjectService implements NewProjectDialog {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: uib.IModalService) {
        // Do nothing.
    }
    open(defaults: NewProjectDefaults): ng.IPromise<NewProjectSettings> {
        const settings: uib.IModalSettings = {
            backdrop: 'static',
            controller: NewProjectController,
            templateUrl: 'new-project-modal.html'
        };
        settings.resolve = {
            pkgInfo: function () {
                return defaults;
            }
        };
        return this.$uibModal.open(settings).result;
    }
}

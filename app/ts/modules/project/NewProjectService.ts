import { IPromise } from 'angular';
import { IModalService, IModalSettings } from 'angular-bootstrap';
import NewProjectDialog from './NewProjectDialog';
import NewProjectDefaults from './NewProjectDefaults';
import { NewProjectSettings } from './NewProjectSettings';
import NewProjectController from './NewProjectController';

/**
 * The implementation that is registered with the application module.
 */
export default class NewProjectService implements NewProjectDialog {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: IModalService) {
        // Do nothing.
    }
    open(defaults: NewProjectDefaults): IPromise<NewProjectSettings> {
        const modalSettings: IModalSettings = {
            backdrop: 'static',
            controller: NewProjectController,
            templateUrl: 'project-new.html'
        };
        modalSettings.resolve = {
            pkgInfo: function () {
                return defaults;
            }
        };
        return this.$uibModal.open(modalSettings).result;
    }
}

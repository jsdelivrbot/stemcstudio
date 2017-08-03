import { IPromise } from 'angular';
import { IModalService, IModalSettings } from 'angular-bootstrap';
import { OpenProjectDialog } from './OpenProjectDialog';
import { OpenProjectSettings } from './OpenProjectSettings';
import { OpenProjectController } from './OpenProjectController';

/**
 * The implementation that is registered with the application module.
 */
export class OpenProjectService implements OpenProjectDialog {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: IModalService) {
        // Do nothing.
    }
    open(defaults: OpenProjectSettings): IPromise<OpenProjectSettings> {
        const modalSettings: IModalSettings = {
            backdrop: 'static',
            controller: OpenProjectController,
            templateUrl: 'project-open.html'
        };
        modalSettings.resolve = {
            pkgInfo: function () {
                return defaults;
            }
        };
        return this.$uibModal.open(modalSettings).result;
    }
}

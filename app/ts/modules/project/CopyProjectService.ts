import { IPromise } from 'angular';
import { IModalService, IModalSettings } from 'angular-bootstrap';
import { CopyProjectDialog } from './CopyProjectDialog';
import { CopyProjectSettings } from './CopyProjectSettings';
import { CopyProjectController } from './CopyProjectController';

/**
 * The implementation that is registered with the application module.
 */
export class CopyProjectService implements CopyProjectDialog {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: IModalService) {
        // Do nothing.
    }
    open(defaults: CopyProjectSettings): IPromise<CopyProjectSettings> {
        const modalSettings: IModalSettings = {
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

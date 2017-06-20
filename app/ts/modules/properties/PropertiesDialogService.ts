import { IPromise } from 'angular';
import { IModalService, IModalSettings } from 'angular-bootstrap';
import { PropertiesDialog } from './PropertiesDialog';
import { PropertiesSettings } from './PropertiesSettings';
import { PropertiesModalController } from './PropertiesModalController';

/**
 * The implementation that is registered with the application module.
 */
export class PropertiesDialogService implements PropertiesDialog {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: IModalService) {
        // Do nothing.
    }
    open(defaults: PropertiesSettings): IPromise<PropertiesSettings> {
        const settings: IModalSettings = {
            backdrop: 'static',
            controller: PropertiesModalController,
            templateUrl: 'properties-modal.html'
        };
        settings.resolve = {
            pkgInfo: function () {
                return defaults;
            }
        };
        return this.$uibModal.open(settings).result;
    }
}

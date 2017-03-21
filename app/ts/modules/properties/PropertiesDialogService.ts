import * as ng from 'angular';
import * as uib from 'angular-bootstrap';
import PropertiesDialog from './PropertiesDialog';
import PropertiesSettings from './PropertiesSettings';
import PropertiesModalController from './PropertiesModalController';

/**
 * The implementation that is registered with the application module.
 */
export default class PropertiesDialogService implements PropertiesDialog {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: uib.IModalService) {
        // Do nothing.
    }
    open(defaults: PropertiesSettings): ng.IPromise<PropertiesSettings> {
        const settings: uib.IModalSettings = {
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

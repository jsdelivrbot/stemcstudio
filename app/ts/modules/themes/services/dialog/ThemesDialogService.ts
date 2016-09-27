import * as ng from 'angular';
import * as uib from 'angular-bootstrap';
import ThemesDialog from '../../contracts/ThemesDialog';
import ThemesDialogModel from '../../contracts/ThemesDialogModel';
import ThemesDialogController from './ThemesDialogController';

/**
 * The (service) implementation of the ThemesDialog interface.
 */
export default class ThemesDialogService implements ThemesDialog {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: uib.IModalService) {
        // Do nothing.
    }
    /**
     * The open method will be invoked by some controller.
     */
    open(defaults: ThemesDialogModel): ng.IPromise<ThemesDialogModel> {
        const settings: uib.IModalSettings = {
            backdrop: 'static',
            controller: ThemesDialogController,
            templateUrl: 'themes-dialog.html'
        };
        // This part is a bit tricky. The object here is passed to the controller's constructor.
        // Because this is not type-safe, you should check that this handoff is correctly implemented.
        // Essentially, the property name 'model' provides the dependency for the controller.
        settings.resolve = {
            model: function (): ThemesDialogModel {
                return defaults;
            }
        };
        return this.$uibModal.open(settings).result;
    }
}

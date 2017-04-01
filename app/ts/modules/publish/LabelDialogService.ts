import { IPromise } from 'angular';
import { IModalService, IModalSettings } from 'angular-bootstrap';
import LabelDialog from './LabelDialog';
import LabelSettings from './LabelSettings';
import LabelModalController from './LabelModalController';

export default class LabelDialogService implements LabelDialog {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: IModalService) {
        // Do nothing.
    }
    open(defaults: LabelSettings): IPromise<LabelSettings> {
        const settings: IModalSettings = {
            backdrop: 'static',
            controller: LabelModalController,
            templateUrl: 'label-modal.html'
        };
        settings.resolve = {
            options: function () {
                return defaults;
            }
        };
        return this.$uibModal.open(settings).result;
    }
}

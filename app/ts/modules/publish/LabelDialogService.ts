import * as ng from 'angular';
import * as uib from 'angular-bootstrap';
import LabelSettings from './LabelSettings';
import LabelModalController from './LabelModalController';

export default class LabelDialogService {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: uib.IModalService) {
        // Do nothing.
    }
    open(defaults: LabelSettings): ng.IPromise<LabelSettings> {
        const settings: uib.IModalSettings = {
            backdrop: 'static',
            controller: LabelModalController,
            templateUrl: 'label-modal.html'
        };
        settings.resolve = {
            options: function() {
                return defaults;
            }
        };
        return this.$uibModal.open(settings).result;
    }
}

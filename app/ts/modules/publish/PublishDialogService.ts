import * as uib from 'angular-bootstrap';
import PublishSettings from './PublishSettings';

export default class PublishDialogService {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: uib.IModalService) {
        // Do nothing.
    }
    open(): ng.IPromise<PublishSettings> {
        const settings: uib.IModalSettings = {
            backdrop: 'static',
            controller: 'PublishModalController',
            templateUrl: 'publish-modal.html'
        };
        return this.$uibModal.open(settings).result;
    }
}

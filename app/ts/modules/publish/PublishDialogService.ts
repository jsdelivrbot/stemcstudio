import { IPromise } from 'angular';
import { IModalService, IModalSettings } from 'angular-bootstrap';
import PublishSettings from './PublishSettings';

export default class PublishDialogService {
    public static $inject: string[] = ['$uibModal'];
    constructor(private $uibModal: IModalService) {
        // Do nothing.
    }
    open(): IPromise<PublishSettings> {
        const settings: IModalSettings = {
            backdrop: 'static',
            controller: 'PublishModalController',
            templateUrl: 'publish-modal.html'
        };
        return this.$uibModal.open(settings).result;
    }
}

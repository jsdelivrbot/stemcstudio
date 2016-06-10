import * as ng from 'angular';
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
        /*        
                settings.bindToController
        
                ng.extend(settings, DEFAULT_MODAL_SETTINGS);
        
                const mergedOptions: AlertOptions = { title: '', message: '' };
                ng.extend(mergedOptions, DEFAULT_ALERT_OPTIONS, options);
                settings.resolve = {
                    options: function() {
                        return mergedOptions;
                    }
                };
        */
        return this.$uibModal.open(settings).result;
    }
}

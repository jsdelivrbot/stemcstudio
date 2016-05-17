import * as ng from 'angular';
import PublishSettings from './PublishSettings';

interface PublishDialog {
    open(): ng.IPromise<PublishSettings>;
}

export default PublishDialog;

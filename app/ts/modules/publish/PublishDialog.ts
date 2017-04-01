import { IPromise } from 'angular';
import PublishSettings from './PublishSettings';

interface PublishDialog {
    open(): IPromise<PublishSettings>;
}

export default PublishDialog;

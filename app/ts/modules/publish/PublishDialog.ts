import PublishSettings from './PublishSettings';

interface PublishDialog {
    open(): ng.IPromise<PublishSettings>;
}

export default PublishDialog;

import * as ng from 'angular';
import AlertOptions from './AlertOptions';
import ConfirmOptions from './ConfirmOptions';
import PromptOptions from './PromptOptions';
import ShareOptions from './ShareOptions';

interface ModalDialog {
    alert(options: AlertOptions): ng.IPromise<boolean>;
    confirm(options: ConfirmOptions): ng.IPromise<any>;
    prompt(options: PromptOptions): ng.IPromise<string>;
    share(options: ShareOptions): ng.IPromise<string>;
}

export default ModalDialog;

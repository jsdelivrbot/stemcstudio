import * as ng from 'angular';
import AlertOptions from './AlertOptions';
import ConfirmOptions from './ConfirmOptions';
import PromptOptions from './PromptOptions';

interface ModalDialog {
    alert(options: AlertOptions): ng.IPromise<boolean>;
    prompt(options: PromptOptions): ng.IPromise<string>;
    confirm(options: ConfirmOptions): ng.IPromise<any>;
}

export default ModalDialog;

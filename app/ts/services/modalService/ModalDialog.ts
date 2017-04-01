import { IPromise } from 'angular';
import AlertOptions from './AlertOptions';
import ConfirmOptions from './ConfirmOptions';
import PromptOptions from './PromptOptions';
import ShareOptions from './ShareOptions';

interface ModalDialog {
    alert(options: AlertOptions): IPromise<boolean>;
    confirm(options: ConfirmOptions): IPromise<any>;
    prompt(options: PromptOptions): IPromise<string>;
    share(options: ShareOptions): IPromise<string>;
}

export default ModalDialog;

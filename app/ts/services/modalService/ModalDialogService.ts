import { extend } from 'angular';
import { IPromise } from 'angular';
import { IModalService, IModalSettings } from 'angular-bootstrap';
import ModalDialog from './ModalDialog';
import AlertOptions from './AlertOptions';
import ConfirmOptions from './ConfirmOptions';
import PromptOptions from './PromptOptions';
import ShareOptions from './ShareOptions';

const DEFAULT_MODAL_SETTINGS: IModalSettings = {
    backdrop: true,
    keyboard: true
};

const DEFAULT_ALERT_OPTIONS: AlertOptions = {
    title: 'Alert',
    message: 'Danger Will Robinson!'
};

const DEFAULT_CONFIRM_OPTIONS: ConfirmOptions = {
    cancelButtonText: 'Cancel',
    actionButtonText: 'OK',
    title: 'Confirm',
    message: ''
};

const DEFAULT_PROMPT_OPTIONS: PromptOptions = {
    title: 'Prompt',
    message: '',
    text: '',
    placeholder: '',
    actionButtonText: 'OK',
    cancelButtonText: 'Cancel'
};

const DEFAULT_SHARE_OPTIONS: ShareOptions = {
    title: 'Share',
    message: '',
    text: '',
    actionButtonText: 'Copy to clipboard',
    closeButtonText: 'Close'
};

/**
 *
 */
export default class ModalServiceClazz implements ModalDialog {
    public static $inject: string[] = ['$uibModal'];

    /**
     *
     */
    constructor(private $uibModal: IModalService) {
        // Do nothing.
    }

    /**
     *
     */
    alert(options: AlertOptions): IPromise<boolean> {

        const settings: IModalSettings = {
            backdrop: 'static',
            controller: 'AlertController',
            templateUrl: 'alert-modal.html'
        };

        extend(settings, DEFAULT_MODAL_SETTINGS);

        const mergedOptions: AlertOptions = { title: '', message: '' };
        extend(mergedOptions, DEFAULT_ALERT_OPTIONS, options);
        settings.resolve = {
            options: function () {
                return mergedOptions;
            }
        };

        return this.$uibModal.open(settings).result;
    }

    /**
     *
     */
    confirm(options: ConfirmOptions): IPromise<any> {

        const settings: IModalSettings = {
            backdrop: 'static',
            controller: 'ConfirmController',
            templateUrl: 'confirm-modal.html'
        };

        extend(settings, DEFAULT_MODAL_SETTINGS);

        const mergedOptions: ConfirmOptions = { title: '', message: '' };
        extend(mergedOptions, DEFAULT_CONFIRM_OPTIONS, options);
        settings.resolve = {
            options: function () {
                return mergedOptions;
            }
        };

        return this.$uibModal.open(settings).result;
    }

    /**
     *
     */
    prompt(options: PromptOptions): IPromise<string> {

        const settings: IModalSettings = {
            backdrop: 'static',
            controller: 'PromptController',
            templateUrl: 'prompt-modal.html'
        };

        extend(settings, DEFAULT_MODAL_SETTINGS);

        const mergedOptions: PromptOptions = { title: '', message: '', text: '', placeholder: '' };
        extend(mergedOptions, DEFAULT_PROMPT_OPTIONS, options);
        settings.resolve = {
            options: function () {
                return mergedOptions;
            }
        };

        return this.$uibModal.open(settings).result;
    }

    /**
     *
     */
    share(options: PromptOptions): IPromise<string> {

        const settings: IModalSettings = {
            backdrop: 'static',
            controller: 'ShareController',
            templateUrl: 'share-modal.html'
        };

        extend(settings, DEFAULT_MODAL_SETTINGS);

        const mergedOptions: ShareOptions = { title: '', message: '', text: '' };
        extend(mergedOptions, DEFAULT_SHARE_OPTIONS, options);
        settings.resolve = {
            options: function () {
                return mergedOptions;
            }
        };

        return this.$uibModal.open(settings).result;
    }
}

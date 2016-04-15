import * as ng from 'angular';
import * as uib from 'angular-bootstrap';
import ModalDialog from './ModalDialog'
import AlertOptions from './AlertOptions';
import ConfirmOptions from './ConfirmOptions';
import PromptOptions from './PromptOptions';

const DEFAULT_MODAL_SETTINGS: uib.IModalSettings = {
    backdrop: true,
    keyboard: true
}

const DEFAULT_ALERT_OPTIONS: AlertOptions = {
    title: 'Alert',
    message: 'Danger Will Robinson!'
}

const DEFAULT_CONFIRM_OPTIONS: ConfirmOptions = {
    cancelButtonText: 'Cancel',
    actionButtonText: 'OK',
    title: 'Confirm',
    message: ''
}

const DEFAULT_PROMPT_OPTIONS: PromptOptions = {
    title: 'Prompt',
    message: '',
    text: '',
    placeholder: '',
    actionButtonText: 'OK',
    cancelButtonText: 'Cancel'
}

/**
 *
 */
export default class ModalService implements ModalDialog {
    public static $inject: string[] = ['$uibModal']

    /**
     *
     */
    constructor(private $uibModal: uib.IModalService) {
        // Do nothing.
    }

    /**
     *
     */
    alert(options: AlertOptions): ng.IPromise<boolean> {

        const settings: uib.IModalSettings = {
            backdrop: 'static',
            controller: 'AlertController',
            templateUrl: 'alert-modal.html'
        }

        ng.extend(settings, DEFAULT_MODAL_SETTINGS)

        const mergedOptions: AlertOptions = { title: '', message: '' }
        ng.extend(mergedOptions, DEFAULT_ALERT_OPTIONS, options)
        settings.resolve = {
            options: function() {
                return mergedOptions
            }
        }

        return this.$uibModal.open(settings).result;
    }

    /**
     *
     */
    confirm(options: ConfirmOptions): ng.IPromise<any> {

        const settings: uib.IModalSettings = {
            backdrop: 'static',
            controller: 'ConfirmController',
            templateUrl: 'confirm-modal.html'
        }

        ng.extend(settings, DEFAULT_MODAL_SETTINGS)

        const mergedOptions: ConfirmOptions = { title: '', message: '' }
        ng.extend(mergedOptions, DEFAULT_CONFIRM_OPTIONS, options)
        settings.resolve = {
            options: function() {
                return mergedOptions
            }
        }

        return this.$uibModal.open(settings).result;
    }

    /**
     *
     */
    prompt(options: PromptOptions): ng.IPromise<string> {

        const settings: uib.IModalSettings = {
            backdrop: 'static',
            controller: 'PromptController',
            templateUrl: 'prompt-modal.html'
        }

        ng.extend(settings, DEFAULT_MODAL_SETTINGS)

        const mergedOptions: PromptOptions = { title: '', message: '', text: '', placeholder: '' }
        ng.extend(mergedOptions, DEFAULT_PROMPT_OPTIONS, options)
        settings.resolve = {
            options: function() {
                return mergedOptions
            }
        }

        return this.$uibModal.open(settings).result;
    }
}

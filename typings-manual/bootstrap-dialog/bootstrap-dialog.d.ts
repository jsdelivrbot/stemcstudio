///<reference path="../../typings/jquery/jquery.d.ts"/>
//
// bootstrap-dialog.d.ts
//
// This file was created manually in order to support the bootstrap-dialog library.
//
interface IBootstrapDialog {
    realize(): IBootstrapDialog;
    open(): IBootstrapDialog;
    close(): IBootstrapDialog;
    getModal(): JQuery;
    getModalDialog(): JQuery;
    getModalContent(): JQuery;
    getModalHeader(): JQuery;
    getModalBody(): JQuery;
    getModalFooter(): JQuery;
    enableButtons(enable: boolean): void;
    setClosable(closable: boolean): void;
}

// This us the factory, it needs new
interface DialogFactory {
    new (options: {
        type?: string;
        title: string | JQuery;
        message: string | JQuery;
        buttons?: {
            label: string;
            cssClass?: string;
            action?: (dialog: IBootstrapDialog) => void
        }[];
        size?: string;
    }): IBootstrapDialog;

    TYPE_DEFAULT: string;
    TYPE_INFO: string;
    TYPE_PRIMARY: string;
    TYPE_SUCCESS: string;
    TYPE_WARNING: string;
    TYPE_DANGER: string;

    SIZE_NORMAL: string;
    SIZE_SMALL: string;
    SIZE_WIDE: string;
    SIZE_LARGE: string;

    /**
     * Creates an alert.
     * FIXME: Why do title and message have to be strings?
     */
    alert(options: {
        type?: string;
        title?: string;
        message: string;
    }): IBootstrapDialog;

    /**
     * The `show` method is a shortcut for `new IBootstrapDialog(options).open()`.
     */
    show(options: {
        type?: string;
        title?: string | JQuery;
        message: string | JQuery;
        buttons?: {
            label: string;
            cssClass?: string;
            action?: (dialog: IBootstrapDialog) => void
        }[];
        size?: string;
    }): IBootstrapDialog;
}

declare var BootstrapDialog: DialogFactory;

declare module 'bootstrap-dialog' {
    export default BootstrapDialog;
}
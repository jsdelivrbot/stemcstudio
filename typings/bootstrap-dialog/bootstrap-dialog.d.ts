///<reference path="../jquery/jquery.d.ts"/>
//
// bootstrap-dialog.d.ts
//
// This file was created manually in order to support the bootstrap-dialog library.
//
declare module BootstrapDialog {

    export var TYPE_DEFAULT: string;
    export var TYPE_INFO: string;
    export var TYPE_PRIMARY: string;
    export var TYPE_SUCCESS: string;
    export var TYPE_WARNING: string;
    export var TYPE_DANGER: string;

    export interface BootstrapDialog {
      close(): BootstrapDialog
    }

    /**
     * Creates an alert.
     * FIXME: Why do title and message have to be strings?
     */
    export function alert(options: {
      type?: string;
      title?: string;
      message: string;
    }): BootstrapDialog;

    /**
     * The `show` method is a shortcut for `new BootstrapDialog(options).open()`.
     */
    export function show(options: {
      type?: string;
      title: string | JQuery;
      message: string | JQuery;
      buttons?: {
        label: string;
        cssClass: string;
        action: (dialog: BootstrapDialog) => void
      }[]
    }): BootstrapDialog;
}

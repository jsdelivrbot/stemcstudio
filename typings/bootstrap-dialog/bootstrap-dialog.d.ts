//
// bootstrap-dialog.d.ts
//
// This file was created manually in order to support the bootstrap-dialog library.
//
declare module BootstrapDialog {

    export interface BootstrapDialog {
      close(): BootstrapDialog
    }

    export function alert(code: string): BootstrapDialog;

    export function show(config: {
      title: any;    // string | JQuery
      message: any;  // string | JQuery
      buttons: {
        label: string;
        cssClass: string;
        action: (dialog: BootstrapDialog) => void
      }[]
    }): BootstrapDialog;
}

import { ModalDialogOptions } from './ModalDialogOptions';

export interface ConfirmOptions extends ModalDialogOptions {
    cancelButtonText?: string;
    actionButtonText?: string;
}

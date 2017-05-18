import { ModalDialogOptions } from './ModalDialogOptions';

export interface ShareOptions extends ModalDialogOptions {
    text: string;
    actionButtonText?: string;
    closeButtonText?: string;
}

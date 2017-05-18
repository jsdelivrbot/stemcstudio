import { ModalDialogOptions } from './ModalDialogOptions';

export interface PromptOptions extends ModalDialogOptions {
    text: string;
    placeholder: string;
    cancelButtonText?: string;
    actionButtonText?: string;
}

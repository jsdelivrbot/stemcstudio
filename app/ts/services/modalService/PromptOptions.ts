import ModalDialogOptions from './ModalDialogOptions';

interface PromptOptions extends ModalDialogOptions {
    text: string;
    placeholder: string;
    cancelButtonText?: string;
    actionButtonText?: string;
}

export default PromptOptions;
